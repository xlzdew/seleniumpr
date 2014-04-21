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

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.Assert.assertEquals;

import com.google.common.base.Function;

import com.thoughtworks.selenium.DefaultSelenium;
import com.thoughtworks.selenium.Selenium;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.grid.common.GridRole;
import org.openqa.grid.e2e.utils.GridTestHelper;
import org.openqa.grid.e2e.utils.RegistryTestHelper;
import org.openqa.grid.internal.utils.SelfRegisteringRemote;
import org.openqa.grid.web.Hub;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;

import java.net.MalformedURLException;
import java.net.URL;

/**
 * checks that the browser is properly stopped when a selenium1 session times out.
 */
public class NodeTimeOutTest {

  private static Hub hub;
  private static SelfRegisteringRemote node;
  private Wait<Object> wait = new FluentWait<Object>("").withTimeout(8, SECONDS);

  @BeforeClass
  public static void setup() throws Exception {
    hub = GridTestHelper.getHub();

    // register a selenium 1

    node = GridTestHelper.getRemoteWithoutCapabilities(hub.getUrl(), GridRole.NODE);
    node.addBrowser(GridTestHelper.getSelenium1FirefoxCapability(), 1);
    node.addBrowser(GridTestHelper.getDefaultBrowserCapability(), 1);
    node.setTimeout(5000, 2000);
    node.startRemoteServer();
    node.sendRegistrationRequest();

    RegistryTestHelper.waitForNode(hub.getRegistry(), 1);
  }

  @Ignore
  @Test
  public void selenium1TimesOut() throws InterruptedException {
    String url = "http://" + hub.getHost() + ":" + hub.getPort() + "/grid/console";
    Selenium selenium = new DefaultSelenium(hub.getHost(), hub.getPort(), "*firefox", url);
    selenium.start();
    selenium.open(url);
    
    wait.until(new Function<Object, Integer>() {
      @Override
      public Integer apply(Object input) {
        Integer i = hub.getRegistry().getActiveSessions().size();
        if (i != 0) {
          return null;
        } else {
          return i;
        }
      }
    });
    assertEquals(hub.getRegistry().getActiveSessions().size(), 0);

  }

  @Test
  public void webDriverTimesOut() throws InterruptedException, MalformedURLException {
    String url = "http://" + hub.getHost() + ":" + hub.getPort() + "/grid/old/console";
    DesiredCapabilities caps = GridTestHelper.getDefaultBrowserCapability();
    WebDriver driver = new RemoteWebDriver(new URL(hub.getUrl() + "/wd/hub"), caps);
    driver.get(url);
    assertEquals(driver.getTitle(), "Grid overview");
    wait.until(new Function<Object, Integer>() {
      @Override
      public Integer apply(Object input) {
        Integer i = hub.getRegistry().getActiveSessions().size();
        if (i != 0) {
          return null;
        } else {
          return i;
        }
      }
    });
    assertEquals(hub.getRegistry().getActiveSessions().size(), 0);

  }

  @AfterClass
  public static void teardown() throws Exception {
    node.stopRemoteServer();
    hub.stop();

  }
}
