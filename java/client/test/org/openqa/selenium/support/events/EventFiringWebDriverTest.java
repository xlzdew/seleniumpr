/*
Copyright 2007-2009 Selenium committers

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

package org.openqa.selenium.support.events;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

import org.junit.Test;
import org.mockito.InOrder;
import org.mockito.Mockito;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StubDriver;
import org.openqa.selenium.StubElement;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriver.Navigation;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.internal.WrapsDriver;
import org.openqa.selenium.internal.WrapsElement;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * @author Michael Tamm
 */
public class EventFiringWebDriverTest {

  @Test
  public void navigationEvents() {
    final WebDriver mockedDriver = mock(WebDriver.class);
    final Navigation mockedNavigation = mock(Navigation.class);
    final StringBuilder log = new StringBuilder();

    when(mockedDriver.navigate()).thenReturn(mockedNavigation);

    EventFiringWebDriver testedDriver =
        new EventFiringWebDriver(mockedDriver).register(new AbstractWebDriverEventListener() {
          @Override
          public void beforeNavigateTo(String url, WebDriver driver) {
            log.append("beforeNavigateTo ").append(url).append("\n");
          }

          @Override
          public void afterNavigateTo(String url, WebDriver driver) {
            log.append("afterNavigateTo ").append(url).append("\n");
          }

          @Override
          public void beforeNavigateBack(WebDriver driver) {
            log.append("beforeNavigateBack\n");
          }

          @Override
          public void afterNavigateBack(WebDriver driver) {
            log.append("afterNavigateBack\n");
          }

          @Override
          public void beforeNavigateForward(WebDriver driver) {
            log.append("beforeNavigateForward\n");
          }

          @Override
          public void afterNavigateForward(WebDriver driver) {
            log.append("afterNavigateForward\n");
          }
        });

    testedDriver.get("http://www.get.com");
    testedDriver.navigate().to("http://www.navigate-to.com");
    testedDriver.navigate().back();
    testedDriver.navigate().forward();

    assertEquals(
        "beforeNavigateTo http://www.get.com\n" +
            "afterNavigateTo http://www.get.com\n" +
            "beforeNavigateTo http://www.navigate-to.com\n" +
            "afterNavigateTo http://www.navigate-to.com\n" +
            "beforeNavigateBack\n" +
            "afterNavigateBack\n" +
            "beforeNavigateForward\n" +
            "afterNavigateForward\n",
        log.toString());

    InOrder order = Mockito.inOrder(mockedDriver, mockedNavigation);
    order.verify(mockedDriver).get("http://www.get.com");
    order.verify(mockedNavigation).to("http://www.navigate-to.com");
    order.verify(mockedNavigation).back();
    order.verify(mockedNavigation).forward();
    order.verifyNoMoreInteractions();
  }

  @Test
  public void clickEvent() {
    final WebDriver mockedDriver = mock(WebDriver.class);
    final WebElement mockedElement = mock(WebElement.class);
    final StringBuilder log = new StringBuilder();

    when(mockedDriver.findElement(By.name("foo"))).thenReturn(mockedElement);

    EventFiringWebDriver testedDriver =
        new EventFiringWebDriver(mockedDriver).register(new AbstractWebDriverEventListener() {
          @Override
          public void beforeClickOn(WebElement element, WebDriver driver) {
            log.append("beforeClickOn\n");
          }

          @Override
          public void afterClickOn(WebElement element, WebDriver driver) {
            log.append("afterClickOn\n");
          }
        });

    testedDriver.findElement(By.name("foo")).click();

    assertEquals(
        "beforeClickOn\n" +
            "afterClickOn\n",
        log.toString());

    InOrder order = Mockito.inOrder(mockedDriver, mockedElement);
    order.verify(mockedDriver).findElement(By.name("foo"));
    order.verify(mockedElement).click();
    order.verifyNoMoreInteractions();
  }

  @Test
  public void changeValueEvent() {
    final WebDriver mockedDriver = mock(WebDriver.class);
    final WebElement mockedElement = mock(WebElement.class);
    final StringBuilder log = new StringBuilder();

    when(mockedDriver.findElement(By.name("foo"))).thenReturn(mockedElement);

    EventFiringWebDriver testedDriver =
        new EventFiringWebDriver(mockedDriver).register(new AbstractWebDriverEventListener() {
          @Override
          public void beforeChangeValueOf(WebElement element, WebDriver driver) {
            log.append("beforeChangeValueOf\n");
          }

          @Override
          public void afterChangeValueOf(WebElement element, WebDriver driver) {
            log.append("afterChangeValueOf\n");
          }
        });

    testedDriver.findElement(By.name("foo")).clear();
    testedDriver.findElement(By.name("foo")).sendKeys("some text");
    testedDriver.findElement(By.name("foo")).click();

    assertEquals(
        "beforeChangeValueOf\n" +
            "afterChangeValueOf\n" +
            "beforeChangeValueOf\n" +
            "afterChangeValueOf\n",
        log.toString());

    InOrder order = Mockito.inOrder(mockedElement);
    order.verify(mockedElement).clear();
    order.verify(mockedElement).sendKeys("some text");
    order.verify(mockedElement).click();
    order.verifyNoMoreInteractions();

    verify(mockedDriver, times(3)).findElement(By.name("foo"));
    verifyNoMoreInteractions(mockedDriver);
  }

