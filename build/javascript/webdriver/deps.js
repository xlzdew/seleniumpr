// Copyright 2012 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.AbstractBuilder');

goog.require('webdriver.Capabilities');
goog.require('webdriver.process');



/**
 * Creates new {@code webdriver.WebDriver} clients.  Upon instantiation, each
 * Builder will configure itself based on the following environment variables:
 * <dl>
 *   <dt>{@code webdriver.AbstractBuilder.SERVER_URL_ENV}</dt>
 *   <dd>Defines the remote WebDriver server that should be used for command
 *       command execution; may be overridden using
 *       {@code webdriver.AbstractBuilder.prototype.usingServer}.</dd>
 * </dl>
 * @constructor
 */
webdriver.AbstractBuilder = function() {

  /**
   * URL of the remote server to use for new clients; initialized from the
   * value of the {@link webdriver.AbstractBuilder.SERVER_URL_ENV} environment
   * variable, but may be overridden using
   * {@link webdriver.AbstractBuilder#usingServer}.
   * @private {string}
   */
  this.serverUrl_ = webdriver.process.getEnv(
      webdriver.AbstractBuilder.SERVER_URL_ENV);

  /**
   * The desired capabilities to use when creating a new session.
   * @private {!webdriver.Capabilities}
   */
  this.capabilities_ = new webdriver.Capabilities();
};


/**
 * Environment variable that defines the URL of the WebDriver server that
 * should be used for all new WebDriver clients. This setting may be overridden
 * using {@code #usingServer(url)}.
 * @type {string}
 * @const
 * @see webdriver.process.getEnv
 */
webdriver.AbstractBuilder.SERVER_URL_ENV = 'wdurl';


/**
 * The default URL of the WebDriver server to use if
 * {@link webdriver.AbstractBuilder.SERVER_URL_ENV} is not set.
 * @type {string}
 * @const
 */
webdriver.AbstractBuilder.DEFAULT_SERVER_URL = 'http://localhost:4444/wd/hub';


/**
 * Configures which WebDriver server should be used for new sessions. Overrides
 * the value loaded from the {@link webdriver.AbstractBuilder.SERVER_URL_ENV}
 * upon creation of this instance.
 * @param {string} url URL of the server to use.
 * @return {!webdriver.AbstractBuilder} This Builder instance for chain calling.
 */
webdriver.AbstractBuilder.prototype.usingServer = function(url) {
  this.serverUrl_ = url;
  return this;
};


/**
 * @return {string} The URL of the WebDriver server this instance is configured
 *     to use.
 */
webdriver.AbstractBuilder.prototype.getServerUrl = function() {
  return this.serverUrl_;
};


/**
 * Sets the desired capabilities when requesting a new session. This will
 * overwrite any previously set desired capabilities.
 * @param {!(Object|webdriver.Capabilities)} capabilities The desired
 *     capabilities for a new session.
 * @return {!webdriver.AbstractBuilder} This Builder instance for chain calling.
 */
webdriver.AbstractBuilder.prototype.withCapabilities = function(capabilities) {
  this.capabilities_ = new webdriver.Capabilities(capabilities);
  return this;
};


/**
 * @return {!webdriver.Capabilities} The current desired capabilities for this
 *     builder.
 */
webdriver.AbstractBuilder.prototype.getCapabilities = function() {
  return this.capabilities_;
};


/**
 * Builds a new {@link webdriver.WebDriver} instance using this builder's
 * current configuration.
 * @return {!webdriver.WebDriver} A new WebDriver client.
 */
webdriver.AbstractBuilder.prototype.build = goog.abstractMethod;
// Copyright 2012 Selenium comitters
// Copyright 2012 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.ActionSequence');

goog.require('goog.array');
goog.require('webdriver.Button');
goog.require('webdriver.Command');
goog.require('webdriver.CommandName');
goog.require('webdriver.Key');



/**
 * Class for defining sequences of complex user interactions. Each sequence
 * will not be executed until {@link #perform} is called.
 *
 * <p>Example:<pre><code>
 *   new webdriver.ActionSequence(driver).
 *       keyDown(webdriver.Key.SHIFT).
 *       click(element1).
 *       click(element2).
 *       dragAndDrop(element3, element4).
 *       keyUp(webdriver.Key.SHIFT).
 *       perform();
 * </pre></code>
 *
 * @param {!webdriver.WebDriver} driver The driver instance to use.
 * @constructor
 */
webdriver.ActionSequence = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;

  /** @private {!Array.<{description: string, command: !webdriver.Command}>} */
  this.actions_ = [];
};


/**
 * Schedules an action to be executed each time {@link #perform} is called on
 * this instance.
 * @param {string} description A description of the command.
 * @param {!webdriver.Command} command The command.
 * @private
 */
webdriver.ActionSequence.prototype.schedule_ = function(description, command) {
  this.actions_.push({
    description: description,
    command: command
  });
};


/**
 * Executes this action sequence.
 * @return {!webdriver.promise.Promise} A promise that will be resolved once
 *     this sequence has completed.
 */
webdriver.ActionSequence.prototype.perform = function() {
  // Make a protected copy of the scheduled actions. This will protect against
  // users defining additional commands before this sequence is actually
  // executed.
  var actions = goog.array.clone(this.actions_);
  var driver = this.driver_;
  return driver.controlFlow().execute(function() {
    goog.array.forEach(actions, function(action) {
      driver.schedule(action.command, action.description);
    });
  }, 'ActionSequence.perform');
};


/**
 * Moves the mouse.  The location to move to may be specified in terms of the
 * mouse's current location, an offset relative to the top-left corner of an
 * element, or an element (in which case the middle of the element is used).
 * @param {(!webdriver.WebElement|{x: number, y: number})} location The
 *     location to drag to, as either another WebElement or an offset in pixels.
 * @param {{x: number, y: number}=} opt_offset If the target {@code location}
 *     is defined as a {@link webdriver.WebElement}, this parameter defines an
 *     offset within that element. The offset should be specified in pixels
 *     relative to the top-left corner of the element's bounding box. If
 *     omitted, the element's center will be used as the target offset.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.mouseMove = function(location, opt_offset) {
  var command = new webdriver.Command(webdriver.CommandName.MOVE_TO);

  if (goog.isNumber(location.x)) {
    setOffset(/** @type {{x: number, y: number}} */(location));
  } else {
    // The interactions API expect the element ID to be encoded as a simple
    // string, not the usual JSON object.
    var id = /** @type {!webdriver.WebElement} */ (location).toWireValue().
        then(function(value) {
          return value['ELEMENT'];
        });
    command.setParameter('element', id);
    if (opt_offset) {
      setOffset(opt_offset);
    }
  }

  this.schedule_('mouseMove', command);
  return this;

  /** @param {{x: number, y: number}} offset The offset to use. */
  function setOffset(offset) {
    command.setParameter('xoffset', offset.x || 0);
    command.setParameter('yoffset', offset.y || 0);
  }
};


/**
 * Schedules a mouse action.
 * @param {string} description A simple descriptive label for the scheduled
 *     action.
 * @param {!webdriver.CommandName} commandName The name of the command.
 * @param {(webdriver.WebElement|webdriver.Button)=} opt_elementOrButton Either
 *     the element to interact with or the button to click with.
 *     Defaults to {@link webdriver.Button.LEFT} if neither an element nor
 *     button is specified.
 * @param {webdriver.Button=} opt_button The button to use. Defaults to
 *     {@link webdriver.Button.LEFT}. Ignored if the previous argument is
 *     provided as a button.
 * @return {!webdriver.ActionSequence} A self reference.
 * @private
 */
webdriver.ActionSequence.prototype.scheduleMouseAction_ = function(
    description, commandName, opt_elementOrButton, opt_button) {
  var button;
  if (goog.isNumber(opt_elementOrButton)) {
    button = opt_elementOrButton;
  } else {
    if (opt_elementOrButton) {
      this.mouseMove(
          /** @type {!webdriver.WebElement} */ (opt_elementOrButton));
    }
    button = goog.isDef(opt_button) ? opt_button : webdriver.Button.LEFT;
  }

  var command = new webdriver.Command(commandName).
      setParameter('button', button);
  this.schedule_(description, command);
  return this;
};


/**
 * Presses a mouse button. The mouse button will not be released until
 * {@link #mouseUp} is called, regardless of whether that call is made in this
 * sequence or another. The behavior for out-of-order events (e.g. mouseDown,
 * click) is undefined.
 *
 * <p>If an element is provided, the mouse will first be moved to the center
 * of that element. This is equivalent to:
 * <pre><code>sequence.mouseMove(element).mouseDown()</code></pre>
 *
 * <p>Warning: this method currently only supports the left mouse button. See
 * http://code.google.com/p/selenium/issues/detail?id=4047
 *
 * @param {(webdriver.WebElement|webdriver.Button)=} opt_elementOrButton Either
 *     the element to interact with or the button to click with.
 *     Defaults to {@link webdriver.Button.LEFT} if neither an element nor
 *     button is specified.
 * @param {webdriver.Button=} opt_button The button to use. Defaults to
 *     {@link webdriver.Button.LEFT}. Ignored if a button is provided as the
 *     first argument.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.mouseDown = function(opt_elementOrButton,
                                                        opt_button) {
  return this.scheduleMouseAction_('mouseDown',
      webdriver.CommandName.MOUSE_DOWN, opt_elementOrButton, opt_button);
};


/**
 * Releases a mouse button. Behavior is undefined for calling this function
 * without a previous call to {@link #mouseDown}.
 *
 * <p>If an element is provided, the mouse will first be moved to the center
 * of that element. This is equivalent to:
 * <pre><code>sequence.mouseMove(element).mouseUp()</code></pre>
 *
 * <p>Warning: this method currently only supports the left mouse button. See
 * http://code.google.com/p/selenium/issues/detail?id=4047
 *
 * @param {(webdriver.WebElement|webdriver.Button)=} opt_elementOrButton Either
 *     the element to interact with or the button to click with.
 *     Defaults to {@link webdriver.Button.LEFT} if neither an element nor
 *     button is specified.
 * @param {webdriver.Button=} opt_button The button to use. Defaults to
 *     {@link webdriver.Button.LEFT}. Ignored if a button is provided as the
 *     first argument.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.mouseUp = function(opt_elementOrButton,
                                                      opt_button) {
  return this.scheduleMouseAction_('mouseUp',
      webdriver.CommandName.MOUSE_UP, opt_elementOrButton, opt_button);
};


/**
 * Convenience function for performing a "drag and drop" manuever. The target
 * element may be moved to the location of another element, or by an offset (in
 * pixels).
 * @param {!webdriver.WebElement} element The element to drag.
 * @param {(!webdriver.WebElement|{x: number, y: number})} location The
 *     location to drag to, either as another WebElement or an offset in pixels.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.dragAndDrop = function(element, location) {
  return this.mouseDown(element).mouseMove(location).mouseUp();
};


/**
 * Clicks a mouse button.
 *
 * <p>If an element is provided, the mouse will first be moved to the center
 * of that element. This is equivalent to:
 * <pre><code>sequence.mouseMove(element).click()</code></pre>
 *
 * @param {(webdriver.WebElement|webdriver.Button)=} opt_elementOrButton Either
 *     the element to interact with or the button to click with.
 *     Defaults to {@link webdriver.Button.LEFT} if neither an element nor
 *     button is specified.
 * @param {webdriver.Button=} opt_button The button to use. Defaults to
 *     {@link webdriver.Button.LEFT}. Ignored if a button is provided as the
 *     first argument.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.click = function(opt_elementOrButton,
                                                    opt_button) {
  return this.scheduleMouseAction_('click',
      webdriver.CommandName.CLICK, opt_elementOrButton, opt_button);
};


/**
 * Double-clicks a mouse button.
 *
 * <p>If an element is provided, the mouse will first be moved to the center of
 * that element. This is equivalent to:
 * <pre><code>sequence.mouseMove(element).doubleClick()</code></pre>
 *
 * <p>Warning: this method currently only supports the left mouse button. See
 * http://code.google.com/p/selenium/issues/detail?id=4047
 *
 * @param {(webdriver.WebElement|webdriver.Button)=} opt_elementOrButton Either
 *     the element to interact with or the button to click with.
 *     Defaults to {@link webdriver.Button.LEFT} if neither an element nor
 *     button is specified.
 * @param {webdriver.Button=} opt_button The button to use. Defaults to
 *     {@link webdriver.Button.LEFT}. Ignored if a button is provided as the
 *     first argument.
 * @return {!webdriver.ActionSequence} A self reference.
 */
webdriver.ActionSequence.prototype.doubleClick = function(opt_elementOrButton,
                                                          opt_button) {
  return this.scheduleMouseAction_('doubleClick',
      webdriver.CommandName.DOUBLE_CLICK, opt_elementOrButton, opt_button);
};


/**
 * Schedules a keyboard action.
 * @param {string} description A simple descriptive label for the scheduled
 *     action.
 * @param {!Array.<(string|!webdriver.Key)>} keys The keys to send.
 * @return {!webdriver.ActionSequence} A self reference.
 * @private
 */
webdriver.ActionSequence.prototype.scheduleKeyboardAction_ = function(
    description, keys) {
  var command =
      new webdriver.Command(webdriver.CommandName.SEND_KEYS_TO_ACTIVE_ELEMENT).
          setParameter('value', keys);
  this.schedule_(description, command);
  return this;
};


/**
 * Checks that a key is a modifier key.
 * @param {!webdriver.Key} key The key to check.
 * @throws {Error} If the key is not a modifier key.
 * @private
 */
webdriver.ActionSequence.checkModifierKey_ = function(key) {
  if (key !== webdriver.Key.ALT && key !== webdriver.Key.CONTROL &&
      key !== webdriver.Key.SHIFT && key !== webdriver.Key.COMMAND) {
    throw Error('Not a modifier key');
  }
};


/**
 * Performs a modifier key press. The modifier key is <em>not released</em>
 * until {@link #keyUp} or {@link #sendKeys} is called. The key press will be
 * targetted at the currently focused element.
 * @param {!webdriver.Key} key The modifier key to push. Must be one of
 *     {ALT, CONTROL, SHIFT, COMMAND, META}.
 * @return {!webdriver.ActionSequence} A self reference.
 * @throws {Error} If the key is not a valid modifier key.
 */
webdriver.ActionSequence.prototype.keyDown = function(key) {
  webdriver.ActionSequence.checkModifierKey_(key);
  return this.scheduleKeyboardAction_('keyDown', [key]);
};


/**
 * Performs a modifier key release. The release is targetted at the currently
 * focused element.
 * @param {!webdriver.Key} key The modifier key to release. Must be one of
 *     {ALT, CONTROL, SHIFT, COMMAND, META}.
 * @return {!webdriver.ActionSequence} A self reference.
 * @throws {Error} If the key is not a valid modifier key.
 */
webdriver.ActionSequence.prototype.keyUp = function(key) {
  webdriver.ActionSequence.checkModifierKey_(key);
  return this.scheduleKeyboardAction_('keyUp', [key]);
};


/**
 * Simulates typing multiple keys. Each modifier key encountered in the
 * sequence will not be released until it is encountered again. All key events
 * will be targetted at the currently focused element.
 * @param {...(string|!webdriver.Key|!Array.<(string|!webdriver.Key)>)} var_args
 *     The keys to type.
 * @return {!webdriver.ActionSequence} A self reference.
 * @throws {Error} If the key is not a valid modifier key.
 */
webdriver.ActionSequence.prototype.sendKeys = function(var_args) {
  var keys = goog.array.flatten(goog.array.slice(arguments, 0));
  return this.scheduleKeyboardAction_('sendKeys', keys);
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.Builder');

goog.require('goog.userAgent');
goog.require('webdriver.AbstractBuilder');
goog.require('webdriver.FirefoxDomExecutor');
goog.require('webdriver.WebDriver');
goog.require('webdriver.http.CorsClient');
goog.require('webdriver.http.Executor');
goog.require('webdriver.http.XhrClient');
goog.require('webdriver.process');



/**
 * @constructor
 * @extends {webdriver.AbstractBuilder}
 */
webdriver.Builder = function() {
  goog.base(this);

  /**
   * ID of an existing WebDriver session that new clients should use.
   * Initialized from the value of the
   * {@link webdriver.AbstractBuilder.SESSION_ID_ENV} environment variable, but
   * may be overridden using
   * {@link webdriver.AbstractBuilder#usingSession}.
   * @private {string}
   */
  this.sessionId_ =
      webdriver.process.getEnv(webdriver.Builder.SESSION_ID_ENV);
};
goog.inherits(webdriver.Builder, webdriver.AbstractBuilder);


/**
 * Environment variable that defines the session ID of an existing WebDriver
 * session to use when creating clients. If set, all new Builder instances will
 * default to creating clients that use this session. To create a new session,
 * use {@code #useExistingSession(boolean)}. The use of this environment
 * variable requires that {@link webdriver.AbstractBuilder.SERVER_URL_ENV} also
 * be set.
 * @type {string}
 * @const
 * @see webdriver.process.getEnv
 */
webdriver.Builder.SESSION_ID_ENV = 'wdsid';


/**
 * Configures the builder to create a client that will use an existing WebDriver
 * session.
 * @param {string} id The existing session ID to use.
 * @return {!webdriver.AbstractBuilder} This Builder instance for chain calling.
 */
webdriver.Builder.prototype.usingSession = function(id) {
  this.sessionId_ = id;
  return this;
};


/**
 * @return {string} The ID of the session, if any, this builder is configured
 *     to reuse.
 */
webdriver.Builder.prototype.getSession = function() {
  return this.sessionId_;
};


/**
 * @override
 */
webdriver.Builder.prototype.build = function() {
  if (goog.userAgent.GECKO && document.readyState != 'complete') {
    throw Error('Cannot create driver instance before window.onload');
  }

  var executor;

  if (webdriver.FirefoxDomExecutor.isAvailable()) {
    executor = new webdriver.FirefoxDomExecutor();
    return webdriver.WebDriver.createSession(executor, this.getCapabilities());
  } else {
    var url = this.getServerUrl() ||
        webdriver.AbstractBuilder.DEFAULT_SERVER_URL;
    var client;
    if (url[0] == '/') {
      var origin = window.location.origin ||
          (window.location.protocol + '//' + window.location.host);
      client = new webdriver.http.XhrClient(origin + url);
    } else {
      client = new webdriver.http.CorsClient(url);
    }
    executor = new webdriver.http.Executor(client);

    if (this.getSession()) {
      return webdriver.WebDriver.attachToSession(executor, this.getSession());
    } else {
      throw new Error('Unable to create a new client for this browser. The ' +
          'WebDriver session ID has not been defined.');
    }
  }
};
// Copyright 2012 Selenium comitters
// Copyright 2012 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.Button');


/**
 * Enumeration of the buttons used in the advanced interactions API.
 * @enum {number}
 */
webdriver.Button = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};
// Copyright 2013 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines the webdriver.Capabilities class.
 */

goog.provide('webdriver.Browser');
goog.provide('webdriver.Capabilities');
goog.provide('webdriver.Capability');



/**
 * Recognized browser names.
 * @enum {string}
 */
webdriver.Browser = {
  ANDROID: 'android',
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  INTERNET_EXPLORER: 'internet explorer',
  IPAD: 'iPad',
  IPHONE: 'iPhone',
  OPERA: 'opera',
  PHANTOM_JS: 'phantomjs',
  SAFARI: 'safari',
  HTMLUNIT: 'htmlunit'
};



/**
 * Common webdriver capability keys.
 * @enum {string}
 */
webdriver.Capability = {

  /**
   * Indicates whether a driver should accept all SSL certs by default. This
   * capability only applies when requesting a new session. To query whether
   * a driver can handle insecure SSL certs, see
   * {@link webdriver.Capability.SECURE_SSL}.
   */
  ACCEPT_SSL_CERTS: 'acceptSslCerts',


  /**
   * The browser name. Common browser names are defined in the
   * {@link webdriver.Browser} enum.
   */
  BROWSER_NAME: 'browserName',

  /**
   * Whether the driver is capable of handling modal alerts (e.g. alert,
   * confirm, prompt). To define how a driver <i>should</i> handle alerts,
   * use {@link webdriver.Capability.UNEXPECTED_ALERT_BEHAVIOR}.
   */
  HANDLES_ALERTS: 'handlesAlerts',

  /**
   * Key for the logging driver logging preferences.
   */
  LOGGING_PREFS: 'loggingPrefs',

  /**
   * Describes the platform the browser is running on. Will be one of
   * ANDROID, IOS, LINUX, MAC, UNIX, or WINDOWS. When <i>requesting</i> a
   * session, ANY may be used to indicate no platform preference (this is
   * semantically equivalent to omitting the platform capability).
   */
  PLATFORM: 'platform',

  /**
   * Describes the proxy configuration to use for a new WebDriver session.
   */
  PROXY: 'proxy',

  /** Whether the driver supports changing the brower's orientation. */
  ROTATABLE: 'rotatable',

  /**
   * Whether a driver is only capable of handling secure SSL certs. To request
   * that a driver accept insecure SSL certs by default, use
   * {@link webdriver.Capability.ACCEPT_SSL_CERTS}.
   */
  SECURE_SSL: 'secureSsl',

  /** Whether the driver supports manipulating the app cache. */
  SUPPORTS_APPLICATION_CACHE: 'applicationCacheEnabled',

  /**
   * Whether the driver supports controlling the browser's internet
   * connectivity.
   */
  SUPPORTS_BROWSER_CONNECTION: 'browserConnectionEnabled',

  /** Whether the driver supports locating elements with CSS selectors. */
  SUPPORTS_CSS_SELECTORS: 'cssSelectorsEnabled',

  /** Whether the browser supports JavaScript. */
  SUPPORTS_JAVASCRIPT: 'javascriptEnabled',

  /** Whether the driver supports controlling the browser's location info. */
  SUPPORTS_LOCATION_CONTEXT: 'locationContextEnabled',

  /** Whether the driver supports taking screenshots. */
  TAKES_SCREENSHOT: 'takesScreenshot',

  /**
   * Defines how the driver should handle unexpected alerts. The value should
   * be one of "accept", "dismiss", or "ignore.
   */
  UNEXPECTED_ALERT_BEHAVIOR: 'unexpectedAlertBehavior',

  /** Defines the browser version. */
  VERSION: 'version'
};



/**
 * @param {(webdriver.Capabilities|Object)=} opt_other Another set of
 *     capabilities to merge into this instance.
 * @constructor
 */
webdriver.Capabilities = function(opt_other) {

  /** @private {!Object} */
  this.caps_ = {};

  if (opt_other) {
    this.merge(opt_other);
  }
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for Android.
 */
webdriver.Capabilities.android = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.ANDROID).
      set(webdriver.Capability.PLATFORM, 'ANDROID');
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for Chrome.
 */
webdriver.Capabilities.chrome = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.CHROME);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for Firefox.
 */
webdriver.Capabilities.firefox = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.FIREFOX);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for
 *     Internet Explorer.
 */
webdriver.Capabilities.ie = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME,
          webdriver.Browser.INTERNET_EXPLORER).
      set(webdriver.Capability.PLATFORM, 'WINDOWS');
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for iPad.
 */
webdriver.Capabilities.ipad = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.IPAD).
      set(webdriver.Capability.PLATFORM, 'MAC');
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for iPhone.
 */
webdriver.Capabilities.iphone = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.IPHONE).
      set(webdriver.Capability.PLATFORM, 'MAC');
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for Opera.
 */
webdriver.Capabilities.opera = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.OPERA);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for
 *     PhantomJS.
 */
webdriver.Capabilities.phantomjs = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.PHANTOM_JS);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for Safari.
 */
webdriver.Capabilities.safari = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.SAFARI);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for HTMLUnit.
 */
webdriver.Capabilities.htmlunit = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.HTMLUNIT);
};


/**
 * @return {!webdriver.Capabilities} A basic set of capabilities for HTMLUnit
 *     with enabled Javascript.
 */
webdriver.Capabilities.htmlunitwithjs = function() {
  return new webdriver.Capabilities().
      set(webdriver.Capability.BROWSER_NAME, webdriver.Browser.HTMLUNIT).
      set(webdriver.Capability.SUPPORTS_JAVASCRIPT, true);
};


/** @return {!Object} The JSON representation of this instance. */
webdriver.Capabilities.prototype.toJSON = function() {
  return this.caps_;
};


/**
 * Merges another set of capabilities into this instance. Any duplicates in
 * the provided set will override those already set on this instance.
 * @param {!(webdriver.Capabilities|Object)} other The capabilities to
 *     merge into this instance.
 * @return {!webdriver.Capabilities} A self reference.
 */
webdriver.Capabilities.prototype.merge = function(other) {
  var caps = other instanceof webdriver.Capabilities ?
      other.caps_ : other;
  for (var key in caps) {
    if (caps.hasOwnProperty(key)) {
      this.set(key, caps[key]);
    }
  }
  return this;
};


/**
 * @param {string} key The capability to set.
 * @param {*} value The capability value.  Capability values must be JSON
 *     serializable. Pass {@code null} to unset the capability.
 * @return {!webdriver.Capabilities} A self reference.
 */
webdriver.Capabilities.prototype.set = function(key, value) {
  if (goog.isDefAndNotNull(value)) {
    this.caps_[key] = value;
  } else {
    delete this.caps_[key];
  }
  return this;
};


/**
 * @param {string} key The capability to return.
 * @return {*} The capability with the given key, or {@code null} if it has
 *     not been set.
 */
webdriver.Capabilities.prototype.get = function(key) {
  var val = null;
  if (this.caps_.hasOwnProperty(key)) {
    val = this.caps_[key];
  }
  return goog.isDefAndNotNull(val) ? val : null;
};


/**
 * @param {string} key The capability to check.
 * @return {boolean} Whether the specified capability is set.
 */
