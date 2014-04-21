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

import com.google.common.base.Function;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.grid.common.GridRole;
import org.openqa.grid.common.RegistrationRequest;
import org.openqa.grid.e2e.utils.GridTestHelper;
import org.openqa.grid.e2e.utils.RegistryTestHelper;
import org.openqa.grid.internal.Registry;
import org.openqa.grid.internal.RemoteProxy;
import org.openqa.grid.internal.utils.SelfRegisteringRemote;
import org.openqa.grid.selenium.proxy.DefaultRemoteProxy;
import org.openqa.grid.web.Hub;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;

public class NodeGoingDownAndUpTest {

  private static Hub hub;
  private static Registry registry;
  private static SelfRegisteringRemote remote;
  private static Wait<Object> wait = new FluentWait<Object>("").withTimeout(30, SECONDS);

  @BeforeClass
  public static void prepare() throws Exception {
    hub = GridTestHelper.getHub();
    registry = hub.getRegistry();

    remote = GridTestHelper.getRemoteWithoutCapabilities(hub.getUrl(), GridRole.NODE);

    // check if the node is up every 900 ms
    remote.getConfiguration().put(RegistrationRequest.NODE_POLLING, 900);
    // unregister the proxy is it's down for more than 10 sec in a row.
    remote.getConfiguration().put(RegistrationRequest.UNREGISTER_IF_STILL_DOWN_AFTER, 10000);
    // mark as down after 3 tries
    remote.getConfiguration().put(RegistrationRequest.DOWN_POLLING_LIMIT, 3);
    // limit connection and socket timeout for node alive check up to
    remote.getConfiguration().put(RegistrationRequest.STATUS_CHECK_TIMEOUT, 100);
    // add browser
    remote.addBrowser(GridTestHelper.getDefaultBrowserCapability(), 1);
  
    remote.startRemoteServer();
    remote.sendRegistrationRequest();
    RegistryTestHelper.waitForNode(registry, 1);
  }

  @Test
  public void markdown() throws Exception {
    // should be up
    for (RemoteProxy proxy : registry.getAllProxies()) {
      wait.until(isUp((DefaultRemoteProxy) proxy));
    }

    // killing the nodes
    remote.stopRemoteServer();

    // should be down
    for (RemoteProxy proxy : registry.getAllProxies()) {
      wait.until(isDown((DefaultRemoteProxy) proxy));
    }

    // and back up
    remote.startRemoteServer();

    // should be up
    for (RemoteProxy proxy : registry.getAllProxies()) {
      wait.until(isUp((DefaultRemoteProxy) proxy));
    }
  }

  private Function<Object, Boolean> isUp(final DefaultRemoteProxy proxy) {
    return new Function<Object, Boolean>() {
      @Override
      public Boolean apply(Object input) {
        return !proxy.isDown();
      }
    };
  }

  private Function<Object, Boolean> isDown(final DefaultRemoteProxy proxy) {
    return new Function<Object, Boolean>() {
      @Override
      public Boolean apply(Object input) {
        return proxy.isDown();
      }
    };
  }

  @AfterClass
  public static void stop() throws Exception {
    hub.stop();
    remote.stopRemoteServer();
  }
}
