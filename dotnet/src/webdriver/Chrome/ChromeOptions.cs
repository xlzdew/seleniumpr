﻿// <copyright file="ChromeOptions.cs" company="WebDriver Committers">
// Copyright 2007-2011 WebDriver committers
// Copyright 2007-2011 Google Inc.
// Portions copyright 2011 Software Freedom Conservancy
//
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
// </copyright>

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using OpenQA.Selenium.Remote;

namespace OpenQA.Selenium.Chrome
{
    /// <summary>
    /// Class to manage options specific to <see cref="ChromeDriver"/>
    /// </summary>
    /// <remarks>
    /// Used with ChromeDriver.exe v17.0.963.0 and higher.
    /// </remarks>
    /// <example>
    /// <code>
    /// ChromeOptions options = new ChromeOptions();
    /// options.AddExtensions("\path\to\extension.crx");
    /// options.BinaryLocation = "\path\to\chrome";
    /// </code>
    /// <para></para>
    /// <para>For use with ChromeDriver:</para>
    /// <para></para>
    /// <code>
    /// ChromeDriver driver = new ChromeDriver(options);
    /// </code>
    /// <para></para>
    /// <para>For use with RemoteWebDriver:</para>
    /// <para></para>
    /// <code>
    /// RemoteWebDriver driver = new RemoteWebDriver(new Uri("http://localhost:4444/wd/hub"), options.ToCapabilities());
    /// </code>
    /// </example>
    public class ChromeOptions
    {
        /// <summary>
        /// Gets the name of the capability used to store Chrome options in
        /// a <see cref="DesiredCapabilities"/> object.
        /// </summary>
        public static readonly string Capability = "chromeOptions";

        private const string ArgumentsChromeOption = "args";
        private const string BinaryChromeOption = "binary";
        private const string ExtensionsChromeOption = "extensions";
        private const string LocalStateChromeOption = "localState";
        private const string PreferencesChromeOption = "prefs";
        private const string DetachChromeOption = "detach";
        private const string DebuggerAddressChromeOption = "debuggerAddress";
        private const string ExcludeSwitchesChromeOption = "excludeSwitches";
        private const string MinidumpPathChromeOption = "minidumpPath";

        private bool leaveBrowserRunning;
        private string binaryLocation;
        private string debuggerAddress;
        private string minidumpPath;
        private List<string> arguments = new List<string>();
        private List<string> extensionFiles = new List<string>();
        private List<string> encodedExtensions = new List<string>();
        private List<string> excludedSwitches = new List<string>();
        private Dictionary<string, object> additionalCapabilities = new Dictionary<string, object>();
        private Dictionary<string, object> additionalChromeOptions = new Dictionary<string, object>();
        private Dictionary<string, object> userProfilePreferences;
        private Dictionary<string, object> localStatePreferences;
        private Proxy proxy;

        /// <summary>
        /// Gets or sets the location of the Chrome browser's binary executable file.
        /// </summary>
        public string BinaryLocation
        {
            get { return this.binaryLocation; }
            set { this.binaryLocation = value; }
        }

        /// <summary>
        /// Gets or sets a value indicating whether Chrome should be left running after the
        /// ChromeDriver instance is exited. Defaults to <see langword="false"/>.
        /// </summary>
        public bool LeaveBrowserRunning
        {
            get { return this.leaveBrowserRunning; }
            set { this.leaveBrowserRunning = value; }
        }

        /// <summary>
        /// Gets or sets the proxy to use with this instance of Chrome.
        /// </summary>
        public Proxy Proxy
        {
            get { return this.proxy; }
            set { this.proxy = value; }
        }

        /// <summary>
        /// Gets the list of arguments appended to the Chrome command line as a string array.
        /// </summary>
        public ReadOnlyCollection<string> Arguments
        {
            get { return this.arguments.AsReadOnly(); }
        }

        /// <summary>
        /// Gets the list of extensions to be installed as an array of base64-encoded strings.
        /// </summary>
        public ReadOnlyCollection<string> Extensions
        {
            get
            {
                List<string> allExtensions = new List<string>(this.encodedExtensions);
                foreach (string extensionFile in this.extensionFiles)
                {
                    byte[] extensionByteArray = File.ReadAllBytes(extensionFile);
                    string encodedExtension = Convert.ToBase64String(extensionByteArray);
                    allExtensions.Add(encodedExtension);
                }

                return allExtensions.AsReadOnly();
            }
        }

