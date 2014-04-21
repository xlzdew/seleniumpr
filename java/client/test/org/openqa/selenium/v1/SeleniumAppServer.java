/*
Copyright 2011 Selenium committers

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

package org.openqa.selenium.v1;

import java.io.File;

import org.openqa.selenium.environment.webserver.Jetty7AppServer;
import org.openqa.selenium.testing.InProject;
import org.seleniumhq.jetty7.servlet.ServletContextHandler;
import org.seleniumhq.jetty7.webapp.WebAppContext;

public class SeleniumAppServer extends Jetty7AppServer {

  private static final String RC_CONTEXT_PATH = "/selenium-server";

  public SeleniumAppServer() {
    super();
    ServletContextHandler context = addResourceHandler(RC_CONTEXT_PATH, findRootOfRcTestPages());
    addServlet(context, "/cachedContentTest", CachedContentServlet.class);
  }

  protected File findRootOfRcTestPages() {
    return InProject.locate("java/server/test/org/openqa/selenium");
  }

  protected String getMainContextPath(String relativeUrl) {
    if (!relativeUrl.startsWith("/")) {
      relativeUrl = RC_CONTEXT_PATH + "/" + relativeUrl;
    }
    return relativeUrl;
  }

  public static void main(String[] args) {
    Jetty7AppServer server = new SeleniumAppServer();

    server.listenOn(getHttpPortFromEnv());
    System.out.println(String.format("Starting server on port %d", getHttpPortFromEnv()));

    server.listenSecurelyOn(getHttpsPortFromEnv());
    System.out.println(String.format("HTTPS on %d", getHttpsPortFromEnv()));

    server.start();
  }

}
