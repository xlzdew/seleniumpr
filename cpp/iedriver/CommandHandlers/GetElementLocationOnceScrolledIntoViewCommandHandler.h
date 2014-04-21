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

#ifndef WEBDRIVER_IE_GETELEMENTLOCATIONONCESCROLLEDINTOVIEWCOMMANDHANDLER_H_
#define WEBDRIVER_IE_GETELEMENTLOCATIONONCESCROLLEDINTOVIEWCOMMANDHANDLER_H_

#include "../Browser.h"
#include "../IECommandHandler.h"
#include "../IECommandExecutor.h"
#include "../Generated/atoms.h"

namespace webdriver {

class GetElementLocationOnceScrolledIntoViewCommandHandler : public IECommandHandler {
 public:
  GetElementLocationOnceScrolledIntoViewCommandHandler(void) {
  }

  virtual ~GetElementLocationOnceScrolledIntoViewCommandHandler(void) {
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
      std::string element_id = id_parameter_iterator->second;

      BrowserHandle browser_wrapper;
      int status_code = executor.GetCurrentBrowser(&browser_wrapper);
      if (status_code != WD_SUCCESS) {
        response->SetErrorResponse(status_code, "Unable to get browser");
        return;
      }

      ElementHandle element_wrapper;
      status_code = this->GetElement(executor, element_id, &element_wrapper);
      if (status_code == WD_SUCCESS) {
        LocationInfo location = {};
        std::vector<LocationInfo> frame_locations;
        status_code = element_wrapper->GetLocationOnceScrolledIntoView(executor.input_manager()->scroll_behavior(),
                                                                       &location,
                                                                       &frame_locations);
        if (status_code == WD_SUCCESS) {
          CComPtr<IHTMLDocument2> doc;
          browser_wrapper->GetDocument(&doc);
          bool browser_appears_before_ie8 = executor.browser_version() < 8 || DocumentHost::GetDocumentMode(doc) <= 7;
          bool is_quirks_mode = !DocumentHost::IsStandardsMode(doc);
          if (browser_appears_before_ie8 && !is_quirks_mode) {
            // NOTE: For IE 6 and 7 in standards mode, each frame enclosing the document
            // containing the element has a 2-pixel offset that must be accounted for.
            int frame_offset = 2 * static_cast<int>(frame_locations.size());

            // NOTE: For IE 6 and 7 in standards mode, elements with "display:none"
            // in the CSS style should not have a 2-pixel offset.
            std::string display_value = "";
            element_wrapper->GetCssPropertyValue("display", &display_value);
            if (display_value != "none") {
              frame_offset += 2;
            }
            location.x -= frame_offset;
            location.y -= frame_offset;
          }
          Json::Value response_value;
          response_value["x"] = location.x;
          response_value["y"] = location.y;
          response->SetSuccessResponse(response_value);
          return;
        } else {
          response->SetErrorResponse(status_code,
                                     "Unable to get element location.");
          return;
        }
      } else {
        response->SetErrorResponse(status_code, "Element is no longer valid");
        return;
      }
    }
  }
};

} // namespace webdriver

#endif // WEBDRIVER_IE_GETELEMENTLOCATIONONCESCROLLEDINTOVIEWCOMMANDHANDLER_H_
