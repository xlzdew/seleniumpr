// Copyright 2013 Software Freedom Conservancy
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

#ifndef WEBDRIVER_IE_CLICKELEMENTCOMMANDHANDLER_H_
#define WEBDRIVER_IE_CLICKELEMENTCOMMANDHANDLER_H_

#define CLICK_OPTION_EVENT_NAME L"ClickOptionEvent"

#include "../Generated/atoms.h"
#include "../Browser.h"
#include "../IECommandHandler.h"
#include "../IECommandExecutor.h"
#include "logging.h"

namespace webdriver {

class ClickElementCommandHandler : public IECommandHandler {
 public:
  ClickElementCommandHandler(void) {
  }

  virtual ~ClickElementCommandHandler(void) {
  }

 protected:
  void ExecuteInternal(const IECommandExecutor& executor,
                       const LocatorMap& locator_parameters,
                       const ParametersMap& command_parameters,
                       Response* response) {
    LocatorMap::const_iterator id_parameter_iterator = locator_parameters.find("id");
    if (id_parameter_iterator == locator_parameters.end()) {
      response->SetErrorResponse(400, "Missing parameter in URL: id");
      return;
    } else {
      int status_code = WD_SUCCESS;
      std::string element_id = id_parameter_iterator->second;

      BrowserHandle browser_wrapper;
      status_code = executor.GetCurrentBrowser(&browser_wrapper);
      if (status_code != WD_SUCCESS) {
        response->SetErrorResponse(status_code, "Unable to get browser");
        return;
      }

      ElementHandle element_wrapper;
      status_code = this->GetElement(executor, element_id, &element_wrapper);
      if (status_code == WD_SUCCESS) {
        if (executor.input_manager()->enable_native_events()) {
          if (this->IsOptionElement(element_wrapper)) {
            std::string option_click_error = "";
            status_code = this->ExecuteAtom(this->GetClickAtom(),
                                            browser_wrapper,
                                            element_wrapper,
                                            &option_click_error);
            if (status_code != WD_SUCCESS) {
              response->SetErrorResponse(status_code, "Cannot click on option element. " + option_click_error);
              return;
            }
          } else {
            Json::Value move_action;
            move_action["action"] = "moveto";
            move_action["element"] = element_wrapper->element_id();

            Json::Value click_action;
            click_action["action"] = "click";
            click_action["button"] = 0;
            
            Json::UInt index = 0;
            Json::Value actions(Json::arrayValue);
            actions[index] = move_action;
            ++index;
            actions[index] = click_action;
            
            // Check to make sure we're not within the double-click time for this element
            // since the last click.
            int double_click_time = ::GetDoubleClickTime();
            int time_since_last_click = static_cast<int>(static_cast<float>(clock() - element_wrapper->last_click_time()) / CLOCKS_PER_SEC * 1000);
            if (time_since_last_click < double_click_time) {
              ::Sleep(double_click_time - time_since_last_click + 10);
            }

            IECommandExecutor& mutable_executor = const_cast<IECommandExecutor&>(executor);
            status_code = mutable_executor.input_manager()->PerformInputSequence(browser_wrapper, actions);
            browser_wrapper->set_wait_required(true);
            element_wrapper->set_last_click_time(clock());
            if (status_code != WD_SUCCESS) {
              if (status_code == EELEMENTCLICKPOINTNOTSCROLLED) {
                // We hard-code the error code here to be "Element not visible"
                // to maintain compatibility with previous behavior.
                response->SetErrorResponse(EELEMENTNOTDISPLAYED, "The point at which the driver is attempting to click on the element was not scrolled into the viewport.");
              } else {
                response->SetErrorResponse(status_code, "Cannot click on element");
              }
              return;
            }
          }
        } else {
          bool displayed;
          status_code = element_wrapper->IsDisplayed(&displayed);
          if (status_code != WD_SUCCESS) {
            response->SetErrorResponse(status_code, "Unable to determine element is displayed");
            return;
          } 

          if (!displayed) {
            response->SetErrorResponse(EELEMENTNOTDISPLAYED, "Element is not displayed");
            return;
          }
          std::string synthetic_click_error = "";
          status_code = this->ExecuteAtom(this->GetSyntheticClickAtom(),
                                          browser_wrapper,
                                          element_wrapper,
                                          &synthetic_click_error);
          if (status_code != WD_SUCCESS) {
            // This is a hack. We should change this when we can get proper error
            // codes back from the atoms. We'll assume the script failed because
            // the element isn't visible.
            response->SetErrorResponse(EELEMENTNOTDISPLAYED, 
                "Received a JavaScript error attempting to click on the element using synthetic events. We are assuming this is because the element isn't displayed, but it may be due to other problems with executing JavaScript.");
            return;
          }
          browser_wrapper->set_wait_required(true);
        }
      } else {
        response->SetErrorResponse(status_code, "Element is no longer valid");
        return;
      }

      response->SetSuccessResponse(Json::Value::null);
    }
  }

 private:
  bool IsOptionElement(ElementHandle element_wrapper) {
    CComPtr<IHTMLOptionElement> option;
    HRESULT(hr) = element_wrapper->element()->QueryInterface<IHTMLOptionElement>(&option);
    return SUCCEEDED(hr) && !!option;
  }

  std::wstring GetSyntheticClickAtom() {
    std::wstring script_source = L"(function() { return function(){" + 
    atoms::asString(atoms::INPUTS) + 
    L"; return webdriver.atoms.inputs.click(arguments[0]);" + 
    L"};})();";
    return script_source;
  }

  std::wstring GetClickAtom() {
    std::wstring script_source = L"(function() { return (";
    script_source += atoms::asString(atoms::CLICK);
    script_source += L")})();";
    return script_source;
  }

  int ExecuteAtom(const std::wstring& atom_script_source,
                  BrowserHandle browser_wrapper,
                  ElementHandle element_wrapper,
                  std::string* error_msg) {
    CComPtr<IHTMLDocument2> doc;
    browser_wrapper->GetDocument(&doc);
    Script script_wrapper(doc, atom_script_source, 1);
    script_wrapper.AddArgument(element_wrapper);
    int status_code = script_wrapper.ExecuteAsync(ASYNC_SCRIPT_EXECUTION_TIMEOUT_IN_MILLISECONDS);
    if (status_code != WD_SUCCESS) {
      if (script_wrapper.ResultIsString()) {
        std::wstring error = script_wrapper.result().bstrVal;
        *error_msg = StringUtilities::ToString(error);
      } else {
        std::string error = "Executing JavaScript click function returned an";
        error.append(" unexpected error, but no error could be returned from");
        error.append(" Internet Explorer's JavaScript engine.");
        *error_msg = error;
      }
    }
    return status_code;
  }
};

} // namespace webdriver

#endif // WEBDRIVER_IE_CLICKELEMENTCOMMANDHANDLER_H_
