// Copyright 2011 Software Freedom Conservancy
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "DocumentHost.h"
#include "Generated/cookies.h"
#include "logging.h"
#include "messages.h"
#include "RegistryUtilities.h"

namespace webdriver {

DocumentHost::DocumentHost(HWND hwnd, HWND executor_handle) {
  LOG(TRACE) << "Entering DocumentHost::DocumentHost";

  // NOTE: COM should be initialized on this thread, so we
  // could use CoCreateGuid() and StringFromGUID2() instead.
  UUID guid;
  RPC_WSTR guid_string = NULL;
  RPC_STATUS status = ::UuidCreate(&guid);
  if (status != RPC_S_OK) {
    // If we encounter an error, not bloody much we can do about it.
    // Just log it and continue.
    LOG(WARN) << "UuidCreate returned a status other then RPC_S_OK: " << status;
  }
  status = ::UuidToString(&guid, &guid_string);
  if (status != RPC_S_OK) {
    // If we encounter an error, not bloody much we can do about it.
    // Just log it and continue.
    LOG(WARN) << "UuidToString returned a status other then RPC_S_OK: " << status;
  }

  // RPC_WSTR is currently typedef'd in RpcDce.h (pulled in by rpc.h)
  // as unsigned short*. It needs to be typedef'd as wchar_t* 
  wchar_t* cast_guid_string = reinterpret_cast<wchar_t*>(guid_string);
  this->browser_id_ = StringUtilities::ToString(cast_guid_string);

  ::RpcStringFree(&guid_string);

  this->window_handle_ = hwnd;
  this->executor_handle_ = executor_handle;
  this->is_closing_ = false;
  this->wait_required_ = false;
  this->focused_frame_window_ = NULL;
}

DocumentHost::~DocumentHost(void) {
}

std::string DocumentHost::GetCurrentUrl() {
  LOG(TRACE) << "Entering DocumentHost::GetCurrentUrl";

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);
  if (!doc) {
    LOG(WARN) << "Unable to get document object, DocumentHost::GetDocument returned NULL. "
              << "Attempting to get URL from IWebBrowser2 object";
    return this->GetBrowserUrl();
  }

  CComBSTR url;
  HRESULT hr = doc->get_URL(&url);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Unable to get current URL, call to IHTMLDocument2::get_URL failed";
    return "";
  }

  std::wstring converted_url = url;
  std::string current_url = StringUtilities::ToString(converted_url);
  return current_url;
}

std::string DocumentHost::GetPageSource() {
  LOG(TRACE) << "Entering DocumentHost::GetPageSource";

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);
  if (!doc) {
    LOG(WARN) << "Unable to get document object, DocumentHost::GetDocument did not return a valid IHTMLDocument2 pointer";
    return "";
  }

  CComPtr<IHTMLDocument3> doc3;
  HRESULT hr = doc->QueryInterface<IHTMLDocument3>(&doc3);
  if (FAILED(hr) || !doc3) {
    LOG(WARN) << "Unable to get document object, QueryInterface to IHTMLDocument3 failed";
    return "";
  }

  CComPtr<IHTMLElement> document_element;
  hr = doc3->get_documentElement(&document_element);
  if (FAILED(hr) || !document_element) {
    LOGHR(WARN, hr) << "Unable to get document element from page, call to IHTMLDocument3::get_documentElement failed";
    return "";
  }

  CComBSTR html;
  hr = document_element->get_outerHTML(&html);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Have document element but cannot read source, call to IHTMLElement::get_outerHTML failed";
    return "";
  }

  std::wstring converted_html = html;
  std::string page_source = StringUtilities::ToString(converted_html);
  return page_source;
}

