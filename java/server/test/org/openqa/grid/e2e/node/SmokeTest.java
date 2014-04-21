/*
Copyright 2011 Selenium committers
Copyright 2011 Software Freedom Conservancy

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package org.openqa.grid.e2e.node;

import static org.junit.Assert.assertEquals;

import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.grid.common.GridRole;
import org.openqa.grid.common.RegistrationRequest;
import org.openqa.grid.common.SeleniumProtocol;
import org.openqa.grid.e2e.utils.GridTestHelper;
import org.openqa.grid.e2e.utils.RegistryTestHelper;
import org.openqa.grid.internal.utils.SelfRegisteringRemote;
import org.openqa.grid.web.Hub;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;

public class SmokeTest {

  private static Hub hub;

  @BeforeClass
  public static void prepare() throws Exception {

    hub = GridTestHelper.getHub();


    SelfRegisteringRemote remote =
        GridTestHelper.getRemoteWithoutCapabilities(hub.getUrl(), GridRole.NODE);
    remote.addBrowser(GridTestHelper.getDefaultBrowserCapability(), 1);
    
    DesiredCapabilities firefoxOnSeleniumCapability = new DesiredCapabilities();
    firefoxOnSeleniumCapability.setBrowserName("*firefox");
    firefoxOnSeleniumCapability.setCapability(RegistrationRequest.SELENIUM_PROTOCOL,SeleniumProtocol.Selenium);
    
    remote.addBrowser(firefoxOnSeleniumCapability, 1);

    remote.startRemoteServer();

    remote.getConfiguration().put(RegistrationRequest.TIME_OUT, -1);
    remote.sendRegistrationRequest();
    RegistryTestHelper.waitForNode(hub.getRegistry(), 1);
  }

  @Test
  public void firefoxOnWebDriver() throws MalformedURLException {
    WebDriver driver = null;
    try {
      DesiredCapabilities caps = GridTestHelper.getDefaultBrowserCapability();
      driver = new RemoteWebDriver(new URL(hub.getUrl() + "/wd/hub"), caps);
      driver.get(hub.getUrl() + "/grid/old/console");
      assertEquals(driver.getTitle(), "Grid overview");
    } finally {
      if (driver != null) {
        driver.quit();
      }
    }
  }
  

  @Ignore
  @Test
  public void firefoxOnSelenium() throws MalformedURLException {
    Selenium selenium = null;
    try {
      selenium = new DefaultSelenium(hub.getHost(), hub.getPort(), "*firefox", hub.getUrl() + "");
      assertEquals(hub.getRegistry().getActiveSessions().size(), 0);
      selenium.start();
      assertEquals(hub.getRegistry().getActiveSessions().size(), 1);
      selenium.open(hub.getUrl() + "/grid/console");
      assertEquals(selenium.getTitle(), "Grid Console");
      
    } finally {
      if (selenium != null) {
        selenium.stop();
      }
    }
  }

  @AfterClass
  public static void stop() throws Exception {
    hub.stop();
  }
}
