// Copyright 2013 Software Freedom Conservancy
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

#ifndef WEBDRIVER_IE_ELEMENTREPOSITORY_H_
#define WEBDRIVER_IE_ELEMENTREPOSITORY_H_

#include <unordered_map>
#include "DocumentHost.h"
#include "Element.h"

namespace webdriver {

class ElementRepository {
 public:
  ElementRepository(void);
  virtual ~ElementRepository(void);
  int GetManagedElement(const std::string& element_id,
                        ElementHandle* element_wrapper) const;
  void AddManagedElement(BrowserHandle current_browser,
                         IHTMLElement* element,
                         ElementHandle* element_wrapper);
  void RemoveManagedElement(const std::string& element_id);
  void ListManagedElements(void);
  void ClearCache(void);
  void Clear(void);
 private:
  typedef std::tr1::unordered_map<std::string, ElementHandle> ElementMap;
  ElementMap managed_elements_;
};

} // namespace webdriver

#endif // WEBDRIVER_IE_ELEMENTREPOSITORY_H_
