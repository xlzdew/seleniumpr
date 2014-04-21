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

#ifndef WEBDRIVER_IE_GETSESSIONCAPABILITIESCOMMANDHANDLER_H_
#define WEBDRIVER_IE_GETSESSIONCAPABILITIESCOMMANDHANDLER_H_

#include "../Browser.h"
#include "../IECommandHandler.h"
#include "../IECommandExecutor.h"

namespace webdriver {

class GetSessionCapabilitiesCommandHandler : public IECommandHandler {
 public:
  GetSessionCapabilitiesCommandHandler(void) {
  }

  virtual ~GetSessionCapabilitiesCommandHandler(void) {
  }

 protected:
  void ExecuteInternal(const IECommandExecutor& executor,
                       const LocatorMap& locator_parameters,
                       const ParametersMap& command_parameters,
                       Response* response) {
    Json::Value capabilities;
    capabilities[BROWSER_NAME_CAPABILITY] = "internet explorer";
    capabilities[BROWSER_VERSION_CAPABILITY] = std::to_string(static_cast<long long>(executor.browser_version()));
    capabilities[JAVASCRIPT_ENABLED_CAPABILITY] = true;
    capabilities[PLATFORM_CAPABILITY] = "WINDOWS";
    capabilities[NATIVE_EVENTS_CAPABILITY] = executor.input_manager()->enable_native_events();
    capabilities[CSS_SELECTOR_ENABLED_CAPABILITY] = true;
    capabilities[TAKES_SCREENSHOT_CAPABILITY] = true;
    capabilities[HANDLES_ALERTS_CAPABILITY] = true;
    if (executor.proxy_manager()->is_proxy_set()) {
      capabilities[PROXY_CAPABILITY] = executor.proxy_manager()->GetProxyAsJson();
    }
    capabilities[ENABLE_PERSISTENT_HOVER_CAPABILITY] = executor.enable_persistent_hover();
    capabilities[UNEXPECTED_ALERT_BEHAVIOR_CAPABILITY] = executor.unexpected_alert_behavior();
    capabilities[ELEMENT_SCROLL_BEHAVIOR_CAPABILITY] = executor.input_manager()->scroll_behavior();
    capabilities[IGNORE_PROTECTED_MODE_CAPABILITY] = executor.browser_factory()->ignore_protected_mode_settings();
    capabilities[IGNORE_ZOOM_SETTING_CAPABILITY] = executor.browser_factory()->ignore_zoom_setting();
    capabilities[INITIAL_BROWSER_URL_CAPABILITY] = executor.browser_factory()->initial_browser_url();
    capabilities[ENABLE_ELEMENT_CACHE_CLEANUP_CAPABILITY] = executor.enable_element_cache_cleanup();
    capabilities[REQUIRE_WINDOW_FOCUS_CAPABILITY] = executor.input_manager()->require_window_focus();
    capabilities[BROWSER_ATTACH_TIMEOUT_CAPABILITY] = executor.browser_factory()->browser_attach_timeout();
    capabilities[BROWSER_COMMAND_LINE_SWITCHES_CAPABILITY] = executor.browser_factory()->browser_command_line_switches();
    capabilities[FORCE_CREATE_PROCESS_API_CAPABILITY] = executor.browser_factory()->force_createprocess_api();
    capabilities[ENSURE_CLEAN_SESSION_CAPABILITY] = executor.browser_factory()->clear_cache();
    capabilities[USE_PER_PROCESS_PROXY_CAPABILITY] = executor.proxy_manager()->use_per_process_proxy();
    response->SetSuccessResponse(capabilities);
  }
};

} // namespace webdriver

#endif // WEBDRIVER_IE_GETSESSIONCAPABILITIESCOMMANDHANDLER_H_
