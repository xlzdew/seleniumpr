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

#ifndef WEBDRIVER_IE_SENDKEYSTOACTIVEELEMENTCOMMANDHANDLER_H_
#define WEBDRIVER_IE_SENDKEYSTOACTIVEELEMENTCOMMANDHANDLER_H_

#include "../Browser.h"
#include "../IECommandHandler.h"
#include "../IECommandExecutor.h"
#include "interactions.h"

namespace webdriver {

class SendKeysToActiveElementCommandHandler : public IECommandHandler {
 public:
  SendKeysToActiveElementCommandHandler(void) {
  }

  virtual ~SendKeysToActiveElementCommandHandler(void) {
  }

 protected:
  void ExecuteInternal(const IECommandExecutor& executor,
                       const LocatorMap& locator_parameters,
                       const ParametersMap& command_parameters,
                       Response* response) {
    ParametersMap::const_iterator value_parameter_iterator = command_parameters.find("value");
    if (value_parameter_iterator == command_parameters.end()) {
      response->SetErrorResponse(400, "Missing parameter: value");
      return;
    } else {
      BrowserHandle browser_wrapper;
      int status_code = executor.GetCurrentBrowser(&browser_wrapper);
      if (status_code != WD_SUCCESS) {
        response->SetErrorResponse(status_code, "Unable to get browser");
        return;
      }
      IECommandExecutor& mutable_executor = const_cast<IECommandExecutor&>(executor);
      Json::Value value = this->RecreateJsonParameterObject(command_parameters);
      value["action"] = "keys";
      Json::UInt index = 0;
      Json::Value actions(Json::arrayValue);
      actions[index] = value;
      mutable_executor.input_manager()->PerformInputSequence(browser_wrapper, actions);
      response->SetSuccessResponse(Json::Value::null);
    }
  }
};

} // namespace webdriver

#endif // WEBDRIVER_IE_SENDKEYSTOACTIVEELEMENTCOMMANDHANDLER_H_