int DocumentHost::SetFocusedFrameByElement(IHTMLElement* frame_element) {
  LOG(TRACE) << "Entering DocumentHost::SetFocusedFrameByElement";

  HRESULT hr = S_OK;
  if (!frame_element) {
    this->focused_frame_window_ = NULL;
    return WD_SUCCESS;
  }

  CComPtr<IHTMLFrameBase2> frame_base;
  frame_element->QueryInterface<IHTMLFrameBase2>(&frame_base);
  if (!frame_base) {
    LOG(WARN) << "IHTMLElement is not a FRAME or IFRAME element";
    return ENOSUCHFRAME;
  }

  CComPtr<IHTMLWindow2> interim_result;
  hr = frame_base->get_contentWindow(&interim_result);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Cannot get contentWindow from IHTMLFrameBase2, call to IHTMLFrameBase2::get_contentWindow failed";
    return ENOSUCHFRAME;
  }

  this->focused_frame_window_ = interim_result;
  return WD_SUCCESS;
}

int DocumentHost::SetFocusedFrameByName(const std::string& frame_name) {
  LOG(TRACE) << "Entering DocumentHost::SetFocusedFrameByName";
  CComVariant frame_identifier =  StringUtilities::ToWString(frame_name).c_str();
  return this->SetFocusedFrameByIdentifier(frame_identifier);
}

int DocumentHost::SetFocusedFrameByIndex(const int frame_index) {
  LOG(TRACE) << "Entering DocumentHost::SetFocusedFrameByIndex";
  CComVariant frame_identifier;
  frame_identifier.vt = VT_I4;
  frame_identifier.lVal = frame_index;
  return this->SetFocusedFrameByIdentifier(frame_identifier);
}

int DocumentHost::SetFocusedFrameByIdentifier(VARIANT frame_identifier) {
  LOG(TRACE) << "Entering DocumentHost::SetFocusedFrameByIdentifier";

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);

  CComPtr<IHTMLFramesCollection2> frames;
  HRESULT hr = doc->get_frames(&frames);

  if (!frames) {
    LOG(WARN) << "No frames in document are set, IHTMLDocument2::get_frames returned NULL";
    return ENOSUCHFRAME;
  }

  long length = 0;
  frames->get_length(&length);
  if (!length) {
    LOG(WARN) << "No frames in document are found IHTMLFramesCollection2::get_length returned 0";
    return ENOSUCHFRAME;
  }

  // Find the frame
  CComVariant frame_holder;
  hr = frames->item(&frame_identifier, &frame_holder);

  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Error retrieving frame holder, call to IHTMLFramesCollection2::item failed";
    return ENOSUCHFRAME;
  }

  CComPtr<IHTMLWindow2> interim_result;
  frame_holder.pdispVal->QueryInterface<IHTMLWindow2>(&interim_result);
  if (!interim_result) {
    LOG(WARN) << "Error retrieving frame, IDispatch cannot be cast to IHTMLWindow2";
    return ENOSUCHFRAME;
  }

  this->focused_frame_window_ = interim_result;
  return WD_SUCCESS;
}

void DocumentHost::GetCookies(std::map<std::string, std::string>* cookies) {
  LOG(TRACE) << "Entering DocumentHost::GetCookies";

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);

  if (!doc) {
    LOG(WARN) << "Unable to get document";
    return;
  }

  CComBSTR cookie_bstr;
  HRESULT hr = doc->get_cookie(&cookie_bstr);
  if (!cookie_bstr) {
    LOG(WARN) << "Unable to get cookie str, call to IHTMLDocument2::get_cookie failed";
    cookie_bstr = L"";
  }

  std::wstring cookie_string = cookie_bstr;
  while (cookie_string.size() > 0) {
    size_t cookie_delimiter_pos = cookie_string.find(L"; ");
    std::wstring cookie = cookie_string.substr(0, cookie_delimiter_pos);
    if (cookie_delimiter_pos == std::wstring::npos) {
      cookie_string = L"";
    } else {
      cookie_string = cookie_string.substr(cookie_delimiter_pos + 2);
    }
    size_t cookie_separator_pos(cookie.find_first_of(L"="));
    std::string cookie_name(StringUtilities::ToString(cookie.substr(0, cookie_separator_pos)));
    std::string cookie_value(StringUtilities::ToString(cookie.substr(cookie_separator_pos + 1)));
    cookies->insert(std::pair<std::string, std::string>(cookie_name, cookie_value));
  }
}

