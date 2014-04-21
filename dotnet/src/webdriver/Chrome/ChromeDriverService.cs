﻿// <copyright file="ChromeDriverService.cs" company="WebDriver Committers">
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
using System.Globalization;
using System.IO;
using System.Text;
using OpenQA.Selenium.Internal;

namespace OpenQA.Selenium.Chrome
{
    /// <summary>
    /// Exposes the service provided by the native ChromeDriver executable.
    /// </summary>
    public sealed class ChromeDriverService : DriverService
    {
        private const string ChromeDriverServiceFileName = "chromedriver.exe";
        private static readonly Uri ChromeDriverDownloadUrl = new Uri("http://chromedriver.storage.googleapis.com/index.html");
        private string logPath = string.Empty;
        private string urlPathPrefix = string.Empty;
        private string portServerAddress = string.Empty;
        private int adbPort = -1;
        private bool enableVerboseLogging;

        /// <summary>
        /// Initializes a new instance of the ChromeDriverService class.
        /// </summary>
        /// <param name="executablePath">The full path to the ChromeDriver executable.</param>
        /// <param name="executableFileName">The file name of the ChromeDriver executable.</param>
        /// <param name="port">The port on which the ChromeDriver executable should listen.</param>
        private ChromeDriverService(string executablePath, string executableFileName, int port)
            : base(executablePath, port, executableFileName, ChromeDriverDownloadUrl)
        {
        }

        /// <summary>
        /// Gets or sets the location of the log file written to by the ChromeDriver executable.
        /// </summary>
        public string LogPath
        {
            get { return this.logPath; }
            set { this.logPath = value; }
        }

        /// <summary>
        /// Gets or sets the base URL path prefix for commands (e.g., "wd/url").
        /// </summary>
        public string UrlPathPrefix
        {
            get { return this.urlPathPrefix; }
            set { this.urlPathPrefix = value; }
        }

        /// <summary>
        /// Gets or sets the address of a server to contact for reserving a port.
        /// </summary>
        public string PortServerAddress
        {
            get { return this.portServerAddress; }
            set { this.portServerAddress = value; }
        }

        /// <summary>
        /// Gets or sets the port on which the Android Debug Bridge is listening for commands.
        /// </summary>
        public int AndroidDebugBridgePort
        {
            get { return this.adbPort; }
            set { this.adbPort = value; }
        }

        /// <summary>
        /// Gets or sets a value indicating whether to enable verbose logging for the ChromeDriver executable.
        /// Defaults to <see langword="false"/>.
        /// </summary>
        public bool EnableVerboseLogging
        {
            get { return this.enableVerboseLogging; }
            set { this.enableVerboseLogging = value; }
        }

        /// <summary>
        /// Gets the command-line arguments for the driver service.
        /// </summary>
        protected override string CommandLineArguments
        {
            get
            {
                StringBuilder argsBuilder = new StringBuilder(base.CommandLineArguments);
                if (this.adbPort > 0)
                {
                    argsBuilder.AppendFormat(CultureInfo.InvariantCulture, " --adb-port={0}", this.adbPort);
                }

                if (this.SuppressInitialDiagnosticInformation)
                {
                    argsBuilder.Append(" --silent");
                }

                if (this.enableVerboseLogging)
                {
                    argsBuilder.Append(" --verbose");
                }

                if (!string.IsNullOrEmpty(this.logPath))
                {
                    argsBuilder.AppendFormat(CultureInfo.InvariantCulture, " --log-path={0}", this.logPath);
                }

                if (!string.IsNullOrEmpty(this.urlPathPrefix))
                {
                    argsBuilder.AppendFormat(CultureInfo.InvariantCulture, " --url-base={0}", this.urlPathPrefix);
                }

                if (!string.IsNullOrEmpty(this.portServerAddress))
                {
                    argsBuilder.AppendFormat(CultureInfo.InvariantCulture, " --port-server={0}", this.portServerAddress);
                }

                return argsBuilder.ToString();
            }
        }

        /// <summary>
        /// Creates a default instance of the ChromeDriverService.
        /// </summary>
        /// <returns>A ChromeDriverService that implements default settings.</returns>
        public static ChromeDriverService CreateDefaultService()
        {
            string serviceDirectory = DriverService.FindDriverServiceExecutable(ChromeDriverServiceFileName, ChromeDriverDownloadUrl);
            return CreateDefaultService(serviceDirectory);
        }

        /// <summary>
        /// Creates a default instance of the ChromeDriverService using a specified path to the ChromeDriver executable.
        /// </summary>
        /// <param name="driverPath">The directory containing the ChromeDriver executable.</param>
        /// <returns>A ChromeDriverService using a random port.</returns>
        public static ChromeDriverService CreateDefaultService(string driverPath)
        {
            return CreateDefaultService(driverPath, ChromeDriverServiceFileName);
        }

        /// <summary>
        /// Creates a default instance of the ChromeDriverService using a specified path to the ChromeDriver executable with the given name.
        /// </summary>
        /// <param name="driverPath">The directory containing the ChromeDriver executable.</param>
        /// <param name="driverExecutableFileName">The name of the ChromeDriver executable file.</param>
        /// <returns>A ChromeDriverService using a random port.</returns>
        public static ChromeDriverService CreateDefaultService(string driverPath, string driverExecutableFileName)
        {
            return new ChromeDriverService(driverPath, driverExecutableFileName, PortUtilities.FindFreePort());
        }
    }
}