        /// <summary>
        /// Gets or sets the address of a Chrome debugger server to connect to.
        /// Should be of the form "{hostname|IP address}:port".
        /// </summary>
        public string DebuggerAddress
        {
            get { return this.debuggerAddress; }
            set { this.debuggerAddress = value; }
        }

        /// <summary>
        /// Gets or sets the directory in which to store minidump files.
        /// </summary>
        public string MinidumpPath
        {
            get { return this.minidumpPath; }
            set { this.minidumpPath = value; }
        }

        /// <summary>
        /// Adds a single argument to the list of arguments to be appended to the Chrome.exe command line.
        /// </summary>
        /// <param name="argument">The argument to add.</param>
        public void AddArgument(string argument)
        {
            if (string.IsNullOrEmpty(argument))
            {
                throw new ArgumentException("argument must not be null or empty", "argument");
            }

            this.AddArguments(argument);
        }

        /// <summary>
        /// Adds arguments to be appended to the Chrome.exe command line.
        /// </summary>
        /// <param name="arguments">An array of arguments to add.</param>
        public void AddArguments(params string[] arguments)
        {
            this.AddArguments(new List<string>(arguments));
        }

        /// <summary>
        /// Adds arguments to be appended to the Chrome.exe command line.
        /// </summary>
        /// <param name="arguments">An <see cref="IEnumerable{T}"/> object of arguments to add.</param>
        public void AddArguments(IEnumerable<string> arguments)
        {
            if (arguments == null)
            {
                throw new ArgumentNullException("arguments", "arguments must not be null");
            }

            this.arguments.AddRange(arguments);
        }

        /// <summary>
        /// Adds a single argument to be excluded from the list of arguments passed by default 
        /// to the Chrome.exe command line by chromedriver.exe.
        /// </summary>
        /// <param name="argument">The argument to exclude.</param>
        public void AddExcludedArgument(string argument)
        {
            if (string.IsNullOrEmpty(argument))
            {
                throw new ArgumentException("argument must not be null or empty", "argument");
            }

            this.AddExcludedArguments(argument);
        }

        /// <summary>
        /// Adds arguments to be excluded from the list of arguments passed by default 
        /// to the Chrome.exe command line by chromedriver.exe.
        /// </summary>
        /// <param name="arguments">An array of arguments to exclude.</param>
        public void AddExcludedArguments(params string[] arguments)
        {
            this.AddExcludedArguments(new List<string>(arguments));
        }

        /// <summary>
        /// Adds arguments to be excluded from the list of arguments passed by default 
        /// to the Chrome.exe command line by chromedriver.exe.
        /// </summary>
        /// <param name="arguments">An <see cref="IEnumerable{T}"/> object of arguments to exclude.</param>
        public void AddExcludedArguments(IEnumerable<string> arguments)
        {
            if (arguments == null)
            {
                throw new ArgumentNullException("arguments", "arguments must not be null");
            }

            this.excludedSwitches.AddRange(arguments);
        }

        /// <summary>
        /// Adds a path to a packed Chrome extension (.crx file) to the list of extensions 
        /// to be installed in the instance of Chrome.
        /// </summary>
        /// <param name="pathToExtension">The full path to the extension to add.</param>
        public void AddExtension(string pathToExtension)
        {
            if (string.IsNullOrEmpty(pathToExtension))
            {
                throw new ArgumentException("pathToExtension must not be null or empty", "pathToExtension");
            }

            this.AddExtensions(pathToExtension);
        }

        /// <summary>
        /// Adds a list of paths to packed Chrome extensions (.crx files) to be installed
        /// in the instance of Chrome.
        /// </summary>
        /// <param name="extensions">An array of full paths to the extensions to add.</param>
        public void AddExtensions(params string[] extensions)
        {
            this.AddExtensions(new List<string>(extensions));
        }

        /// <summary>
        /// Adds a list of paths to packed Chrome extensions (.crx files) to be installed
        /// in the instance of Chrome.
        /// </summary>
        /// <param name="extensions">An <see cref="IEnumerable{T}"/> of full paths to the extensions to add.</param>
        public void AddExtensions(IEnumerable<string> extensions)
        {
            if (extensions == null)
            {
                throw new ArgumentNullException("extensions", "extensions must not be null");
            }

            foreach (string extension in extensions)
            {
                if (!File.Exists(extension))
                {
                    throw new FileNotFoundException("No extension found at the specified path", extension);
                }

                this.extensionFiles.Add(extension);
            }
        }