int DocumentHost::AddCookie(const std::string& cookie) {
  LOG(TRACE) << "Entering DocumentHost::AddCookie";

  CComBSTR cookie_bstr = StringUtilities::ToWString(cookie.c_str()).c_str();

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);

  if (!doc) {
    LOG(WARN) << "Unable to get document";
    return EUNHANDLEDERROR;
  }

  if (!this->IsHtmlPage(doc)) {
    LOG(WARN) << "Unable to add cookie, document does not appear to be an HTML page";
    return ENOSUCHDOCUMENT;
  }

  HRESULT hr = doc->put_cookie(cookie_bstr);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Unable to put cookie to document, call to IHTMLDocument2::put_cookie failed";
    return EUNHANDLEDERROR;
  }

  return WD_SUCCESS;
}

int DocumentHost::DeleteCookie(const std::string& cookie_name) {
  LOG(TRACE) << "Entering DocumentHost::DeleteCookie";

  // Construct the delete cookie script
  std::wstring script_source;
  for (int i = 0; DELETECOOKIES[i]; i++) {
    script_source += DELETECOOKIES[i];
  }

  CComPtr<IHTMLDocument2> doc;
  this->GetDocument(&doc);
  Script script_wrapper(doc, script_source, 1);
  script_wrapper.AddArgument(cookie_name);
  int status_code = script_wrapper.Execute();
  return status_code;
}

void DocumentHost::PostQuitMessage() {
  LOG(TRACE) << "Entering DocumentHost::PostQuitMessage";

  this->set_is_closing(true);

  LPSTR message_payload = new CHAR[this->browser_id_.size() + 1];
  strcpy_s(message_payload, this->browser_id_.size() + 1, this->browser_id_.c_str());
  ::PostMessage(this->executor_handle(),
                WD_BROWSER_QUIT,
                NULL,
                reinterpret_cast<LPARAM>(message_payload));
}

bool DocumentHost::IsHtmlPage(IHTMLDocument2* doc) {
  LOG(TRACE) << "Entering DocumentHost::IsHtmlPage";

  CComBSTR type;
  HRESULT hr = doc->get_mimeType(&type);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Unable to get mime type for document, call to IHTMLDocument2::get_mimeType failed";
    return false;
  }

  // Call once to get the required buffer size, then again to fill
  // the buffer.
  DWORD mime_type_name_buffer_size = 0;
  hr = ::AssocQueryString(0,
                          ASSOCSTR_FRIENDLYDOCNAME,
                          L".htm",
                          NULL,
                          NULL,
                          &mime_type_name_buffer_size);

  std::vector<wchar_t> mime_type_name_buffer(mime_type_name_buffer_size);
  hr = ::AssocQueryString(0,
                          ASSOCSTR_FRIENDLYDOCNAME,
                          L".htm",
                          NULL,
                          &mime_type_name_buffer[0],
                          &mime_type_name_buffer_size);

  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Call to AssocQueryString failed in getting friendly name of .htm documents";
    return false;
  }

  std::wstring mime_type_name = &mime_type_name_buffer[0];
  std::wstring type_string = type;
  if (type_string == mime_type_name) {
    return true;
  }

  // If the user set Firefox as a default browser at any point, the MIME type
  // appears to be "sticky". This isn't elegant, but it appears to alleviate
  // the worst symptoms. Tested by using both Safari and Opera as the default
  // browser, even after setting IE as the default after Firefox (so the chain
  // of defaults looks like (IE -> Firefox -> IE -> Opera)

  if (L"Firefox HTML Document" == mime_type_name) {
    LOG(INFO) << "It looks like Firefox was once the default browser. " 
              << "Guessing the page type from mime type alone";
    return true;
  }

  return false;
}