webdriver.Capabilities.prototype.has = function(key) {
  return !!this.get(key);
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Contains several classes for handling commands.
 */

goog.provide('webdriver.Command');
goog.provide('webdriver.CommandExecutor');
goog.provide('webdriver.CommandName');



/**
 * Describes a command to be executed by the WebDriverJS framework.
 * @param {!webdriver.CommandName} name The name of this command.
 * @constructor
 */
webdriver.Command = function(name) {

  /**
   * The name of this command.
   * @private {!webdriver.CommandName}
   */
  this.name_ = name;

  /**
   * The parameters to this command.
   * @private {!Object.<*>}
   */
  this.parameters_ = {};
};


/**
 * @return {!webdriver.CommandName} This command's name.
 */
webdriver.Command.prototype.getName = function() {
  return this.name_;
};


/**
 * Sets a parameter to send with this command.
 * @param {string} name The parameter name.
 * @param {*} value The parameter value.
 * @return {!webdriver.Command} A self reference.
 */
webdriver.Command.prototype.setParameter = function(name, value) {
  this.parameters_[name] = value;
  return this;
};


/**
 * Sets the parameters for this command.
 * @param {!Object.<*>} parameters The command parameters.
 * @return {!webdriver.Command} A self reference.
 */
webdriver.Command.prototype.setParameters = function(parameters) {
  this.parameters_ = parameters;
  return this;
};


/**
 * Returns a named command parameter.
 * @param {string} key The parameter key to look up.
 * @return {*} The parameter value, or undefined if it has not been set.
 */
webdriver.Command.prototype.getParameter = function(key) {
  return this.parameters_[key];
};


/**
 * @return {!Object.<*>} The parameters to send with this command.
 */
webdriver.Command.prototype.getParameters = function() {
  return this.parameters_;
};


/**
 * Enumeration of predefined names command names that all command processors
 * will support.
 * @enum {string}
 */
// TODO: Delete obsolete command names.
webdriver.CommandName = {
  GET_SERVER_STATUS: 'getStatus',

  NEW_SESSION: 'newSession',
  GET_SESSIONS: 'getSessions',
  DESCRIBE_SESSION: 'getSessionCapabilities',

  CLOSE: 'close',
  QUIT: 'quit',

  GET_CURRENT_URL: 'getCurrentUrl',
  GET: 'get',
  GO_BACK: 'goBack',
  GO_FORWARD: 'goForward',
  REFRESH: 'refresh',

  ADD_COOKIE: 'addCookie',
  GET_COOKIE: 'getCookie',
  GET_ALL_COOKIES: 'getCookies',
  DELETE_COOKIE: 'deleteCookie',
  DELETE_ALL_COOKIES: 'deleteAllCookies',

  GET_ACTIVE_ELEMENT: 'getActiveElement',
  FIND_ELEMENT: 'findElement',
  FIND_ELEMENTS: 'findElements',
  FIND_CHILD_ELEMENT: 'findChildElement',
  FIND_CHILD_ELEMENTS: 'findChildElements',

  CLEAR_ELEMENT: 'clearElement',
  CLICK_ELEMENT: 'clickElement',
  SEND_KEYS_TO_ELEMENT: 'sendKeysToElement',
  SUBMIT_ELEMENT: 'submitElement',

  GET_CURRENT_WINDOW_HANDLE: 'getCurrentWindowHandle',
  GET_WINDOW_HANDLES: 'getWindowHandles',
  GET_WINDOW_POSITION: 'getWindowPosition',
  SET_WINDOW_POSITION: 'setWindowPosition',
  GET_WINDOW_SIZE: 'getWindowSize',
  SET_WINDOW_SIZE: 'setWindowSize',
  MAXIMIZE_WINDOW: 'maximizeWindow',

  SWITCH_TO_WINDOW: 'switchToWindow',
  SWITCH_TO_FRAME: 'switchToFrame',
  GET_PAGE_SOURCE: 'getPageSource',
  GET_TITLE: 'getTitle',

  EXECUTE_SCRIPT: 'executeScript',
  EXECUTE_ASYNC_SCRIPT: 'executeAsyncScript',

  GET_ELEMENT_TEXT: 'getElementText',
  GET_ELEMENT_TAG_NAME: 'getElementTagName',
  IS_ELEMENT_SELECTED: 'isElementSelected',
  IS_ELEMENT_ENABLED: 'isElementEnabled',
  IS_ELEMENT_DISPLAYED: 'isElementDisplayed',
  GET_ELEMENT_LOCATION: 'getElementLocation',
  GET_ELEMENT_LOCATION_IN_VIEW: 'getElementLocationOnceScrolledIntoView',
  GET_ELEMENT_SIZE: 'getElementSize',
  GET_ELEMENT_ATTRIBUTE: 'getElementAttribute',
  GET_ELEMENT_VALUE_OF_CSS_PROPERTY: 'getElementValueOfCssProperty',
  ELEMENT_EQUALS: 'elementEquals',

  SCREENSHOT: 'screenshot',
  IMPLICITLY_WAIT: 'implicitlyWait',
  SET_SCRIPT_TIMEOUT: 'setScriptTimeout',
  SET_TIMEOUT: 'setTimeout',

  ACCEPT_ALERT: 'acceptAlert',
  DISMISS_ALERT: 'dismissAlert',
  GET_ALERT_TEXT: 'getAlertText',
  SET_ALERT_TEXT: 'setAlertValue',

  EXECUTE_SQL: 'executeSQL',
  GET_LOCATION: 'getLocation',
  SET_LOCATION: 'setLocation',
  GET_APP_CACHE: 'getAppCache',
  GET_APP_CACHE_STATUS: 'getStatus',
  CLEAR_APP_CACHE: 'clearAppCache',
  IS_BROWSER_ONLINE: 'isBrowserOnline',
  SET_BROWSER_ONLINE: 'setBrowserOnline',

  GET_LOCAL_STORAGE_ITEM: 'getLocalStorageItem',
  GET_LOCAL_STORAGE_KEYS: 'getLocalStorageKeys',
  SET_LOCAL_STORAGE_ITEM: 'setLocalStorageItem',
  REMOVE_LOCAL_STORAGE_ITEM: 'removeLocalStorageItem',
  CLEAR_LOCAL_STORAGE: 'clearLocalStorage',
  GET_LOCAL_STORAGE_SIZE: 'getLocalStorageSize',

  GET_SESSION_STORAGE_ITEM: 'getSessionStorageItem',
  GET_SESSION_STORAGE_KEYS: 'getSessionStorageKey',
  SET_SESSION_STORAGE_ITEM: 'setSessionStorageItem',
  REMOVE_SESSION_STORAGE_ITEM: 'removeSessionStorageItem',
  CLEAR_SESSION_STORAGE: 'clearSessionStorage',
  GET_SESSION_STORAGE_SIZE: 'getSessionStorageSize',

  SET_SCREEN_ORIENTATION: 'setScreenOrientation',
  GET_SCREEN_ORIENTATION: 'getScreenOrientation',

  // These belong to the Advanced user interactions - an element is
  // optional for these commands.
  CLICK: 'mouseClick',
  DOUBLE_CLICK: 'mouseDoubleClick',
  MOUSE_DOWN: 'mouseDown',
  MOUSE_UP: 'mouseUp',
  MOVE_TO: 'mouseMove',
  SEND_KEYS_TO_ACTIVE_ELEMENT: 'sendKeysToActiveElement',

  // These belong to the Advanced Touch API
  TOUCH_SINGLE_TAP: 'touchSingleTap',
  TOUCH_DOWN: 'touchDown',
  TOUCH_UP: 'touchUp',
  TOUCH_MOVE: 'touchMove',
  TOUCH_SCROLL: 'touchScroll',
  TOUCH_DOUBLE_TAP: 'touchDoubleTap',
  TOUCH_LONG_PRESS: 'touchLongPress',
  TOUCH_FLICK: 'touchFlick',

  GET_AVAILABLE_LOG_TYPES: 'getAvailableLogTypes',
  GET_LOG: 'getLog',
  GET_SESSION_LOGS: 'getSessionLogs'
};



/**
 * Handles the execution of {@code webdriver.Command} objects.
 * @interface
 */
webdriver.CommandExecutor = function() {};


/**
 * Executes the given {@code command}. If there is an error executing the
 * command, the provided callback will be invoked with the offending error.
 * Otherwise, the callback will be invoked with a null Error and non-null
 * {@link bot.response.ResponseObject} object.
 * @param {!webdriver.Command} command The command to execute.
 * @param {function(Error, !bot.response.ResponseObject=)} callback the function
 *     to invoke when the command response is ready.
 */
webdriver.CommandExecutor.prototype.execute = goog.abstractMethod;
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A light weight event system modeled after Node's EventEmitter.
 */

goog.provide('webdriver.EventEmitter');



/**
 * Object that can emit events for others to listen for. This is used instead
 * of Closure's event system because it is much more light weight. The API is
 * based on Node's EventEmitters.
 * @constructor
 */
webdriver.EventEmitter = function() {
  /**
   * Map of events to registered listeners.
   * @private {!Object.<!Array.<{fn: !Function, oneshot: boolean,
   *                             scope: (Object|undefined)}>>}
   */
  this.events_ = {};
};


/**
 * Fires an event and calls all listeners.
 * @param {string} type The type of event to emit.
 * @param {...*} var_args Any arguments to pass to each listener.
 */
webdriver.EventEmitter.prototype.emit = function(type, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  var listeners = this.events_[type];
  if (!listeners) {
    return;
  }
  for (var i = 0; i < listeners.length;) {
    var listener = listeners[i];
    listener.fn.apply(listener.scope, args);
    if (listeners[i] === listener) {
      if (listeners[i].oneshot) {
        listeners.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }
};


/**
 * Returns a mutable list of listeners for a specific type of event.
 * @param {string} type The type of event to retrieve the listeners for.
 * @return {!Array.<{fn: !Function, oneshot: boolean,
 *                   scope: (Object|undefined)}>} The registered listeners for
 *     the given event type.
 */
webdriver.EventEmitter.prototype.listeners = function(type) {
  var listeners = this.events_[type];
  if (!listeners) {
    listeners = this.events_[type] = [];
  }
  return listeners;
};


/**
 * Registers a listener.
 * @param {string} type The type of event to listen for.
 * @param {!Function} listenerFn The function to invoke when the event is fired.
 * @param {Object=} opt_scope The object in whose scope to invoke the listener.
 * @param {boolean=} opt_oneshot Whether the listener should be removed after
 *    the first event is fired.
 * @return {!webdriver.EventEmitter} A self reference.
 * @private
 */
webdriver.EventEmitter.prototype.addListener_ = function(type, listenerFn,
    opt_scope, opt_oneshot) {
  var listeners = this.listeners(type);
  var n = listeners.length;
  for (var i = 0; i < n; ++i) {
    if (listeners[i].fn == listenerFn) {
      return this;
    }
  }

  listeners.push({
    fn: listenerFn,
    scope: opt_scope,
    oneshot: !!opt_oneshot
  });
  return this;
};


/**
 * Registers a listener.
 * @param {string} type The type of event to listen for.
 * @param {!Function} listenerFn The function to invoke when the event is fired.
 * @param {Object=} opt_scope The object in whose scope to invoke the listener.
 * @return {!webdriver.EventEmitter} A self reference.
 */
webdriver.EventEmitter.prototype.addListener = function(type, listenerFn,
    opt_scope) {
  return this.addListener_(type, listenerFn, opt_scope);
};


/**
 * Registers a one-time listener which will be called only the first time an
 * event is emitted, after which it will be removed.
 * @param {string} type The type of event to listen for.
 * @param {!Function} listenerFn The function to invoke when the event is fired.
 * @param {Object=} opt_scope The object in whose scope to invoke the listener.
 * @return {!webdriver.EventEmitter} A self reference.
 */
webdriver.EventEmitter.prototype.once = function(type, listenerFn, opt_scope) {
  return this.addListener_(type, listenerFn, opt_scope, true);
};


/**
 * An alias for {@code #addListener()}.
 * @param {string} type The type of event to listen for.
 * @param {!Function} listenerFn The function to invoke when the event is fired.
 * @param {Object=} opt_scope The object in whose scope to invoke the listener.
 * @return {!webdriver.EventEmitter} A self reference.
 */
webdriver.EventEmitter.prototype.on =
    webdriver.EventEmitter.prototype.addListener;


/**
 * Removes a previously registered event listener.
 * @param {string} type The type of event to unregister.
 * @param {!Function} listenerFn The handler function to remove.
 * @return {!webdriver.EventEmitter} A self reference.
 */
webdriver.EventEmitter.prototype.removeListener = function(type, listenerFn) {
  var listeners = this.events_[type];
  if (listeners) {
    var n = listeners.length;
    for (var i = 0; i < n; ++i) {
      if (listeners[i].fn == listenerFn) {
        listeners.splice(i, 1);
        return this;
      }
    }
  }
  return this;
};


/**
 * Removes all listeners for a specific type of event. If no event is
 * specified, all listeners across all types will be removed.
 * @param {string=} opt_type The type of event to remove listeners from.
 * @return {!webdriver.EventEmitter} A self reference.
 */
webdriver.EventEmitter.prototype.removeAllListeners = function(opt_type) {
  goog.isDef(opt_type) ? delete this.events_[opt_type] : this.events_ = {};
  return this;
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.FirefoxDomExecutor');

goog.require('bot.response');
goog.require('goog.json');
goog.require('goog.userAgent.product');
goog.require('webdriver.Command');
goog.require('webdriver.CommandName');



/**
 * @constructor
 * @implements {webdriver.CommandExecutor}
 */
webdriver.FirefoxDomExecutor = function() {
  if (!webdriver.FirefoxDomExecutor.isAvailable()) {
    throw Error(
        'The current environment does not support the FirefoxDomExecutor');
  }

  /** @private {!Document} */
  this.doc_ = document;

  /** @private {!Element} */
  this.docElement_ = document.documentElement;

  this.docElement_.addEventListener(
      webdriver.FirefoxDomExecutor.EventType_.RESPONSE,
      goog.bind(this.onResponse_, this), false);
};


/**
 * @return {boolean} Whether the current environment supports the
 *     FirefoxDomExecutor.
 */
webdriver.FirefoxDomExecutor.isAvailable = function() {
  return goog.userAgent.product.FIREFOX &&
      typeof document !== 'undefined' &&
      document.documentElement &&
      goog.isFunction(document.documentElement.hasAttribute) &&
      document.documentElement.hasAttribute('webdriver');
};


/**
 * Attributes used to communicate with the FirefoxDriver extension.
 * @enum {string}
 * @private
 */
webdriver.FirefoxDomExecutor.Attribute_ = {
  COMMAND: 'command',
  RESPONSE: 'response'
};


/**
 * Events used to communicate with the FirefoxDriver extension.
 * @enum {string}
 * @private
 */
webdriver.FirefoxDomExecutor.EventType_ = {
  COMMAND: 'webdriverCommand',
  RESPONSE: 'webdriverResponse'
};


/**
 * The pending command, if any.
 * @private {?{name:string, callback:!Function}}
 */
webdriver.FirefoxDomExecutor.prototype.pendingCommand_ = null;


/** @override */
webdriver.FirefoxDomExecutor.prototype.execute = function(command, callback) {
  if (this.pendingCommand_) {
    throw Error('Currently awaiting a command response!');
  }

  this.pendingCommand_ = {
    name: command.getName(),
    callback: callback
  };

  var parameters = command.getParameters();

  // There are two means for communicating with the FirefoxDriver: via
  // HTTP using WebDriver's wire protocol and over the DOM using a custom
  // JSON protocol. This class uses the latter. When the FirefoxDriver receives
  // commands over HTTP, it builds a parameters object from the URL parameters.
  // When an element ID is sent in the URL, it'll be decoded as just id:string
  // instead of id:{ELEMENT:string}. When switching to a frame by element,
  // however, the element ID is not sent through the URL, so we must make sure
  // to encode that parameter properly here. It would be nice if we unified
  // the two protocols used by the FirefoxDriver...
  if (parameters['id'] &&
      parameters['id']['ELEMENT'] &&
      command.getName() != webdriver.CommandName.SWITCH_TO_FRAME) {
    parameters['id'] = parameters['id']['ELEMENT'];
  }

  var json = goog.json.serialize({
    'name': command.getName(),
    'sessionId': {
      'value': parameters['sessionId']
    },
    'parameters': parameters
  });
  this.docElement_.setAttribute(
      webdriver.FirefoxDomExecutor.Attribute_.COMMAND, json);

  var event = this.doc_.createEvent('Event');
  event.initEvent(webdriver.FirefoxDomExecutor.EventType_.COMMAND,
      /*canBubble=*/true, /*cancelable=*/true);

  this.docElement_.dispatchEvent(event);
};


/** @private */
webdriver.FirefoxDomExecutor.prototype.onResponse_ = function() {
  if (!this.pendingCommand_) {
    return;  // Not expecting a response.
  }

  var command = this.pendingCommand_;
  this.pendingCommand_ = null;

  var json = this.docElement_.getAttribute(
      webdriver.FirefoxDomExecutor.Attribute_.RESPONSE);
  if (!json) {
    command.callback(Error('Empty command response!'));
    return;
  }

  this.docElement_.removeAttribute(
      webdriver.FirefoxDomExecutor.Attribute_.COMMAND);
  this.docElement_.removeAttribute(
      webdriver.FirefoxDomExecutor.Attribute_.RESPONSE);

  try {
    var response = bot.response.checkResponse(
        /** @type {!bot.response.ResponseObject} */ (goog.json.parse(json)));
  } catch (ex) {
    command.callback(ex);
    return;
  }

  // Prior to Selenium 2.35.0, two commands are required to fully create a
  // session: one to allocate the session, and another to fetch the
  // capabilities.
  if (command.name == webdriver.CommandName.NEW_SESSION &&
      goog.isString(response['value'])) {
    var cmd = new webdriver.Command(webdriver.CommandName.DESCRIBE_SESSION).
        setParameter('sessionId', response['value']);
    this.execute(cmd, command.callback);
  } else {
    command.callback(null, response);
  }
};
// Copyright 2012 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.Key');


/**
 * Representations of pressable keys that aren't text.  These are stored in
 * the Unicode PUA (Private Use Area) code points, 0xE000-0xF8FF.  Refer to
 * http://www.google.com.au/search?&q=unicode+pua&btnG=Search
 *
 * @enum {string}
 */
webdriver.Key = {
  NULL:         '\uE000',
  CANCEL:       '\uE001',  // ^break
  HELP:         '\uE002',
  BACK_SPACE:   '\uE003',
  TAB:          '\uE004',
  CLEAR:        '\uE005',
  RETURN:       '\uE006',
  ENTER:        '\uE007',
  SHIFT:        '\uE008',
  CONTROL:      '\uE009',
  ALT:          '\uE00A',
  PAUSE:        '\uE00B',
  ESCAPE:       '\uE00C',
  SPACE:        '\uE00D',
  PAGE_UP:      '\uE00E',
  PAGE_DOWN:    '\uE00F',
  END:          '\uE010',
  HOME:         '\uE011',
  ARROW_LEFT:   '\uE012',
  LEFT:         '\uE012',
  ARROW_UP:     '\uE013',
  UP:           '\uE013',
  ARROW_RIGHT:  '\uE014',
  RIGHT:        '\uE014',
  ARROW_DOWN:   '\uE015',
  DOWN:         '\uE015',
  INSERT:       '\uE016',
  DELETE:       '\uE017',
  SEMICOLON:    '\uE018',
  EQUALS:       '\uE019',

  NUMPAD0:      '\uE01A',  // number pad keys
  NUMPAD1:      '\uE01B',
  NUMPAD2:      '\uE01C',
  NUMPAD3:      '\uE01D',
  NUMPAD4:      '\uE01E',
  NUMPAD5:      '\uE01F',
  NUMPAD6:      '\uE020',
  NUMPAD7:      '\uE021',
  NUMPAD8:      '\uE022',
  NUMPAD9:      '\uE023',
  MULTIPLY:     '\uE024',
  ADD:          '\uE025',
  SEPARATOR:    '\uE026',
  SUBTRACT:     '\uE027',
  DECIMAL:      '\uE028',
  DIVIDE:       '\uE029',

  F1:           '\uE031',  // function keys
  F2:           '\uE032',
  F3:           '\uE033',
  F4:           '\uE034',
  F5:           '\uE035',
  F6:           '\uE036',
  F7:           '\uE037',
  F8:           '\uE038',
  F9:           '\uE039',
  F10:          '\uE03A',
  F11:          '\uE03B',
  F12:          '\uE03C',

  COMMAND:      '\uE03D',  // Apple command key
  META:         '\uE03D'   // alias for Windows key
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Factory methods for the supported locator strategies.
 */

goog.provide('webdriver.By');
goog.provide('webdriver.Locator');
goog.provide('webdriver.Locator.Strategy');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');



/**
 * An element locator.
 * @param {string} using The type of strategy to use for this locator.
 * @param {string} value The search target of this locator.
 * @constructor
 */
webdriver.Locator = function(using, value) {

  /**
   * The search strategy to use when searching for an element.
   * @type {string}
   */
  this.using = using;

  /**
   * The search target for this locator.
   * @type {string}
   */
  this.value = value;
};


/**
 * Creates a factory function for a {@link webdriver.Locator}.
 * @param {string} type The type of locator for the factory.
 * @return {function(string): !webdriver.Locator} The new factory function.
 * @private
 */
webdriver.Locator.factory_ = function(type) {
  return function(value) {
    return new webdriver.Locator(type, value);
  };
};


/**
 * A collection of factory functions for creating {@link webdriver.Locator}
 * instances.
 */
webdriver.By = {};
// Exported to the global scope for legacy reasons.
goog.exportSymbol('By', webdriver.By);


/**
 * Short-hand expressions for the primary element locator strategies.
 * For example the following two statements are equivalent:
 * <code><pre>
 * var e1 = driver.findElement(webdriver.By.id('foo'));
 * var e2 = driver.findElement({id: 'foo'});
 * </pre></code>
 *
 * <p>Care should be taken when using JavaScript minifiers (such as the
 * Closure compiler), as locator hashes will always be parsed using
 * the un-obfuscated properties listed below.
 *
 * @typedef {(
 *     {className: string}|
 *     {css: string}|
 *     {id: string}|
 *     {js: string}|
 *     {linkText: string}|
 *     {name: string}|
 *     {partialLinkText: string}|
 *     {tagName: string}|
 *     {xpath: string})}
 */
webdriver.By.Hash;


/**
 * Locates elements that have a specific class name. The returned locator
 * is equivalent to searching for elements with the CSS selector ".clazz".
 *
 * @param {string} className The class name to search for.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/2011/WD-html5-20110525/elements.html#classes
 * @see http://www.w3.org/TR/CSS2/selector.html#class-html
 */
webdriver.By.className = webdriver.Locator.factory_('class name');


/**
 * Locates elements using a CSS selector. For browsers that do not support
 * CSS selectors, WebDriver implementations may return an
 * {@link bot.Error.State.INVALID_SELECTOR invalid selector} error. An
 * implementation may, however, emulate the CSS selector API.
 *
 * @param {string} selector The CSS selector to use.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/CSS2/selector.html
 */
webdriver.By.css = webdriver.Locator.factory_('css selector');


/**
 * Locates an element by its ID.
 *
 * @param {string} id The ID to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.id = webdriver.Locator.factory_('id');


/**
 * Locates link elements whose {@link webdriver.WebElement#getText visible
 * text} matches the given string.
 *
 * @param {string} text The link text to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.linkText = webdriver.Locator.factory_('link text');


/**
 * Locates an elements by evaluating a
 * {@link webdriver.WebDriver#executeScript JavaScript expression}.
 * The result of this expression must be an element or list of elements.
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {function(!webdriver.WebDriver): !webdriver.promise.Promise} A new,
 *     JavaScript-based locator function.
 */
webdriver.By.js = function(script, var_args) {
  var args = goog.array.slice(arguments, 0);
  return function(driver) {
    return driver.executeScript.apply(driver, args);
  };
};


/**
 * Locates elements whose {@code name} attribute has the given value.
 *
 * @param {string} name The name attribute to search for.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.name = webdriver.Locator.factory_('name');


/**
 * Locates link elements whose {@link webdriver.WebElement#getText visible
 * text} contains the given substring.
 *
 * @param {string} text The substring to check for in a link's visible text.
 * @return {!webdriver.Locator} The new locator.
 */
webdriver.By.partialLinkText = webdriver.Locator.factory_(
    'partial link text');


/**
 * Locates elements with a given tag name. The returned locator is
 * equivalent to using the {@code getElementsByTagName} DOM function.
 *
 * @param {string} text The substring to check for in a link's visible text.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html
 */
webdriver.By.tagName = webdriver.Locator.factory_('tag name');


/**
 * Locates elements matching a XPath selector. Care should be taken when
 * using an XPath selector with a {@link webdriver.WebElement} as WebDriver
 * will respect the context in the specified in the selector. For example,
 * given the selector {@code "//div"}, WebDriver will search from the
 * document root regardless of whether the locator was used with a
 * WebElement.
 *
 * @param {string} xpath The XPath selector to use.
 * @return {!webdriver.Locator} The new locator.
 * @see http://www.w3.org/TR/xpath/
 */
webdriver.By.xpath = webdriver.Locator.factory_('xpath');


/**
 * Maps {@link webdriver.By.Hash} keys to the appropriate factory function.
 * @type {!Object.<string, function(string): !(Function|webdriver.Locator)>}
 * @const
 */
webdriver.Locator.Strategy = {
  'className': webdriver.By.className,
  'css': webdriver.By.css,
  'id': webdriver.By.id,
  'js': webdriver.By.js,
  'linkText': webdriver.By.linkText,
  'name': webdriver.By.name,
  'partialLinkText': webdriver.By.partialLinkText,
  'tagName': webdriver.By.tagName,
  'xpath': webdriver.By.xpath
};


/**
 * Verifies that a {@code value} is a valid locator to use for searching for
 * elements on the page.
 *
 * @param {*} value The value to check is a valid locator.
 * @return {!(webdriver.Locator|Function)} A valid locator object or function.
 * @throws {TypeError} If the given value is an invalid locator.
 */
webdriver.Locator.checkLocator = function(value) {
  if (goog.isFunction(value) || value instanceof webdriver.Locator) {
    return value;
  }
  for (var key in value) {
    if (value.hasOwnProperty(key) &&
        webdriver.Locator.Strategy.hasOwnProperty(key)) {
      return webdriver.Locator.Strategy[key](value[key]);
    }
  }
  throw new TypeError('Invalid locator');
};



/** @override */
webdriver.Locator.prototype.toString = function() {
  return 'By.' + this.using.replace(/ ([a-z])/g, function(all, match) {
    return match.toUpperCase();
  }) + '(' + goog.string.quote(this.value) + ')';
};
// Copyright 2013 Selenium comitters
// Copyright 2013 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.logging');
goog.provide('webdriver.logging.Preferences');

goog.require('goog.object');


/**
 * Log level names from WebDriver's JSON wire protocol.
 * @enum {string}
 */
webdriver.logging.LevelName = {
  ALL: 'ALL',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  SEVERE: 'SEVERE',
  OFF: 'OFF'
};


/**
 * Logging levels.
 * @enum {{value: number, name: webdriver.logging.LevelName}}
 */
webdriver.logging.Level = {
  ALL: {value: Number.MIN_VALUE, name: webdriver.logging.LevelName.ALL},
  DEBUG: {value: 700, name: webdriver.logging.LevelName.DEBUG},
  INFO: {value: 800, name: webdriver.logging.LevelName.INFO},
  WARNING: {value: 900, name: webdriver.logging.LevelName.WARNING},
  SEVERE: {value: 1000, name: webdriver.logging.LevelName.SEVERE},
  OFF: {value: Number.MAX_VALUE, name: webdriver.logging.LevelName.OFF}
};


/**
 * Converts a level name or value to a {@link webdriver.logging.Level} value.
 * If the name/value is not recognized, {@link webdriver.logging.Level.ALL}
 * will be returned.
 * @param {(number|string)} nameOrValue The log level name, or value, to
 *     convert .
 * @return {!webdriver.logging.Level} The converted level.
 */
webdriver.logging.getLevel = function(nameOrValue) {
  var predicate = goog.isString(nameOrValue) ?
      function(val) { return val.name === nameOrValue; } :
      function(val) { return val.value === nameOrValue; };

  return goog.object.findValue(webdriver.logging.Level, predicate) ||
      webdriver.logging.Level.ALL;
};


/**
 * Common log types.
 * @enum {string}
 */
webdriver.logging.Type = {
  /** Logs originating from the browser. */
  BROWSER: 'browser',
  /** Logs from a WebDriver client. */
  CLIENT: 'client',
  /** Logs from a WebDriver implementation. */
  DRIVER: 'driver',
  /** Logs related to performance. */
  PERFORMANCE: 'performance',
  /** Logs from the remote server. */
  SERVER: 'server'
};


/**
 * A hash describing log preferences.
 * @typedef {Object.<webdriver.logging.Type, webdriver.logging.LevelName>}
 */
webdriver.logging.Preferences;


/**
 * A single log entry.
 * @param {(!webdriver.logging.Level|string)} level The entry level.
 * @param {string} message The log message.
 * @param {number=} opt_timestamp The time this entry was generated, in
 *     milliseconds since 0:00:00, January 1, 1970 UTC. If omitted, the
 *     current time will be used.
 * @param {string=} opt_type The log type, if known.
 * @constructor
 */
webdriver.logging.Entry = function(level, message, opt_timestamp, opt_type) {

  /** @type {!webdriver.logging.Level} */
  this.level =
      goog.isString(level) ? webdriver.logging.getLevel(level) : level;

  /** @type {string} */
  this.message = message;

  /** @type {number} */
  this.timestamp = goog.isNumber(opt_timestamp) ? opt_timestamp : goog.now();

  /** @type {string} */
  this.type = opt_type || '';
};


/**
 * @return {{level: string, message: string, timestamp: number,
 *           type: string}} The JSON representation of this entry.
 */
webdriver.logging.Entry.prototype.toJSON = function() {
  return {
    'level': this.level.name,
    'message': this.message,
    'timestamp': this.timestamp,
    'type': this.type
  };
};


/**
 * Converts a {@link goog.debug.LogRecord} into a
 * {@link webdriver.logging.Entry}.
 * @param {!goog.debug.LogRecord} logRecord The record to convert.
 * @param {string=} opt_type The log type.
 * @return {!webdriver.logging.Entry} The converted entry.
 */
webdriver.logging.Entry.fromClosureLogRecord = function(logRecord, opt_type) {
  var closureLevel = logRecord.getLevel();
  var level = webdriver.logging.Level.SEVERE;

  if (closureLevel.value <= webdriver.logging.Level.DEBUG.value) {
    level = webdriver.logging.Level.DEBUG;
  } else if (closureLevel.value <= webdriver.logging.Level.INFO.value) {
    level = webdriver.logging.Level.INFO;
  } else if (closureLevel.value <= webdriver.logging.Level.WARNING.value) {
    level = webdriver.logging.Level.WARNING;
  }

  return new webdriver.logging.Entry(
      level,
      '[' + logRecord.getLoggerName() + '] ' + logRecord.getMessage(),
      logRecord.getMillis(),
      opt_type);
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Provides access to the current process' environment variables.
 * When running in node, this is simply a wrapper for {@code process.env}.
 * When running in a browser, environment variables are loaded by parsing the
 * current URL's query string. Variables that have more than one variable will
 * be initialized to the JSON representation of the array of all values,
 * otherwise the variable will be initialized to a sole string value. If a
 * variable does not have any values, but is nonetheless present in the query
 * string, it will be initialized to an empty string.
 * After the initial parsing, environment variables must be queried and set
 * through the API defined in this file.
 */

goog.provide('webdriver.process');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.json');


/**
 * @return {boolean} Whether the current process is Node's native process
 *     object.
 */
webdriver.process.isNative = function() {
  return webdriver.process.IS_NATIVE_PROCESS_;
};


/**
 * Queries for a named environment variable.
 * @param {string} name The name of the environment variable to look up.
 * @param {string=} opt_default The default value if the named variable is not
 *     defined.
 * @return {string} The queried environment variable.
 */
webdriver.process.getEnv = function(name, opt_default) {
  var value = webdriver.process.PROCESS_.env[name];
  return goog.isDefAndNotNull(value) ? value : opt_default;
};


/**
 * Sets an environment value. If the new value is either null or undefined, the
 *     environment variable will be cleared.
 * @param {string} name The value to set.
 * @param {*} value The new value; will be coerced to a string.
 */
webdriver.process.setEnv = function(name, value) {
  webdriver.process.PROCESS_.env[name] =
      goog.isDefAndNotNull(value) ? value + '' : null;
};


/**
 * Whether the current environment is using Node's native process object.
 * @private {boolean}
 * @const
 */
webdriver.process.IS_NATIVE_PROCESS_ = typeof process !== 'undefined';


/**
 * Initializes a process object for use in a browser window.
 * @param {!Window=} opt_window The window object to initialize the process
 *     from; if not specified, will default to the current window. Should only
 *     be set for unit testing.
 * @return {!Object} The new process object.
 * @private
 */
webdriver.process.initBrowserProcess_ = function(opt_window) {
  var process = {'env': {}};

  var win = opt_window;
  if (!win && typeof window != 'undefined') {
    win = window;
  }

  // Initialize the global error handler.
  if (win) {
    // Initialize the environment variable map by parsing the current URL query
    // string.
    if (win.location) {
      var data = new goog.Uri(win.location).getQueryData();
      goog.array.forEach(data.getKeys(), function(key) {
        var values = data.getValues(key);
        process.env[key] = values.length == 0 ? '' :
                           values.length == 1 ? values[0] :
                           goog.json.serialize(values);
      });
    }
  }

  return process;
};


/**
 * The global process object to use. Will either be Node's global
 * {@code process} object, or an approximation of it for use in a browser
 * environment.
 * @private {!Object}
 * @const
 */
webdriver.process.PROCESS_ = webdriver.process.IS_NATIVE_PROCESS_ ? process :
    webdriver.process.initBrowserProcess_();
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @license Portions of this code are from the Dojo toolkit, received under the
 * BSD License:
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice,
 *     this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of the Dojo Foundation nor the names of its contributors
 *     may be used to endorse or promote products derived from this software
 *     without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @fileoverview A promise implementation based on the CommonJS promise/A and
 * promise/B proposals. For more information, see
 * http://wiki.commonjs.org/wiki/Promises.
 */

goog.provide('webdriver.promise');
goog.provide('webdriver.promise.ControlFlow');
goog.provide('webdriver.promise.ControlFlow.Timer');
goog.provide('webdriver.promise.Deferred');
goog.provide('webdriver.promise.Promise');

goog.require('goog.array');
goog.require('goog.debug.Error');
goog.require('goog.object');
goog.require('webdriver.EventEmitter');
goog.require('webdriver.stacktrace.Snapshot');



/**
 * Represents the eventual value of a completed operation. Each promise may be
 * in one of three states: pending, resolved, or rejected. Each promise starts
 * in the pending state and may make a single transition to either a
 * fulfilled or failed state.
 *
 * <p/>This class is based on the Promise/A proposal from CommonJS. Additional
 * functions are provided for API compatibility with Dojo Deferred objects.
 *
 * @constructor
 * @see http://wiki.commonjs.org/wiki/Promises/A
 */
webdriver.promise.Promise = function() {
};


/**
 * Cancels the computation of this promise's value, rejecting the promise in the
 * process.
 * @param {*} reason The reason this promise is being cancelled. If not an
 *     {@code Error}, one will be created using the value's string
 *     representation.
 */
webdriver.promise.Promise.prototype.cancel = function(reason) {
  throw new TypeError('Unimplemented function: "cancel"');
};


/** @return {boolean} Whether this promise's value is still being computed. */
webdriver.promise.Promise.prototype.isPending = function() {
  throw new TypeError('Unimplemented function: "isPending"');
};


/**
 * Registers listeners for when this instance is resolved. This function most
 * overridden by subtypes.
 *
 * @param {Function=} opt_callback The function to call if this promise is
 *     successfully resolved. The function should expect a single argument: the
 *     promise's resolved value.
 * @param {Function=} opt_errback The function to call if this promise is
 *     rejected. The function should expect a single argument: the rejection
 *     reason.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 */
webdriver.promise.Promise.prototype.then = function(
    opt_callback, opt_errback) {
  throw new TypeError('Unimplemented function: "then"');
};


/**
 * Registers a listener for when this promise is rejected. This is synonymous
 * with the {@code catch} clause in a synchronous API:
 * <pre><code>
 *   // Synchronous API:
 *   try {
 *     doSynchronousWork();
 *   } catch (ex) {
 *     console.error(ex);
 *   }
 *
 *   // Asynchronous promise API:
 *   doAsynchronousWork().thenCatch(function(ex) {
 *     console.error(ex);
 *   });
 * </code></pre>
 *
 * @param {!Function} errback The function to call if this promise is
 *     rejected. The function should expect a single argument: the rejection
 *     reason.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 */
webdriver.promise.Promise.prototype.thenCatch = function(errback) {
  return this.then(null, errback);
};


/**
 * Registers a listener to invoke when this promise is resolved, regardless
 * of whether the promise's value was successfully computed. This function
 * is synonymous with the {@code finally} clause in a synchronous API:
 * <pre><code>
 *   // Synchronous API:
 *   try {
 *     doSynchronousWork();
 *   } finally {
 *     cleanUp();
 *   }
 *
 *   // Asynchronous promise API:
 *   doAsynchronousWork().thenFinally(cleanUp);
 * </code></pre>
 *
 * <b>Note:</b> similar to the {@code finally} clause, if the registered
 * callback returns a rejected promise or throws an error, it will silently
 * replace the rejection error (if any) from this promise:
 * <pre><code>
 *   try {
 *     throw Error('one');
 *   } finally {
 *     throw Error('two');  // Hides Error: one
 *   }
 *
 *   webdriver.promise.rejected(Error('one'))
 *       .thenFinally(function() {
 *         throw Error('two');  // Hides Error: one
 *       });
 * </code></pre>
 *
 *
 * @param callback
 * @returns {!webdriver.promise.Promise}
 */
webdriver.promise.Promise.prototype.thenFinally = function(callback) {
  return this.then(callback, callback);
};


/**
 * Registers a function to be invoked when this promise is successfully
 * resolved. This function is provided for backwards compatibility with the
 * Dojo Deferred API.
 *
 * @param {Function} callback The function to call if this promise is
 *     successfully resolved. The function should expect a single argument: the
 *     promise's resolved value.
 * @param {!Object=} opt_self The object which |this| should refer to when the
 *     function is invoked.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 * @deprecated Use {@link #then()} instead.
 */
webdriver.promise.Promise.prototype.addCallback = function(callback, opt_self) {
  return this.then(goog.bind(callback, opt_self));
};


/**
 * Registers a function to be invoked when this promise is rejected.
 * This function is provided for backwards compatibility with the
 * Dojo Deferred API.
 *
 * @param {Function} errback The function to call if this promise is
 *     rejected. The function should expect a single argument: the rejection
 *     reason.
 * @param {!Object=} opt_self The object which |this| should refer to when the
 *     function is invoked.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 * @deprecated Use {@link #thenCatch()} instead.
 */
webdriver.promise.Promise.prototype.addErrback = function(errback, opt_self) {
  return this.thenCatch(goog.bind(errback, opt_self));
};


/**
 * Registers a function to be invoked when this promise is either rejected or
 * resolved. This function is provided for backwards compatibility with the
 * Dojo Deferred API.
 *
 * @param {Function} callback The function to call when this promise is
 *     either resolved or rejected. The function should expect a single
 *     argument: the resolved value or rejection error.
 * @param {!Object=} opt_self The object which |this| should refer to when the
 *     function is invoked.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 * @deprecated Use {@link #thenFinally()} instead.
 */
webdriver.promise.Promise.prototype.addBoth = function(callback, opt_self) {
  return this.thenFinally(goog.bind(callback, opt_self));
};


/**
 * An alias for {@code webdriver.promise.Promise.prototype.then} that permits
 * the scope of the invoked function to be specified. This function is provided
 * for backwards compatibility with the Dojo Deferred API.
 *
 * @param {Function} callback The function to call if this promise is
 *     successfully resolved. The function should expect a single argument: the
 *     promise's resolved value.
 * @param {Function} errback The function to call if this promise is
 *     rejected. The function should expect a single argument: the rejection
 *     reason.
 * @param {!Object=} opt_self The object which |this| should refer to when the
 *     function is invoked.
 * @return {!webdriver.promise.Promise} A new promise which will be resolved
 *     with the result of the invoked callback.
 * @deprecated Use {@link #then()} instead.
 */
webdriver.promise.Promise.prototype.addCallbacks = function(
    callback, errback, opt_self) {
  return this.then(goog.bind(callback, opt_self),
      goog.bind(errback, opt_self));
};



/**
 * Represents a value that will be resolved at some point in the future. This
 * class represents the protected "producer" half of a Promise - each Deferred
 * has a {@code promise} property that may be returned to consumers for
 * registering callbacks, reserving the ability to resolve the deferred to the
 * producer.
 *
 * <p>If this Deferred is rejected and there are no listeners registered before
 * the next turn of the event loop, the rejection will be passed to the
 * {@link webdriver.promise.ControlFlow} as an unhandled failure.
 *
 * <p>If this Deferred is cancelled, the cancellation reason will be forward to
 * the Deferred's canceller function (if provided). The canceller may return a
 * truth-y value to override the reason provided for rejection.
 *
 * @param {Function=} opt_canceller Function to call when cancelling the
 *     computation of this instance's value.
 * @param {webdriver.promise.ControlFlow=} opt_flow The control flow
 *     this instance was created under. This should only be provided during
 *     unit tests.
 * @constructor
 * @extends {webdriver.promise.Promise}
 */
webdriver.promise.Deferred = function(opt_canceller, opt_flow) {
  /* NOTE: This class's implementation diverges from the prototypical style
   * used in the rest of the atoms library. This was done intentionally to
   * protect the internal Deferred state from consumers, as outlined by
   *     http://wiki.commonjs.org/wiki/Promises
   */
  goog.base(this);

  var flow = opt_flow || webdriver.promise.controlFlow();

  /**
   * The listeners registered with this Deferred. Each element in the list will
   * be a 3-tuple of the callback function, errback function, and the
   * corresponding deferred object.
   * @type {!Array.<!webdriver.promise.Deferred.Listener_>}
   */
  var listeners = [];

  /**
   * Whether this Deferred's resolution was ever handled by a listener.
   * If the Deferred is rejected and its value is not handled by a listener
   * before the next turn of the event loop, the error will be passed to the
   * global error handler.
   * @type {boolean}
   */
  var handled = false;

  /**
   * Key for the timeout used to delay reproting an unhandled rejection to the
   * parent {@link webdriver.promise.ControlFlow}.
   * @type {?number}
   */
  var pendingRejectionKey = null;

  /**
   * This Deferred's current state.
   * @type {!webdriver.promise.Deferred.State_}
   */
  var state = webdriver.promise.Deferred.State_.PENDING;

  /**
   * This Deferred's resolved value; set when the state transitions from
   * {@code webdriver.promise.Deferred.State_.PENDING}.
   * @type {*}
   */
  var value;

  /** @return {boolean} Whether this promise's value is still pending. */
  function isPending() {
    return state == webdriver.promise.Deferred.State_.PENDING;
  }

  /**
   * Removes all of the listeners previously registered on this deferred.
   * @throws {Error} If this deferred has already been resolved.
   */
  function removeAll() {
    listeners = [];
  }

  /**
   * Resolves this deferred. If the new value is a promise, this function will
   * wait for it to be resolved before notifying the registered listeners.
   * @param {!webdriver.promise.Deferred.State_} newState The deferred's new
   *     state.
   * @param {*} newValue The deferred's new value.
   */
  function resolve(newState, newValue) {
    if (webdriver.promise.Deferred.State_.PENDING !== state) {
      return;
    }

    state = webdriver.promise.Deferred.State_.BLOCKED;

    if (webdriver.promise.isPromise(newValue) && newValue !== self) {
      var onFulfill = goog.partial(notifyAll, newState);
      var onReject = goog.partial(
          notifyAll, webdriver.promise.Deferred.State_.REJECTED);
      if (newValue instanceof webdriver.promise.Deferred) {
        newValue.then(onFulfill, onReject);
      } else {
        webdriver.promise.asap(newValue, onFulfill, onReject);
      }

    } else {
      notifyAll(newState, newValue);
    }
  }

  /**
   * Notifies all of the listeners registered with this Deferred that its state
   * has changed.
   * @param {!webdriver.promise.Deferred.State_} newState The deferred's new
   *     state.
   * @param {*} newValue The deferred's new value.
   */
  function notifyAll(newState, newValue) {
    if (newState === webdriver.promise.Deferred.State_.REJECTED &&
        // We cannot check instanceof Error since the object may have been
        // created in a different JS context.
        goog.isObject(newValue) && goog.isString(newValue.message)) {
      newValue = flow.annotateError(/** @type {!Error} */(newValue));
    }

    state = newState;
    value = newValue;
    while (listeners.length) {
      notify(listeners.shift());
    }

    if (!handled && state == webdriver.promise.Deferred.State_.REJECTED) {
      pendingRejectionKey = propagateError(value);
    }
  }

  /**
   * Propagates an unhandled rejection to the parent ControlFlow in a
   * future turn of the JavaScript event loop.
   * @param {*} error The error value to report.
   * @return {number} The key for the registered timeout.
   */
  function propagateError(error) {
    flow.pendingRejections_ += 1;
    return flow.timer.setTimeout(function() {
      flow.pendingRejections_ -= 1;
      flow.abortFrame_(error);
    }, 0);
  }

  /**
   * Notifies a single listener of this Deferred's change in state.
   * @param {!webdriver.promise.Deferred.Listener_} listener The listener to
   *     notify.
   */
  function notify(listener) {
    var func = state == webdriver.promise.Deferred.State_.RESOLVED ?
        listener.callback : listener.errback;
    if (func) {
      flow.runInNewFrame_(goog.partial(func, value),
          listener.fulfill, listener.reject);
    } else if (state == webdriver.promise.Deferred.State_.REJECTED) {
      listener.reject(value);
    } else {
      listener.fulfill(value);
    }
  }

  /**
   * The consumer promise for this instance. Provides protected access to the
   * callback registering functions.
   * @type {!webdriver.promise.Promise}
   */
  var promise = new webdriver.promise.Promise();

  /**
   * Registers a callback on this Deferred.
   * @param {Function=} opt_callback The callback.
   * @param {Function=} opt_errback The errback.
   * @return {!webdriver.promise.Promise} A new promise representing the result
   *     of the callback.
   * @see webdriver.promise.Promise#then
   */
  function then(opt_callback, opt_errback) {
    // Avoid unnecessary allocations if we weren't given any callback functions.
    if (!opt_callback && !opt_errback) {
      return promise;
    }

    // The moment a listener is registered, we consider this deferred to be
    // handled; the callback must handle any rejection errors.
    handled = true;
    if (pendingRejectionKey) {
      flow.pendingRejections_ -= 1;
      flow.timer.clearTimeout(pendingRejectionKey);
    }

    var deferred = new webdriver.promise.Deferred(cancel, flow);
    var listener = {
      callback: opt_callback,
      errback: opt_errback,
      fulfill: deferred.fulfill,
      reject: deferred.reject
    };

    if (state == webdriver.promise.Deferred.State_.PENDING ||
        state == webdriver.promise.Deferred.State_.BLOCKED) {
      listeners.push(listener);
    } else {
      notify(listener);
    }

    return deferred.promise;
  }

  var self = this;

  /**
   * Resolves this promise with the given value. If the value is itself a
   * promise and not a reference to this deferred, this instance will wait for
   * it before resolving.
   * @param {*=} opt_value The resolved value.
   */
  function fulfill(opt_value) {
    resolve(webdriver.promise.Deferred.State_.RESOLVED, opt_value);
  }

  /**
   * Rejects this promise. If the error is itself a promise, this instance will
   * be chained to it and be rejected with the error's resolved value.
   * @param {*=} opt_error The rejection reason, typically either a
   *     {@code Error} or a {@code string}.
   */
  function reject(opt_error) {
    resolve(webdriver.promise.Deferred.State_.REJECTED, opt_error);
  }

  /**
   * Attempts to cancel the computation of this instance's value. This attempt
   * will silently fail if this instance has already resolved.
   * @param {*=} opt_reason The reason for cancelling this promise.
   */
  function cancel(opt_reason) {
    if (!isPending()) {
      return;
    }

    if (opt_canceller) {
      opt_reason = opt_canceller(opt_reason) || opt_reason;
    }

    reject(opt_reason);
  }

  this.promise = promise;
  this.promise.then = this.then = then;
  this.promise.cancel = this.cancel = cancel;
  this.promise.isPending = this.isPending = isPending;
  this.fulfill = fulfill;
  this.reject = this.errback = reject;

  // Only expose this function to our internal classes.
  // TODO: find a cleaner way of handling this.
  if (this instanceof webdriver.promise.Task_) {
    this.removeAll = removeAll;
  }

  // Export symbols necessary for the contract on this object to work in
  // compiled mode.
  goog.exportProperty(this, 'then', this.then);
  goog.exportProperty(this, 'cancel', cancel);
  goog.exportProperty(this, 'fulfill', fulfill);
  goog.exportProperty(this, 'reject', reject);
  goog.exportProperty(this, 'isPending', isPending);
  goog.exportProperty(this, 'promise', this.promise);
  goog.exportProperty(this.promise, 'then', this.then);
  goog.exportProperty(this.promise, 'cancel', cancel);
  goog.exportProperty(this.promise, 'isPending', isPending);
};
goog.inherits(webdriver.promise.Deferred, webdriver.promise.Promise);


/**
 * Type definition for a listener registered on a Deferred object.
 * @typedef {{callback:(Function|undefined),
 *            errback:(Function|undefined),
 *            fulfill: function(*), reject: function(*)}}
 * @private
 */
webdriver.promise.Deferred.Listener_;


/**
 * The three states a {@link webdriver.promise.Deferred} object may be in.
 * @enum {number}
 * @private
 */
webdriver.promise.Deferred.State_ = {
  REJECTED: -1,
  PENDING: 0,
  BLOCKED: 1,
  RESOLVED: 2
};


/**
 * Tests if a value is an Error-like object. This is more than an straight
 * instanceof check since the value may originate from another context.
 * @param {*} value The value to test.
 * @return {boolean} Whether the value is an error.
 * @private
 */
webdriver.promise.isError_ = function(value) {
  return value instanceof Error ||
      goog.isObject(value) &&
      (Object.prototype.toString.call(value) === '[object Error]' ||
       // A special test for goog.testing.JsUnitException.
       value.isJsUnitException);

};


/**
 * Determines whether a {@code value} should be treated as a promise.
 * Any object whose "then" property is a function will be considered a promise.
 *
 * @param {*} value The value to test.
 * @return {boolean} Whether the value is a promise.
 */
webdriver.promise.isPromise = function(value) {
  return !!value && goog.isObject(value) &&
      // Use array notation so the Closure compiler does not obfuscate away our
      // contract.
      goog.isFunction(value['then']);
};


/**
 * Creates a promise that will be resolved at a set time in the future.
 * @param {number} ms The amount of time, in milliseconds, to wait before
 *     resolving the promise.
 * @return {!webdriver.promise.Promise} The promise.
 */
webdriver.promise.delayed = function(ms) {
  var timer = webdriver.promise.controlFlow().timer;
  var key;
  var deferred = new webdriver.promise.Deferred(function() {
    timer.clearTimeout(key);
  });
  key = timer.setTimeout(deferred.fulfill, ms);
  return deferred.promise;
};


/**
 * Creates a new deferred object.
 * @param {Function=} opt_canceller Function to call when cancelling the
 *     computation of this instance's value.
 * @return {!webdriver.promise.Deferred} The new deferred object.
 */
webdriver.promise.defer = function(opt_canceller) {
  return new webdriver.promise.Deferred(opt_canceller);
};


/**
 * Creates a promise that has been resolved with the given value.
 * @param {*=} opt_value The resolved value.
 * @return {!webdriver.promise.Promise} The resolved promise.
 */
webdriver.promise.fulfilled = function(opt_value) {
  if (opt_value instanceof webdriver.promise.Promise) {
    return opt_value;
  }
  var deferred = new webdriver.promise.Deferred();
  deferred.fulfill(opt_value);
  return deferred.promise;
};


/**
 * Creates a promise that has been rejected with the given reason.
 * @param {*=} opt_reason The rejection reason; may be any value, but is
 *     usually an Error or a string.
 * @return {!webdriver.promise.Promise} The rejected promise.
 */
webdriver.promise.rejected = function(opt_reason) {
  var deferred = new webdriver.promise.Deferred();
  deferred.reject(opt_reason);
  return deferred.promise;
};


/**
 * Wraps a function that is assumed to be a node-style callback as its final
 * argument. This callback takes two arguments: an error value (which will be
 * null if the call succeeded), and the success value as the second argument.
 * If the call fails, the returned promise will be rejected, otherwise it will
 * be resolved with the result.
 * @param {!Function} fn The function to wrap.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     result of the provided function's callback.
 */
webdriver.promise.checkedNodeCall = function(fn) {
  var deferred = new webdriver.promise.Deferred(function() {
    throw Error('This Deferred may not be cancelled');
  });
  try {
    fn(function(error, value) {
      error ? deferred.reject(error) : deferred.fulfill(value);
    });
  } catch (ex) {
    deferred.reject(ex);
  }
  return deferred.promise;
};


/**
 * Registers an observer on a promised {@code value}, returning a new promise
 * that will be resolved when the value is. If {@code value} is not a promise,
 * then the return promise will be immediately resolved.
 * @param {*} value The value to observe.
 * @param {Function=} opt_callback The function to call when the value is
 *     resolved successfully.
 * @param {Function=} opt_errback The function to call when the value is
 *     rejected.
 * @return {!webdriver.promise.Promise} A new promise.
 */
webdriver.promise.when = function(value, opt_callback, opt_errback) {
  if (value instanceof webdriver.promise.Promise) {
    return value.then(opt_callback, opt_errback);
  }

  var deferred = new webdriver.promise.Deferred();

  webdriver.promise.asap(value, deferred.fulfill, deferred.reject);

  return deferred.then(opt_callback, opt_errback);
};


/**
 * Invokes the appropriate callback function as soon as a promised
 * {@code value} is resolved. This function is similar to
 * {@link webdriver.promise.when}, except it does not return a new promise.
 * @param {*} value The value to observe.
 * @param {Function} callback The function to call when the value is
 *     resolved successfully.
 * @param {Function=} opt_errback The function to call when the value is
 *     rejected.
 */
webdriver.promise.asap = function(value, callback, opt_errback) {
  if (webdriver.promise.isPromise(value)) {
    value.then(callback, opt_errback);

  // Maybe a Dojo-like deferred object?
  } else if (!!value && goog.isObject(value) &&
      goog.isFunction(value.addCallbacks)) {
    value.addCallbacks(callback, opt_errback);

  // A raw value, return a resolved promise.
  } else if (callback) {
    callback(value);
  }
};


/**
 * Given an array of promises, will return a promise that will be fulfilled
 * with the fulfillment values of the input array's values. If any of the
 * input array's promises are rejected, the returned promise will be rejected
 * with the same reason.
 *
 * @param {!Array.<(T|!webdriver.promise.Promise.<T>)>} arr An array of
 *     promises to wait on.
 * @return {!webdriver.promise.Promise.<!Array.<T>>} A promise that is
 *     fulfilled with an array containing the fulfilled values of the
 *     input array, or rejected with the same reason as the first
 *     rejected value.
 * @template T
 */
webdriver.promise.all = function(arr) {
  var n = arr.length;
  if (!n) {
    return webdriver.promise.fulfilled([]);
  }

  var toFulfill = n;
  var result = webdriver.promise.defer();
  var values = [];

  var onFulfill = function(index, value) {
    values[index] = value;
    toFulfill--;
    if (toFulfill == 0) {
      result.fulfill(values);
    }
  };

  for (var i = 0; i < n; ++i) {
    webdriver.promise.asap(
        arr[i], goog.partial(onFulfill, i), result.reject);
  }

  return result.promise;
};


/**
 * Calls a function for each element in an array and inserts the result into a
 * new array, which is used as the fulfillment value of the promise returned
 * by this function.
 *
 * <p>If the return value of the mapping function is a promise, this function
 * will wait for it to be fulfilled before inserting it into the new array.
 *
 * <p>If the mapping function throws or returns a rejected promise, the
 * promise returned by this function will be rejected with the same reason.
 * Only the first failure will be reported; all subsequent errors will be
 * silently ignored.
 *
 * @param {!(Array.<TYPE>|webdriver.promise.Promise.<!Array.<TYPE>>)} arr The
 *     array to iterator over, or a promise that will resolve to said array.
 * @param {function(this: SELF, TYPE, number, !Array.<TYPE>): ?} fn The
 *     function to call for each element in the array. This function should
 *     expect three arguments (the element, the index, and the array itself.
 * @param {SELF=} opt_self The object to be used as the value of 'this' within
 *     {@code fn}.
 * @template TYPE, SELF
 */
webdriver.promise.map = function(arr, fn, opt_self) {
  return webdriver.promise.when(arr, function(arr) {
    var result = goog.array.map(arr, fn, opt_self);
    return webdriver.promise.all(result);
  });
};


/**
 * Calls a function for each element in an array, and if the function returns
 * true adds the element to a new array.
 *
 * <p>If the return value of the filter function is a promise, this function
 * will wait for it to be fulfilled before determining whether to insert the
 * element into the new array.
 *
 * <p>If the filter function throws or returns a rejected promise, the promise
 * returned by this function will be rejected with the same reason. Only the
 * first failure will be reported; all subsequent errors will be silently
 * ignored.
 *
 * @param {!(Array.<TYPE>|webdriver.promise.Promise.<!Array.<TYPE>>)} arr The
 *     array to iterator over, or a promise that will resolve to said array.
 * @param {function(this: SELF, TYPE, number, !Array.<TYPE>): (
 *             boolean|webdriver.promise.Promise.<boolean>)} fn The function
 *     to call for each element in the array.
 * @param {SELF=} opt_self The object to be used as the value of 'this' within
 *     {@code fn}.
 * @template TYPE, SELF
 */
webdriver.promise.filter = function(arr, fn, opt_self) {
  return webdriver.promise.when(arr, function(arr) {
    var originalValues = goog.array.clone(arr);
    return webdriver.promise.map(arr, fn, opt_self).then(function(include) {
      return goog.array.filter(originalValues, function(value, index) {
        return include[index];
      });
    });
  });
};


/**
 * Returns a promise that will be resolved with the input value in a
 * fully-resolved state. If the value is an array, each element will be fully
 * resolved. Likewise, if the value is an object, all keys will be fully
 * resolved. In both cases, all nested arrays and objects will also be
 * fully resolved.  All fields are resolved in place; the returned promise will
 * resolve on {@code value} and not a copy.
 *
 * Warning: This function makes no checks against objects that contain
 * cyclical references:
 * <pre><code>
 *   var value = {};
 *   value['self'] = value;
 *   webdriver.promise.fullyResolved(value);  // Stack overflow.
 * </code></pre>
 *
 * @param {*} value The value to fully resolve.
 * @return {!webdriver.promise.Promise} A promise for a fully resolved version
 *     of the input value.
 */
webdriver.promise.fullyResolved = function(value) {
  if (webdriver.promise.isPromise(value)) {
    return webdriver.promise.when(value, webdriver.promise.fullyResolveValue_);
  }
  return webdriver.promise.fullyResolveValue_(value);
};


/**
 * @param {*} value The value to fully resolve. If a promise, assumed to
 *     already be resolved.
 * @return {!webdriver.promise.Promise} A promise for a fully resolved version
 *     of the input value.
 * @private
 */
webdriver.promise.fullyResolveValue_ = function(value) {
  switch (goog.typeOf(value)) {
    case 'array':
      return webdriver.promise.fullyResolveKeys_(
          /** @type {!Array} */ (value));

    case 'object':
      if (webdriver.promise.isPromise(value)) {
        // We get here when the original input value is a promise that
        // resolves to itself. When the user provides us with such a promise,
        // trust that it counts as a "fully resolved" value and return it.
        // Of course, since it's already a promise, we can just return it
        // to the user instead of wrapping it in another promise.
        return /** @type {!webdriver.promise.Promise} */ (value);
      }

      if (goog.isNumber(value.nodeType) &&
          goog.isObject(value.ownerDocument) &&
          goog.isNumber(value.ownerDocument.nodeType)) {
        // DOM node; return early to avoid infinite recursion. Should we
        // only support objects with a certain level of nesting?
        return webdriver.promise.fulfilled(value);
      }

      return webdriver.promise.fullyResolveKeys_(
          /** @type {!Object} */ (value));

    default:  // boolean, function, null, number, string, undefined
      return webdriver.promise.fulfilled(value);
  }
};


/**
 * @param {!(Array|Object)} obj the object to resolve.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     input object once all of its values have been fully resolved.
 * @private
 */
webdriver.promise.fullyResolveKeys_ = function(obj) {
  var isArray = goog.isArray(obj);
  var numKeys = isArray ? obj.length : goog.object.getCount(obj);
  if (!numKeys) {
    return webdriver.promise.fulfilled(obj);
  }

  var numResolved = 0;
  var deferred = new webdriver.promise.Deferred();

  // In pre-IE9, goog.array.forEach will not iterate properly over arrays
  // containing undefined values because "index in array" returns false
  // when array[index] === undefined (even for x = [undefined, 1]). To get
  // around this, we need to use our own forEach implementation.
  // DO NOT REMOVE THIS UNTIL WE NO LONGER SUPPORT IE8. This cannot be
  // reproduced in IE9 by changing the browser/document modes, it requires an
  // actual pre-IE9 browser.  Yay, IE!
  var forEachKey = !isArray ? goog.object.forEach : function(arr, fn) {
    var n = arr.length;
    for (var i = 0; i < n; ++i) {
      fn.call(null, arr[i], i, arr);
    }
  };

  forEachKey(obj, function(partialValue, key) {
    var type = goog.typeOf(partialValue);
    if (type != 'array' && type != 'object') {
      maybeResolveValue();
      return;
    }

    webdriver.promise.fullyResolved(partialValue).then(
        function(resolvedValue) {
          obj[key] = resolvedValue;
          maybeResolveValue();
        },
        deferred.reject);
  });

  return deferred.promise;

  function maybeResolveValue() {
    if (++numResolved == numKeys) {
      deferred.fulfill(obj);
    }
  }
};


//////////////////////////////////////////////////////////////////////////////
//
//  webdriver.promise.ControlFlow
//
//////////////////////////////////////////////////////////////////////////////



/**
 * Handles the execution of scheduled tasks, each of which may be an
 * asynchronous operation. The control flow will ensure tasks are executed in
 * the ordered scheduled, starting each task only once those before it have
 * completed.
 *
 * <p>Each task scheduled within this flow may return a
 * {@link webdriver.promise.Promise} to indicate it is an asynchronous
 * operation. The ControlFlow will wait for such promises to be resolved before
 * marking the task as completed.
 *
 * <p>Tasks and each callback registered on a {@link webdriver.promise.Deferred}
 * will be run in their own ControlFlow frame.  Any tasks scheduled within a
 * frame will have priority over previously scheduled tasks. Furthermore, if
 * any of the tasks in the frame fails, the remainder of the tasks in that frame
 * will be discarded and the failure will be propagated to the user through the
 * callback/task's promised result.
 *
 * <p>Each time a ControlFlow empties its task queue, it will fire an
 * {@link webdriver.promise.ControlFlow.EventType.IDLE} event. Conversely,
 * whenever the flow terminates due to an unhandled error, it will remove all
 * remaining tasks in its queue and fire an
 * {@link webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION} event. If
 * there are no listeners registered with the flow, the error will be
 * rethrown to the global error handler.
 *
 * @param {webdriver.promise.ControlFlow.Timer=} opt_timer The timer object
 *     to use. Should only be set for testing.
 * @constructor
 * @extends {webdriver.EventEmitter}
 */
webdriver.promise.ControlFlow = function(opt_timer) {
  webdriver.EventEmitter.call(this);

  /**
   * The timer used by this instance.
   * @type {webdriver.promise.ControlFlow.Timer}
   */
  this.timer = opt_timer || webdriver.promise.ControlFlow.defaultTimer;

  /**
   * A list of recent tasks. Each time a new task is started, or a frame is
   * completed, the previously recorded task is removed from this list. If
   * there are multiple tasks, task N+1 is considered a sub-task of task
   * N.
   * @private {!Array.<!webdriver.promise.Task_>}
   */
  this.history_ = [];
};
goog.inherits(webdriver.promise.ControlFlow, webdriver.EventEmitter);


/**
 * @typedef {{clearInterval: function(number),
 *            clearTimeout: function(number),
 *            setInterval: function(!Function, number): number,
 *            setTimeout: function(!Function, number): number}}
 */
webdriver.promise.ControlFlow.Timer;


/**
 * The default timer object, which uses the global timer functions.
 * @type {webdriver.promise.ControlFlow.Timer}
 */
webdriver.promise.ControlFlow.defaultTimer = (function() {
  // The default timer functions may be defined as free variables for the
  // current context, so do not reference them using "window" or
  // "goog.global".  Also, we must invoke them in a closure, and not using
  // bind(), so we do not get "TypeError: Illegal invocation" (WebKit) or
  // "Invalid calling object" (IE) errors.
  return {
    clearInterval: wrap(clearInterval),
    clearTimeout: wrap(clearTimeout),
    setInterval: wrap(setInterval),
    setTimeout: wrap(setTimeout)
  };

  function wrap(fn) {
    return function() {
      // Cannot use .call() or .apply() since we do not know which variable
      // the function is bound to, and using the wrong one will generate
      // an error.
      return fn(arguments[0], arguments[1]);
    };
  }
})();


/**
 * Events that may be emitted by an {@link webdriver.promise.ControlFlow}.
 * @enum {string}
 */
webdriver.promise.ControlFlow.EventType = {

  /** Emitted when all tasks have been successfully executed. */
  IDLE: 'idle',

  /** Emitted whenever a new task has been scheduled. */
  SCHEDULE_TASK: 'scheduleTask',

  /**
   * Emitted whenever a control flow aborts due to an unhandled promise
   * rejection. This event will be emitted along with the offending rejection
   * reason. Upon emitting this event, the control flow will empty its task
   * queue and revert to its initial state.
   */
  UNCAUGHT_EXCEPTION: 'uncaughtException'
};


/**
 * How often, in milliseconds, the event loop should run.
 * @type {number}
 * @const
 */
webdriver.promise.ControlFlow.EVENT_LOOP_FREQUENCY = 10;


/**
 * Tracks the active execution frame for this instance. Lazily initialized
 * when the first task is scheduled.
 * @private {webdriver.promise.Frame_}
 */
webdriver.promise.ControlFlow.prototype.activeFrame_ = null;


/**
 * A reference to the frame in which new tasks should be scheduled. If
 * {@code null}, tasks will be scheduled within the active frame. When forcing
 * a function to run in the context of a new frame, this pointer is used to
 * ensure tasks are scheduled within the newly created frame, even though it
 * won't be active yet.
 * @private {webdriver.promise.Frame_}
 * @see {#runInNewFrame_}
 */
webdriver.promise.ControlFlow.prototype.schedulingFrame_ = null;


/**
 * Timeout ID set when the flow is about to shutdown without any errors
 * being detected. Upon shutting down, the flow will emit an
 * {@link webdriver.promise.ControlFlow.EventType.IDLE} event. Idle events
 * always follow a brief timeout in order to catch latent errors from the last
 * completed task. If this task had a callback registered, but no errback, and
 * the task fails, the unhandled failure would not be reported by the promise
 * system until the next turn of the event loop:
 *
 *   // Schedule 1 task that fails.
 *   var result = webriver.promise.controlFlow().schedule('example',
 *       function() { return webdriver.promise.rejected('failed'); });
 *   // Set a callback on the result. This delays reporting the unhandled
 *   // failure for 1 turn of the event loop.
 *   result.then(goog.nullFunction);
 *
 * @private {?number}
 */
webdriver.promise.ControlFlow.prototype.shutdownId_ = null;


/**
 * Interval ID for this instance's event loop.
 * @private {?number}
 */
webdriver.promise.ControlFlow.prototype.eventLoopId_ = null;


/**
 * The number of "pending" promise rejections.
 *
 * <p>Each time a promise is rejected and is not handled by a listener, it will
 * schedule a 0-based timeout to check if it is still unrejected in the next
 * turn of the JS-event loop. This allows listeners to attach to, and handle,
 * the rejected promise at any point in same turn of the event loop that the
 * promise was rejected.
 *
 * <p>When this flow's own event loop triggers, it will not run if there
 * are any outstanding promise rejections. This allows unhandled promises to
 * be reported before a new task is started, ensuring the error is reported to
 * the current task queue.
 *
 * @private {number}
 */
webdriver.promise.ControlFlow.prototype.pendingRejections_ = 0;


/**
 * The number of aborted frames since the last time a task was executed or a
 * frame completed successfully.
 * @private {number}
 */
webdriver.promise.ControlFlow.prototype.numAbortedFrames_ = 0;


/**
 * Resets this instance, clearing its queue and removing all event listeners.
 */
webdriver.promise.ControlFlow.prototype.reset = function() {
  this.activeFrame_ = null;
  this.clearHistory();
  this.removeAllListeners();
  this.cancelShutdown_();
  this.cancelEventLoop_();
};


/**
 * Returns a summary of the recent task activity for this instance. This
 * includes the most recently completed task, as well as any parent tasks. In
 * the returned summary, the task at index N is considered a sub-task of the
 * task at index N+1.
 * @return {!Array.<string>} A summary of this instance's recent task
 *     activity.
 */
webdriver.promise.ControlFlow.prototype.getHistory = function() {
  var pendingTasks = [];
  var currentFrame = this.activeFrame_;
  while (currentFrame) {
    var task = currentFrame.getPendingTask();
    if (task) {
      pendingTasks.push(task);
    }
    // A frame's parent node will always be another frame.
    currentFrame =
        /** @type {webdriver.promise.Frame_} */ (currentFrame.getParent());
  }

  var fullHistory = goog.array.concat(this.history_, pendingTasks);
  return goog.array.map(fullHistory, function(task) {
    return task.toString();
  });
};


/** Clears this instance's task history. */
webdriver.promise.ControlFlow.prototype.clearHistory = function() {
  this.history_ = [];
};


/**
 * Removes a completed task from this instance's history record. If any
 * tasks remain from aborted frames, those will be removed as well.
 * @private
 */
webdriver.promise.ControlFlow.prototype.trimHistory_ = function() {
  if (this.numAbortedFrames_) {
    goog.array.splice(this.history_,
        this.history_.length - this.numAbortedFrames_,
        this.numAbortedFrames_);
    this.numAbortedFrames_ = 0;
  }
  this.history_.pop();
};


/**
 * Property used to track whether an error has been annotated by
 * {@link webdriver.promise.ControlFlow#annotateError}.
 * @private {string}
 * @const
 */
webdriver.promise.ControlFlow.ANNOTATION_PROPERTY_ =
    'webdriver_promise_error_';


/**
 * Appends a summary of this instance's recent task history to the given
 * error's stack trace. This function will also ensure the error's stack trace
 * is in canonical form.
 * @param {!(Error|goog.testing.JsUnitException)} e The error to annotate.
 * @return {!(Error|goog.testing.JsUnitException)} The annotated error.
 */
webdriver.promise.ControlFlow.prototype.annotateError = function(e) {
  if (!!e[webdriver.promise.ControlFlow.ANNOTATION_PROPERTY_]) {
    return e;
  }

  var history = this.getHistory();
  if (history.length) {
    e = webdriver.stacktrace.format(e);

    /** @type {!Error} */(e).stack += [
      '\n==== async task ====\n',
      history.join('\n==== async task ====\n')
    ].join('');

    e[webdriver.promise.ControlFlow.ANNOTATION_PROPERTY_] = true;
  }

  return e;
};


/**
 * @return {string} The scheduled tasks still pending with this instance.
 */
webdriver.promise.ControlFlow.prototype.getSchedule = function() {
  return this.activeFrame_ ? this.activeFrame_.getRoot().toString() : '[]';
};


/**
 * Schedules a task for execution. If there is nothing currently in the
 * queue, the task will be executed in the next turn of the event loop.
 *
 * @param {!Function} fn The function to call to start the task. If the
 *     function returns a {@link webdriver.promise.Promise}, this instance
 *     will wait for it to be resolved before starting the next task.
 * @param {string=} opt_description A description of the task.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     the result of the action.
 */
webdriver.promise.ControlFlow.prototype.execute = function(
    fn, opt_description) {
  this.cancelShutdown_();

  if (!this.activeFrame_) {
    this.activeFrame_ = new webdriver.promise.Frame_(this);
  }

  // Trim an extra frame off the generated stack trace for the call to this
  // function.
  var snapshot = new webdriver.stacktrace.Snapshot(1);
  var task = new webdriver.promise.Task_(
      this, fn, opt_description || '', snapshot);
  var scheduleIn = this.schedulingFrame_ || this.activeFrame_;
  scheduleIn.addChild(task);

  this.emit(webdriver.promise.ControlFlow.EventType.SCHEDULE_TASK);

  this.scheduleEventLoopStart_();
  return task.promise;
};


/**
 * Inserts a {@code setTimeout} into the command queue. This is equivalent to
 * a thread sleep in a synchronous programming language.
 *
 * @param {number} ms The timeout delay, in milliseconds.
 * @param {string=} opt_description A description to accompany the timeout.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     the result of the action.
 */
webdriver.promise.ControlFlow.prototype.timeout = function(
    ms, opt_description) {
  return this.execute(function() {
    return webdriver.promise.delayed(ms);
  }, opt_description);
};


/**
 * Schedules a task that shall wait for a condition to hold. Each condition
 * function may return any value, but it will always be evaluated as a boolean.
 *
 * <p>Condition functions may schedule sub-tasks with this instance, however,
 * their execution time will be factored into whether a wait has timed out.
 *
 * <p>In the event a condition returns a Promise, the polling loop will wait for
 * it to be resolved before evaluating whether the condition has been satisfied.
 * The resolution time for a promise is factored into whether a wait has timed
 * out.
 *
 * <p>If the condition function throws, or returns a rejected promise, the
 * wait task will fail.
 *
 * @param {!Function} condition The condition function to poll.
 * @param {number} timeout How long to wait, in milliseconds, for the condition
 *     to hold before timing out.
 * @param {string=} opt_message An optional error message to include if the
 *     wait times out; defaults to the empty string.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     condition has been satisified. The promise shall be rejected if the wait
 *     times out waiting for the condition.
 */
webdriver.promise.ControlFlow.prototype.wait = function(
    condition, timeout, opt_message) {
  var sleep = Math.min(timeout, 100);
  var self = this;

  return this.execute(function() {
    var startTime = goog.now();
    var waitResult = new webdriver.promise.Deferred();
    var waitFrame = self.activeFrame_;
    waitFrame.isWaiting = true;
    pollCondition();
    return waitResult.promise;

    function pollCondition() {
      self.runInNewFrame_(condition, function(value) {
        var elapsed = goog.now() - startTime;
        if (!!value) {
          waitFrame.isWaiting = false;
          waitResult.fulfill(value);
        } else if (elapsed >= timeout) {
          waitResult.reject(new Error((opt_message ? opt_message + '\n' : '') +
              'Wait timed out after ' + elapsed + 'ms'));
        } else {
          self.timer.setTimeout(pollCondition, sleep);
        }
      }, waitResult.reject, true);
    }
  }, opt_message);
};


/**
 * Schedules a task that will wait for another promise to resolve.  The resolved
 * promise's value will be returned as the task result.
 * @param {!webdriver.promise.Promise} promise The promise to wait on.
 * @return {!webdriver.promise.Promise} A promise that will resolve when the
 *     task has completed.
 */
webdriver.promise.ControlFlow.prototype.await = function(promise) {
  return this.execute(function() {
    return promise;
  });
};


/**
 * Schedules the interval for this instance's event loop, if necessary.
 * @private
 */
webdriver.promise.ControlFlow.prototype.scheduleEventLoopStart_ = function() {
  if (!this.eventLoopId_) {
    this.eventLoopId_ = this.timer.setInterval(
        goog.bind(this.runEventLoop_, this),
        webdriver.promise.ControlFlow.EVENT_LOOP_FREQUENCY);
  }
};


/**
 * Cancels the event loop, if necessary.
 * @private
 */
webdriver.promise.ControlFlow.prototype.cancelEventLoop_ = function() {
  if (this.eventLoopId_) {
    this.timer.clearInterval(this.eventLoopId_);
    this.eventLoopId_ = null;
  }
};


/**
 * Executes the next task for the current frame. If the current frame has no
 * more tasks, the frame's result will be resolved, returning control to the
 * frame's creator. This will terminate the flow if the completed frame was at
 * the top of the stack.
 * @private
 */
webdriver.promise.ControlFlow.prototype.runEventLoop_ = function() {
  // If we get here and there are pending promise rejections, then those
  // promises are queued up to run as soon as this (JS) event loop terminates.
  // Short-circuit our loop to give those promises a chance to run. Otherwise,
  // we might start a new task only to have it fail because of one of these
  // pending rejections.
  if (this.pendingRejections_) {
    return;
  }

  // If the flow aborts due to an unhandled exception after we've scheduled
  // another turn of the execution loop, we can end up in here with no tasks
  // left. This is OK, just quietly return.
  if (!this.activeFrame_) {
    this.commenceShutdown_();
    return;
  }

  var task;
  if (this.activeFrame_.getPendingTask() || !(task = this.getNextTask_())) {
    // Either the current frame is blocked on a pending task, or we don't have
    // a task to finish because we've completed a frame. When completing a
    // frame, we must abort the event loop to allow the frame's promise's
    // callbacks to execute.
    return;
  }

  var activeFrame = this.activeFrame_;
  activeFrame.setPendingTask(task);
  var markTaskComplete = goog.bind(function() {
    this.history_.push(/** @type {!webdriver.promise.Task_} */ (task));
    activeFrame.setPendingTask(null);
  }, this);

  this.trimHistory_();
  var self = this;
  this.runInNewFrame_(task.execute, function(result) {
    markTaskComplete();
    task.fulfill(result);
  }, function(error) {
    markTaskComplete();

    if (!webdriver.promise.isError_(error) &&
        !webdriver.promise.isPromise(error)) {
      error = Error(error);
    }

    task.reject(self.annotateError(/** @type {!Error} */ (error)));
  }, true);
};


/**
 * @return {webdriver.promise.Task_} The next task to execute, or
 *     {@code null} if a frame was resolved.
 * @private
 */
webdriver.promise.ControlFlow.prototype.getNextTask_ = function() {
  var firstChild = this.activeFrame_.getFirstChild();
  if (!firstChild) {
    if (!this.activeFrame_.isWaiting) {
      this.resolveFrame_(this.activeFrame_);
    }
    return null;
  }

  if (firstChild instanceof webdriver.promise.Frame_) {
    this.activeFrame_ = firstChild;
    return this.getNextTask_();
  }

  firstChild.getParent().removeChild(firstChild);
  return firstChild;
};


/**
 * @param {!webdriver.promise.Frame_} frame The frame to resolve.
 * @private
 */
webdriver.promise.ControlFlow.prototype.resolveFrame_ = function(frame) {
  if (this.activeFrame_ === frame) {
    // Frame parent is always another frame, but the compiler is not smart
    // enough to recognize this.
    this.activeFrame_ =
        /** @type {webdriver.promise.Frame_} */ (frame.getParent());
  }

  if (frame.getParent()) {
    frame.getParent().removeChild(frame);
  }
  this.trimHistory_();
  frame.fulfill();

  if (!this.activeFrame_) {
    this.commenceShutdown_();
  }
};


/**
 * Aborts the current frame. The frame, and all of the tasks scheduled within it
 * will be discarded. If this instance does not have an active frame, it will
 * immediately terminate all execution.
 * @param {*} error The reason the frame is being aborted; typically either
 *     an Error or string.
 * @private
 */
webdriver.promise.ControlFlow.prototype.abortFrame_ = function(error) {
  // Annotate the error value if it is Error-like.
  if (webdriver.promise.isError_(error)) {
    this.annotateError(/** @type {!Error} */ (error));
  }
  this.numAbortedFrames_++;

  if (!this.activeFrame_) {
    this.abortNow_(error);
    return;
  }

  // Frame parent is always another frame, but the compiler is not smart
  // enough to recognize this.
  var parent = /** @type {webdriver.promise.Frame_} */ (
      this.activeFrame_.getParent());
  if (parent) {
    parent.removeChild(this.activeFrame_);
  }

  var frame = this.activeFrame_;
  this.activeFrame_ = parent;
  frame.reject(error);
};


/**
 * Executes a function in a new frame. If the function does not schedule any new
 * tasks, the frame will be discarded and the function's result returned
 * immediately. Otherwise, a promise will be returned. This promise will be
 * resolved with the function's result once all of the tasks scheduled within
 * the function have been completed. If the function's frame is aborted, the
 * returned promise will be rejected.
 *
 * @param {!Function} fn The function to execute.
 * @param {function(*)} callback The function to call with a successful result.
 * @param {function(*)} errback The function to call if there is an error.
 * @param {boolean=} opt_activate Whether the active frame should be updated to
 *     the newly created frame so tasks are treated as sub-tasks.
 * @private
 */
webdriver.promise.ControlFlow.prototype.runInNewFrame_ = function(
    fn, callback, errback, opt_activate) {
  var newFrame = new webdriver.promise.Frame_(this),
      self = this,
      oldFrame = this.activeFrame_;

  try {
    if (!this.activeFrame_) {
      this.activeFrame_ = newFrame;
    } else {
      this.activeFrame_.addChild(newFrame);
    }

    // Activate the new frame to force tasks to be treated as sub-tasks of
    // the parent frame.
    if (opt_activate) {
      this.activeFrame_ = newFrame;
    }

    try {
      this.schedulingFrame_ = newFrame;
      webdriver.promise.pushFlow_(this);
      var result = fn();
    } finally {
      webdriver.promise.popFlow_();
      this.schedulingFrame_ = null;
    }
    newFrame.lockFrame();

    // If there was nothing scheduled in the new frame we can discard the
    // frame and return immediately.
    if (!newFrame.children_.length) {
      removeNewFrame();
      webdriver.promise.asap(result, callback, errback);
      return;
    }

    newFrame.then(function() {
      webdriver.promise.asap(result, callback, errback);
    }, function(e) {
      if (result instanceof webdriver.promise.Promise && result.isPending()) {
        result.cancel(e);
        e = result;
      }
      errback(e);
    });
  } catch (ex) {
    removeNewFrame(new webdriver.promise.CanceledTaskError_(ex));
    errback(ex);
  }

  /**
   * @param {webdriver.promise.CanceledTaskError_=} opt_err If provided, the
   *     error that triggered the removal of this frame.
   */
  function removeNewFrame(opt_err) {
    var parent = newFrame.getParent();
    if (parent) {
      parent.removeChild(newFrame);
    }

    if (opt_err) {
      newFrame.cancelRemainingTasks(opt_err);
    }
    self.activeFrame_ = oldFrame;
  }
};


/**
 * Commences the shutdown sequence for this instance. After one turn of the
 * event loop, this object will emit the
 * {@link webdriver.promise.ControlFlow.EventType.IDLE} event to signal
 * listeners that it has completed. During this wait, if another task is
 * scheduled, the shutdown will be aborted.
 * @private
 */
webdriver.promise.ControlFlow.prototype.commenceShutdown_ = function() {
  if (!this.shutdownId_) {
    // Go ahead and stop the event loop now.  If we're in here, then there are
    // no more frames with tasks to execute. If we waited to cancel the event
    // loop in our timeout below, the event loop could trigger *before* the
    // timeout, generating an error from there being no frames.
    // If #execute is called before the timeout below fires, it will cancel
    // the timeout and restart the event loop.
    this.cancelEventLoop_();

    var self = this;
    self.shutdownId_ = self.timer.setTimeout(function() {
      self.shutdownId_ = null;
      self.emit(webdriver.promise.ControlFlow.EventType.IDLE);
    }, 0);
  }
};


/**
 * Cancels the shutdown sequence if it is currently scheduled.
 * @private
 */
webdriver.promise.ControlFlow.prototype.cancelShutdown_ = function() {
  if (this.shutdownId_) {
    this.timer.clearTimeout(this.shutdownId_);
    this.shutdownId_ = null;
  }
};


/**
 * Aborts this flow, abandoning all remaining tasks. If there are
 * listeners registered, an {@code UNCAUGHT_EXCEPTION} will be emitted with the
 * offending {@code error}, otherwise, the {@code error} will be rethrown to the
 * global error handler.
 * @param {*} error Object describing the error that caused the flow to
 *     abort; usually either an Error or string value.
 * @private
 */
webdriver.promise.ControlFlow.prototype.abortNow_ = function(error) {
  this.activeFrame_ = null;
  this.cancelShutdown_();
  this.cancelEventLoop_();

  var listeners = this.listeners(
      webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION);
  if (!listeners.length) {
    this.timer.setTimeout(function() {
      throw error;
    }, 0);
  } else {
    this.emit(webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION,
        error);
  }
};



/**
 * A single node in an {@link webdriver.promise.ControlFlow}'s task tree.
 * @param {!webdriver.promise.ControlFlow} flow The flow this instance belongs
 *     to.
 * @constructor
 * @extends {webdriver.promise.Deferred}
 * @private
 */
webdriver.promise.Node_ = function(flow) {
  webdriver.promise.Deferred.call(this, null, flow);
};
goog.inherits(webdriver.promise.Node_, webdriver.promise.Deferred);


/**
 * This node's parent.
 * @private {webdriver.promise.Node_}
 */
webdriver.promise.Node_.prototype.parent_ = null;


/** @return {webdriver.promise.Node_} This node's parent. */
webdriver.promise.Node_.prototype.getParent = function() {
  return this.parent_;
};


/**
 * @param {webdriver.promise.Node_} parent This node's new parent.
 */
webdriver.promise.Node_.prototype.setParent = function(parent) {
  this.parent_ = parent;
};


/**
 * @return {!webdriver.promise.Node_} The root of this node's tree.
 */
webdriver.promise.Node_.prototype.getRoot = function() {
  var root = this;
  while (root.parent_) {
    root = root.parent_;
  }
  return root;
};



/**
 * An execution frame within a {@link webdriver.promise.ControlFlow}.  Each
 * frame represents the execution context for either a
 * {@link webdriver.promise.Task_} or a callback on a
 * {@link webdriver.promise.Deferred}.
 *
 * <p>Each frame may contain sub-frames.  If child N is a sub-frame, then the
 * items queued within it are given priority over child N+1.
 *
 * @param {!webdriver.promise.ControlFlow} flow The flow this instance belongs
 *     to.
 * @constructor
 * @extends {webdriver.promise.Node_}
 * @private
 */
webdriver.promise.Frame_ = function(flow) {
  webdriver.promise.Node_.call(this, flow);

  var reject = goog.bind(this.reject, this);
  var cancelRemainingTasks = goog.bind(this.cancelRemainingTasks, this);

  /** @override */
  this.reject = function(e) {
    cancelRemainingTasks(new webdriver.promise.CanceledTaskError_(e));
    reject(e);
  };

  /**
   * @private {!Array.<!(webdriver.promise.Frame_|webdriver.promise.Task_)>}
   */
  this.children_ = [];
};
goog.inherits(webdriver.promise.Frame_, webdriver.promise.Node_);


/**
 * The task currently being executed within this frame.
 * @private {webdriver.promise.Task_}
 */
webdriver.promise.Frame_.prototype.pendingTask_ = null;


/**
 * Whether this frame is active. A frame is considered active once one of its
 * descendants has been removed for execution.
 *
 * Adding a sub-frame as a child to an active frame is an indication that
 * a callback to a {@link webdriver.promise.Deferred} is being invoked and any
 * tasks scheduled within it should have priority over previously scheduled
 * tasks:
 * <code><pre>
 *   var flow = webdriver.promise.controlFlow();
 *   flow.execute('start here', goog.nullFunction).then(function() {
 *     flow.execute('this should execute 2nd', goog.nullFunction);
 *   });
 *   flow.execute('this should execute last', goog.nullFunction);
 * </pre></code>
 *
 * @private {boolean}
 */
webdriver.promise.Frame_.prototype.isActive_ = false;


/**
 * Whether this frame is currently locked. A locked frame represents a callback
 * or task function which has run to completion and scheduled all of its tasks.
 *
 * <p>Once a frame becomes {@link #isActive_ active}, any new frames which are
 * added represent callbacks on a {@link webdriver.promise.Deferred}, whose
 * tasks must be given priority over previously scheduled tasks.
 *
 * @private {boolean}
 */
webdriver.promise.Frame_.prototype.isLocked_ = false;


/**
 * A reference to the last node inserted in this frame.
 * @private {webdriver.promise.Node_}
 */
webdriver.promise.Frame_.prototype.lastInsertedChild_ = null;


/**
 * Marks all of the tasks that are descendants of this frame in the execution
 * tree as cancelled. This is necessary for callbacks scheduled asynchronous.
 * For example:
 *
 *     var someResult;
 *     webdriver.promise.createFlow(function(flow) {
 *       someResult = flow.execute(function() {});
 *       throw Error();
 *     }).addErrback(function(err) {
 *       console.log('flow failed: ' + err);
 *       someResult.then(function() {
 *         console.log('task succeeded!');
 *       }, function(err) {
 *         console.log('task failed! ' + err);
 *       });
 *     });
 *     // flow failed: Error: boom
 *     // task failed! CanceledTaskError: Task discarded due to a previous
 *     // task failure: Error: boom
 *
 * @param {!webdriver.promise.CanceledTaskError_} error The cancellation
 *     error.
 */
webdriver.promise.Frame_.prototype.cancelRemainingTasks = function(error) {
  goog.array.forEach(this.children_, function(child) {
    if (child instanceof webdriver.promise.Frame_) {
      child.cancelRemainingTasks(error);
    } else {
      // None of the previously registered listeners should be notified that
      // the task is being canceled, however, we need at least one errback
      // to prevent the cancellation from bubbling up.
      child.removeAll();
      child.thenCatch(goog.nullFunction);
      child.cancel(error);
    }
  });
};


/**
 * @return {webdriver.promise.Task_} The task currently executing
 *     within this frame, if any.
 */
webdriver.promise.Frame_.prototype.getPendingTask = function() {
  return this.pendingTask_;
};


/**
 * @param {webdriver.promise.Task_} task The task currently
 *     executing within this frame, if any.
 */
webdriver.promise.Frame_.prototype.setPendingTask = function(task) {
  this.pendingTask_ = task;
};


/** Locks this frame. */
webdriver.promise.Frame_.prototype.lockFrame = function() {
  this.isLocked_ = true;
};


/**
 * Adds a new node to this frame.
 * @param {!(webdriver.promise.Frame_|webdriver.promise.Task_)} node
 *     The node to insert.
 */
webdriver.promise.Frame_.prototype.addChild = function(node) {
  if (this.lastInsertedChild_ &&
      this.lastInsertedChild_ instanceof webdriver.promise.Frame_ &&
      !this.lastInsertedChild_.isLocked_) {
    this.lastInsertedChild_.addChild(node);
    return;
  }

  node.setParent(this);

  if (this.isActive_ && node instanceof webdriver.promise.Frame_) {
    var index = 0;
    if (this.lastInsertedChild_ instanceof
        webdriver.promise.Frame_) {
      index = goog.array.indexOf(this.children_, this.lastInsertedChild_) + 1;
    }
    goog.array.insertAt(this.children_, node, index);
    this.lastInsertedChild_ = node;
    return;
  }

  this.lastInsertedChild_ = node;
  this.children_.push(node);
};


/**
 * @return {(webdriver.promise.Frame_|webdriver.promise.Task_)} This frame's
 *     fist child.
 */
webdriver.promise.Frame_.prototype.getFirstChild = function() {
  this.isActive_ = true;
  this.lastInsertedChild_ = null;
  return this.children_[0];
};


/**
 * Removes a child from this frame.
 * @param {!(webdriver.promise.Frame_|webdriver.promise.Task_)} child
 *     The child to remove.
 */
webdriver.promise.Frame_.prototype.removeChild = function(child) {
  var index = goog.array.indexOf(this.children_, child);
  child.setParent(null);
  goog.array.removeAt(this.children_, index);
  if (this.lastInsertedChild_ === child) {
    this.lastInsertedChild_ = null;
  }
};


/** @override */
webdriver.promise.Frame_.prototype.toString = function() {
  return '[' + goog.array.map(this.children_, function(child) {
    return child.toString();
  }).join(', ') + ']';
};



/**
 * A task to be executed by a {@link webdriver.promise.ControlFlow}.
 *
 * @param {!webdriver.promise.ControlFlow} flow The flow this instances belongs
 *     to.
 * @param {!Function} fn The function to call when the task executes. If it
 *     returns a {@code webdriver.promise.Promise}, the flow will wait
 *     for it to be resolved before starting the next task.
 * @param {string} description A description of the task for debugging.
 * @param {!webdriver.stacktrace.Snapshot} snapshot A snapshot of the stack
 *     when this task was scheduled.
 * @constructor
 * @extends {webdriver.promise.Node_}
 * @private
 */
webdriver.promise.Task_ = function(flow, fn, description, snapshot) {
  webdriver.promise.Node_.call(this, flow);

  /**
   * Executes this task.
   * @type {!Function}
   */
  this.execute = fn;

  /** @private {string} */
  this.description_ = description;

  /** @private {!webdriver.stacktrace.Snapshot} */
  this.snapshot_ = snapshot;
};
goog.inherits(webdriver.promise.Task_, webdriver.promise.Node_);


/** @return {string} This task's description. */
webdriver.promise.Task_.prototype.getDescription = function() {
  return this.description_;
};


/** @override */
webdriver.promise.Task_.prototype.toString = function() {
  var stack = this.snapshot_.getStacktrace();
  var ret = this.description_;
  if (stack.length) {
    if (this.description_) {
      ret += '\n';
    }
    ret += stack.join('\n');
  }
  return ret;
};



/**
 * Special error used to signal when a task is canceled because a previous
 * task in the same frame failed.
 * @param {*} err The error that caused the task cancellation.
 * @constructor
 * @extends {goog.debug.Error}
 * @private
 */
webdriver.promise.CanceledTaskError_ = function(err) {
  goog.base(this, 'Task discarded due to a previous task failure: ' + err);
};
goog.inherits(webdriver.promise.CanceledTaskError_, goog.debug.Error);


/** @override */
webdriver.promise.CanceledTaskError_.prototype.name = 'CanceledTaskError';



/**
 * The default flow to use if no others are active.
 * @private {!webdriver.promise.ControlFlow}
 */
webdriver.promise.defaultFlow_ = new webdriver.promise.ControlFlow();


/**
 * A stack of active control flows, with the top of the stack used to schedule
 * commands. When there are multiple flows on the stack, the flow at index N
 * represents a callback triggered within a task owned by the flow at index
 * N-1.
 * @private {!Array.<!webdriver.promise.ControlFlow>}
 */
webdriver.promise.activeFlows_ = [];


/**
 * Changes the default flow to use when no others are active.
 * @param {!webdriver.promise.ControlFlow} flow The new default flow.
 * @throws {Error} If the default flow is not currently active.
 */
webdriver.promise.setDefaultFlow = function(flow) {
  if (webdriver.promise.activeFlows_.length) {
    throw Error('You may only change the default flow while it is active');
  }
  webdriver.promise.defaultFlow_ = flow;
};


/**
 * @return {!webdriver.promise.ControlFlow} The currently active control flow.
 */
webdriver.promise.controlFlow = function() {
  return /** @type {!webdriver.promise.ControlFlow} */ (
      goog.array.peek(webdriver.promise.activeFlows_) ||
      webdriver.promise.defaultFlow_);
};


/**
 * @param {!webdriver.promise.ControlFlow} flow The new flow.
 * @private
 */
webdriver.promise.pushFlow_ = function(flow) {
  webdriver.promise.activeFlows_.push(flow);
};


/** @private */
webdriver.promise.popFlow_ = function() {
  webdriver.promise.activeFlows_.pop();
};


/**
 * Creates a new control flow. The provided callback will be invoked as the
 * first task within the new flow, with the flow as its sole argument. Returns
 * a promise that resolves to the callback result.
 * @param {function(!webdriver.promise.ControlFlow)} callback The entry point
 *     to the newly created flow.
 * @return {!webdriver.promise.Promise} A promise that resolves to the callback
 *     result.
 */
webdriver.promise.createFlow = function(callback) {
  var flow = new webdriver.promise.ControlFlow(
      webdriver.promise.defaultFlow_.timer);
  return flow.execute(function() {
    return callback(flow);
  });
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('webdriver.Session');

goog.require('webdriver.Capabilities');



/**
 * Contains information about a WebDriver session.
 * @param {string} id The session ID.
 * @param {!(Object|webdriver.Capabilities)} capabilities The session
 *     capabilities.
 * @constructor
 */
webdriver.Session = function(id, capabilities) {

  /** @private {string} */
  this.id_ = id;

  /** @private {!webdriver.Capabilities} */
  this.caps_ = new webdriver.Capabilities().merge(capabilities);
};


/**
 * @return {string} This session's ID.
 */
webdriver.Session.prototype.getId = function() {
  return this.id_;
};


/**
 * @return {!webdriver.Capabilities} This session's capabilities.
 */
webdriver.Session.prototype.getCapabilities = function() {
  return this.caps_;
};


/**
 * Retrieves the value of a specific capability.
 * @param {string} key The capability to retrieve.
 * @return {*} The capability value.
 */
webdriver.Session.prototype.getCapability = function(key) {
  return this.caps_.get(key);
};


/**
 * Returns the JSON representation of this object, which is just the string
 * session ID.
 * @return {string} The JSON representation of this Session.
 */
webdriver.Session.prototype.toJSON = function() {
  return this.getId();
};
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
// Copyright 2012 Selenium comitters
// Copyright 2012 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tools for parsing and pretty printing error stack traces. This
 * file is based on goog.testing.stacktrace.
 */

goog.provide('webdriver.stacktrace');
goog.provide('webdriver.stacktrace.Snapshot');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.userAgent');



/**
 * Stores a snapshot of the stack trace at the time this instance was created.
 * The stack trace will always be adjusted to exclude this function call.
 * @param {number=} opt_slice The number of frames to remove from the top of
 *     the generated stack trace.
 * @constructor
 */
webdriver.stacktrace.Snapshot = function(opt_slice) {

  /** @private {number} */
  this.slice_ = opt_slice || 0;

  var error;
  if (webdriver.stacktrace.CAN_CAPTURE_STACK_TRACE_) {
    error = Error();
    Error.captureStackTrace(error, webdriver.stacktrace.Snapshot);
  } else {
    // Remove 1 extra frame for the call to this constructor.
    this.slice_ += 1;
    // IE will only create a stack trace when the Error is thrown.
    // We use null.x() to throw an exception instead of throw this.error_
    // because the closure compiler may optimize throws to a function call
    // in an attempt to minimize the binary size which in turn has the side
    // effect of adding an unwanted stack frame.
    try {
      null.x();
    } catch (e) {
      error = e;
    }
  }

  /**
   * The error's stacktrace.  This must be accessed immediately to ensure Opera
   * computes the context correctly.
   * @private {string}
   */
  this.stack_ = webdriver.stacktrace.getStack_(error);
};


/**
 * Whether the current environment supports the Error.captureStackTrace
 * function (as of 10/17/2012, only V8).
 * @private {boolean}
 * @const
 */
webdriver.stacktrace.CAN_CAPTURE_STACK_TRACE_ =
    goog.isFunction(Error.captureStackTrace);


/**
 * Whether the current browser supports stack traces.
 *
 * @type {boolean}
 * @const
 */
webdriver.stacktrace.BROWSER_SUPPORTED =
    webdriver.stacktrace.CAN_CAPTURE_STACK_TRACE_ || (function() {
      try {
        throw Error();
      } catch (e) {
        return !!e.stack;
      }
    })();


/**
 * The parsed stack trace. This list is lazily generated the first time it is
 * accessed.
 * @private {Array.<!webdriver.stacktrace.Frame>}
 */
webdriver.stacktrace.Snapshot.prototype.parsedStack_ = null;


/**
 * @return {!Array.<!webdriver.stacktrace.Frame>} The parsed stack trace.
 */
webdriver.stacktrace.Snapshot.prototype.getStacktrace = function() {
  if (goog.isNull(this.parsedStack_)) {
    this.parsedStack_ = webdriver.stacktrace.parse_(this.stack_);
    if (this.slice_) {
      this.parsedStack_ = goog.array.slice(this.parsedStack_, this.slice_);
    }
    delete this.slice_;
    delete this.stack_;
  }
  return this.parsedStack_;
};



/**
 * Class representing one stack frame.
 * @param {(string|undefined)} context Context object, empty in case of global
 *     functions or if the browser doesn't provide this information.
 * @param {(string|undefined)} name Function name, empty in case of anonymous
 *     functions.
 * @param {(string|undefined)} alias Alias of the function if available. For
 *     example the function name will be 'c' and the alias will be 'b' if the
 *     function is defined as <code>a.b = function c() {};</code>.
 * @param {(string|undefined)} path File path or URL including line number and
 *     optionally column number separated by colons.
 * @constructor
 */
webdriver.stacktrace.Frame = function(context, name, alias, path) {

  /** @private {string} */
  this.context_ = context || '';

  /** @private {string} */
  this.name_ = name || '';

  /** @private {string} */
  this.alias_ = alias || '';

  /** @private {string} */
  this.path_ = path || '';

  /** @private {string} */
  this.url_ = this.path_;

  /** @private {number} */
  this.line_ = -1;

  /** @private {number} */
  this.column_ = -1;

  if (path) {
    var match = /:(\d+)(?::(\d+))?$/.exec(path);
    if (match) {
      this.line_ = Number(match[1]);
      this.column = Number(match[2] || -1);
      this.url_ = path.substr(0, match.index);
    }
  }
};


/**
 * Constant for an anonymous frame.
 * @private {!webdriver.stacktrace.Frame}
 * @const
 */
webdriver.stacktrace.ANONYMOUS_FRAME_ =
    new webdriver.stacktrace.Frame('', '', '', '');


/**
 * @return {string} The function name or empty string if the function is
 *     anonymous and the object field which it's assigned to is unknown.
 */
webdriver.stacktrace.Frame.prototype.getName = function() {
  return this.name_;
};


/**
 * @return {string} The url or empty string if it is unknown.
 */
webdriver.stacktrace.Frame.prototype.getUrl = function() {
  return this.url_;
};


/**
 * @return {number} The line number if known or -1 if it is unknown.
 */
webdriver.stacktrace.Frame.prototype.getLine = function() {
  return this.line_;
};


/**
 * @return {number} The column number if known and -1 if it is unknown.
 */
webdriver.stacktrace.Frame.prototype.getColumn = function() {
  return this.column_;
};


/**
 * @return {boolean} Whether the stack frame contains an anonymous function.
 */
webdriver.stacktrace.Frame.prototype.isAnonymous = function() {
  return !this.name_ || this.context_ == '[object Object]';
};


/**
 * Converts this frame to its string representation using V8's stack trace
 * format: http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 * @return {string} The string representation of this frame.
 * @override
 */
webdriver.stacktrace.Frame.prototype.toString = function() {
  var context = this.context_;
  if (context && context !== 'new ') {
    context += '.';
  }
  context += this.name_;
  context += this.alias_ ? ' [as ' + this.alias_ + ']' : '';

  var path = this.path_ || '<anonymous>';
  return '    at ' + (context ? context + ' (' + path + ')' : path);
};


/**
 * Maximum length of a string that can be matched with a RegExp on
 * Firefox 3x. Exceeding this approximate length will cause string.match
 * to exceed Firefox's stack quota. This situation can be encountered
 * when goog.globalEval is invoked with a long argument; such as
 * when loading a module.
 * @private {number}
 * @const
 */
webdriver.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_ = 500000;


/**
 * RegExp pattern for JavaScript identifiers. We don't support Unicode
 * identifiers defined in ECMAScript v3.
 * @private {string}
 * @const
 */
webdriver.stacktrace.IDENTIFIER_PATTERN_ = '[a-zA-Z_$][\\w$]*';


/**
 * Pattern for a matching the type on a fully-qualified name. Forms an
 * optional sub-match on the type. For example, in "foo.bar.baz", will match on
 * "foo.bar".
 * @private {string}
 * @const
 */
webdriver.stacktrace.CONTEXT_PATTERN_ =
    '(' + webdriver.stacktrace.IDENTIFIER_PATTERN_ +
    '(?:\\.' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + ')*)\\.';


/**
 * Pattern for matching a fully qualified name. Will create two sub-matches:
 * the type (optional), and the name. For example, in "foo.bar.baz", will
 * match on ["foo.bar", "baz"].
 * @private {string}
 * @const
 */
webdriver.stacktrace.QUALIFIED_NAME_PATTERN_ =
    '(?:' + webdriver.stacktrace.CONTEXT_PATTERN_ + ')?' +
    '(' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + ')';


/**
 * RegExp pattern for function name alias in the V8 stack trace.
 * @private {string}
 * @const
 */
webdriver.stacktrace.V8_ALIAS_PATTERN_ =
    '(?: \\[as (' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + ')\\])?';


/**
 * RegExp pattern for function names and constructor calls in the V8 stack
 * trace.
 * @private {string}
 * @const
 */
webdriver.stacktrace.V8_FUNCTION_NAME_PATTERN_ =
    '(?:' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + '|<anonymous>)';


/**
 * RegExp pattern for the context of a function call in V8. Creates two
 * submatches, only one of which will ever match: either the namespace
 * identifier (with optional "new" keyword in the case of a constructor call),
 * or just the "new " phrase for a top level constructor call.
 * @private {string}
 * @const
 */
webdriver.stacktrace.V8_CONTEXT_PATTERN_ =
    '(?:((?:new )?(?:\\[object Object\\]|' +
    webdriver.stacktrace.IDENTIFIER_PATTERN_ +
    '(?:\\.' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + ')*)' +
    ')\\.|(new ))';


/**
 * RegExp pattern for function call in the V8 stack trace.
 * Creates 3 submatches with context object (optional), function name and
 * function alias (optional).
 * @private {string}
 * @const
 */
webdriver.stacktrace.V8_FUNCTION_CALL_PATTERN_ =
    ' (?:' + webdriver.stacktrace.V8_CONTEXT_PATTERN_ + ')?' +
    '(' + webdriver.stacktrace.V8_FUNCTION_NAME_PATTERN_ + ')' +
    webdriver.stacktrace.V8_ALIAS_PATTERN_;


/**
 * RegExp pattern for an URL + position inside the file.
 * @private {string}
 * @const
 */
webdriver.stacktrace.URL_PATTERN_ =
    '((?:http|https|file)://[^\\s]+|javascript:.*)';


/**
 * RegExp pattern for a location string in a V8 stack frame. Creates two
 * submatches for the location, one for enclosed in parentheticals and on
 * where the location appears alone (which will only occur if the location is
 * the only information in the frame).
 * @private {string}
 * @const
 * @see http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 */
webdriver.stacktrace.V8_LOCATION_PATTERN_ = ' (?:\\((.*)\\)|(.*))';


/**
 * Regular expression for parsing one stack frame in V8.
 * @private {!RegExp}
 * @const
 */
webdriver.stacktrace.V8_STACK_FRAME_REGEXP_ = new RegExp('^    at' +
    '(?:' + webdriver.stacktrace.V8_FUNCTION_CALL_PATTERN_ + ')?' +
    webdriver.stacktrace.V8_LOCATION_PATTERN_ + '$');


/**
 * RegExp pattern for function names in the Firefox stack trace.
 * Firefox has extended identifiers to deal with inner functions and anonymous
 * functions: https://bugzilla.mozilla.org/show_bug.cgi?id=433529#c9
 * @private {string}
 * @const
 */
webdriver.stacktrace.FIREFOX_FUNCTION_NAME_PATTERN_ =
    webdriver.stacktrace.IDENTIFIER_PATTERN_ + '[\\w./<$]*';


/**
 * RegExp pattern for function call in the Firefox stack trace.
 * Creates a submatch for the function name.
 * @private {string}
 * @const
 */
webdriver.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ =
    '(' + webdriver.stacktrace.FIREFOX_FUNCTION_NAME_PATTERN_ + ')?' +
    '(?:\\(.*\\))?@';


/**
 * Regular expression for parsing one stack frame in Firefox.
 * @private {!RegExp}
 * @const
 */
webdriver.stacktrace.FIREFOX_STACK_FRAME_REGEXP_ = new RegExp('^' +
    webdriver.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ +
    '(?::0|' + webdriver.stacktrace.URL_PATTERN_ + ')$');


/**
 * RegExp pattern for an anonymous function call in an Opera stack frame.
 * Creates 2 (optional) submatches: the context object and function name.
 * @private {string}
 * @const
 */
webdriver.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ =
    '<anonymous function(?:\\: ' +
    webdriver.stacktrace.QUALIFIED_NAME_PATTERN_ + ')?>';


/**
 * RegExp pattern for a function call in an Opera stack frame.
 * Creates 3 (optional) submatches: the function name (if not anonymous),
 * the aliased context object and the function name (if anonymous).
 * @private {string}
 * @const
 */
webdriver.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ =
    '(?:(?:(' + webdriver.stacktrace.IDENTIFIER_PATTERN_ + ')|' +
    webdriver.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ +
    ')(?:\\(.*\\)))?@';


/**
 * Regular expression for parsing on stack frame in Opera 11.68+
 * @private {!RegExp}
 * @const
 */
webdriver.stacktrace.OPERA_STACK_FRAME_REGEXP_ = new RegExp('^' +
    webdriver.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ +
    webdriver.stacktrace.URL_PATTERN_ + '?$');


/**
 * RegExp pattern for function call in a Chakra (IE) stack trace. This
 * expression allows for identifiers like 'Anonymous function', 'eval code',
 * and 'Global code'.
 * @private {string}
 * @const
 */
webdriver.stacktrace.CHAKRA_FUNCTION_CALL_PATTERN_ = '(' +
    webdriver.stacktrace.IDENTIFIER_PATTERN_ + '(?:\\s+\\w+)*)';


/**
 * Regular expression for parsing on stack frame in Chakra (IE).
 * @private {!RegExp}
 * @const
 */
webdriver.stacktrace.CHAKRA_STACK_FRAME_REGEXP_ = new RegExp('^   at ' +
    webdriver.stacktrace.CHAKRA_FUNCTION_CALL_PATTERN_ +
    '\\s*(?:\\((.*)\\))$');


/**
 * Placeholder for an unparsable frame in a stack trace generated by
 * {@link goog.testing.stacktrace}.
 * @private {string}
 * @const
 */
webdriver.stacktrace.UNKNOWN_CLOSURE_FRAME_ = '> (unknown)';


/**
 * Representation of an anonymous frame in a stack trace generated by
 * {@link goog.testing.stacktrace}.
 * @private {string}
 * @const
 */
webdriver.stacktrace.ANONYMOUS_CLOSURE_FRAME_ = '> anonymous';


/**
 * Pattern for a function call in a Closure stack trace. Creates three optional
 * submatches: the context, function name, and alias.
 * @private {string}
 * @const
 */
webdriver.stacktrace.CLOSURE_FUNCTION_CALL_PATTERN_ =
    webdriver.stacktrace.QUALIFIED_NAME_PATTERN_ +
    '(?:\\(.*\\))?' +  // Ignore arguments if present.
    webdriver.stacktrace.V8_ALIAS_PATTERN_;


/**
 * Regular expression for parsing a stack frame generated by Closure's
 * {@link goog.testing.stacktrace}.
 * @private {!RegExp}
 * @const
 */
webdriver.stacktrace.CLOSURE_STACK_FRAME_REGEXP_ = new RegExp('^> ' +
    '(?:' + webdriver.stacktrace.CLOSURE_FUNCTION_CALL_PATTERN_ +
    '(?: at )?)?' +
    '(?:(.*:\\d+:\\d+)|' + webdriver.stacktrace.URL_PATTERN_ + ')?$');


/**
 * Parses one stack frame.
 * @param {string} frameStr The stack frame as string.
 * @return {webdriver.stacktrace.Frame} Stack frame object or null if the
 *     parsing failed.
 * @private
 */
webdriver.stacktrace.parseStackFrame_ = function(frameStr) {
  var m = frameStr.match(webdriver.stacktrace.V8_STACK_FRAME_REGEXP_);
  if (m) {
    return new webdriver.stacktrace.Frame(
        m[1] || m[2], m[3], m[4], m[5] || m[6]);
  }

  if (frameStr.length >
      webdriver.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_) {
    return webdriver.stacktrace.parseLongFirefoxFrame_(frameStr);
  }

  m = frameStr.match(webdriver.stacktrace.FIREFOX_STACK_FRAME_REGEXP_);
  if (m) {
    return new webdriver.stacktrace.Frame('', m[1], '', m[2]);
  }

  m = frameStr.match(webdriver.stacktrace.OPERA_STACK_FRAME_REGEXP_);
  if (m) {
    return new webdriver.stacktrace.Frame(m[2], m[1] || m[3], '', m[4]);
  }

  m = frameStr.match(webdriver.stacktrace.CHAKRA_STACK_FRAME_REGEXP_);
  if (m) {
    return new webdriver.stacktrace.Frame('', m[1], '', m[2]);
  }

  if (frameStr == webdriver.stacktrace.UNKNOWN_CLOSURE_FRAME_ ||
      frameStr == webdriver.stacktrace.ANONYMOUS_CLOSURE_FRAME_) {
    return webdriver.stacktrace.ANONYMOUS_FRAME_;
  }

  m = frameStr.match(webdriver.stacktrace.CLOSURE_STACK_FRAME_REGEXP_);
  if (m) {
    return new webdriver.stacktrace.Frame(m[1], m[2], m[3], m[4] || m[5]);
  }

  return null;
};


/**
 * Parses a long firefox stack frame.
 * @param {string} frameStr The stack frame as string.
 * @return {!webdriver.stacktrace.Frame} Stack frame object.
 * @private
 */
webdriver.stacktrace.parseLongFirefoxFrame_ = function(frameStr) {
  var firstParen = frameStr.indexOf('(');
  var lastAmpersand = frameStr.lastIndexOf('@');
  var lastColon = frameStr.lastIndexOf(':');
  var functionName = '';
  if ((firstParen >= 0) && (firstParen < lastAmpersand)) {
    functionName = frameStr.substring(0, firstParen);
  }
  var loc = '';
  if ((lastAmpersand >= 0) && (lastAmpersand + 1 < lastColon)) {
    loc = frameStr.substring(lastAmpersand + 1);
  }
  return new webdriver.stacktrace.Frame('', functionName, '', loc);
};


/**
 * Get an error's stack trace with the error string trimmed.
 * V8 prepends the string representation of an error to its stack trace.
 * This function trims the string so that the stack trace can be parsed
 * consistently with the other JS engines.
 * @param {!(Error|goog.testing.JsUnitException)} error The error.
 * @return {string} The stack trace string.
 * @private
 */
webdriver.stacktrace.getStack_ = function(error) {
  var stack = error.stack || error.stackTrace || '';
  var errorStr = error + '\n';
  if (goog.string.startsWith(stack, errorStr)) {
    stack = stack.substring(errorStr.length);
  }
  return stack;
};


/**
 * Formats an error's stack trace.
 * @param {!(Error|goog.testing.JsUnitException)} error The error to format.
 * @return {!(Error|goog.testing.JsUnitException)} The formatted error.
 */
webdriver.stacktrace.format = function(error) {
  var stack = webdriver.stacktrace.getStack_(error);
  var frames = webdriver.stacktrace.parse_(stack);

  // Older versions of IE simply return [object Error] for toString(), so
  // only use that as a last resort.
  var errorStr = '';
  if (error.message) {
    errorStr = (error.name ? error.name + ': ' : '') + error.message;
  } else {
    errorStr = error.toString();
  }

  // Ensure the error is in the V8 style with the error's string representation
  // prepended to the stack.
  error.stack = errorStr + '\n' + frames.join('\n');
  return error;
};


/**
 * Parses an Error object's stack trace.
 * @param {string} stack The stack trace.
 * @return {!Array.<!webdriver.stacktrace.Frame>} Stack frames. The
 *     unrecognized frames will be nulled out.
 * @private
 */
webdriver.stacktrace.parse_ = function(stack) {
  if (!stack) {
    return [];
  }

  var lines = stack.
      replace(/\s*$/, '').
      split('\n');
  var frames = [];
  for (var i = 0; i < lines.length; i++) {
    var frame = webdriver.stacktrace.parseStackFrame_(lines[i]);
    // The first two frames will be:
    //   webdriver.stacktrace.Snapshot()
    //   webdriver.stacktrace.get()
    // In the case of Opera, sometimes an extra frame is injected in the next
    // frame with a reported line number of zero. The next line detects that
    // case and skips that frame.
    if (!(goog.userAgent.OPERA && i == 2 && frame.getLine() == 0)) {
      frames.push(frame || webdriver.stacktrace.ANONYMOUS_FRAME_);
    }
  }
  return frames;
};


/**
 * Gets the native stack trace if available otherwise follows the call chain.
 * The generated trace will exclude all frames up to and including the call to
 * this function.
 * @return {!Array.<!webdriver.stacktrace.Frame>} The frames of the stack trace.
 */
webdriver.stacktrace.get = function() {
  return new webdriver.stacktrace.Snapshot(1).getStacktrace();
};
// Copyright 2011 Software Freedom Conservancy. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview The heart of the WebDriver JavaScript API.
 */

goog.provide('webdriver.Alert');
goog.provide('webdriver.UnhandledAlertError');
goog.provide('webdriver.WebDriver');
goog.provide('webdriver.WebElement');

goog.require('bot.Error');
goog.require('bot.ErrorCode');
goog.require('bot.response');
goog.require('goog.array');
goog.require('goog.object');
goog.require('webdriver.ActionSequence');
goog.require('webdriver.Command');
goog.require('webdriver.CommandName');
goog.require('webdriver.Key');
goog.require('webdriver.Locator');
goog.require('webdriver.Session');
goog.require('webdriver.logging');
goog.require('webdriver.promise');


//////////////////////////////////////////////////////////////////////////////
//
//  webdriver.WebDriver
//
//////////////////////////////////////////////////////////////////////////////



/**
 * Creates a new WebDriver client, which provides control over a browser.
 *
 * Every WebDriver command returns a {@code webdriver.promise.Promise} that
 * represents the result of that command. Callbacks may be registered on this
 * object to manipulate the command result or catch an expected error. Any
 * commands scheduled with a callback are considered sub-commands and will
 * execute before the next command in the current frame. For example:
 * <pre><code>
 *   var message = [];
 *   driver.call(message.push, message, 'a').then(function() {
 *     driver.call(message.push, message, 'b');
 *   });
 *   driver.call(message.push, message, 'c');
 *   driver.call(function() {
 *     alert('message is abc? ' + (message.join('') == 'abc'));
 *   });
 * </code></pre>
 *
 * @param {!(webdriver.Session|webdriver.promise.Promise)} session Either a
 *     known session or a promise that will be resolved to a session.
 * @param {!webdriver.CommandExecutor} executor The executor to use when
 *     sending commands to the browser.
 * @param {webdriver.promise.ControlFlow=} opt_flow The flow to
 *     schedule commands through. Defaults to the active flow object.
 * @constructor
 */
webdriver.WebDriver = function(session, executor, opt_flow) {

  /** @private {!(webdriver.Session|webdriver.promise.Promise)} */
  this.session_ = session;

  /** @private {!webdriver.CommandExecutor} */
  this.executor_ = executor;

  /** @private {!webdriver.promise.ControlFlow} */
  this.flow_ = opt_flow || webdriver.promise.controlFlow();
};


/**
 * Creates a new WebDriver client for an existing session.
 * @param {!webdriver.CommandExecutor} executor Command executor to use when
 *     querying for session details.
 * @param {string} sessionId ID of the session to attach to.
 * @return {!webdriver.WebDriver} A new client for the specified session.
 */
webdriver.WebDriver.attachToSession = function(executor, sessionId) {
  return webdriver.WebDriver.acquireSession_(executor,
      new webdriver.Command(webdriver.CommandName.DESCRIBE_SESSION).
          setParameter('sessionId', sessionId),
      'WebDriver.attachToSession()');
};


/**
 * Creates a new WebDriver session.
 * @param {!webdriver.CommandExecutor} executor The executor to create the new
 *     session with.
 * @param {!webdriver.Capabilities} desiredCapabilities The desired
 *     capabilities for the new session.
 * @return {!webdriver.WebDriver} The driver for the newly created session.
 */
webdriver.WebDriver.createSession = function(executor, desiredCapabilities) {
  return webdriver.WebDriver.acquireSession_(executor,
      new webdriver.Command(webdriver.CommandName.NEW_SESSION).
          setParameter('desiredCapabilities', desiredCapabilities),
      'WebDriver.createSession()');
};


/**
 * Sends a command to the server that is expected to return the details for a
 * {@link webdriver.Session}. This may either be an existing session, or a
 * newly created one.
 * @param {!webdriver.CommandExecutor} executor Command executor to use when
 *     querying for session details.
 * @param {!webdriver.Command} command The command to send to fetch the session
 *     details.
 * @param {string} description A descriptive debug label for this action.
 * @return {!webdriver.WebDriver} A new WebDriver client for the session.
 * @private
 */
webdriver.WebDriver.acquireSession_ = function(executor, command, description) {
  var session = webdriver.promise.controlFlow().execute(function() {
    return webdriver.WebDriver.executeCommand_(executor, command).
        then(function(response) {
          bot.response.checkResponse(response);
          return new webdriver.Session(response['sessionId'],
              response['value']);
        });
  }, description);
  return new webdriver.WebDriver(session, executor);
};


/**
 * Converts an object to its JSON representation in the WebDriver wire protocol.
 * When converting values of type object, the following steps will be taken:
 * <ol>
 * <li>if the object provides a "toWireValue" function, the return value will
 *     be returned in its fully resolved state (e.g. this function may return
 *     promise values)</li>
 * <li>if the object provides a "toJSON" function, the return value of this
 *     function will be returned</li>
 * <li>otherwise, the value of each key will be recursively converted according
 *     to the rules above.</li>
 * </ol>
 *
 * @param {*} obj The object to convert.
 * @return {!webdriver.promise.Promise} A promise that will resolve to the
 *     input value's JSON representation.
 * @private
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol
 */
webdriver.WebDriver.toWireValue_ = function(obj) {
  switch (goog.typeOf(obj)) {
    case 'array':
      return webdriver.promise.fullyResolved(
          goog.array.map(/** @type {!Array} */ (obj),
              webdriver.WebDriver.toWireValue_));
    case 'object':
      if (goog.isFunction(obj.toWireValue)) {
        return webdriver.promise.fullyResolved(obj.toWireValue());
      }
      if (goog.isFunction(obj.toJSON)) {
        return webdriver.promise.fulfilled(obj.toJSON());
      }
      if (goog.isNumber(obj.nodeType) && goog.isString(obj.nodeName)) {
        throw Error([
          'Invalid argument type: ', obj.nodeName, '(', obj.nodeType, ')'
        ].join(''));
      }
      return webdriver.promise.fullyResolved(
          goog.object.map(/** @type {!Object} */ (obj),
              webdriver.WebDriver.toWireValue_));
    case 'function':
      return webdriver.promise.fulfilled('' + obj);
    case 'undefined':
      return webdriver.promise.fulfilled(null);
    default:
      return webdriver.promise.fulfilled(obj);
  }
};


/**
 * Converts a value from its JSON representation according to the WebDriver wire
 * protocol. Any JSON object containing a
 * {@code webdriver.WebElement.ELEMENT_KEY} key will be decoded to a
 * {@code webdriver.WebElement} object. All other values will be passed through
 * as is.
 * @param {!webdriver.WebDriver} driver The driver instance to use as the
 *     parent of any unwrapped {@code webdriver.WebElement} values.
 * @param {*} value The value to convert.
 * @return {*} The converted value.
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol
 * @private
 */
webdriver.WebDriver.fromWireValue_ = function(driver, value) {
  if (goog.isArray(value)) {
    value = goog.array.map(/**@type {goog.array.ArrayLike}*/ (value),
        goog.partial(webdriver.WebDriver.fromWireValue_, driver));
  } else if (value && goog.isObject(value) && !goog.isFunction(value)) {
    if (webdriver.WebElement.ELEMENT_KEY in value) {
      value = new webdriver.WebElement(driver,
          value[webdriver.WebElement.ELEMENT_KEY]);
    } else {
      value = goog.object.map(/**@type {!Object}*/ (value),
          goog.partial(webdriver.WebDriver.fromWireValue_, driver));
    }
  }
  return value;
};


/**
 * Translates a command to its wire-protocol representation before passing it
 * to the given {@code executor} for execution.
 * @param {!webdriver.CommandExecutor} executor The executor to use.
 * @param {!webdriver.Command} command The command to execute.
 * @return {!webdriver.promise.Promise} A promise that will resolve with the
 *     command response.
 * @private
 */
webdriver.WebDriver.executeCommand_ = function(executor, command) {
  return webdriver.promise.fullyResolved(command.getParameters()).
      then(webdriver.WebDriver.toWireValue_).
      then(function(parameters) {
        command.setParameters(parameters);
        return webdriver.promise.checkedNodeCall(
            goog.bind(executor.execute, executor, command));
      });
};


/**
 * @return {!webdriver.promise.ControlFlow} The control flow used by this
 *     instance.
 */
webdriver.WebDriver.prototype.controlFlow = function() {
  return this.flow_;
};


/**
 * Schedules a {@code webdriver.Command} to be executed by this driver's
 * {@code webdriver.CommandExecutor}.
 * @param {!webdriver.Command} command The command to schedule.
 * @param {string} description A description of the command for debugging.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     the command result.
 */
webdriver.WebDriver.prototype.schedule = function(command, description) {
  var self = this;

  checkHasNotQuit();
  command.setParameter('sessionId', this.session_);

  var flow = this.flow_;
  return flow.execute(function() {
    // A call to WebDriver.quit() may have been scheduled in the same event
    // loop as this |command|, which would prevent us from detecting that the
    // driver has quit above.  Therefore, we need to make another quick check.
    // We still check above so we can fail as early as possible.
    checkHasNotQuit();
    return webdriver.WebDriver.executeCommand_(self.executor_, command);
  }, description).then(function(response) {
    try {
      bot.response.checkResponse(response);
    } catch (ex) {
      var value = response['value'];
      if (ex.code === bot.ErrorCode.MODAL_DIALOG_OPENED) {
        var text = value && value['alert'] ? value['alert']['text'] : '';
        throw new webdriver.UnhandledAlertError(ex.message,
            new webdriver.Alert(self, text));
      }
      throw ex;
    }
    return webdriver.WebDriver.fromWireValue_(self, response['value']);
  });

  function checkHasNotQuit() {
    if (!self.session_) {
      throw new Error('This driver instance does not have a valid session ID ' +
                      '(did you call WebDriver.quit()?) and may no longer be ' +
                      'used.');
    }
  }
};


// ----------------------------------------------------------------------------
// Client command functions:
// ----------------------------------------------------------------------------


/**
 * @return {!webdriver.promise.Promise} A promise for this client's session.
 */
webdriver.WebDriver.prototype.getSession = function() {
  return webdriver.promise.when(this.session_);
};


/**
 * @return {!webdriver.promise.Promise} A promise that will resolve with the
 *     this instance's capabilities.
 */
webdriver.WebDriver.prototype.getCapabilities = function() {
  return webdriver.promise.when(this.session_, function(session) {
    return session.getCapabilities();
  });
};


/**
 * Schedules a command to quit the current session. After calling quit, this
 * instance will be invalidated and may no longer be used to issue commands
 * against the browser.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     the command has completed.
 */
webdriver.WebDriver.prototype.quit = function() {
  var result = this.schedule(
      new webdriver.Command(webdriver.CommandName.QUIT),
      'WebDriver.quit()');
  // Delete our session ID when the quit command finishes; this will allow us to
  // throw an error when attemnpting to use a driver post-quit.
  return result.thenFinally(goog.bind(function() {
    delete this.session_;
  }, this));
};


/**
 * Creates a new action sequence using this driver. The sequence will not be
 * scheduled for execution until {@link webdriver.ActionSequence#perform} is
 * called. Example:
 * <pre><code>
 *   driver.actions().
 *       mouseDown(element1).
 *       mouseMove(element2).
 *       mouseUp().
 *       perform();
 * </code></pre>
 * @return {!webdriver.ActionSequence} A new action sequence for this instance.
 */
webdriver.WebDriver.prototype.actions = function() {
  return new webdriver.ActionSequence(this);
};


/**
 * Schedules a command to execute JavaScript in the context of the currently
 * selected frame or window. The script fragment will be executed as the body
 * of an anonymous function. If the script is provided as a function object,
 * that function will be converted to a string for injection into the target
 * window.
 *
 * Any arguments provided in addition to the script will be included as script
 * arguments and may be referenced using the {@code arguments} object.
 * Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
 * Arrays and objects may also be used as script arguments as long as each item
 * adheres to the types previously mentioned.
 *
 * The script may refer to any variables accessible from the current window.
 * Furthermore, the script will execute in the window's context, thus
 * {@code document} may be used to refer to the current document. Any local
 * variables will not be available once the script has finished executing,
 * though global variables will persist.
 *
 * If the script has a return value (i.e. if the script contains a return
 * statement), then the following steps will be taken for resolving this
 * functions return value:
 * <ul>
 * <li>For a HTML element, the value will resolve to a
 *     {@code webdriver.WebElement}</li>
 * <li>Null and undefined return values will resolve to null</li>
 * <li>Booleans, numbers, and strings will resolve as is</li>
 * <li>Functions will resolve to their string representation</li>
 * <li>For arrays and objects, each member item will be converted according to
 *     the rules above</li>
 * </ul>
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!webdriver.promise.Promise} A promise that will resolve to the
 *    scripts return value.
 */
webdriver.WebDriver.prototype.executeScript = function(script, var_args) {
  if (goog.isFunction(script)) {
    script = 'return (' + script + ').apply(null, arguments);';
  }
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.EXECUTE_SCRIPT).
          setParameter('script', script).
          setParameter('args', goog.array.slice(arguments, 1)),
      'WebDriver.executeScript()');
};


/**
 * Schedules a command to execute asynchronous JavaScript in the context of the
 * currently selected frame or window. The script fragment will be executed as
 * the body of an anonymous function. If the script is provided as a function
 * object, that function will be converted to a string for injection into the
 * target window.
 *
 * Any arguments provided in addition to the script will be included as script
 * arguments and may be referenced using the {@code arguments} object.
 * Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
 * Arrays and objects may also be used as script arguments as long as each item
 * adheres to the types previously mentioned.
 *
 * Unlike executing synchronous JavaScript with
 * {@code webdriver.WebDriver.prototype.executeScript}, scripts executed with
 * this function must explicitly signal they are finished by invoking the
 * provided callback. This callback will always be injected into the
 * executed function as the last argument, and thus may be referenced with
 * {@code arguments[arguments.length - 1]}. The following steps will be taken
 * for resolving this functions return value against the first argument to the
 * script's callback function:
 * <ul>
 * <li>For a HTML element, the value will resolve to a
 *     {@code webdriver.WebElement}</li>
 * <li>Null and undefined return values will resolve to null</li>
 * <li>Booleans, numbers, and strings will resolve as is</li>
 * <li>Functions will resolve to their string representation</li>
 * <li>For arrays and objects, each member item will be converted according to
 *     the rules above</li>
 * </ul>
 *
 * Example #1: Performing a sleep that is synchronized with the currently
 * selected window:
 * <code><pre>
 * var start = new Date().getTime();
 * driver.executeAsyncScript(
 *     'window.setTimeout(arguments[arguments.length - 1], 500);').
 *     then(function() {
 *       console.log('Elapsed time: ' + (new Date().getTime() - start) + ' ms');
 *     });
 * </pre></code>
 *
 * Example #2: Synchronizing a test with an AJAX application:
 * <code><pre>
 * var button = driver.findElement(By.id('compose-button'));
 * button.click();
 * driver.executeAsyncScript(
 *     'var callback = arguments[arguments.length - 1];' +
 *     'mailClient.getComposeWindowWidget().onload(callback);');
 * driver.switchTo().frame('composeWidget');
 * driver.findElement(By.id('to')).sendKEys('dog@example.com');
 * </pre></code>
 *
 * Example #3: Injecting a XMLHttpRequest and waiting for the result. In this
 * example, the inject script is specified with a function literal. When using
 * this format, the function is converted to a string for injection, so it
 * should not reference any symbols not defined in the scope of the page under
 * test.
 * <code><pre>
 * driver.executeAsyncScript(function() {
 *   var callback = arguments[arguments.length - 1];
 *   var xhr = new XMLHttpRequest();
 *   xhr.open("GET", "/resource/data.json", true);
 *   xhr.onreadystatechange = function() {
 *     if (xhr.readyState == 4) {
 *       callback(xhr.resposneText);
 *     }
 *   }
 *   xhr.send('');
 * }).then(function(str) {
 *   console.log(JSON.parse(str)['food']);
 * });
 * </pre></code>
 *
 * @param {!(string|Function)} script The script to execute.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!webdriver.promise.Promise} A promise that will resolve to the
 *    scripts return value.
 */
webdriver.WebDriver.prototype.executeAsyncScript = function(script, var_args) {
  if (goog.isFunction(script)) {
    script = 'return (' + script + ').apply(null, arguments);';
  }
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.EXECUTE_ASYNC_SCRIPT).
          setParameter('script', script).
          setParameter('args', goog.array.slice(arguments, 1)),
      'WebDriver.executeScript()');
};


/**
 * Schedules a command to execute a custom function.
 * @param {!Function} fn The function to execute.
 * @param {Object=} opt_scope The object in whose scope to execute the function.
 * @param {...*} var_args Any arguments to pass to the function.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     function's result.
 */
webdriver.WebDriver.prototype.call = function(fn, opt_scope, var_args) {
  var args = goog.array.slice(arguments, 2);
  var flow = this.flow_;
  return flow.execute(function() {
    return webdriver.promise.fullyResolved(args).then(function(args) {
      return fn.apply(opt_scope, args);
    });
  }, 'WebDriver.call(' + (fn.name || 'function') + ')');
};


/**
 * Schedules a command to wait for a condition to hold, as defined by some
 * user supplied function. If any errors occur while evaluating the wait, they
 * will be allowed to propagate.
 * @param {function():boolean} fn The function to evaluate as a wait condition.
 * @param {number} timeout How long to wait for the condition to be true.
 * @param {string=} opt_message An optional message to use if the wait times
 *     out.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     wait condition has been satisfied.
 */
webdriver.WebDriver.prototype.wait = function(fn, timeout, opt_message) {
  return this.flow_.wait(fn, timeout, opt_message);
};


/**
 * Schedules a command to make the driver sleep for the given amount of time.
 * @param {number} ms The amount of time, in milliseconds, to sleep.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     sleep has finished.
 */
webdriver.WebDriver.prototype.sleep = function(ms) {
  return this.flow_.timeout(ms, 'WebDriver.sleep(' + ms + ')');
};


/**
 * Schedules a command to retrieve they current window handle.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     current window handle.
 */
webdriver.WebDriver.prototype.getWindowHandle = function() {
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.GET_CURRENT_WINDOW_HANDLE),
      'WebDriver.getWindowHandle()');
};


/**
 * Schedules a command to retrieve the current list of available window handles.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with an
 *     array of window handles.
 */
webdriver.WebDriver.prototype.getAllWindowHandles = function() {
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.GET_WINDOW_HANDLES),
      'WebDriver.getAllWindowHandles()');
};


