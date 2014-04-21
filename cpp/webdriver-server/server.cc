// Copyright 2011 Software Freedom Conservancy
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

#include <regex>
#include "server.h"
#include "logging.h"

#define SERVER_DEFAULT_PAGE "<html><head><title>WebDriver</title></head><body><p id='main'>This is the initial start page for the WebDriver server.</p></body></html>"
#define HTML_CONTENT_TYPE "text/html"
#define JSON_CONTENT_TYPE "application/json"

namespace webdriver {

Server::Server(const int port) {
  this->Initialize(port, "", "", "");
}

Server::Server(const int port, const std::string& host) {
  this->Initialize(port, host, "", "");
}

Server::Server(const int port,
               const std::string& host,
               const std::string& log_level,
               const std::string& log_file) {
  this->Initialize(port, host, log_level, log_file);
}

Server::~Server(void) {
  SessionMap::iterator it = this->sessions_.begin();
  for (; it != this->sessions_.end(); ++it) {
    std::string session_id = it->first;
    this->ShutDownSession(session_id);
  }
}

void Server::Initialize(const int port,
                        const std::string& host,
                        const std::string& log_level,
                        const std::string& log_file) {
  LOG::Level(log_level);
  LOG::File(log_file);
  LOG(INFO) << "Starting WebDriver server on port: '" << port << "' on host: '" << host << "'";
  this->port_ = port;
  this->host_ = host;
  this->PopulateCommandRepository();
}

void* Server::OnHttpEvent(enum mg_event event_raised,
                          struct mg_connection* conn,
                          const struct mg_request_info* request_info) {
  LOG(TRACE) << "Entering Server::OnHttpEvent";

  // Mongoose calls method with the following events:
  // - MG_EVENT_LOG - on crying to log
  // - MG_NEW_REQUEST - on processing new HTTP request
  // - MG_HTTP_ERROR - on sending HTTP error
  // - MG_REQUEST_COMPLETE - on request processing is completed (in last version of code)
  int handler_result_code = 0;
  if (event_raised == MG_NEW_REQUEST) {
    handler_result_code = reinterpret_cast<Server*>(request_info->user_data)->
        ProcessRequest(conn, request_info);
  } else if (event_raised == MG_EVENT_LOG) {
    LOG(WARN) << "Mongoose log event: " << request_info->log_message;
  } else if (event_raised == MG_HTTP_ERROR) {
    // do nothing due it will be reported as MG_EVENT_LOG with more info
  }

  return reinterpret_cast<void*>(handler_result_code);
}

bool Server::Start() {
  LOG(TRACE) << "Entering Server::Start";
  std::string port_format_string = "%s:%d";
  if (this->host_.size() == 0) {
    // If the host name is an empty string, then we don't want the colon
    // in the listening ports string. Remove it from the format string,
    // and when we use printf to format, the %s will be replaced by an
    // empty string.
    port_format_string = "%s%d";
  }
  int formatted_string_size = _scprintf(port_format_string.c_str(),
                                        this->host_.c_str(),
                                        this->port_);
  char* listening_ports_buffer = new char[formatted_string_size + 1];
  _snprintf_s(listening_ports_buffer,
              formatted_string_size + 1,
              formatted_string_size,
              port_format_string.c_str(),
              this->host_.c_str(),
              this->port_);

  std::string acl = "-0.0.0.0/0,+127.0.0.1";
  LOG(DEBUG) << "Mongoose ACL is " << acl;

  const char* options[] = { "listening_ports", listening_ports_buffer,
                            "access_control_list", acl.c_str(),
                            // "enable_keep_alive", "yes",
                            NULL };
  context_ = mg_start(&OnHttpEvent, this, options);
  if (context_ == NULL) {
    LOG(WARN) << "Failed to start Mongoose";
    return false;
  }
  return true;
}

void Server::Stop() {
  LOG(TRACE) << "Entering Server::Stop";
  if (context_) {
    mg_stop(context_);
    context_ = NULL;
  }
}

int Server::ProcessRequest(struct mg_connection* conn,
    const struct mg_request_info* request_info) {
  LOG(TRACE) << "Entering Server::ProcessRequest";

  int http_response_code = NULL;
  std::string http_verb = request_info->request_method;
  std::string request_body = "{}";
  if (http_verb == "POST") {
    request_body = this->ReadRequestBody(conn, request_info);
  }

  LOG(TRACE) << "Process request with:"
             << " URI: "  << request_info->uri
             << " HTTP verb: " << http_verb << std::endl
             << "body: " << request_body;

  if (strcmp(request_info->uri, "/") == 0) {
    this->SendHttpOk(conn,
                     request_info,
                     SERVER_DEFAULT_PAGE,
                     HTML_CONTENT_TYPE);
    http_response_code = 200;
  } else if (strcmp(request_info->uri, "/shutdown") == 0) {
    this->SendHttpOk(conn,
                     request_info,
                     SERVER_DEFAULT_PAGE,
                     HTML_CONTENT_TYPE);
    http_response_code = 200;
    this->ShutDown();
  } else {
    std::string serialized_response = this->DispatchCommand(request_info->uri,
                                                             http_verb,
                                                             request_body);
    http_response_code = this->SendResponseToClient(conn,
                                                    request_info,
                                                    serialized_response);
  }

  return http_response_code;
}

void Server::AddCommand(const std::string& url,
                        const std::string& http_verb,
                        const std::string& command_name) {
  this->commands_[url][http_verb] = command_name;
}

std::string Server::CreateSession() {
  LOG(TRACE) << "Entering Server::CreateSession";

  SessionHandle session_handle= this->InitializeSession();
  std::string session_id = session_handle->session_id();
  this->sessions_[session_id] = session_handle;
  return session_id;
}

void Server::ShutDownSession(const std::string& session_id) {
  LOG(TRACE) << "Entering Server::ShutDownSession";

  SessionMap::iterator it = this->sessions_.find(session_id);
  if (it != this->sessions_.end()) {
    it->second->ShutDown();
    this->sessions_.erase(session_id);
  } else {
    LOG(DEBUG) << "Shutdown session is not found";
  }
}

std::string Server::ReadRequestBody(struct mg_connection* conn,
    const struct mg_request_info* request_info) {
  LOG(TRACE) << "Entering Server::ReadRequestBody";

  std::string request_body = "";
  int content_length = 0;
  for (int header_index = 0; header_index < 64; ++header_index) {
    if (request_info->http_headers[header_index].name == NULL) {
      break;
    }
    if (strcmp(request_info->http_headers[header_index].name,
               "Content-Length") == 0) {
      content_length = atoi(request_info->http_headers[header_index].value);
      break;
    }
  }
  if (content_length == 0) {
    request_body = "{}";
  } else {
    std::vector<char> buffer(content_length + 1);
    int bytes_read = 0;
    while (bytes_read < content_length) {
      bytes_read += mg_read(conn,
                            &buffer[bytes_read],
                            content_length - bytes_read);
    }
    buffer[content_length] = '\0';
    request_body.append(&buffer[0]);
  }

  return request_body;
}

std::string Server::DispatchCommand(const std::string& uri,
                                     const std::string& http_verb,
                                     const std::string& command_body) {
  LOG(TRACE) << "Entering Server::DispatchCommand";

  std::string session_id = "";
  std::string locator_parameters = "";
  std::string serialized_response = "";
  std::string command = this->LookupCommand(uri,
                                            http_verb,
                                            &session_id,
                                            &locator_parameters);
  LOG(DEBUG) << "Command: " << http_verb << " " << uri << " " << command_body;

  if (command == webdriver::CommandType::NoCommand) {
    if (locator_parameters.size() != 0) {
      // Hand-code the response for an invalid HTTP verb for URL
      serialized_response.append("{ \"status\" : 405, ");
      serialized_response.append("\"sessionId\" : \"<no session>\", ");
      serialized_response.append("\"value\" : \"");
      serialized_response.append(locator_parameters);
      serialized_response.append("\" }");
    } else {
      // Hand-code the response for an unknown URL
      serialized_response.append("{ \"status\" : 404, ");
      serialized_response.append("\"sessionId\" : \"<no session>\", ");
      serialized_response.append("\"value\" : \"Command not found: ");
      serialized_response.append(http_verb);
      serialized_response.append(" ");
      serialized_response.append(uri);
      serialized_response.append("\" }");
    }
  } else if (command == webdriver::CommandType::Status) {
    // Status command must be handled by the server, not by the session.
    serialized_response = this->GetStatus();
  } else if (command == webdriver::CommandType::GetSessionList) {
    // GetSessionList command must be handled by the server,
    // not by the session.
    serialized_response = this->ListSessions();
  } else {
    if (command == webdriver::CommandType::NewSession) {
      session_id = this->CreateSession();
    }

    SessionHandle session_handle = NULL;
    if (!this->LookupSession(session_id, &session_handle)) {
      if (command == webdriver::CommandType::Quit) {
        // Calling quit on an invalid session should be a no-op.
        // Hand-code the response for quit on an invalid (already
        // quit) session.
        serialized_response.append("{ \"status\" : 0, ");
        serialized_response.append("\"sessionId\" : \"");
        serialized_response.append(session_id);
        serialized_response.append("\", ");
        serialized_response.append("\"value\" : null }");
      } else {
        // Hand-code the response for an invalid session id
        serialized_response.append("{ \"status\" : 6, ");
        serialized_response.append("\"sessionId\" : \"");
        serialized_response.append(session_id);
        serialized_response.append("\", ");
        serialized_response.append("\"value\" : \"session ");
        serialized_response.append(session_id);
        serialized_response.append(" does not exist\" }");
      }
    } else {
      // Compile the serialized JSON representation of the command by hand.
      std::string serialized_command = "{ \"command\" : \"" + command + "\"";
      serialized_command.append(", \"locator\" : ");
      serialized_command.append(locator_parameters);
      serialized_command.append(", \"parameters\" : ");
      serialized_command.append(command_body);
      serialized_command.append(" }");
      bool session_is_valid = session_handle->ExecuteCommand(
          serialized_command,
          &serialized_response);
      if (!session_is_valid) {
        this->ShutDownSession(session_id);
      }
    }
  }
  LOG(DEBUG) << "Response: " << serialized_response;
  return serialized_response;
}

std::string Server::ListSessions() {
  LOG(TRACE) << "Entering Server::ListSessions";

  // Manually construct the serialized command for getting 
  // session capabilities.
  std::string get_caps_command = "{ \"command\" : \"" + webdriver::CommandType::GetSessionCapabilities + "\"" +
                                 ", \"locator\" : {}, \"parameters\" : {} }";

  Json::Value sessions(Json::arrayValue);
  SessionMap::iterator it = this->sessions_.begin();
  for (; it != this->sessions_.end(); ++it) {
    // Each element of the GetSessionList command is an object with two
    // named properties, "id" and "capabilities". We already know the
    // ID, so we execute the GetSessionCapabilities command on each session
    // to be able to return the capabilities.
    Json::Value session_descriptor;
    session_descriptor["id"] = it->first;

    SessionHandle session = it->second;
    std::string serialized_session_response;
    session->ExecuteCommand(get_caps_command, &serialized_session_response);

    Response session_response;
    session_response.Deserialize(serialized_session_response);
    session_descriptor["capabilities"] = session_response.value();
    sessions.append(session_descriptor);
  }
  Response response;
  response.SetSuccessResponse(sessions);
  return response.Serialize();
}

bool Server::LookupSession(const std::string& session_id,
                           SessionHandle* session_handle) {
  LOG(TRACE) << "Entering Server::LookupSession";

  SessionMap::iterator it = this->sessions_.find(session_id);
  if (it == this->sessions_.end()) {
    return false;
  }
  *session_handle = it->second;
  return true;
}

int Server::SendResponseToClient(struct mg_connection* conn,
                                 const struct mg_request_info* request_info,
                                 const std::string& serialized_response) {
  LOG(TRACE) << "Entering Server::SendResponseToClient";

  int return_code = 0;
  if (serialized_response.size() > 0) {
    Response response;
    response.Deserialize(serialized_response);
    return_code = response.status_code();
    if (return_code == 0) {
      this->SendHttpOk(conn,
                       request_info,
                       serialized_response,
                       JSON_CONTENT_TYPE);
      return_code = 200;
    } else if (return_code == 200) {
      this->SendHttpOk(conn,
                       request_info,
                       serialized_response,
                       HTML_CONTENT_TYPE);
    } else if (return_code == 303) {
      std::string location = response.value().asString();
      response.SetSuccessResponse(response.value());
      this->SendHttpSeeOther(conn, request_info, location);
      return_code = 303;
    } else if (return_code == 400) {
      this->SendHttpBadRequest(conn, request_info, serialized_response);
      return_code = 400;
    } else if (return_code == 404) {
      this->SendHttpNotFound(conn, request_info, serialized_response);
      return_code = 404;
    } else if (return_code == 405) {
      std::string parameters = response.value().asString();
      this->SendHttpMethodNotAllowed(conn, request_info, parameters);
      return_code = 405;
    } else if (return_code == 501) {
      this->SendHttpNotImplemented(conn,
                                   request_info,
                                   "");
      return_code = 501;
    } else {
      this->SendHttpInternalError(conn, request_info, serialized_response);
      return_code = 500;
    }
  }
  return return_code;
}

// The standard HTTP Status codes are implemented below.  Chrome uses
// OK, See Other, Not Found, Method Not Allowed, and Internal Error.
// Internal Error, HTTP 500, is used as a catch all for any issue
// not covered in the JSON protocol.
void Server::SendHttpOk(struct mg_connection* connection,
                        const struct mg_request_info* request_info,
                        const std::string& body,
                        const std::string& content_type) {
  LOG(TRACE) << "Entering Server::SendHttpOk";

  std::ostringstream out;
  out << "HTTP/1.1 200 OK\r\n"
    << "Content-Length: " << strlen(body.c_str()) << "\r\n"
    << "Content-Type: " << content_type << "; charset=UTF-8\r\n"
    << "Vary: Accept-Charset, Accept-Encoding, Accept-Language, Accept\r\n"
    << "Accept-Ranges: bytes\r\n"
    << "Connection: close\r\n\r\n";
  if (strcmp(request_info->request_method, "HEAD") != 0) {
    out << body << "\r\n";
  }

  mg_write(connection, out.str().c_str(), out.str().size());
}

void Server::SendHttpBadRequest(struct mg_connection* const connection,
                                const struct mg_request_info* request_info,
                                const std::string& body) {
  LOG(TRACE) << "Entering Server::SendHttpBadRequest";

  std::ostringstream out;
  out << "HTTP/1.1 400 Bad Request\r\n"
    << "Content-Length: " << strlen(body.c_str()) << "\r\n"
    << "Content-Type: application/json; charset=UTF-8\r\n"
    << "Vary: Accept-Charset, Accept-Encoding, Accept-Language, Accept\r\n"
    << "Accept-Ranges: bytes\r\n"
    << "Connection: close\r\n\r\n";
  if (strcmp(request_info->request_method, "HEAD") != 0) {
    out << body << "\r\n";
  }

  mg_printf(connection, "%s", out.str().c_str());
}

void Server::SendHttpInternalError(struct mg_connection* connection,
                                   const struct mg_request_info* request_info,
                                   const std::string& body) {
  LOG(TRACE) << "Entering Server::SendHttpInternalError";

  std::ostringstream out;
  out << "HTTP/1.1 500 Internal Server Error\r\n"
    << "Content-Length: " << strlen(body.c_str()) << "\r\n"
    << "Content-Type: application/json; charset=UTF-8\r\n"
    << "Vary: Accept-Charset, Accept-Encoding, Accept-Language, Accept\r\n"
    << "Accept-Ranges: bytes\r\n"
    << "Connection: close\r\n\r\n";
  if (strcmp(request_info->request_method, "HEAD") != 0) {
    out << body << "\r\n";
  }

  mg_write(connection, out.str().c_str(), out.str().size());
}

void Server::SendHttpNotFound(struct mg_connection* const connection,
                              const struct mg_request_info* request_info,
                              const std::string& body) {
  LOG(TRACE) << "Entering Server::SendHttpNotFound";

  std::ostringstream out;
  out << "HTTP/1.1 404 Not Found\r\n"
    << "Content-Length: " << strlen(body.c_str()) << "\r\n"
    << "Content-Type: application/json; charset=UTF-8\r\n"
    << "Vary: Accept-Charset, Accept-Encoding, Accept-Language, Accept\r\n"
    << "Accept-Ranges: bytes\r\n"
    << "Connection: close\r\n\r\n";
  if (strcmp(request_info->request_method, "HEAD") != 0) {
    out << body << "\r\n";
  }

  mg_printf(connection, "%s", out.str().c_str());
}

void Server::SendHttpMethodNotAllowed(
    struct mg_connection* connection,
    const struct mg_request_info* request_info,
    const std::string& allowed_methods) {
  LOG(TRACE) << "Entering Server::SendHttpMethodNotAllowed";

  std::ostringstream out;
  out << "HTTP/1.1 405 Method Not Allowed\r\n"
    << "Content-Type: text/html\r\n"
    << "Content-Length: 0\r\n"
    << "Allow: " << allowed_methods << "\r\n\r\n";

  mg_write(connection, out.str().c_str(), out.str().size());
}

void Server::SendHttpNotImplemented(struct mg_connection* connection,
                                    const struct mg_request_info* request_info,
                                    const std::string& body) {
  LOG(TRACE) << "Entering Server::SendHttpNotImplemented";

  std::ostringstream out;
  out << "HTTP/1.1 501 Not Implemented\r\n\r\n";

  mg_write(connection, out.str().c_str(), out.str().size());
}

void Server::SendHttpSeeOther(struct mg_connection* connection,
                              const struct mg_request_info* request_info,
                              const std::string& location) {
  LOG(TRACE) << "Entering Server::SendHttpSeeOther";

  std::ostringstream out;
  out << "HTTP/1.1 303 See Other\r\n"
    << "Location: " << location << "\r\n"
    << "Content-Type: text/html\r\n"
    << "Content-Length: 0\r\n\r\n";

  mg_write(connection, out.str().c_str(), out.str().size());
}

std::string Server::LookupCommand(const std::string& uri,
                                  const std::string& http_verb,
                                  std::string* session_id,
                                  std::string* locator) {
  LOG(TRACE) << "Entering Server::LookupCommand";

  std::string value = webdriver::CommandType::NoCommand;
  UrlMap::const_iterator it = this->commands_.begin();
  for (; it != this->commands_.end(); ++it) {
    std::string url_candidate = it->first;
    std::vector<std::string> locator_param_names;
    std::vector<std::string> locator_param_values;
    if (this->IsCommandMatch(uri, url_candidate, &locator_param_names, &locator_param_values)) {
      VerbMap::const_iterator verb_iterator = it->second.find(http_verb);
      if (verb_iterator != it->second.end()) {
        value = verb_iterator->second;
        std::string param = this->ConstructLocatorParameterJson(locator_param_names,
                                                                locator_param_values,
                                                                session_id);
        locator->append(param);
        break;
      } else {
        verb_iterator = it->second.begin();
        for (; verb_iterator != it->second.end(); ++verb_iterator) {
          if (locator->size() != 0) {
            locator->append(",");
          }
          locator->append(verb_iterator->first);
        }
      }
    }
  }
  return value;
}

std::string Server::ConstructLocatorParameterJson(std::vector<std::string> locator_param_names,
                                                  std::vector<std::string> locator_param_values,
                                                  std::string* session_id) {
  std::string param = "{";
  size_t param_count = locator_param_names.size();
  for (unsigned int i = 0; i < param_count; i++) {
    if (i != 0) {
      param.append(",");
    }

    param.append(" \"");
    param.append(locator_param_names[i]);
    param.append("\" : \"");
    param.append(locator_param_values[i]);
    param.append("\"");
    if (locator_param_names[i] == "sessionid") {
      session_id->append(locator_param_values[i]);
    }
  }

  param.append(" }");
  return param;
}

bool Server::IsCommandMatch(const std::string& uri,
                            const std::string& url_template,
                            std::vector<std::string>* locator_param_names,
                            std::vector<std::string>* locator_param_values) {
  std::string url_match_regex = url_template;
  size_t param_start_pos = url_match_regex.find_first_of(":");
  while (param_start_pos != std::string::npos) {
    size_t param_len = std::string::npos;
    size_t param_end_pos = url_match_regex.find_first_of("/", param_start_pos);
    if (param_end_pos != std::string::npos) {
      param_len = param_end_pos - param_start_pos;
    }

    // Skip the colon
    std::string param_name = url_match_regex.substr(param_start_pos + 1,
                                                    param_len - 1);
    locator_param_names->push_back(param_name);
    if (param_name == "sessionid" || param_name == "id") {
      url_match_regex.replace(param_start_pos, param_len, "([0-9a-fA-F-]+)");
    } else {
      url_match_regex.replace(param_start_pos, param_len, "([^/]+)");
    }
    param_start_pos = url_match_regex.find_first_of(":");
  }

  std::tr1::regex matcher("^" + url_match_regex + "$");
  std::tr1::match_results<std::string::const_iterator> matches;
  if (std::tr1::regex_search(uri, matches, matcher)) {
    size_t param_count = locator_param_names->size();
    for (unsigned int i = 0; i < param_count; i++) {
      std::string locator_param_value = matches[i + 1].str();
      locator_param_values->push_back(locator_param_value);
    }
    return true;
  }
  return false;
}

void Server::PopulateCommandRepository() {
  LOG(TRACE) << "Entering Server::PopulateCommandRepository";

  this->AddCommand("/status", "GET", webdriver::CommandType::Status);
  this->AddCommand("/session", "POST",  webdriver::CommandType::NewSession);
  this->AddCommand("/sessions", "GET",  webdriver::CommandType::GetSessionList);
  this->AddCommand("/session/:sessionid", "GET",  webdriver::CommandType::GetSessionCapabilities);
  this->AddCommand("/session/:sessionid", "DELETE",  webdriver::CommandType::Quit);
  this->AddCommand("/session/:sessionid/window_handle", "GET",  webdriver::CommandType::GetCurrentWindowHandle);
  this->AddCommand("/session/:sessionid/window_handles", "GET",  webdriver::CommandType::GetWindowHandles);
  this->AddCommand("/session/:sessionid/url", "GET",  webdriver::CommandType::GetCurrentUrl);
  this->AddCommand("/session/:sessionid/url", "POST",  webdriver::CommandType::Get);
  this->AddCommand("/session/:sessionid/forward", "POST",  webdriver::CommandType::GoForward);
  this->AddCommand("/session/:sessionid/back", "POST",  webdriver::CommandType::GoBack);
  this->AddCommand("/session/:sessionid/refresh", "POST",  webdriver::CommandType::Refresh);
  this->AddCommand("/session/:sessionid/execute", "POST",  webdriver::CommandType::ExecuteScript);
  this->AddCommand("/session/:sessionid/execute_async", "POST",  webdriver::CommandType::ExecuteAsyncScript);
  this->AddCommand("/session/:sessionid/screenshot", "GET",  webdriver::CommandType::Screenshot);
  this->AddCommand("/session/:sessionid/frame", "POST",  webdriver::CommandType::SwitchToFrame);
  this->AddCommand("/session/:sessionid/window", "POST",  webdriver::CommandType::SwitchToWindow);
  this->AddCommand("/session/:sessionid/window", "DELETE",  webdriver::CommandType::Close);
  this->AddCommand("/session/:sessionid/cookie", "GET",  webdriver::CommandType::GetAllCookies);
  this->AddCommand("/session/:sessionid/cookie", "POST",  webdriver::CommandType::AddCookie);
  this->AddCommand("/session/:sessionid/cookie", "DELETE",  webdriver::CommandType::DeleteAllCookies);
  this->AddCommand("/session/:sessionid/cookie/:name", "DELETE",  webdriver::CommandType::DeleteCookie);
  this->AddCommand("/session/:sessionid/source", "GET",  webdriver::CommandType::GetPageSource);
  this->AddCommand("/session/:sessionid/title", "GET",  webdriver::CommandType::GetTitle);
  this->AddCommand("/session/:sessionid/element", "POST",  webdriver::CommandType::FindElement);
  this->AddCommand("/session/:sessionid/elements", "POST",  webdriver::CommandType::FindElements);
  this->AddCommand("/session/:sessionid/timeouts", "POST",  webdriver::CommandType::SetTimeout);
  this->AddCommand("/session/:sessionid/timeouts/implicit_wait", "POST",  webdriver::CommandType::ImplicitlyWait);
  this->AddCommand("/session/:sessionid/timeouts/async_script", "POST",  webdriver::CommandType::SetAsyncScriptTimeout);
  this->AddCommand("/session/:sessionid/element/active", "POST",  webdriver::CommandType::GetActiveElement);
  this->AddCommand("/session/:sessionid/element/:id/element", "POST",  webdriver::CommandType::FindChildElement);
  this->AddCommand("/session/:sessionid/element/:id/elements", "POST",  webdriver::CommandType::FindChildElements);
  this->AddCommand("/session/:sessionid/element/:id", "GET",  webdriver::CommandType::DescribeElement);
  this->AddCommand("/session/:sessionid/element/:id/click", "POST",  webdriver::CommandType::ClickElement);
  this->AddCommand("/session/:sessionid/element/:id/text", "GET",  webdriver::CommandType::GetElementText);
  this->AddCommand("/session/:sessionid/element/:id/submit", "POST",  webdriver::CommandType::SubmitElement);
  this->AddCommand("/session/:sessionid/element/:id/value", "GET",  webdriver::CommandType::GetElementValue);
  this->AddCommand("/session/:sessionid/element/:id/value", "POST",  webdriver::CommandType::SendKeysToElement);
  this->AddCommand("/session/:sessionid/element/:id/name", "GET",  webdriver::CommandType::GetElementTagName);
  this->AddCommand("/session/:sessionid/element/:id/clear", "POST",  webdriver::CommandType::ClearElement);
  this->AddCommand("/session/:sessionid/element/:id/selected", "GET",  webdriver::CommandType::IsElementSelected);
  this->AddCommand("/session/:sessionid/element/:id/enabled", "GET",  webdriver::CommandType::IsElementEnabled);
  this->AddCommand("/session/:sessionid/element/:id/displayed", "GET",  webdriver::CommandType::IsElementDisplayed);
  this->AddCommand("/session/:sessionid/element/:id/location", "GET",  webdriver::CommandType::GetElementLocation);
  this->AddCommand("/session/:sessionid/element/:id/location_in_view", "GET",  webdriver::CommandType::GetElementLocationOnceScrolledIntoView);
  this->AddCommand("/session/:sessionid/element/:id/size", "GET",  webdriver::CommandType::GetElementSize);
  this->AddCommand("/session/:sessionid/element/:id/css/:propertyName", "GET",  webdriver::CommandType::GetElementValueOfCssProperty);
  this->AddCommand("/session/:sessionid/element/:id/attribute/:name", "GET",  webdriver::CommandType::GetElementAttribute);
  this->AddCommand("/session/:sessionid/element/:id/equals/:other", "GET",  webdriver::CommandType::ElementEquals);
  this->AddCommand("/session/:sessionid/screenshot", "GET",  webdriver::CommandType::Screenshot);
  this->AddCommand("/session/:sessionid/orientation", "GET",  webdriver::CommandType::GetOrientation);
  this->AddCommand("/session/:sessionid/orientation", "POST",  webdriver::CommandType::SetOrientation);

  this->AddCommand("/session/:sessionid/window/:windowHandle/size", "GET",  webdriver::CommandType::GetWindowSize);
  this->AddCommand("/session/:sessionid/window/:windowHandle/size", "POST",  webdriver::CommandType::SetWindowSize);
  this->AddCommand("/session/:sessionid/window/:windowHandle/position", "GET",  webdriver::CommandType::GetWindowPosition);
  this->AddCommand("/session/:sessionid/window/:windowHandle/position", "POST",  webdriver::CommandType::SetWindowPosition);
  this->AddCommand("/session/:sessionid/window/:windowHandle/maximize", "POST",  webdriver::CommandType::MaximizeWindow);

  this->AddCommand("/session/:sessionid/accept_alert", "POST",  webdriver::CommandType::AcceptAlert);
  this->AddCommand("/session/:sessionid/dismiss_alert", "POST",  webdriver::CommandType::DismissAlert);
  this->AddCommand("/session/:sessionid/alert_text", "GET",  webdriver::CommandType::GetAlertText);
  this->AddCommand("/session/:sessionid/alert_text", "POST",  webdriver::CommandType::SendKeysToAlert);

  this->AddCommand("/session/:sessionid/keys", "POST",  webdriver::CommandType::SendKeysToActiveElement);
  this->AddCommand("/session/:sessionid/moveto", "POST",  webdriver::CommandType::MouseMoveTo);
  this->AddCommand("/session/:sessionid/click", "POST",  webdriver::CommandType::MouseClick);
  this->AddCommand("/session/:sessionid/doubleclick", "POST",  webdriver::CommandType::MouseDoubleClick);
  this->AddCommand("/session/:sessionid/buttondown", "POST",  webdriver::CommandType::MouseButtonDown);
  this->AddCommand("/session/:sessionid/buttonup", "POST",  webdriver::CommandType::MouseButtonUp);

  this->AddCommand("/session/:sessionid/ime/available_engines", "GET",  webdriver::CommandType::ListAvailableImeEngines);
  this->AddCommand("/session/:sessionid/ime/active_engines", "GET",  webdriver::CommandType::GetActiveImeEngine);
  this->AddCommand("/session/:sessionid/ime/activated", "GET",  webdriver::CommandType::IsImeActivated);
  this->AddCommand("/session/:sessionid/ime/activate", "POST",  webdriver::CommandType::ActivateImeEngine);
  this->AddCommand("/session/:sessionid/ime/deactivate", "POST",  webdriver::CommandType::DeactivateImeEngine);

  this->AddCommand("/session/:sessionid/touch/click", "POST",  webdriver::CommandType::TouchClick);
  this->AddCommand("/session/:sessionid/touch/down", "POST",  webdriver::CommandType::TouchDown);
  this->AddCommand("/session/:sessionid/touch/up", "POST",  webdriver::CommandType::TouchUp);
  this->AddCommand("/session/:sessionid/touch/move", "POST",  webdriver::CommandType::TouchMove);
  this->AddCommand("/session/:sessionid/touch/scroll", "POST",  webdriver::CommandType::TouchScroll);
  this->AddCommand("/session/:sessionid/touch/doubleclick", "POST",  webdriver::CommandType::TouchDoubleClick);
  this->AddCommand("/session/:sessionid/touch/longclick", "POST",  webdriver::CommandType::TouchLongClick);
  this->AddCommand("/session/:sessionid/touch/flick", "POST",  webdriver::CommandType::TouchFlick);
}

}  // namespace webdriver