  @Test
  public void findByEvent() {
    final WebDriver mockedDriver = mock(WebDriver.class);
    final WebElement mockedElement = mock(WebElement.class);
    final WebElement mockedChildElement = mock(WebElement.class);
    final StringBuilder log = new StringBuilder();

    when(mockedDriver.findElement(By.id("foo"))).thenReturn(mockedElement);
    when(mockedElement.findElement(Mockito.<By>any())).thenReturn(mockedChildElement);

    EventFiringWebDriver testedDriver =
        new EventFiringWebDriver(mockedDriver).register(new AbstractWebDriverEventListener() {
          @Override
          public void beforeFindBy(By by, WebElement element, WebDriver driver) {
            log.append("beforeFindBy from ").append(element == null ? "WebDriver" : "WebElement")
                .append(" ").append(by).append("\n");
          }

          @Override
          public void afterFindBy(By by, WebElement element, WebDriver driver) {
            log.append("afterFindBy from ").append(element == null ? "WebDriver" : "WebElement")
                .append(" ").append(by).append("\n");
          }
        });

    WebElement element = testedDriver.findElement(By.id("foo"));
    element.findElement(By.linkText("bar"));
    element.findElements(By.name("xyz"));
    testedDriver.findElements(By.xpath("//link[@type = 'text/css']"));

    assertEquals(
        "beforeFindBy from WebDriver By.id: foo\n" +
            "afterFindBy from WebDriver By.id: foo\n" +
            "beforeFindBy from WebElement By.linkText: bar\n" +
            "afterFindBy from WebElement By.linkText: bar\n" +
            "beforeFindBy from WebElement By.name: xyz\n" +
            "afterFindBy from WebElement By.name: xyz\n" +
            "beforeFindBy from WebDriver By.xpath: //link[@type = 'text/css']\n" +
            "afterFindBy from WebDriver By.xpath: //link[@type = 'text/css']\n",
        log.toString());

    InOrder order = Mockito.inOrder(mockedElement, mockedDriver);
    order.verify(mockedElement).findElement(By.linkText("bar"));
    order.verify(mockedElement).findElements(By.name("xyz"));
    order.verify(mockedDriver).findElements(By.xpath("//link[@type = 'text/css']"));
    order.verifyNoMoreInteractions();
  }

  @Test
  public void shouldCallListenersWhenAnExceptionIsThrown() {
    final WebDriver mockedDriver = mock(WebDriver.class);
    final StringBuilder log = new StringBuilder();

    final NoSuchElementException exception = new NoSuchElementException("argh");

    when(mockedDriver.findElement(By.id("foo"))).thenThrow(exception);

    EventFiringWebDriver testedDriver =
        new EventFiringWebDriver(mockedDriver).register(new AbstractWebDriverEventListener() {
          @Override
          public void onException(Throwable throwable, WebDriver driver) {
            log.append(throwable.getMessage());
          }
        });

    try {
      testedDriver.findElement(By.id("foo"));
      fail("Expected exception to be propagated");
    } catch (NoSuchElementException e) {
      // Fine
    }

    assertEquals(exception.getMessage(), log.toString());
  }

  @Test
  public void shouldUnpackElementArgsWhenCallingScripts() {
    final ExececutingDriver mockedDriver = mock(ExececutingDriver.class);
    final WebElement stubbedElement = mock(WebElement.class);

    when(mockedDriver.findElement(By.id("foo"))).thenReturn(stubbedElement);

    EventFiringWebDriver testedDriver = new EventFiringWebDriver(mockedDriver);
    testedDriver.register(new AbstractWebDriverEventListener() {});

    WebElement element = testedDriver.findElement(By.id("foo"));
    testedDriver.executeScript("foo", element);
    verify(mockedDriver).executeScript("foo", element);
  }

