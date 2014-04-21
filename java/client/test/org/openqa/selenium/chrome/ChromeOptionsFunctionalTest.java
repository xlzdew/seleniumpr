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

package org.openqa.selenium.chrome;

import static org.junit.Assert.assertEquals;

import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.testing.JUnit4TestBase;
import org.openqa.selenium.testing.NeedsLocalEnvironment;

/**
 * Functional tests for {@link ChromeOptions}.
 */
public class ChromeOptionsFunctionalTest extends JUnit4TestBase {
  private ChromeDriver driver = null;

  @After
  public void tearDown() throws Exception {
    if (driver != null) {
      driver.quit();
    }
  }

  @NeedsLocalEnvironment
  @Test
  public void canStartChromeWithCustomOptions() {
    ChromeOptions options = new ChromeOptions();
    //options.addArguments("user-agent=foo;bar");
    driver = new ChromeDriver(options);
    //driver.get("http://www.baidu.com");
   //driver.get(pages.clickJacker);
  // Object userAgent = driver.executeScript("return window.navigator.userAgent");
 //  assertEquals("foo;bar", userAgent);
  }
}