/**
 * Schedules a command to retrieve the current page's source. The page source
 * returned is a representation of the underlying DOM: do not expect it to be
 * formatted or escaped in the same way as the response sent from the web
 * server.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     current page source.
 */
webdriver.WebDriver.prototype.getPageSource = function() {
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.GET_PAGE_SOURCE),
      'WebDriver.getAllWindowHandles()');
};


/**
 * Schedules a command to close the current window.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     this command has completed.
 */
webdriver.WebDriver.prototype.close = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.CLOSE),
                       'WebDriver.close()');
};


/**
 * Schedules a command to navigate to the given URL.
 * @param {string} url The fully qualified URL to open.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     document has finished loading.
 */
webdriver.WebDriver.prototype.get = function(url) {
  return this.navigate().to(url);
};


/**
 * Schedules a command to retrieve the URL of the current page.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     current URL.
 */
webdriver.WebDriver.prototype.getCurrentUrl = function() {
  return this.schedule(
      new webdriver.Command(webdriver.CommandName.GET_CURRENT_URL),
      'WebDriver.getCurrentUrl()');
};


/**
 * Schedules a command to retrieve the current page's title.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     current page's title.
 */
webdriver.WebDriver.prototype.getTitle = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.GET_TITLE),
                       'WebDriver.getTitle()');
};