  @Test
  public void testShouldUnpackListOfElementArgsWhenCallingScripts() {
    final ExececutingDriver mockedDriver = mock(ExececutingDriver.class);
    final WebElement mockElement = mock(WebElement.class);

    when(mockedDriver.findElement(By.id("foo"))).thenReturn(mockElement);

    EventFiringWebDriver testedDriver = new EventFiringWebDriver(mockedDriver);
    testedDriver.register(new AbstractWebDriverEventListener() {});

    final WebElement foundElement = testedDriver.findElement(By.id("foo"));
    assertTrue(foundElement instanceof WrapsElement);
    assertSame(mockElement, ((WrapsElement) foundElement).getWrappedElement());

    testedDriver.executeScript("foo", new ArrayList<Object>() {{
      add("before");
      add(foundElement);
      add("after");
    }});

    verify(mockedDriver).executeScript("foo", new ArrayList<Object>() {{
      add("before");
      add(mockElement);
      add("after");
    }});
  }

  @Test
  public void testShouldUnpackMapOfElementArgsWhenCallingScripts() {
    final ExececutingDriver mockedDriver = mock(ExececutingDriver.class);
    final WebElement mockElement = mock(WebElement.class);

    when(mockedDriver.findElement(By.id("foo"))).thenReturn(mockElement);

    EventFiringWebDriver testedDriver = new EventFiringWebDriver(mockedDriver);
    testedDriver.register(new AbstractWebDriverEventListener() {
    });

    final WebElement foundElement = testedDriver.findElement(By.id("foo"));
    assertTrue(foundElement instanceof WrapsElement);
    assertSame(mockElement, ((WrapsElement) foundElement).getWrappedElement());

    testedDriver.executeScript("foo", new HashMap<String, Object>() {{
      put("foo", "bar");
      put("element", foundElement);
      put("nested", new ArrayList<Object>() {{
        add("before");
        add(foundElement);
        add("after");
      }});
    }});

    verify(mockedDriver).executeScript("foo", new HashMap<String, Object>() {{
      put("foo", "bar");
      put("element", mockElement);
      put("nested", new ArrayList<Object>() {{
        add("before");
        add(mockElement);
        add("after");
      }});
    }});
  }

  @Test
  public void shouldBeAbleToWrapSubclassesOfSomethingImplementingTheWebDriverInterface() {
    try {
      new EventFiringWebDriver(new ChildDriver());
      // We should get this far
    } catch (ClassCastException e) {
      e.printStackTrace();
      fail("Should have been able to wrap the child of a webdriver implementing interface");
    }
  }

  @Test
  public void shouldBeAbleToAccessWrappedInstanceFromEventCalls() {
    class MyStub extends StubDriver {
      @Override
      public void get(String url) {
        // Do nothing
      }

      @SuppressWarnings("unused")
      public void fishy() {
      }

    }

    final WebDriver stub = new MyStub();
    EventFiringWebDriver driver = new EventFiringWebDriver(stub);
    MyStub wrapped = (MyStub) driver.getWrappedDriver();
    assertEquals(stub, wrapped);

    class MyListener extends AbstractWebDriverEventListener {
      @Override
      public void beforeNavigateTo(String url, WebDriver driver) {
        MyStub unwrapped = (MyStub) ((WrapsDriver) driver).getWrappedDriver();

        assertEquals(stub, unwrapped);
      }
    }

    driver.register(new MyListener());

    driver.get("http://example.org");
  }

  @Test
  public void shouldBeAbleToAccessWrappedElementInstanceFromEventCalls() {
    final StubElement stubElement = new StubElement();

    final WebDriver stubDriver = new StubDriver() {
      @Override
      public WebElement findElement(By by) {
        return stubElement;
      }
    };

    EventFiringWebDriver driver = new EventFiringWebDriver(stubDriver);

    class MyListener extends AbstractWebDriverEventListener {
      @Override
      public void beforeClickOn(WebElement element, WebDriver driver) {
        assertEquals(stubElement, ((WrapsElement) element).getWrappedElement());
      }
    }

    driver.register(new MyListener());

    driver.findElement(By.name("stub")).click();
  }

  @Test
  public void shouldReturnLocatorFromToStringMethod() {
    final StubElement stubElement = new StubElement() {
      @Override
      public String toString() {
        return "cheese";
      }
    };

    StubDriver driver = new StubDriver() {
      @Override
      public WebElement findElement(By by) {
        return stubElement;
      }
    };

    EventFiringWebDriver firingDriver = new EventFiringWebDriver(driver);
    WebElement firingElement = firingDriver.findElement(By.id("ignored"));

    assertEquals(stubElement.toString(), firingElement.toString());
  }

  private static interface ExececutingDriver extends WebDriver, JavascriptExecutor {}

  private static class ChildDriver extends StubDriver {}
}