        /// <summary>
        /// Adds a base64-encoded string representing a Chrome extension to the list of extensions 
        /// to be installed in the instance of Chrome.
        /// </summary>
        /// <param name="extension">A base64-encoded string representing the extension to add.</param>
        public void AddEncodedExtension(string extension)
        {
            if (string.IsNullOrEmpty(extension))
            {
                throw new ArgumentException("extension must not be null or empty", "extension");
            }

            this.AddExtensions(extension);
        }

        /// <summary>
        /// Adds a list of base64-encoded strings representing Chrome extensions to the list of extensions 
        /// to be installed in the instance of Chrome.
        /// </summary>
        /// <param name="extensions">An array of base64-encoded strings representing the extensions to add.</param>
        public void AddEncodedExtensions(params string[] extensions)
        {
            this.AddEncodedExtensions(new List<string>(extensions));
        }

        /// <summary>
        /// Adds a list of base64-encoded strings representing Chrome extensions to be installed
        /// in the instance of Chrome.
        /// </summary>
        /// <param name="extensions">An <see cref="IEnumerable{T}"/> of base64-encoded strings
        /// representing the extensions to add.</param>
        public void AddEncodedExtensions(IEnumerable<string> extensions)
        {
            if (extensions == null)
            {
                throw new ArgumentNullException("extensions", "extensions must not be null");
            }

            foreach (string extension in extensions)
            {
                // Run the extension through the base64 converter to test that the
                // string is not malformed.
                try
                {
                    Convert.FromBase64String(extension);
                }
                catch (FormatException ex)
                {
                    throw new WebDriverException("Could not properly decode the base64 string", ex);
                }

                this.encodedExtensions.Add(extension);
            }
        }

        /// <summary>
        /// Adds a preference for the user-specific profile or "user data directory."
        /// If the specified preference already exists, it will be overwritten.
        /// </summary>
        /// <param name="preferenceName">The name of the preference to set.</param>
        /// <param name="preferenceValue">The value of the preference to set.</param>
        public void AddUserProfilePreference(string preferenceName, object preferenceValue)
        {
            if (this.userProfilePreferences == null)
            {
                this.userProfilePreferences = new Dictionary<string, object>();
            }

            this.userProfilePreferences[preferenceName] = preferenceValue;
        }

        /// <summary>
        /// Adds a preference for the local state file in the user's data directory for Chrome.
        /// If the specified preference already exists, it will be overwritten.
        /// </summary>
        /// <param name="preferenceName">The name of the preference to set.</param>
        /// <param name="preferenceValue">The value of the preference to set.</param>
        public void AddLocalStatePreference(string preferenceName, object preferenceValue)
        {
            if (this.localStatePreferences == null)
            {
                this.localStatePreferences = new Dictionary<string, object>();
            }

            this.localStatePreferences[preferenceName] = preferenceValue;
        }

        /// <summary>
        /// Provides a means to add additional capabilities not yet added as type safe options 
        /// for the Chrome driver.
        /// </summary>
        /// <param name="capabilityName">The name of the capability to add.</param>
        /// <param name="capabilityValue">The value of the capability to add.</param>
        /// <exception cref="ArgumentException">
        /// thrown when attempting to add a capability for which there is already a type safe option, or 
        /// when <paramref name="capabilityName"/> is <see langword="null"/> or the empty string.
        /// </exception>
        /// <remarks>Calling <see cref="AddAdditionalCapability(System.String, System.Object)"/>
        /// where <paramref name="capabilityName"/> has already been added will overwrite the 
        /// existing value with the new value in <paramref name="capabilityValue"/>.
        /// Also, by default, calling this method adds capabilities to the options object passed to
        /// chromedriver.exe.</remarks>
        public void AddAdditionalCapability(string capabilityName, object capabilityValue)
        {
            // Add the capability to the chromeOptions object by default. This is to handle
            // the 80% case where the chromedriver team adds a new option in chromedriver.exe
            // and the bindings have not yet had a type safe option added.
            this.AddAdditionalCapability(capabilityName, capabilityValue, false);
        }
        