/**
 * Schedule a command to find an element on the page. If the element cannot be
 * found, a {@link bot.ErrorCode.NO_SUCH_ELEMENT} result will be returned
 * by the driver. Unlike other commands, this error cannot be suppressed. In
 * other words, scheduling a command to find an element doubles as an assert
 * that the element is present on the page. To test whether an element is
 * present on the page, use {@link #isElementPresent} instead.
 *
 * <p>The search criteria for an element may be defined using one of the
 * factories in the {@link webdriver.By} namespace, or as a short-hand
 * {@link webdriver.By.Hash} object. For example, the following two statements
 * are equivalent:
 * <code><pre>
 * var e1 = driver.findElement(By.id('foo'));
 * var e2 = driver.findElement({id:'foo'});
 * </pre></code>
 *
 * <p>You may also provide a custom locator function, which takes as input
 * this WebDriver instance and returns a {@link webdriver.WebElement}, or a
 * promise that will resolve to a WebElement. For example, to find the first
 * visible link on a page, you could write:
 * <code><pre>
 * var link = driver.findElement(firstVisibleLink);
 *
 * function firstVisibleLink(driver) {
 *   var links = driver.findElements(By.tagName('a'));
 *   return webdriver.promise.filter(links, function(link) {
 *     return links.isDisplayed();
 *   }).then(function(visibleLinks) {
 *     return visibleLinks[0];
 *   });
 * }
 * </pre></code>
 *
 * <p>When running in the browser, a WebDriver cannot manipulate DOM elements
 * directly; it may do so only through a {@link webdriver.WebElement} reference.
 * This function may be used to generate a WebElement from a DOM element. A
 * reference to the DOM element will be stored in a known location and this
 * driver will attempt to retrieve it through {@link #executeScript}. If the
 * element cannot be found (eg, it belongs to a different document than the
 * one this instance is currently focused on), a
 * {@link bot.ErrorCode.NO_SUCH_ELEMENT} error will be returned.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Element|Function)} locator The
 *     locator to use.
 * @return {!webdriver.WebElement} A WebElement that can be used to issue
 *     commands against the located element. If the element is not found, the
 *     element will be invalidated and all scheduled commands aborted.
 */
