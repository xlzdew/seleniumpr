package fff;

import java.io.File;
import java.net.MalformedURLException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chrome.ChromeDriverService.Builder;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.RemoteWebDriver;

public class testFirefox {
	public static void main(String[] arg) throws InterruptedException, MalformedURLException{
		//File ed= new File("/Users/lingzhixiang/tools/chromedriver");
		//File logf= new File("/Users/lingzhixiang/tools/chrome.log");
		//Builder bu = new ChromeDriverService.Builder();
		//System.setProperty("webdriver.chrome.verboseLogging", "true");
		//ChromeDriverService service =bu.usingDriverExecutable(ed).usingAnyFreePort().withLogFile(logf).build();
		//ChromeOptions option= new ChromeOptions();
		//option.addArguments("--log-path=/Users/lingzhixiang/tools/chrome.log", "--verbose");
		//RemoteWebDriver driver  = new ChromeDriver(service,option);
		//System.setProperty("webdriver.firefox.bin", "/Applications/Firefox"); 
		FirefoxProfile profile = new FirefoxProfile();
		WebDriver driver = new FirefoxDriver(profile); 
		driver.get("http://www.baidu.com");
		WebElement ele =driver.findElement(By.cssSelector("input#kw1"));
		ele.sendKeys("selenium");
		driver.findElement(By.cssSelector("input#su1")).submit();
		//driver.manage().window().wait(1000);
		driver.close();
		driver.quit();
	
	}
}