HWND DocumentHost::FindContentWindowHandle(HWND top_level_window_handle) {
  LOG(TRACE) << "Entering DocumentHost::FindContentWindowHandle";

  ProcessWindowInfo process_window_info;
  process_window_info.pBrowser = NULL;
  process_window_info.hwndBrowser = NULL;
  DWORD process_id;
  ::GetWindowThreadProcessId(top_level_window_handle, &process_id);
  process_window_info.dwProcessId = process_id;

  ::EnumChildWindows(top_level_window_handle,
                     &BrowserFactory::FindChildWindowForProcess,
                     reinterpret_cast<LPARAM>(&process_window_info));
  return process_window_info.hwndBrowser;
}

int DocumentHost::GetDocumentMode(IHTMLDocument2* doc) {
  LOG(TRACE) << "Entering DocumentHost::GetDocumentMode";
  CComPtr<IHTMLDocument6> mode_doc;
  doc->QueryInterface<IHTMLDocument6>(&mode_doc);
  if (!mode_doc) {
    LOG(DEBUG) << "QueryInterface for IHTMLDocument6 fails, so document mode must be 7 or less.";
    return 5;
  }
  CComVariant mode;
  HRESULT hr = mode_doc->get_documentMode(&mode);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "get_documentMode failed.";
    return 5;
  }
  int document_mode = static_cast<int>(mode.fltVal);
  return document_mode;
}

bool DocumentHost::IsStandardsMode(IHTMLDocument2* doc) {
  LOG(TRACE) << "Entering DocumentHost::IsStandardsMode";
  CComPtr<IHTMLDocument5> compatibility_mode_doc;
  doc->QueryInterface<IHTMLDocument5>(&compatibility_mode_doc);
  if (!compatibility_mode_doc) {
    LOG(WARN) << "Unable to cast document to IHTMLDocument5. IE6 or greater is required.";
    return false;
  }

  CComBSTR compatibility_mode;
  HRESULT hr = compatibility_mode_doc->get_compatMode(&compatibility_mode);
  if (FAILED(hr)) {
    LOGHR(WARN, hr) << "Failed calling get_compatMode.";
    return false;
  }
  // Compatibility mode should be "BackCompat" for quirks mode, and
  // "CSS1Compat" for standards mode. Check for "BackCompat" because
  // that's less likely to change.
  return compatibility_mode != L"BackCompat";
}

bool DocumentHost::GetDocumentDimensions(IHTMLDocument2* doc, LocationInfo* info) {
  LOG(TRACE) << "Entering DocumentHost::GetDocumentDimensions";
  CComVariant document_height;
  CComVariant document_width;

  // In non-standards-compliant mode, the BODY element represents the canvas.
  // In standards-compliant mode, the HTML element represents the canvas.
  CComPtr<IHTMLElement> canvas_element;
  if (!IsStandardsMode(doc)) {
    doc->get_body(&canvas_element);
    if (!canvas_element) {
      LOG(WARN) << "Unable to get canvas element from document in compatibility mode";
      return false;
    }
  } else {
    CComPtr<IHTMLDocument3> document_element_doc;
    doc->QueryInterface<IHTMLDocument3>(&document_element_doc);
    if (!document_element_doc) {
      LOG(WARN) << "Unable to get IHTMLDocument3 handle from document.";
      return false;
    }

    // The root node should be the HTML element.
    document_element_doc->get_documentElement(&canvas_element);
    if (!canvas_element) {
      LOG(WARN) << "Could not retrieve document element.";
      return false;
    }

    CComPtr<IHTMLHtmlElement> html_element;
    canvas_element->QueryInterface<IHTMLHtmlElement>(&html_element);
    if (!html_element) {
      LOG(WARN) << "Document element is not the HTML element.";
      return false;
    }
  }

  canvas_element->getAttribute(CComBSTR("scrollHeight"), 0, &document_height);
  canvas_element->getAttribute(CComBSTR("scrollWidth"), 0, &document_width);
  info->height = document_height.lVal;
  info->width = document_width.lVal;
  return true;
}

} // namespace webdriver