webdriver.WebDriver.prototype.findElement = function(locator) {
  var id;
  if ('nodeType' in locator && 'ownerDocument' in locator) {
    var element = /** @type {!Element} */ (locator);
    id = this.findDomElement_(element).
        then(function(elements) {
          if (!elements.length) {
            throw new bot.Error(bot.ErrorCode.NO_SUCH_ELEMENT,
                'Unable to locate element. Is WebDriver focused on its ' +
                    'ownerDocument\'s frame?');
          }
          return elements[0];
        });
  } else {
    locator = webdriver.Locator.checkLocator(locator);
    if (goog.isFunction(locator)) {
      id = this.findElementInternal_(locator, this);
    } else {
      var command = new webdriver.Command(webdriver.CommandName.FIND_ELEMENT).
          setParameter('using', locator.using).
          setParameter('value', locator.value);
      id = this.schedule(command, 'WebDriver.findElement(' + locator + ')');
    }
  }
  return new webdriver.WebElement(this, id);
};


/**
 * @param {!Function} locatorFn The locator function to use.
 * @param {!(webdriver.WebDriver|webdriver.WebElement)} context The search
 *     context.
 * @return {!webdriver.promise.Promise.<!webdriver.WebElement>} A
 *     promise that will resolve to a list of WebElements.
 * @private
 */