        /// <summary>
        /// Provides a means to add additional capabilities not yet added as type safe options 
        /// for the Chrome driver.
        /// </summary>
        /// <param name="capabilityName">The name of the capability to add.</param>
        /// <param name="capabilityValue">The value of the capability to add.</param>
        /// <param name="isGlobalCapability">Indicates whether the capability is to be set as a global
        /// capability for the driver instead of a Chrome-specific option.</param>
        /// <exception cref="ArgumentException">
        /// thrown when attempting to add a capability for which there is already a type safe option, or 
        /// when <paramref name="capabilityName"/> is <see langword="null"/> or the empty string.
        /// </exception>
        /// <remarks>Calling <see cref="AddAdditionalCapability(System.String, System.Object, System.Boolean)"/>
        /// where <paramref name="capabilityName"/> has already been added will overwrite the
        /// existing value with the new value in <paramref name="capabilityValue"/></remarks>
        public void AddAdditionalCapability(string capabilityName, object capabilityValue, bool isGlobalCapability)
        {
            if (capabilityName == ChromeOptions.Capability ||
                capabilityName == CapabilityType.Proxy ||
                capabilityName == ChromeOptions.ArgumentsChromeOption ||
                capabilityName == ChromeOptions.BinaryChromeOption ||
                capabilityName == ChromeOptions.ExtensionsChromeOption ||
                capabilityName == ChromeOptions.LocalStateChromeOption ||
                capabilityName == ChromeOptions.PreferencesChromeOption ||
                capabilityName == ChromeOptions.DetachChromeOption ||
                capabilityName == ChromeOptions.DebuggerAddressChromeOption ||
                capabilityName == ChromeOptions.ExtensionsChromeOption ||
                capabilityName == ChromeOptions.ExcludeSwitchesChromeOption ||
                capabilityName == ChromeOptions.MinidumpPathChromeOption)
            {
                string message = string.Format(CultureInfo.InvariantCulture, "There is already an option for the {0} capability. Please use that instead.", capabilityName);
                throw new ArgumentException(message, "capabilityName");
            }

            if (string.IsNullOrEmpty(capabilityName))
            {
                throw new ArgumentException("Capability name may not be null an empty string.", "capabilityName");
            }

            if (isGlobalCapability)
            {
                this.additionalCapabilities[capabilityName] = capabilityValue;
            }
            else
            {
                this.additionalChromeOptions[capabilityName] = capabilityValue;
            }
        }

        /// <summary>
        /// Returns DesiredCapabilities for Chrome with these options included as
        /// capabilities. This does not copy the options. Further changes will be
        /// reflected in the returned capabilities.
        /// </summary>
        /// <returns>The DesiredCapabilities for Chrome with these options.</returns>
        public ICapabilities ToCapabilities()
        {
            Dictionary<string, object> chromeOptions = BuildChromeOptionsDictionary();

            DesiredCapabilities capabilities = DesiredCapabilities.Chrome();
            capabilities.SetCapability(ChromeOptions.Capability, chromeOptions);

            if (this.proxy != null)
            {
                capabilities.SetCapability(CapabilityType.Proxy, this.proxy);
            }

            foreach (KeyValuePair<string, object> pair in this.additionalCapabilities)
            {
                capabilities.SetCapability(pair.Key, pair.Value);
            }

            return capabilities;
        }

        private Dictionary<string, object> BuildChromeOptionsDictionary()
        {
            Dictionary<string, object> chromeOptions = new Dictionary<string, object>();
            if (this.Arguments.Count > 0)
            {
                chromeOptions[ArgumentsChromeOption] = this.Arguments;
            }

            if (!string.IsNullOrEmpty(this.binaryLocation))
            {
                chromeOptions[BinaryChromeOption] = this.binaryLocation;
            }

            ReadOnlyCollection<string> extensions = this.Extensions;
            if (extensions.Count > 0)
            {
                chromeOptions[ExtensionsChromeOption] = extensions;
            }

            if (this.localStatePreferences != null && this.localStatePreferences.Count > 0)
            {
                chromeOptions[LocalStateChromeOption] = this.localStatePreferences;
            }

            if (this.userProfilePreferences != null && this.userProfilePreferences.Count > 0)
            {
                chromeOptions[PreferencesChromeOption] = this.userProfilePreferences;
            }

            if (this.leaveBrowserRunning)
            {
                chromeOptions[DetachChromeOption] = this.leaveBrowserRunning;
            }

            if (!string.IsNullOrEmpty(this.debuggerAddress))
            {
                chromeOptions[DebuggerAddressChromeOption] = this.debuggerAddress;
            }

            if (this.excludedSwitches.Count > 0)
            {
                chromeOptions[ExcludeSwitchesChromeOption] = this.excludedSwitches;
            }

            if (!string.IsNullOrEmpty(this.minidumpPath))
            {
                chromeOptions[MinidumpPathChromeOption] = this.minidumpPath;
            }

            foreach (KeyValuePair<string, object> pair in this.additionalChromeOptions)
            {
                chromeOptions.Add(pair.Key, pair.Value);
            }

            return chromeOptions;
        }
    }
}
