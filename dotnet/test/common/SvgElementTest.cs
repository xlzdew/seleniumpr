using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Text;
using NUnit.Framework;

namespace OpenQA.Selenium
{
    [TestFixture]
    public class SvgElementTest : DriverTestFixture
    {
        [Test]
        [IgnoreBrowser(Browser.Opera, "Not tested")]
        [IgnoreBrowser(Browser.HtmlUnit, "SVG tests only in rendered browsers")]
        [IgnoreBrowser(Browser.Safari, "Not supported by driver")]
        public void ShouldClickOnGraphVisualElements()
        {
            if (TestUtilities.IsOldIE(driver))
            {
                Assert.Ignore("SVG support only exists in IE9+");
            }

            driver.Url = svgPage;
            IWebElement svg = driver.FindElement(By.CssSelector("svg"));

            ReadOnlyCollection<IWebElement> groupElements = svg.FindElements(By.CssSelector("g"));
            Assert.AreEqual(5, groupElements.Count);

            groupElements[1].Click();
            IWebElement resultElement = driver.FindElement(By.Id("result"));
            WaitFor(() => { return resultElement.Text == "slice_red"; });
            Assert.AreEqual("slice_red", resultElement.Text);

            groupElements[2].Click();
            resultElement = driver.FindElement(By.Id("result"));
            WaitFor(() => { return resultElement.Text == "slice_green"; });
            Assert.AreEqual("slice_green", resultElement.Text);
        }

        [Test]
        [IgnoreBrowser(Browser.Opera, "Not tested")]
        [IgnoreBrowser(Browser.HtmlUnit, "SVG tests only in rendered browsers")]
        [IgnoreBrowser(Browser.Safari, "Not supported by driver")]
        public void ShouldClickOnGraphTextElements()
        {
            if (TestUtilities.IsOldIE(driver))
            {
                Assert.Ignore("SVG support only exists in IE9+");
            }

            driver.Url = svgPage;
            IWebElement svg = driver.FindElement(By.CssSelector("svg"));
            ReadOnlyCollection<IWebElement> textElements = svg.FindElements(By.CssSelector("text"));

            IWebElement appleElement = FindAppleElement(textElements);
            Assert.IsNotNull(appleElement);

            appleElement.Click();
            IWebElement resultElement = driver.FindElement(By.Id("result"));
            WaitFor(() => { return resultElement.Text == "text_apple"; });
            Assert.AreEqual("text_apple", resultElement.Text);
        }

        private IWebElement FindAppleElement(IEnumerable<IWebElement> textElements)
        {
            foreach (IWebElement currentElement in textElements)
            {
                if (currentElement.Text.Contains("Apple"))
                {
                    return currentElement;
                }
            }

            return null;
        }
    }
}