webdriver.WebDriver.prototype.findElementInternal_ = function(
    locatorFn, context) {
  return this.call(goog.partial(locatorFn, context)).then(function(result) {
    if (goog.isArray(result)) {
      result = result[0];
    }
    if (!(result instanceof webdriver.WebElement)) {
      throw new TypeError('Custom locator did not return a WebElement');
    }
    return result;
  });
};


/**
 * Locates a DOM element so that commands may be issued against it using the
 * {@link webdriver.WebElement} class. This is accomplished by storing a
 * reference to the element in an object on the element's ownerDocument.
 * {@link #executeScript} will then be used to create a WebElement from this
 * reference. This requires this driver to currently be focused on the
 * ownerDocument's window+frame.

 * @param {!Element} element The element to locate.
 * @return {!webdriver.promise.Promise} A promise that will be resolved
 *     with the located WebElement.
 * @private
 */
webdriver.WebDriver.prototype.findDomElement_ = function(element) {
  var doc = element.ownerDocument;
  var store = doc['$webdriver$'] = doc['$webdriver$'] || {};
  var id = Math.floor(Math.random() * goog.now()).toString(36);
  store[id] = element;
  element[id] = id;

  function cleanUp() {
    delete store[id];
  }

  function lookupElement(id) {
    var store = document['$webdriver$'];
    if (!store) {
      return null;
    }

    var element = store[id];
    if (!element || element[id] !== id) {
      return [];
    }
    return [element];
  }

  return this.executeScript(lookupElement, id).
      then(function(value) {
        cleanUp();
        if (value.length && !(value[0] instanceof webdriver.WebElement)) {
          throw new Error('JS locator script result was not a WebElement');
        }
        return value;
      }, cleanUp);
};


/**
 * Schedules a command to test if an element is present on the page.
 *
 * <p>If given a DOM element, this function will check if it belongs to the
 * document the driver is currently focused on. Otherwise, the function will
 * test if at least one element can be found with the given search criteria.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Element|
 *           Function)} locatorOrElement The locator to use, or the actual
 *     DOM element to be located by the server.
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will resolve
 *     with whether the element is present on the page.
 */
webdriver.WebDriver.prototype.isElementPresent = function(locatorOrElement) {
  var findElement =
      ('nodeType' in locatorOrElement && 'ownerDocument' in locatorOrElement) ?
          this.findDomElement_(/** @type {!Element} */ (locatorOrElement)) :
          this.findElements.apply(this, arguments);
  return findElement.then(function(result) {
    return !!result.length;
  });
};


/**
 * Schedule a command to search for multiple elements on the page.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The locator
 *     strategy to use when searching for the element.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.WebElement>>} A
 *     promise that will resolve to an array of WebElements.
 */
webdriver.WebDriver.prototype.findElements = function(locator) {
  locator = webdriver.Locator.checkLocator(locator);
  if (goog.isFunction(locator)) {
    return this.findElementsInternal_(locator, this);
  } else {
    var command = new webdriver.Command(webdriver.CommandName.FIND_ELEMENTS).
        setParameter('using', locator.using).
        setParameter('value', locator.value);
    return this.schedule(command, 'WebDriver.findElements(' + locator + ')');
  }
};


/**
 * @param {!Function} locatorFn The locator function to use.
 * @param {!(webdriver.WebDriver|webdriver.WebElement)} context The search
 *     context.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.WebElement>>} A
 *     promise that will resolve to an array of WebElements.
 * @private
 */
webdriver.WebDriver.prototype.findElementsInternal_ = function(
    locatorFn, context) {
  return this.call(goog.partial(locatorFn, context)).then(function(result) {
    if (result instanceof webdriver.WebElement) {
      return [result];
    }

    if (!goog.isArray(result)) {
      return [];
    }

    return goog.array.filter(result, function(item) {
      return item instanceof webdriver.WebElement;
    });
  });
};


/**
 * Schedule a command to take a screenshot. The driver makes a best effort to
 * return a screenshot of the following, in order of preference:
 * <ol>
 *   <li>Entire page
 *   <li>Current window
 *   <li>Visible portion of the current frame
 *   <li>The screenshot of the entire display containing the browser
 * </ol>
 *
 * @return {!webdriver.promise.Promise} A promise that will be resolved to the
 *     screenshot as a base-64 encoded PNG.
 */
webdriver.WebDriver.prototype.takeScreenshot = function() {
  return this.schedule(new webdriver.Command(webdriver.CommandName.SCREENSHOT),
      'WebDriver.takeScreenshot()');
};


/**
 * @return {!webdriver.WebDriver.Options} The options interface for this
 *     instance.
 */
webdriver.WebDriver.prototype.manage = function() {
  return new webdriver.WebDriver.Options(this);
};


/**
 * @return {!webdriver.WebDriver.Navigation} The navigation interface for this
 *     instance.
 */
webdriver.WebDriver.prototype.navigate = function() {
  return new webdriver.WebDriver.Navigation(this);
};


/**
 * @return {!webdriver.WebDriver.TargetLocator} The target locator interface for
 *     this instance.
 */
webdriver.WebDriver.prototype.switchTo = function() {
  return new webdriver.WebDriver.TargetLocator(this);
};



/**
 * Interface for navigating back and forth in the browser history.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.Navigation = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Schedules a command to navigate to a new URL.
 * @param {string} url The URL to navigate to.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     URL has been loaded.
 */
webdriver.WebDriver.Navigation.prototype.to = function(url) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET).
          setParameter('url', url),
      'WebDriver.navigate().to(' + url + ')');
};


/**
 * Schedules a command to move backwards in the browser history.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     navigation event has completed.
 */
webdriver.WebDriver.Navigation.prototype.back = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GO_BACK),
      'WebDriver.navigate().back()');
};


/**
 * Schedules a command to move forwards in the browser history.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     navigation event has completed.
 */
webdriver.WebDriver.Navigation.prototype.forward = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GO_FORWARD),
      'WebDriver.navigate().forward()');
};


/**
 * Schedules a command to refresh the current page.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     navigation event has completed.
 */
webdriver.WebDriver.Navigation.prototype.refresh = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.REFRESH),
      'WebDriver.navigate().refresh()');
};



/**
 * Provides methods for managing browser and driver state.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.Options = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Schedules a command to add a cookie.
 * @param {string} name The cookie name.
 * @param {string} value The cookie value.
 * @param {string=} opt_path The cookie path.
 * @param {string=} opt_domain The cookie domain.
 * @param {boolean=} opt_isSecure Whether the cookie is secure.
 * @param {(number|!Date)=} opt_expiry When the cookie expires. If specified as
 *     a number, should be in milliseconds since midnight, January 1, 1970 UTC.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     cookie has been added to the page.
 */
webdriver.WebDriver.Options.prototype.addCookie = function(
    name, value, opt_path, opt_domain, opt_isSecure, opt_expiry) {
  // We do not allow '=' or ';' in the name.
  if (/[;=]/.test(name)) {
    throw Error('Invalid cookie name "' + name + '"');
  }

  // We do not allow ';' in value.
  if (/;/.test(value)) {
    throw Error('Invalid cookie value "' + value + '"');
  }

  var cookieString = name + '=' + value +
      (opt_domain ? ';domain=' + opt_domain : '') +
      (opt_path ? ';path=' + opt_path : '') +
      (opt_isSecure ? ';secure' : '');

  var expiry;
  if (goog.isDef(opt_expiry)) {
    var expiryDate;
    if (goog.isNumber(opt_expiry)) {
      expiryDate = new Date(opt_expiry);
    } else {
      expiryDate = /** @type {!Date} */ (opt_expiry);
      opt_expiry = expiryDate.getTime();
    }
    cookieString += ';expires=' + expiryDate.toUTCString();
    // Convert from milliseconds to seconds.
    expiry = Math.floor(/** @type {number} */ (opt_expiry) / 1000);
  }

  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.ADD_COOKIE).
          setParameter('cookie', {
            'name': name,
            'value': value,
            'path': opt_path,
            'domain': opt_domain,
            'secure': !!opt_isSecure,
            'expiry': expiry
          }),
      'WebDriver.manage().addCookie(' + cookieString + ')');
};


/**
 * Schedules a command to delete all cookies visible to the current page.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when all
 *     cookies have been deleted.
 */
webdriver.WebDriver.Options.prototype.deleteAllCookies = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.DELETE_ALL_COOKIES),
      'WebDriver.manage().deleteAllCookies()');
};


/**
 * Schedules a command to delete the cookie with the given name. This command is
 * a no-op if there is no cookie with the given name visible to the current
 * page.
 * @param {string} name The name of the cookie to delete.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     cookie has been deleted.
 */
webdriver.WebDriver.Options.prototype.deleteCookie = function(name) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.DELETE_COOKIE).
          setParameter('name', name),
      'WebDriver.manage().deleteCookie(' + name + ')');
};


/**
 * Schedules a command to retrieve all cookies visible to the current page.
 * Each cookie will be returned as a JSON object as described by the WebDriver
 * wire protocol.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     cookies visible to the current page.
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object
 */
webdriver.WebDriver.Options.prototype.getCookies = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_ALL_COOKIES),
      'WebDriver.manage().getCookies()');
};


/**
 * Schedules a command to retrieve the cookie with the given name. Returns null
 * if there is no such cookie. The cookie will be returned as a JSON object as
 * described by the WebDriver wire protocol.
 * @param {string} name The name of the cookie to retrieve.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     named cookie, or {@code null} if there is no such cookie.
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object
 */
