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

#ifndef WEBDRIVER_IE_COMMANDHANDLER_H_
#define WEBDRIVER_IE_COMMANDHANDLER_H_

#include <map>
#include <memory>
#include <string>
#include "json.h"
#include "command_handler.h"
#include "command.h"
#include "Element.h"
#include "response.h"

#define BROWSER_NAME_CAPABILITY "browserName"
#define BROWSER_VERSION_CAPABILITY "version"
#define PLATFORM_CAPABILITY "platform"
#define JAVASCRIPT_ENABLED_CAPABILITY "javascriptEnabled"
#define TAKES_SCREENSHOT_CAPABILITY "takesScreenshot"
#define HANDLES_ALERTS_CAPABILITY "handlesAlerts"
#define UNEXPECTED_ALERT_BEHAVIOR_CAPABILITY "unexpectedAlertBehaviour"
#define CSS_SELECTOR_ENABLED_CAPABILITY "cssSelectorsEnabled"
#define NATIVE_EVENTS_CAPABILITY "nativeEvents"
#define PROXY_CAPABILITY "proxy"
#define IGNORE_PROTECTED_MODE_CAPABILITY "ignoreProtectedModeSettings"
#define IGNORE_ZOOM_SETTING_CAPABILITY "ignoreZoomSetting"
#define INITIAL_BROWSER_URL_CAPABILITY "initialBrowserUrl"
#define ELEMENT_SCROLL_BEHAVIOR_CAPABILITY "elementScrollBehavior"
#define ENABLE_PERSISTENT_HOVER_CAPABILITY "enablePersistentHover"
#define ENABLE_ELEMENT_CACHE_CLEANUP_CAPABILITY "enableElementCacheCleanup"
#define REQUIRE_WINDOW_FOCUS_CAPABILITY "requireWindowFocus"
#define BROWSER_ATTACH_TIMEOUT_CAPABILITY "browserAttachTimeout"
#define BROWSER_COMMAND_LINE_SWITCHES_CAPABILITY "ie.browserCommandLineSwitches"
#define FORCE_CREATE_PROCESS_API_CAPABILITY "ie.forceCreateProcessApi"
#define USE_PER_PROCESS_PROXY_CAPABILITY "ie.usePerProcessProxy"
#define ENSURE_CLEAN_SESSION_CAPABILITY "ie.ensureCleanSession"
#define FORCE_SHELL_WINDOWS_API_CAPABILITY "ie.forceShellWindowsApi"

using namespace std;

namespace webdriver {

// Forward declaration of classes to avoid
// circular include files.
class IECommandExecutor;

class IECommandHandler : public CommandHandler<IECommandExecutor> {
 public:
  IECommandHandler(void);
  virtual ~IECommandHandler(void);

 protected:
  virtual void ExecuteInternal(const IECommandExecutor& executor,
                               const LocatorMap& locator_parameters,
                               const ParametersMap& command_parameters,
                               Response* response);
  int GetElement(const IECommandExecutor& executor,
                 const std::string& element_id,
                 ElementHandle* element_wrapper);
  Json::Value RecreateJsonParameterObject(const ParametersMap& command_parameters);
};

typedef std::tr1::shared_ptr<IECommandHandler> CommandHandlerHandle;

} // namespace webdriver

#endif // WEBDRIVER_IE_COMMANDHANDLER_H_
