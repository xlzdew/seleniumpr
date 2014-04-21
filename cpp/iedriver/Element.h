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

#ifndef WEBDRIVER_IE_ELEMENT_H_
#define WEBDRIVER_IE_ELEMENT_H_

#include <ctime>
#include <memory>
#include <string>
#include <vector>
#include "json.h"
#include "LocationInfo.h"

namespace webdriver {

enum ELEMENT_SCROLL_BEHAVIOR {
  TOP,
  BOTTOM
};

typedef unsigned int (__stdcall *ASYNCEXECPROC)(void*);

// Forward declaration of classes to avoid
// circular include files.
class Browser;

class Element {
 public:
  Element(IHTMLElement* element, HWND containing_window_handle);
  virtual ~Element(void);
  Json::Value ConvertToJson(void);
  std::string GetTagName(void);
  int GetLocationOnceScrolledIntoView(const ELEMENT_SCROLL_BEHAVIOR scroll,
                                      LocationInfo* location,
                                      std::vector<LocationInfo>* frame_locations);
  int GetClickLocation(const ELEMENT_SCROLL_BEHAVIOR scroll_behavior,
                       LocationInfo* element_location,
                       LocationInfo* click_location);
  int GetAttributeValue(const std::string& attribute_name,
                        std::string* attribute_value,
                        bool* value_is_null);
  int GetCssPropertyValue(const std::string& property_name,
                          std::string* property_value);

  int IsDisplayed(bool* result);
  bool IsEnabled(void);
  bool IsSelected(void);
  bool IsInteractable(void);
  bool IsEditable(void);
  bool IsAttachedToDom(void);

  std::string element_id(void) const { return this->element_id_; }
  IHTMLElement* element(void) { return this->element_; }

  clock_t last_click_time(void) const { return this->last_click_time_; }
  void set_last_click_time(clock_t click_time) { this->last_click_time_ = click_time; }

 private:
  int GetLocation(LocationInfo* location,
                  std::vector<LocationInfo>* frame_locations);
  LocationInfo CalculateClickPoint(const LocationInfo location,
                                   const bool document_contains_frames);
  bool GetClickableViewPortLocation(const bool document_contains_frames,
                                    LocationInfo* location);
  bool IsLocationInViewPort(const LocationInfo location,
                            const bool document_contains_frames);
  bool IsLocationVisibleInFrames(const LocationInfo location,
                                 const std::vector<LocationInfo> frame_locations);
  bool IsHiddenByOverflow();
  bool AppendFrameDetails(std::vector<LocationInfo>* frame_locations);
  int GetContainingDocument(const bool use_dom_node, IHTMLDocument2** doc);
  int GetDocumentFromWindow(IHTMLWindow2* parent_window,
                            IHTMLDocument2** parent_doc);
  bool IsInline(void);
  static bool RectHasNonZeroDimensions(IHTMLRect* rect);

  bool HasFirstChildTextNodeOfMultipleChildren(void);
  bool GetTextBoundaries(LocationInfo* text_info);

  std::string element_id_;
  CComPtr<IHTMLElement> element_;
  HWND containing_window_handle_;
  clock_t last_click_time_;
};

typedef std::tr1::shared_ptr<Element> ElementHandle;

} // namespace webdriver

#endif // WEBDRIVER_IE_ELEMENT_H_