webdriver.WebDriver.Options.prototype.getCookie = function(name) {
  return this.getCookies().then(function(cookies) {
    return goog.array.find(cookies, function(cookie) {
      return cookie && cookie['name'] == name;
    });
  });
};


/**
 * @return {!webdriver.WebDriver.Logs} The interface for managing driver
 *     logs.
 */
webdriver.WebDriver.Options.prototype.logs = function() {
  return new webdriver.WebDriver.Logs(this.driver_);
};


/**
 * @return {!webdriver.WebDriver.Timeouts} The interface for managing driver
 *     timeouts.
 */
webdriver.WebDriver.Options.prototype.timeouts = function() {
  return new webdriver.WebDriver.Timeouts(this.driver_);
};


/**
 * @return {!webdriver.WebDriver.Window} The interface for managing the
 *     current window.
 */
webdriver.WebDriver.Options.prototype.window = function() {
  return new webdriver.WebDriver.Window(this.driver_);
};



/**
 * An interface for managing timeout behavior for WebDriver instances.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.Timeouts = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Specifies the amount of time the driver should wait when searching for an
 * element if it is not immediately present.
 * <p/>
 * When searching for a single element, the driver should poll the page
 * until the element has been found, or this timeout expires before failing
 * with a {@code bot.ErrorCode.NO_SUCH_ELEMENT} error. When searching
 * for multiple elements, the driver should poll the page until at least one
 * element has been found or this timeout has expired.
 * <p/>
 * Setting the wait timeout to 0 (its default value), disables implicit
 * waiting.
 * <p/>
 * Increasing the implicit wait timeout should be used judiciously as it
 * will have an adverse effect on test run time, especially when used with
 * slower location strategies like XPath.
 *
 * @param {number} ms The amount of time to wait, in milliseconds.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     implicit wait timeout has been set.
 */
webdriver.WebDriver.Timeouts.prototype.implicitlyWait = function(ms) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.IMPLICITLY_WAIT).
          setParameter('ms', ms < 0 ? 0 : ms),
      'WebDriver.manage().timeouts().implicitlyWait(' + ms + ')');
};


/**
 * Sets the amount of time to wait, in milliseconds, for an asynchronous script
 * to finish execution before returning an error. If the timeout is less than or
 * equal to 0, the script will be allowed to run indefinitely.
 *
 * @param {number} ms The amount of time to wait, in milliseconds.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     script timeout has been set.
 */
webdriver.WebDriver.Timeouts.prototype.setScriptTimeout = function(ms) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SET_SCRIPT_TIMEOUT).
          setParameter('ms', ms < 0 ? 0 : ms),
      'WebDriver.manage().timeouts().setScriptTimeout(' + ms + ')');
};


/**
 * Sets the amount of time to wait for a page load to complete before returning
 * an error.  If the timeout is negative, page loads may be indefinite.
 * @param {number} ms The amount of time to wait, in milliseconds.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     the timeout has been set.
 */
webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout = function(ms) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SET_TIMEOUT).
          setParameter('type', 'page load').
          setParameter('ms', ms),
      'WebDriver.manage().timeouts().pageLoadTimeout(' + ms + ')');
};



/**
 * An interface for managing the current window.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.Window = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Retrieves the window's current position, relative to the top left corner of
 * the screen.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     window's position in the form of a {x:number, y:number} object literal.
 */
webdriver.WebDriver.Window.prototype.getPosition = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_WINDOW_POSITION).
          setParameter('windowHandle', 'current'),
      'WebDriver.manage().window().getPosition()');
};


/**
 * Repositions the current window.
 * @param {number} x The desired horizontal position, relative to the left side
 *     of the screen.
 * @param {number} y The desired vertical position, relative to the top of the
 *     of the screen.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     command has completed.
 */
webdriver.WebDriver.Window.prototype.setPosition = function(x, y) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SET_WINDOW_POSITION).
          setParameter('windowHandle', 'current').
          setParameter('x', x).
          setParameter('y', y),
      'WebDriver.manage().window().setPosition(' + x + ', ' + y + ')');
};


/**
 * Retrieves the window's current size.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     window's size in the form of a {width:number, height:number} object
 *     literal.
 */
webdriver.WebDriver.Window.prototype.getSize = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_WINDOW_SIZE).
          setParameter('windowHandle', 'current'),
      'WebDriver.manage().window().getSize()');
};


/**
 * Resizes the current window.
 * @param {number} width The desired window width.
 * @param {number} height The desired window height.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     command has completed.
 */
webdriver.WebDriver.Window.prototype.setSize = function(width, height) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SET_WINDOW_SIZE).
          setParameter('windowHandle', 'current').
          setParameter('width', width).
          setParameter('height', height),
      'WebDriver.manage().window().setSize(' + width + ', ' + height + ')');
};


/**
 * Maximizes the current window.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     command has completed.
 */
webdriver.WebDriver.Window.prototype.maximize = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.MAXIMIZE_WINDOW).
          setParameter('windowHandle', 'current'),
      'WebDriver.manage().window().maximize()');
};


/**
 * Interface for managing WebDriver log records.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.Logs = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Fetches available log entries for the given type.
 *
 * <p/>Note that log buffers are reset after each call, meaning that
 * available log entries correspond to those entries not yet returned for a
 * given log type. In practice, this means that this call will return the
 * available log entries since the last call, or from the start of the
 * session.
 *
 * @param {!webdriver.logging.Type} type The desired log type.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.logging.Entry>>} A
 *   promise that will resolve to a list of log entries for the specified
 *   type.
 */
webdriver.WebDriver.Logs.prototype.get = function(type) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_LOG).
          setParameter('type', type),
      'WebDriver.manage().logs().get(' + type + ')').
      then(function(entries) {
        return goog.array.map(entries, function(entry) {
          if (!(entry instanceof webdriver.logging.Entry)) {
            return new webdriver.logging.Entry(
                entry['level'], entry['message'], entry['timestamp']);
          }
          return entry;
        });
      });
};


/**
 * Retrieves the log types available to this driver.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.logging.Type>>} A
 *     promise that will resolve to a list of available log types.
 */
webdriver.WebDriver.Logs.prototype.getAvailableLogTypes = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_AVAILABLE_LOG_TYPES),
      'WebDriver.manage().logs().getAvailableLogTypes()');
};



/**
 * An interface for changing the focus of the driver to another frame or window.
 * @param {!webdriver.WebDriver} driver The parent driver.
 * @constructor
 */
webdriver.WebDriver.TargetLocator = function(driver) {

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;
};


/**
 * Schedules a command retrieve the {@code document.activeElement} element on
 * the current document, or {@code document.body} if activeElement is not
 * available.
 * @return {!webdriver.WebElement} The active element.
 */
webdriver.WebDriver.TargetLocator.prototype.activeElement = function() {
  var id = this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_ACTIVE_ELEMENT),
      'WebDriver.switchTo().activeElement()');
  return new webdriver.WebElement(this.driver_, id);
};


/**
 * Schedules a command to switch focus of all future commands to the first frame
 * on the page.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     driver has changed focus to the default content.
 */
webdriver.WebDriver.TargetLocator.prototype.defaultContent = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SWITCH_TO_FRAME).
          setParameter('id', null),
      'WebDriver.switchTo().defaultContent()');
};


/**
 * Schedules a command to switch the focus of all future commands to another
 * frame on the page.
 * <p/>
 * If the frame is specified by a number, the command will switch to the frame
 * by its (zero-based) index into the {@code window.frames} collection.
 * <p/>
 * If the frame is specified by a string, the command will select the frame by
 * its name or ID. To select sub-frames, simply separate the frame names/IDs by
 * dots. As an example, "main.child" will select the frame with the name "main"
 * and then its child "child".
 * <p/>
 * If the specified frame can not be found, the deferred result will errback
 * with a {@code bot.ErrorCode.NO_SUCH_FRAME} error.
 * @param {string|number} nameOrIndex The frame locator.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     driver has changed focus to the specified frame.
 */
webdriver.WebDriver.TargetLocator.prototype.frame = function(nameOrIndex) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SWITCH_TO_FRAME).
          setParameter('id', nameOrIndex),
      'WebDriver.switchTo().frame(' + nameOrIndex + ')');
};


/**
 * Schedules a command to switch the focus of all future commands to another
 * window. Windows may be specified by their {@code window.name} attribute or
 * by its handle (as returned by {@code webdriver.WebDriver#getWindowHandles}).
 * <p/>
 * If the specificed window can not be found, the deferred result will errback
 * with a {@code bot.ErrorCode.NO_SUCH_WINDOW} error.
 * @param {string} nameOrHandle The name or window handle of the window to
 *     switch focus to.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when the
 *     driver has changed focus to the specified window.
 */
webdriver.WebDriver.TargetLocator.prototype.window = function(nameOrHandle) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SWITCH_TO_WINDOW).
          setParameter('name', nameOrHandle),
      'WebDriver.switchTo().window(' + nameOrHandle + ')');
};


/**
 * Schedules a command to change focus to the active alert dialog. This command
 * will return a {@link bot.ErrorCode.NO_MODAL_DIALOG_OPEN} error if a modal
 * dialog is not currently open.
 * @return {!webdriver.Alert} The open alert.
 */
webdriver.WebDriver.TargetLocator.prototype.alert = function() {
  var text = this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.GET_ALERT_TEXT),
      'WebDriver.switchTo().alert()');
  return new webdriver.Alert(this.driver_, text);
};


/**
 * Simulate pressing many keys at once in a "chord". Takes a sequence of
 * {@link webdriver.Key}s or strings, appends each of the values to a string,
 * and adds the chord termination key ({@link webdriver.Key.NULL}) and returns
 * the resultant string.
 *
 * Note: when the low-level webdriver key handlers see Keys.NULL, active
 * modifier keys (CTRL/ALT/SHIFT/etc) release via a keyup event.
 *
 * @param {...string} var_args The key sequence to concatenate.
 * @return {string} The null-terminated key sequence.
 * @see http://code.google.com/p/webdriver/issues/detail?id=79
 */
webdriver.Key.chord = function(var_args) {
  var sequence = goog.array.reduce(
      goog.array.slice(arguments, 0),
      function(str, key) {
        return str + key;
      }, '');
  sequence += webdriver.Key.NULL;
  return sequence;
};


//////////////////////////////////////////////////////////////////////////////
//
//  webdriver.WebElement
//
//////////////////////////////////////////////////////////////////////////////



/**
 * Represents a DOM element. WebElements can be found by searching from the
 * document root using a {@code webdriver.WebDriver} instance, or by searching
 * under another {@code webdriver.WebElement}:
 * <pre><code>
 *   driver.get('http://www.google.com');
 *   var searchForm = driver.findElement(By.tagName('form'));
 *   var searchBox = searchForm.findElement(By.name('q'));
 *   searchBox.sendKeys('webdriver');
 * </code></pre>
 *
 * The WebElement is implemented as a promise for compatibility with the promise
 * API. It will always resolve itself when its internal state has been fully
 * resolved and commands may be issued against the element. This can be used to
 * catch errors when an element cannot be located on the page:
 * <pre><code>
 *   driver.findElement(By.id('not-there')).then(function(element) {
 *     alert('Found an element that was not expected to be there!');
 *   }, function(error) {
 *     alert('The element was not found, as expected');
 *   });
 * </code></pre>
 *
 * @param {!webdriver.WebDriver} driver The parent WebDriver instance for this
 *     element.
 * @param {!(string|webdriver.promise.Promise)} id Either the opaque ID for the
 *     underlying DOM element assigned by the server, or a promise that will
 *     resolve to that ID or another WebElement.
 * @constructor
 * @extends {webdriver.promise.Deferred}
 */
webdriver.WebElement = function(driver, id) {
  webdriver.promise.Deferred.call(this, null, driver.controlFlow());

  /**
   * The parent WebDriver instance for this element.
   * @private {!webdriver.WebDriver}
   */
  this.driver_ = driver;

  // This class is responsible for resolving itself; delete the resolve and
  // reject methods so they may not be accessed by consumers of this class.
  var fulfill = goog.partial(this.fulfill, this);
  var reject = this.reject;
  delete this.promise;
  delete this.fulfill;
  delete this.reject;

  /**
   * A promise that resolves to the JSON representation of this WebElement's
   * ID, as defined by the WebDriver wire protocol.
   * @private {!webdriver.promise.Promise}
   * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol
   */
  this.id_ = webdriver.promise.when(id, function(id) {
    if (id instanceof webdriver.WebElement) {
      return id.id_;
    } else if (goog.isDef(id[webdriver.WebElement.ELEMENT_KEY])) {
      return id;
    }

    var json = {};
    json[webdriver.WebElement.ELEMENT_KEY] = id;
    return json;
  });

  // This WebElement should not be resolved until its ID has been
  // fully resolved.
  this.id_.then(fulfill, reject);
};
goog.inherits(webdriver.WebElement, webdriver.promise.Deferred);


/**
 * The property key used in the wire protocol to indicate that a JSON object
 * contains the ID of a WebElement.
 * @type {string}
 * @const
 */
webdriver.WebElement.ELEMENT_KEY = 'ELEMENT';


/**
 * Compares to WebElements for equality.
 * @param {!webdriver.WebElement} a A WebElement.
 * @param {!webdriver.WebElement} b A WebElement.
 * @return {!webdriver.promise.Promise} A promise that will be resolved to
 *     whether the two WebElements are equal.
 */
webdriver.WebElement.equals = function(a, b) {
  if (a == b) {
    return webdriver.promise.fulfilled(true);
  }
  return webdriver.promise.fullyResolved([a.id_, b.id_]).then(function(ids) {
    // If the two element's have the same ID, they should be considered
    // equal. Otherwise, they may still be equivalent, but we'll need to
    // ask the server to check for us.
    if (ids[0][webdriver.WebElement.ELEMENT_KEY] ==
        ids[1][webdriver.WebElement.ELEMENT_KEY]) {
      return true;
    }

    var command = new webdriver.Command(
        webdriver.CommandName.ELEMENT_EQUALS);
    command.setParameter('other', b);
    return a.schedule_(command, 'webdriver.WebElement.equals()');
  });
};


/**
 * @return {!webdriver.WebDriver} The parent driver for this instance.
 */
webdriver.WebElement.prototype.getDriver = function() {
  return this.driver_;
};


/**
 * @return {!webdriver.promise.Promise} A promise that resolves to this
 *     element's JSON representation as defined by the WebDriver wire protocol.
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol
 */
webdriver.WebElement.prototype.toWireValue = function() {
  return this.id_;
};


/**
 * Schedules a command that targets this element with the parent WebDriver
 * instance. Will ensure this element's ID is included in the command parameters
 * under the "id" key.
 * @param {!webdriver.Command} command The command to schedule.
 * @param {string} description A description of the command for debugging.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     the command result.
 * @see webdriver.WebDriver.prototype.schedule
 * @private
 */
webdriver.WebElement.prototype.schedule_ = function(command, description) {
  command.setParameter('id', this.id_);
  return this.driver_.schedule(command, description);
};


/**
 * Schedule a command to find a descendant of this element. If the element
 * cannot be found, a {@code bot.ErrorCode.NO_SUCH_ELEMENT} result will
 * be returned by the driver. Unlike other commands, this error cannot be
 * suppressed. In other words, scheduling a command to find an element doubles
 * as an assert that the element is present on the page. To test whether an
 * element is present on the page, use {@code #isElementPresent} instead.
 *
 * <p>The search criteria for an element may be defined using one of the
 * factories in the {@link webdriver.By} namespace, or as a short-hand
 * {@link webdriver.By.Hash} object. For example, the following two statements
 * are equivalent:
 * <code><pre>
 * var e1 = element.findElement(By.id('foo'));
 * var e2 = element.findElement({id:'foo'});
 * </pre></code>
 *
 * <p>You may also provide a custom locator function, which takes as input
 * this WebDriver instance and returns a {@link webdriver.WebElement}, or a
 * promise that will resolve to a WebElement. For example, to find the first
 * visible link on a page, you could write:
 * <code><pre>
 * var link = element.findElement(firstVisibleLink);
 *
 * function firstVisibleLink(element) {
 *   var links = element.findElements(By.tagName('a'));
 *   return webdriver.promise.filter(links, function(link) {
 *     return links.isDisplayed();
 *   }).then(function(visibleLinks) {
 *     return visibleLinks[0];
 *   });
 * }
 * </pre></code>
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the element.
 * @return {!webdriver.WebElement} A WebElement that can be used to issue
 *     commands against the located element. If the element is not found, the
 *     element will be invalidated and all scheduled commands aborted.
 */
webdriver.WebElement.prototype.findElement = function(locator) {
  locator = webdriver.Locator.checkLocator(locator);
  var id;
  if (goog.isFunction(locator)) {
    id = this.driver_.findElementInternal_(locator, this);
  } else {
    var command = new webdriver.Command(
        webdriver.CommandName.FIND_CHILD_ELEMENT).
        setParameter('using', locator.using).
        setParameter('value', locator.value);
    id = this.schedule_(command, 'WebElement.findElement(' + locator + ')');
  }
  return new webdriver.WebElement(this.driver_, id);
};


/**
 * Schedules a command to test if there is at least one descendant of this
 * element that matches the given search criteria.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the element.
 * @return {!webdriver.promise.Promise.<boolean>} A promise that will be
 *     resolved with whether an element could be located on the page.
 */
webdriver.WebElement.prototype.isElementPresent = function(locator) {
  return this.findElements(locator).then(function(result) {
    return !!result.length;
  });
};


/**
 * Schedules a command to find all of the descendants of this element that
 * match the given search criteria.
 *
 * @param {!(webdriver.Locator|webdriver.By.Hash|Function)} locator The
 *     locator strategy to use when searching for the elements.
 * @return {!webdriver.promise.Promise.<!Array.<!webdriver.WebElement>>} A
 *     promise that will resolve to an array of WebElements.
 */
webdriver.WebElement.prototype.findElements = function(locator) {
  locator = webdriver.Locator.checkLocator(locator);
  if (goog.isFunction(locator)) {
    return this.driver_.findElementsInternal_(locator, this);
  } else {
    var command = new webdriver.Command(
        webdriver.CommandName.FIND_CHILD_ELEMENTS).
        setParameter('using', locator.using).
        setParameter('value', locator.value);
    return this.schedule_(command, 'WebElement.findElements(' + locator + ')');
  }
};


/**
 * Schedules a command to click on this element.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     the click command has completed.
 */
webdriver.WebElement.prototype.click = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.CLICK_ELEMENT),
      'WebElement.click()');
};


/**
 * Schedules a command to type a sequence on the DOM element represented by this
 * instance.
 * <p/>
 * Modifier keys (SHIFT, CONTROL, ALT, META) are stateful; once a modifier is
 * processed in the keysequence, that key state is toggled until one of the
 * following occurs:
 * <ul>
 * <li>The modifier key is encountered again in the sequence. At this point the
 * state of the key is toggled (along with the appropriate keyup/down events).
 * </li>
 * <li>The {@code webdriver.Key.NULL} key is encountered in the sequence. When
 * this key is encountered, all modifier keys current in the down state are
 * released (with accompanying keyup events). The NULL key can be used to
 * simulate common keyboard shortcuts:
 * <code><pre>
 *     element.sendKeys("text was",
 *                      webdriver.Key.CONTROL, "a", webdriver.Key.NULL,
 *                      "now text is");
 *     // Alternatively:
 *     element.sendKeys("text was",
 *                      webdriver.Key.chord(webdriver.Key.CONTROL, "a"),
 *                      "now text is");
 * </pre></code></li>
 * <li>The end of the keysequence is encountered. When there are no more keys
 * to type, all depressed modifier keys are released (with accompanying keyup
 * events).
 * </li>
 * </ul>
 * <strong>Note:</strong> On browsers where native keyboard events are not yet
 * supported (e.g. Firefox on OS X), key events will be synthesized. Special
 * punctionation keys will be synthesized according to a standard QWERTY en-us
 * keyboard layout.
 *
 * @param {...string} var_args The sequence of keys to
 *     type. All arguments will be joined into a single sequence (var_args is
 *     permitted for convenience).
 * @return {!webdriver.promise.Promise} A promise that will be resolved when all
 *     keys have been typed.
 */
webdriver.WebElement.prototype.sendKeys = function(var_args) {
  // Coerce every argument to a string. This protects us from users that
  // ignore the jsdoc and give us a number (which ends up causing problems on
  // the server, which requires strings).
  var keys = webdriver.promise.fullyResolved(goog.array.slice(arguments, 0)).
      then(function(args) {
        return goog.array.map(goog.array.slice(args, 0), function(key) {
          return key + '';
        });
      });
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.SEND_KEYS_TO_ELEMENT).
          setParameter('value', keys),
      'WebElement.sendKeys(' + keys + ')');
};


/**
 * Schedules a command to query for the tag/node name of this element.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     element's tag name.
 */
webdriver.WebElement.prototype.getTagName = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.GET_ELEMENT_TAG_NAME),
      'WebElement.getTagName()');
};


/**
 * Schedules a command to query for the computed style of the element
 * represented by this instance. If the element inherits the named style from
 * its parent, the parent will be queried for its value.  Where possible, color
 * values will be converted to their hex representation (e.g. #00ff00 instead of
 * rgb(0, 255, 0)).
 * <p/>
 * <em>Warning:</em> the value returned will be as the browser interprets it, so
 * it may be tricky to form a proper assertion.
 *
 * @param {string} cssStyleProperty The name of the CSS style property to look
 *     up.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     requested CSS value.
 */
webdriver.WebElement.prototype.getCssValue = function(cssStyleProperty) {
  var name = webdriver.CommandName.GET_ELEMENT_VALUE_OF_CSS_PROPERTY;
  return this.schedule_(
      new webdriver.Command(name).
          setParameter('propertyName', cssStyleProperty),
      'WebElement.getCssValue(' + cssStyleProperty + ')');
};


/**
 * Schedules a command to query for the value of the given attribute of the
 * element. Will return the current value, even if it has been modified after
 * the page has been loaded. More exactly, this method will return the value of
 * the given attribute, unless that attribute is not present, in which case the
 * value of the property with the same name is returned. If neither value is
 * set, null is returned (for example, the "value" property of a textarea
 * element). The "style" attribute is converted as best can be to a
 * text representation with a trailing semi-colon. The following are deemed to
 * be "boolean" attributes and will return either "true" or null:
 *
 * <p>async, autofocus, autoplay, checked, compact, complete, controls, declare,
 * defaultchecked, defaultselected, defer, disabled, draggable, ended,
 * formnovalidate, hidden, indeterminate, iscontenteditable, ismap, itemscope,
 * loop, multiple, muted, nohref, noresize, noshade, novalidate, nowrap, open,
 * paused, pubdate, readonly, required, reversed, scoped, seamless, seeking,
 * selected, spellcheck, truespeed, willvalidate
 *
 * <p>Finally, the following commonly mis-capitalized attribute/property names
 * are evaluated as expected:
 * <ul>
 *   <li>"class"
 *   <li>"readonly"
 * </ul>
 * @param {string} attributeName The name of the attribute to query.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     attribute's value. The returned value will always be either a string or
 *     null.
 */
webdriver.WebElement.prototype.getAttribute = function(attributeName) {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.GET_ELEMENT_ATTRIBUTE).
          setParameter('name', attributeName),
      'WebElement.getAttribute(' + attributeName + ')');
};


/**
 * Get the visible (i.e. not hidden by CSS) innerText of this element, including
 * sub-elements, without any leading or trailing whitespace.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     element's visible text.
 */
webdriver.WebElement.prototype.getText = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.GET_ELEMENT_TEXT),
      'WebElement.getText()');
};


/**
 * Schedules a command to compute the size of this element's bounding box, in
 * pixels.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     element's size as a {@code {width:number, height:number}} object.
 */
webdriver.WebElement.prototype.getSize = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.GET_ELEMENT_SIZE),
      'WebElement.getSize()');
};


/**
 * Schedules a command to compute the location of this element in page space.
 * @return {!webdriver.promise.Promise} A promise that will be resolved to the
 *     element's location as a {@code {x:number, y:number}} object.
 */
webdriver.WebElement.prototype.getLocation = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.GET_ELEMENT_LOCATION),
      'WebElement.getLocation()');
};


/**
 * Schedules a command to query whether the DOM element represented by this
 * instance is enabled, as dicted by the {@code disabled} attribute.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     whether this element is currently enabled.
 */
webdriver.WebElement.prototype.isEnabled = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.IS_ELEMENT_ENABLED),
      'WebElement.isEnabled()');
};


/**
 * Schedules a command to query whether this element is selected.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     whether this element is currently selected.
 */
webdriver.WebElement.prototype.isSelected = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.IS_ELEMENT_SELECTED),
      'WebElement.isSelected()');
};


/**
 * Schedules a command to submit the form containing this element (or this
 * element if it is a FORM element). This command is a no-op if the element is
 * not contained in a form.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     the form has been submitted.
 */
webdriver.WebElement.prototype.submit = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.SUBMIT_ELEMENT),
      'WebElement.submit()');
};


/**
 * Schedules a command to clear the {@code value} of this element. This command
 * has no effect if the underlying DOM element is neither a text INPUT element
 * nor a TEXTAREA element.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     the element has been cleared.
 */
webdriver.WebElement.prototype.clear = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.CLEAR_ELEMENT),
      'WebElement.clear()');
};


/**
 * Schedules a command to test whether this element is currently displayed.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     whether this element is currently visible on the page.
 */
webdriver.WebElement.prototype.isDisplayed = function() {
  return this.schedule_(
      new webdriver.Command(webdriver.CommandName.IS_ELEMENT_DISPLAYED),
      'WebElement.isDisplayed()');
};


/**
 * Schedules a command to retrieve the outer HTML of this element.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with
 *     the element's outer HTML.
 */
webdriver.WebElement.prototype.getOuterHtml = function() {
  return this.driver_.executeScript(function() {
    var element = arguments[0];
    if ('outerHTML' in element) {
      return element.outerHTML;
    } else {
      var div = element.ownerDocument.createElement('div');
      div.appendChild(element.cloneNode(true));
      return div.innerHTML;
    }
  }, this);
};


/**
 * Schedules a command to retrieve the inner HTML of this element.
 * @return {!webdriver.promise.Promise} A promise that will be resolved with the
 *     element's inner HTML.
 */
webdriver.WebElement.prototype.getInnerHtml = function() {
  return this.driver_.executeScript('return arguments[0].innerHTML', this);
};



/**
 * Represents a modal dialog such as {@code alert}, {@code confirm}, or
 * {@code prompt}. Provides functions to retrieve the message displayed with
 * the alert, accept or dismiss the alert, and set the response text (in the
 * case of {@code prompt}).
 * @param {!webdriver.WebDriver} driver The driver controlling the browser this
 *     alert is attached to.
 * @param {!(string|webdriver.promise.Promise)} text Either the message text
 *     displayed with this alert, or a promise that will be resolved to said
 *     text.
 * @constructor
 * @extends {webdriver.promise.Deferred}
 */
webdriver.Alert = function(driver, text) {
  goog.base(this, null, driver.controlFlow());

  /** @private {!webdriver.WebDriver} */
  this.driver_ = driver;

  // This class is responsible for resolving itself; delete the resolve and
  // reject methods so they may not be accessed by consumers of this class.
  var fulfill = goog.partial(this.fulfill, this);
  var reject = this.reject;
  delete this.promise;
  delete this.fulfill;
  delete this.reject;

  /** @private {!webdriver.promise.Promise} */
  this.text_ = webdriver.promise.when(text);

  // Make sure this instance is resolved when its displayed text is.
  this.text_.then(fulfill, reject);
};
goog.inherits(webdriver.Alert, webdriver.promise.Deferred);


/**
 * Retrieves the message text displayed with this alert. For instance, if the
 * alert were opened with alert("hello"), then this would return "hello".
 * @return {!webdriver.promise.Promise} A promise that will be resolved to the
 *     text displayed with this alert.
 */
webdriver.Alert.prototype.getText = function() {
  return this.text_;
};


/**
 * Accepts this alert.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     this command has completed.
 */
webdriver.Alert.prototype.accept = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.ACCEPT_ALERT),
      'WebDriver.switchTo().alert().accept()');
};


/**
 * Dismisses this alert.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     this command has completed.
 */
webdriver.Alert.prototype.dismiss = function() {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.DISMISS_ALERT),
      'WebDriver.switchTo().alert().dismiss()');
};


/**
 * Sets the response text on this alert. This command will return an error if
 * the underlying alert does not support response text (e.g. window.alert and
 * window.confirm).
 * @param {string} text The text to set.
 * @return {!webdriver.promise.Promise} A promise that will be resolved when
 *     this command has completed.
 */
webdriver.Alert.prototype.sendKeys = function(text) {
  return this.driver_.schedule(
      new webdriver.Command(webdriver.CommandName.SET_ALERT_TEXT).
          setParameter('text', text),
      'WebDriver.switchTo().alert().sendKeys(' + text + ')');
};



/**
 * An error returned to indicate that there is an unhandled modal dialog on the
 * current page.
 * @param {string} message The error message.
 * @param {!webdriver.Alert} alert The alert handle.
 * @constructor
 * @extends {bot.Error}
 */
webdriver.UnhandledAlertError = function(message, alert) {
  goog.base(this, bot.ErrorCode.MODAL_DIALOG_OPENED, message);

  /** @private {!webdriver.Alert} */
  this.alert_ = alert;
};
goog.inherits(webdriver.UnhandledAlertError, bot.Error);


/**
 * @return {!webdriver.Alert} The open alert.
 */
