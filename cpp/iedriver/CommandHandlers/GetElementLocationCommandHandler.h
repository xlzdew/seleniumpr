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
#ifndef WEBDRIVER_IE_GETELEMENTLOCATIONCOMMANDHANDLER_H_
#define WEBDRIVER_IE_GETELEMENTLOCATIONCOMMANDHANDLER_H_

#include "../Browser.h"
#include "../IECommandHandler.h"
#include "../IECommandExecutor.h"
#include "../Generated/atoms.h"

namespace webdriver {

class GetElementLocationCommandHandler : public IECommandHandler {
 public:
  GetElementLocationCommandHandler(void) {
  }

  virtual ~GetElementLocationCommandHandler(void) {
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
        // The atom is just the definition of an anonymous
        // function: "function() {...}"; Wrap it in another function so
        // we can invoke it with our arguments without polluting the
        // current namespace.
        // Furthermore, we need to invoke the function that is the atom and
        // get the result, but we need to wrap the execution in another function
        // so that it can be invoked without polluting the current namespace.
        std::wstring script_source = L"(function() { return function() { var result = ";
        script_source += L"(function() { return (";
        script_source += atoms::asString(atoms::GET_LOCATION);
        script_source += L")})().apply(null, arguments);";
        script_source += L"return [result.x, result.y]; };})();";

        CComPtr<IHTMLDocument2> doc;
        browser_wrapper->GetDocument(&doc);

        Json::Value location_array;
        Script script_wrapper(doc, script_source, 1);
        script_wrapper.AddArgument(element_wrapper);
        status_code = script_wrapper.Execute();

        if (status_code == WD_SUCCESS) {
          script_wrapper.ConvertResultToJsonValue(executor, &location_array);
          Json::UInt index = 0;
          int x = location_array.get(index, 0).asInt();
          ++index;
          int y = location_array.get(index, 0).asInt();

          CComPtr<IHTMLDocument2> doc;
          browser_wrapper->GetDocument(&doc);
          bool browser_appears_before_ie8 = executor.browser_version() < 8 || DocumentHost::GetDocumentMode(doc) <= 7;
          bool is_quirks_mode = !DocumentHost::IsStandardsMode(doc);
          if (browser_appears_before_ie8 && !is_quirks_mode) {
            // NOTE: For IE 6 and 7 in standards mode, elements with "display:none"
            // in the CSS style should have a 2-pixel offset for their location.
            std::string display_value = "";
            element_wrapper->GetCssPropertyValue("display", &display_value);
            if (display_value == "none") {
              int offset = 2;
              x += offset;
              y += offset;
            }
          }

          Json::Value response_value;
          response_value["x"] = x;
          response_value["y"] = y;
          response->SetSuccessResponse(response_value);
          return;
        } else {
          response->SetErrorResponse(status_code, "Unable to get element location");
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

#endif // WEBDRIVER_IE_GETELEMENTLOCATIONCOMMANDHANDLER_H_
