package fff;

import org.testng.annotations.Test;

import java.awt.event.KeyEvent;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.SearchContext;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.interactions.HasInputDevices;
import org.openqa.selenium.interactions.SRobot;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class helloflash{


@Test
public void buyerCreateSeaFeightPo() throws MalformedURLException, InterruptedException {
//System.out.println("ok:"+account.getLoginId());
System.setProperty("webdriver.chrome.driver", "/Users/lingzhixiang/tools/chromedriver");
   WebDriver driver = new ChromeDriver();

driver.manage().timeouts().pageLoadTimeout(100, TimeUnit.SECONDS);

String urlBizBuyerCreatePoString="http://biz.alibaba.com/generalorders/po/draftPo.htm?svId=200012245&pageType=miniHome";

String ss="https://login.alibaba.com/?Done=http%3A%2F%2Fbiz.alibaba.com%2Fgeneralorders%2Flist_orders.htm";
preLoginTo(ss,"aliqatest07","20130909qa07aetest", driver);
driver.navigate().to(urlBizBuyerCreatePoString);
driver.findElement(By.cssSelector("input[name='quntity']")).sendKeys("2");
driver.findElement(By.cssSelector("input[name='unitPrice']")).sendKeys("2");
driver.findElement(By.cssSelector("input[name='shipping']")).click();
driver.findElement(By.cssSelector("embed")).click();
//driver.findElement(By.cssSelector("embed")).sendKeys("");
SRobot sr= ((HasInputDevices) driver).getSRobot();
sr.pressKey(KeyEvent.VK_CONTROL);
sr.pressKey(KeyEvent.VK_V);
sr.releaseKey(KeyEvent.VK_V);
sr.releaseKey(KeyEvent.VK_CONTROL);
sr.pressKey(KeyEvent.VK_ENTER);
sr.releaseKey(KeyEvent.VK_ENTER);


Thread.sleep(3000);
/*
JavascriptExecutor js = null;
if (driver instanceof JavascriptExecutor) {
 js = (JavascriptExecutor)driver;
}
js.executeScript(
       "var inputs = document.embeds;"+
"return inputs;"
);
*/
//TimeUtil.toWait(2000);
//driver.quit();
//document.embeds['__swfuploader__id1396966071725__1'];"

}



public void preLoginTo(String url, String account, String password, WebDriver driver) throws InterruptedException {
    driver.get("https://login.alibaba.com/?Done=http%3A%2F%2Fbiz.alibaba.com%2Fgeneralorders%2Flist_orders.htm");
    //TimeUtil.toWait(1000);
    Thread.sleep(3000);
WebElement xloginPassportId = driver.findElement(By.id("xloginPassportId")); 
    xloginPassportId.clear();
    xloginPassportId.sendKeys(account);
    driver.findElement(By.id("xloginPasswordId")).sendKeys(password);
    driver.findElement(By.id("signInButton")).click();
    int tryTime = 40;
    while (driver.getCurrentUrl().contains("login.alibaba.com") && tryTime > 0) {
        //TimeUtil.toWait(500);
        tryTime--;
    }
    if (tryTime <= 0) {
        driver.get(url);
    }
}
/*
public static By byLabel(final String label)
{
  return new By() {

    @Override
    public String toString()
    {
      return "ByLabel: " + label;
    }

	@Override
   public List<WebElement> findElements(final SearchContext context)
   {
     final String xpath =
        "//*[@id = //label[text() = \"" + label + "\"]/@for]";
     return ((FindsByXPath) context).findElementsByXPath(xpath);
   }

   @Override
   public WebElement findElement(final SearchContext context)
   {
     String xpath =
       "id(//label[text() = \"" + label + "\"]/@for)";
     return ((FindsByXPath) context).findElementByXPath(xpath);
   }
	
  };
}
*/

}