webdriver.UnhandledAlertError.prototype.getAlert = function() {
  return this.alert_;
};
// Copyright 2013 WebDriver committers
// Copyright 2013 Software Freedom Conservancy
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Exports various symbols from the webdriver.atoms.inputs
 * namespace.
 */

goog.require('webdriver.atoms.inputs');


goog.exportSymbol('webdriver.atoms.inputs.click',
                  webdriver.atoms.inputs.click);
goog.exportSymbol('webdriver.atoms.inputs.doubleClick',
                  webdriver.atoms.inputs.doubleClick);
goog.exportSymbol('webdriver.atoms.inputs.rightClick',
                  webdriver.atoms.inputs.rightClick);
goog.exportSymbol('webdriver.atoms.inputs.mouseButtonDown',
                  webdriver.atoms.inputs.mouseButtonDown);
goog.exportSymbol('webdriver.atoms.inputs.mouseButtonUp',
                  webdriver.atoms.inputs.mouseButtonUp);
goog.exportSymbol('webdriver.atoms.inputs.mouseMove',
                  webdriver.atoms.inputs.mouseMove);
goog.exportSymbol('webdriver.atoms.inputs.sendKeys',
                  webdriver.atoms.inputs.sendKeys);
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for manipulating the DOM.
 */

goog.provide('webdriver.atoms.inject.action');

goog.require('bot.action');
goog.require('webdriver.atoms.element');
goog.require('webdriver.atoms.inject');
goog.require('webdriver.atoms.inputs');


/**
 * Sends key events to simulating typing on an element.
 *
 * @param {bot.inject.JsonElement} element The element to submit.
 * @param {!Array.<string>} keys The keys to type.
 * @param {bot.inject.JsonWindow=} opt_window The optional window
 *     containing the element.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 */
webdriver.atoms.inject.action.type = function(element, keys, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.element.type, [element, keys], opt_window);
};


/**
 * Submits the form containing the given element.
 *
 * @param {bot.inject.JsonElement} element The element to submit.
 * @param {bot.inject.JsonWindow=} opt_window The optional window
 *     containing the element.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @deprecated Click on a submit button or type ENTER in a text box instead.
 */
webdriver.atoms.inject.action.submit = function(element, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.submit,
      [element], opt_window);
};


/**
 * Clear an element.
 *
 * @param {bot.inject.JsonElement} element The element to clear.
 * @param {bot.inject.JsonWindow=} opt_window The optional window
 *     containing the element.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.clear
 */
webdriver.atoms.inject.action.clear = function(element, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.clear,
      [element], opt_window);
};


/**
 * Click an element.
 *
 * @param {bot.inject.JsonElement} element The element to click.
 * @param {bot.inject.JsonWindow=} opt_window The optional window
 *     containing the element.
 * @return {string} A stringified {@link bot.response.ResponseObject}.
 * @see bot.action.click
 */
webdriver.atoms.inject.action.click = function (element, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(bot.action.click,
      [element], opt_window);
};


/**
 * JSON representation of a {@link bot.Mouse.State} object.
 * @typedef {{buttonPressed: ?bot.Mouse.Button,
 *            elementPressed: ?bot.inject.JsonElement,
 *            clientXY: {x: number, y: number},
 *            nextClickIsDoubleClick: boolean,
 *            hasEverInteracted: boolean,
 *            element: ?bot.inject.JsonElement}}
 */
webdriver.atoms.inject.action.JsonMouseState;


/**
 * Clicks a mouse button.
 *
 * @param {bot.Mouse.Button} button The button to press.
 * @param {webdriver.atoms.inject.action.JsonMouseState=} opt_mouseState The
 *     current state of the mouse.
 * @param {bot.inject.JsonWindow=} opt_window The window context for
 *     the execution of the function.
 * @return {string} A stringified {@link bot.response.ResponseObject}. The
 *     mouse's new state, as a
 *     {@link webdriver.atoms.inject.action.JsonMouseState} will be included
 *     as the response value.
 */
webdriver.atoms.inject.action.mouseClick = function(
    button, opt_mouseState, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.mouseClick,
      [button, opt_mouseState], opt_window);
};


/**
 * Types a sequence of key strokes on the active element.
 * @param {!Array.<string>} keys The keys to type.
 * @param {bot.Keyboard.State=} opt_keyboardState The keyboard's state.
 * @param {bot.inject.JsonWindow=} opt_window The window context for
 *     the execution of the function.
 * @return {string} A stringified {@link bot.response.ResponseObject}. The
 *     keyboard's new state, as a {@link bot.Keyboard.State} will be included
 *     as the response value.
 */
webdriver.atoms.inject.action.sendKeysToActiveElement = function(
    keys, opt_keyboardState, opt_window) {
  var persistModifiers = true;
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.sendKeys,
      [null, keys, opt_keyboardState, persistModifiers], opt_window);
};

/**
  * Moves the mouse to a specific element and/or coordinate location.
  *
  * @param {?bot.inject.JsonElement} element The element to move the mouse
  *     relative to, or {@code null} to use the mouse's current position.
  * @param {?number} xOffset A horizontal offset, relative to the left edge of
  *     the given element, or the mouse's current position if no element is
  *     specified.
  * @param {?number} yOffset A vertical offset, relative to the top edge of
  *     the given element, or the mouse's current position if no element
  *     is specified.
  * @param {webdriver.atoms.inject.action.JsonMouseState=} opt_mouseState The
  *     current state of the mouse.
  * @param {bot.inject.JsonWindow=} opt_window The window context for
  *     the execution of the function.
  * @return {string} A stringified {@link bot.response.ResponseObject}. The
  *     mouse's new state, as a
  *     {@link webdriver.atoms.inject.action.JsonMouseState} will be included
  *     as the response value.
  */
webdriver.atoms.inject.action.mouseMove = function(
    element, xOffset, yOffset, opt_mouseState, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.mouseMove,
      [element, xOffset, yOffset, opt_mouseState], opt_window);
};


/**
 * Presses the primary mouse button at the current location.
 *
 * @param {webdriver.atoms.inject.action.JsonMouseState=} opt_mouseState The
 *     current state of the mouse.
 * @param {bot.inject.JsonWindow=} opt_window The window context for
 *     the execution of the function.
 * @return {string} A stringified {@link bot.response.ResponseObject}. The
 *     mouse's new state, as a
 *     {@link webdriver.atoms.inject.action.JsonMouseState} will be included
 *     as the response value.
 */
webdriver.atoms.inject.action.mouseButtonDown = function(opt_mouseState, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.mouseButtonDown,
      [opt_mouseState], opt_window);
};


/**
 * Releases the primary mouse button at the current location.
 *
 * @param {webdriver.atoms.inject.action.JsonMouseState=} opt_mouseState The
 *     current state of the mouse.
 * @param {bot.inject.JsonWindow=} opt_window The window context for
 *     the execution of the function.
 * @return {string} A stringified {@link bot.response.ResponseObject}. The
 *     mouse's new state, as a
 *     {@link webdriver.atoms.inject.action.JsonMouseState} will be included
 *     as the response value.
 */
webdriver.atoms.inject.action.mouseButtonUp = function(opt_mouseState, opt_window) {
  return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.mouseButtonUp,
      [opt_mouseState], opt_window);
};

/**
* Double-clicks the primary mouse button.
*
* @param {webdriver.atoms.inject.action.JsonMouseState=} opt_mouseState The
*     current state of the mouse.
* @param {bot.inject.JsonWindow=} opt_window The window context for
*     the execution of the function.
* @return {string} A stringified {@link bot.response.ResponseObject}. The
*     mouse's new state, as a
*     {@link webdriver.atoms.inject.action.JsonMouseState} will be included
*     as the response value.
*/
webdriver.atoms.inject.action.doubleClick = function (
    opt_mouseState, opt_window) {
    return webdriver.atoms.inject.action.executeActionFunction_(
      webdriver.atoms.inputs.doubleClick,
      [opt_mouseState], opt_window);
};


/**
 * @param {!Function} fn The function to call.
 * @param {!Array.<*>} args An array of function arguments for the function.
 * @param {bot.inject.JsonWindow=} opt_window The window context for
 *     the execution of the function.
 * @return {string} The serialized JSON wire protocol result of the function.
 */
webdriver.atoms.inject.action.executeActionFunction_ = function (
    fn, args, opt_window) {
  var response;
  try {
    var targetWindow = webdriver.atoms.inject.getWindow(opt_window);
    var unwrappedArgs = /** @type {Array} */(bot.inject.unwrapValue(
        args, targetWindow.document));
    var functionResult = fn.apply(null, unwrappedArgs);
    response = bot.inject.wrapResponse(functionResult);
  } catch (ex) {
    response = bot.inject.wrapError(ex);
  }
  return goog.json.serialize(response);
};
// Copyright 2012 WebDriver committers
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for handling application cache.
 */

goog.provide('webdriver.atoms.inject.storage.appcache');

goog.require('bot.inject');
goog.require('webdriver.atoms.storage.appcache');


/**
 * Gets the status of the application cache.
 *
 * @return {string} The status of the application cache.
 */
webdriver.atoms.inject.storage.appcache.getStatus = function() {
  return /**@type {string}*/(bot.inject.executeScript(
      webdriver.atoms.storage.appcache.getStatus, [], true));
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for querying the DOM.
 */

goog.provide('webdriver.atoms.inject.dom');

goog.require('bot.dom');
goog.require('bot.userAgent');
goog.require('webdriver.atoms.element');
goog.require('webdriver.atoms.inject');


/**
 * Gets the visisble text for the given element.
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} The visible text wrapped in a JSON string as defined by the
 *     WebDriver wire protocol.
 */
webdriver.atoms.inject.dom.getText = function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      bot.dom.getVisibleText, [element], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} A boolean describing whether the element is
 *     checked or selected wrapped in a JSON string as defined by
 *     the wire protocol.
 */
webdriver.atoms.inject.dom.isSelected = function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      bot.dom.isSelected, [element], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} The coordinates of the top left corner in a JSON
 *     string as defined by the wire protocol.
 */
webdriver.atoms.inject.dom.getTopLeftCoordinates =
    function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      webdriver.atoms.element.getLocationInView, [element], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {string} attribute The attribute to look up.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} The requested attribute value in a JSON string
 *     as defined by the wire protocol.
 */
webdriver.atoms.inject.dom.getAttributeValue =
    function(element, attribute, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      webdriver.atoms.element.getAttribute, [element, attribute], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} The element size in a JSON string as
 *     defined by the wire protocol.
 */
webdriver.atoms.inject.dom.getSize = function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      getSize, [element], opt_window);

  function getSize(e) {
    var rect = bot.dom.getClientRect(e);
    var height = rect.height;
    var width = rect.width;
    if (!bot.userAgent.IE_DOC_PRE10) {
      // On IE10, getBoundingClientRect returns floating point values.
      width = Math.floor(width);
      height = Math.floor(height);
    }
    return { 'width': width, 'height': height };
  }
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {string} property The property to look up.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} The value of the requested CSS property in a JSON
 *     string as defined by the wire protocol.
 */
webdriver.atoms.inject.dom.getValueOfCssProperty =
    function(element, property, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      bot.dom.getEffectiveStyle, [element, property], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to query.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} A boolean describing whether the element is enabled
 *     in a JSON string as defined by the wire protocol.
 */
webdriver.atoms.inject.dom.isEnabled = function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      bot.dom.isEnabled, [element], opt_window);
};


/**
 * @param {{bot.inject.ELEMENT_KEY: string}} element The element to check.
 * @param {{WINDOW: string}=} opt_window The optional window
 *     containing the element.
 * @return {string} true if the element is visisble, false otherwise.
 *     The result is wrapped in a JSON string as defined by the wire
 *     protocol.
 */
webdriver.atoms.inject.dom.isDisplayed = function(element, opt_window) {
  return webdriver.atoms.inject.dom.executeDomFunction_(
      bot.dom.isShown, [element, /*ignoreOpacity=*/true], opt_window);
};


/**
 * @param {Function} fn The function to call.
 * @param {Array.<*>} args An array of function arguments for the function.
 * @param {{WINDOW: string}=} opt_window The window context for
 *     the execution of the function.
 * @return {string} The serialized JSON wire protocol result of the function.
 */
webdriver.atoms.inject.dom.executeDomFunction_ =
    function(fn, args, opt_window) {
  var response;
  try {
    var targetWindow = webdriver.atoms.inject.getWindow(opt_window);
    var unwrappedArgs = /**@type {Object}*/(bot.inject.unwrapValue(args,
        targetWindow.document));
    var functionResult = fn.apply(null, unwrappedArgs);
    response = bot.inject.wrapResponse(functionResult);
  } catch (ex) {
    response = bot.inject.wrapError(ex);
  }
  return goog.json.serialize(response);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Wrapping execute script to use a serialized window object.
 *
 */

goog.provide('webdriver.atoms.inject');

goog.require('bot.inject');
goog.require('bot.inject.cache');


/**
 * Wrapper to allow passing a seliazed window object to executeScript.
 *
 * @param {!(string|Function)} fn The function to execute.
 * @param {Array.<*>} args Array of arguments to pass to fn.
 * @param {{WINDOW: string}=} opt_window The serialized window object to be
 *     read from the cache.
 * @return {string} The response object, serialized and returned in string
 *     format.
 */
webdriver.atoms.inject.executeScript = function(fn, args, opt_window) {
  return /**@type {string}*/(bot.inject.executeScript(fn, args, true,
      webdriver.atoms.inject.getWindow(opt_window)));
};


/**
 *
 * @param {!(string|Function)} fn The function to execute.
 * @param {Array.<*>} args Array of arguments to pass to fn.
 * @param {number} timeout The timeout to wait up to in millis.
 * @param {function(string)|function(!bot.response.ResponseObject)} onDone
 *     The function to call when the given {@code fn} invokes its callback,
 *     or when an exception or timeout occurs. This will always be called.
 * @param {{WINDOW: string}=} opt_window The serialized window
 *     object to be read from the cache.
 */
webdriver.atoms.inject.executeAsyncScript =
    function(fn, args, timeout, onDone, opt_window) {
  bot.inject.executeAsyncScript(
      fn, args, timeout, onDone, true,
      webdriver.atoms.inject.getWindow(opt_window));
};


/**
 * Decodes a serialized {WINDOW: string} object using the current document's
 * cache.
 *
 * @param {{WINDOW: string}=} opt_window The serialized window object to be
 *     read from the cache. If undefined, this function will trivially return
 *     the current window.
 * @return {!Window} A reference to a window.
 * @throws {bot.Error} If the serialized window cannot be found in the current
 *     document's cache.
 */
webdriver.atoms.inject.getWindow = function(opt_window) {
  var win;
  if (opt_window) {
    win = bot.inject.cache.getElement(opt_window[bot.inject.WINDOW_KEY]);
  } else {
    win = window;
  }
  return /**@type {!Window}*/(win);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms to find elements in the page.
 */

goog.provide('webdriver.atoms.inject.locators');

goog.require('bot.locators');
goog.require('bot.inject');
goog.require('webdriver.atoms.inject');


/**
 * Finds an element by using the given lookup strategy.
 * @param {string} strategy The strategy to use to locate the element.
 * @param {string} using The locator to use.
 * @param {?{ELEMENT: string}=} opt_root The WebElement reference for the
 *     element to perform the search under. If not specified, will use
 *     {@code document} for the target page.
 * @param {{WINDOW: string}=} opt_window The serialized window object for the
 *     page to find the element in. The referenced window must exist in the
 *     page executing this script's cache.
 * @return {string} A JSON serialized {@link bot.response.ResponseObject}.
 */
webdriver.atoms.inject.locators.findElement = function(
    strategy, using, opt_root, opt_window) {
  return webdriver.atoms.inject.locators.performSearch_(
      strategy, using, bot.locators.findElement, opt_root, opt_window);
};


/**
 * Finds all elements by using the given lookup strategy.
 * @param {string} strategy The strategy to use to locate the element.
 * @param {string} using The locator to use.
 * @param {?{ELEMENT: string}=} opt_root The WebElement reference for the
 *     element to perform the search under. If not specified, will use
 *     {@code document} for the target page.
 * @param {{WINDOW: string}=} opt_window The serialized window object for the
 *     page to find the element in. The referenced window must exist in the
 *     page executing this script's cache.
 * @return {string} A JSON serialized {@link bot.response.ResponseObject}.
 */
webdriver.atoms.inject.locators.findElements = function(
    strategy, using, opt_root, opt_window) {
  return webdriver.atoms.inject.locators.performSearch_(
      strategy, using, bot.locators.findElements, opt_root, opt_window);
};


/**
 * Performs a search for one or more elements.
 * @param {string} strategy The strategy to use to locate the element.
 * @param {string} target The locator to use.
 * @param {(function(!Object, (Document|Element)=): Element|
 *          function(!Object, (Document|Element)=): !goog.array.ArrayLike)}
 *     searchFn The search function to invoke.
 * @param {?{ELEMENT: string}=} opt_root The WebElement reference for the
 *     element to perform the search under. If not specified, will use
 *     {@code document} for the target page.
 * @param {{WINDOW: string}=} opt_window The serialized window object for the
 *     page to find the element in. The referenced window must exist in the
 *     page executing this script's cache.
 * @return {string} A JSON serialized {@link bot.response.ResponseObject}.
 * @private
 */
webdriver.atoms.inject.locators.performSearch_ = function(
    strategy, target, searchFn, opt_root, opt_window) {
  var locator = {};
  locator[strategy] = target;

  var response;
  try {
    // Step 1: find the window we are locating the element in.
    var targetWindow = webdriver.atoms.inject.getWindow(opt_window);

    // Step 2: decode the root of our search.
    var root;
    if (opt_root) {
      root = /** @type {!Element} */ (bot.inject.cache.getElement(
          opt_root[bot.inject.ELEMENT_KEY], targetWindow.document));
    } else {
      root = targetWindow.document;
    }

    // Step 3: perform the search.
    var found = searchFn(locator, root);

    // Step 4: encode our response.
    response = bot.inject.wrapResponse(found);
  } catch (ex) {
    response = bot.inject.wrapError(ex);
  }
  return goog.json.serialize(response);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for handling frames.
 */

goog.provide('webdriver.atoms.inject.frame');

goog.require('bot.frame');
goog.require('bot.inject.cache');
goog.require('webdriver.atoms.inject');


/**
 * Finds a frame by id or name.
 *
 * @param {string} idOrName The frame id or name.
 * @param {{bot.inject.WINDOW_KEY: string}=} opt_root The wrapped window to
 *     perform the search under. Defaults to window.
 * @return {string} A frame element wrapped in a JSON string as defined by
 *     the wire protocol.
 */
webdriver.atoms.inject.frame.findFrameByIdOrName =
    function(idOrName, opt_root) {
  return webdriver.atoms.inject.executeScript(bot.frame.findFrameByNameOrId,
      [idOrName, opt_root]);
};


/**
 * @return {string} A string representing the currently active element.
 */
webdriver.atoms.inject.frame.activeElement = function() {
  return webdriver.atoms.inject.executeScript(bot.frame.activeElement, []);
};


/**
 * Finds a frame by index.
 *
 * @param {number} index The index of the frame to search for.
 * @param {!Window=} opt_root The window to perform the search under.
 * If not specified window is used as the default.
 * @return {string} A frame element wrapped in a JSON string as defined by
 *     the wire protocol.
 */
webdriver.atoms.inject.frame.findFrameByIndex = function(index, opt_root) {
  return webdriver.atoms.inject.executeScript(bot.frame.findFrameByIndex,
      [index, opt_root]);
};


/**
 * @return {string} The default content of the current page,
 *     which is the top window.
 */
webdriver.atoms.inject.frame.defaultContent = function() {
  return webdriver.atoms.inject.executeScript(bot.frame.defaultContent, []);
};


/**
 * @param {!{bot.inject.ELEMENT_KEY:string}} element The element to query.
 * @return {string} The window corresponding to the frame element
 *     wrapped in a JSON string as defined by the wire protocol.
 */
webdriver.atoms.inject.frame.getFrameWindow = function(element) {
  return webdriver.atoms.inject.executeScript(bot.frame.getFrameWindow,
      [element]);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for handling local storage.
 */

goog.provide('webdriver.atoms.inject.storage.local');

goog.require('webdriver.atoms.inject');
goog.require('webdriver.atoms.storage.local');


/**
 * Sets an item in the local storage.
 *
 * @param {string} key The key of the item.
 * @param {*} value The value of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.setItem = function(key, value) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.setItem, [key, value]);
};


/**
 * Gets an item from the local storage.
 *
 * @param {string} key The key of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.getItem = function(key) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.getItem, [key]);
};


/**
 * Gets the key set of the entries.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.keySet = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.keySet, []);
};


/**
 * Removes an item in the local storage.
 *
 * @param {string} key The key of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.removeItem = function(key) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.removeItem, [key]);
};


/**
 * Clears the local storage.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.clear = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.clear, []);
};


/**
 * Gets the size of the local storage.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.local.size = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.local.size, []);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for handling session storage.
 */

goog.provide('webdriver.atoms.inject.storage.session');

goog.require('webdriver.atoms.inject');
goog.require('webdriver.atoms.storage.session');


/**
 * Sets an item in the session storage.
 *
 * @param {string} key The key of the item.
 * @param {*} value The value of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.setItem = function(key, value) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.setItem, [key, value]);
};


/**
 * Gets an item from the session storage.
 *
 * @param {string} key The key of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.getItem = function(key) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.getItem, [key]);
};


/**
 * Gets the key set of the entries.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.keySet = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.keySet, []);
};


/**
 * Removes an item in the session storage.
 *
 * @param {string} key The key of the item.
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.removeItem = function(key) {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.removeItem, [key]);
};


/**
 * Clears the session storage.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.clear = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.clear, []);
};


/**
 * Gets the size of the session storage.
 *
 * @return {string} The stringified result wrapped according to the wire
 *     protocol.
 */
webdriver.atoms.inject.storage.session.size = function() {
  return webdriver.atoms.inject.executeScript(
      webdriver.atoms.storage.session.size, []);
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Ready to inject atoms for handling web SQL database.
 */

goog.provide('webdriver.atoms.inject.storage.database');

goog.require('bot.Error');
goog.require('bot.ErrorCode');
goog.require('bot.storage.database');
goog.require('webdriver.atoms.inject');


/**
 * Executes the given query in the Web SQL database specified.
 *
 * @param {string} databaseName The name of the database.
 * @param {string} query The SQL statement.
 * @param {Array.<*>} args Arguments to pass to the query.
 * @param {function(string)} onDone The callback to invoke when done. The
 *     result, according to the wire protocol, will be passed to this callback.
 */
webdriver.atoms.inject.storage.database.executeSql =
    function(databaseName, query, args, onDone) {
  var onSuccessCallback = function(tx, result) {
    onDone(webdriver.atoms.inject.executeScript(function(res) {
      return result;
    }, [result]));
  };

  var onErrorCallback = function(error) {
    onDone(webdriver.atoms.inject.executeScript(function() {
      throw new bot.Error(bot.ErrorCode.SQL_DATABASE_ERROR,
          'SQL Error Code: ' + error.code + '. SQL Error Message: ' +
          error.message);
    }, []));
  };

  bot.storage.database.executeSql(
      databaseName, query, args, onSuccessCallback, onErrorCallback);
};
// Copyright 2012 WebDriver committers
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility functions for accessing HTML5 appcache object.
 * These functions are wrapper of the functions of individual method of
 * bot.storage.Storage class. An extra redirection is used to define
 * individual functional unit (atom) for injecting in Webdriver.
 */

goog.provide('webdriver.atoms.storage.appcache');

goog.require('bot.appcache');


/**
 * Returns the status of the appcache.
 * @return {number} status of the appcache.
 */
webdriver.atoms.storage.appcache.getStatus = function() {
  return bot.appcache.getStatus();
};
// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility functions for accessing HTML5 localStorage object.
 * These functions are wrapper of the functions of individual method of
 * bot.storage.Storage class. An extra redirection is used to define
 * individual functional unit (atom) for injecting in Webdriver.
 */

goog.provide('webdriver.atoms.storage.local');

goog.require('bot.storage');


/**
 * Utility function to set the value of a key/value pair in localStorage.
 * @param {string} key The key of the item.
 * @param {*} value The value of the item.
 */
webdriver.atoms.storage.local.setItem = function(key, value) {
  bot.storage.getLocalStorage().setItem(key, value);
};


/**
 * Returns the value item of a key in the localStorage object.
 * @param {string} key The key of the returned value.
 * @return {?string} The mapped value if present in the localStorage object,
 *     otherwise null.
 */
webdriver.atoms.storage.local.getItem = function(key) {
  return bot.storage.getLocalStorage().getItem(key);
};


/**
 * Returns an array of keys of all keys of the localStorage object.
 * @return {Array.<string>} The array of stored keys.
 */
webdriver.atoms.storage.local.keySet = function() {
  return bot.storage.getLocalStorage().keySet();
};


/**
 * Removes an item with a given key.
 * @param {string} key The key of the key/value pair.
 * @return {?string} The removed value if present, otherwise null.
 */
webdriver.atoms.storage.local.removeItem = function(key) {
  return bot.storage.getLocalStorage().removeItem(key);
};


/**
 * Removes all items from the localStorage object.
 */
webdriver.atoms.storage.local.clear = function() {
  bot.storage.getLocalStorage().clear();
};


/**
 * Returns the number of items in the localStorage object.
 * @return {number} The number of the key/value pairs.
 */
webdriver.atoms.storage.local.size = function() {
  return bot.storage.getLocalStorage().size();
};


/**
 * Returns the key item of the key/value pairs in the localStorage object
 * of a given index.
 * @param {number} index The index of the key/value pair list.
 * @return {?string} The key item of a given index.
 */
webdriver.atoms.storage.local.key = function(index) {
  return bot.storage.getLocalStorage().key(index);
};

// Copyright 2011 WebDriver committers
// Copyright 2011 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility functions for accessing HTML5 sessionStorage object.
 * These functions are wrapper of the functions of individual method of
 * bot.storage.Storage class. An extra redirection is used to define
 * individual functional unit (atom) for injecting in Webdriver.
 */

goog.provide('webdriver.atoms.storage.session');

goog.require('bot.storage');


/**
 * Utility function to set the value of a key/value pair in sessionStorage.
 * @param {string} key The key of the item.
 * @param {*} value The value of the item.
 */
webdriver.atoms.storage.session.setItem = function(key, value) {
  bot.storage.getSessionStorage().setItem(key, value);
};


/**
 * Returns the value item of a key in the sessionStorage object.
 * @param {string} key The key of the returned value.
 * @return {?string} The mapped value if present in the sessionStorage object,
 *     otherwise null.
 */
webdriver.atoms.storage.session.getItem = function(key) {
  return bot.storage.getSessionStorage().getItem(key);
};


/**
 * Returns an array of keys of all keys of the sessionStorage object.
 * @return {Array.<string>} The array of stored keys..
 */
webdriver.atoms.storage.session.keySet = function() {
  return bot.storage.getSessionStorage().keySet();
};


/**
 * Removes an item with a given key.
 * @param {string} key The key of the key/value pair.
 * @return {?string} The removed value if present, otherwise null.
 */
webdriver.atoms.storage.session.removeItem = function(key) {
  return bot.storage.getSessionStorage().removeItem(key);
};


/**
 * Removes all items from the sessionStorage object.
 */
webdriver.atoms.storage.session.clear = function() {
  bot.storage.getSessionStorage().clear();
};


/**
 * Returns the number of items in the sessionStorage object.
 * @return {number} The number of the key/value pairs.
 */
webdriver.atoms.storage.session.size = function() {
  return bot.storage.getSessionStorage().size();
};


/**
 * Returns the key item of the key/value pairs in the sessionStorage object
 * of a given index.
 * @param {number} index The index of the key/value pair list.
 * @return {?string} The key item of a given index.
 */
webdriver.atoms.storage.session.key = function(index) {
  return bot.storage.getSessionStorage().key(index);
};

/**
 * @fileoverview Common e2e test setup.
 */

goog.provide('webdriver.test.e2e.setup');

goog.require('goog.debug.TextFormatter');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.string');
goog.require('goog.userAgent.product');
goog.require('webdriver.browser');
goog.require('webdriver.testing.assert');
/** @suppress {extraRequire} Bootstraps the test framework. */
goog.require('webdriver.testing.jsunit');


if (window.console) {
  var formatter = new goog.debug.TextFormatter();
  formatter.showAbsoluteTime = false;
  formatter.showExceptionText = true;
  formatter.showSeverityLevel = true;

  goog.log.addHandler(goog.log.getLogger(''), function(logRecord) {
    console.log(goog.string.trimRight(
    formatter.formatRecord(logRecord)));
  });
}

var assert = webdriver.testing.assert;
var container;
var driver;


function shouldRunTests() {
  // Command handlers have only been fine tuned for Chrome.
  return goog.userAgent.product.CHROME;
}

function setUp() {
  container = goog.dom.createElement(goog.dom.TagName.DIV);
  goog.dom.appendChild(goog.dom.getDocument().body, container);

  var frame = goog.dom.createElement(goog.dom.TagName.IFRAME);
  frame.style.width = '600px';
  frame.style.height = '300px';
  goog.dom.appendChild(container, frame);

  var win = goog.dom.getFrameContentWindow(frame);
  driver = webdriver.browser.createDriver(win);
}


function tearDown() {
  driver.quit();
  if (container) {
    goog.dom.removeNode(container);
  }
}
