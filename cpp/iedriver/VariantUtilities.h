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

#ifndef WEBDRIVER_IE_VARIANTUTILITIES_H
#define WEBDRIVER_IE_VARIANTUTILITIES_H

#include <string>
#include <vector>
#include "json.h"

namespace webdriver {

// Forward declaration of classes to avoid
// circular include files.
class IECommandExecutor;

class VariantUtilities {
 private:
  VariantUtilities(void);
  ~VariantUtilities(void);
 public:
  static bool VariantIsEmpty(VARIANT value);
  static bool VariantIsString(VARIANT value);
  static bool VariantIsInteger(VARIANT value);
  static bool VariantIsBoolean(VARIANT value);
  static bool VariantIsDouble(VARIANT value);
  static bool VariantIsArray(VARIANT value);
  static bool VariantIsObject(VARIANT value);
  static bool VariantIsElement(VARIANT value);
  static bool VariantIsElementCollection(VARIANT value);
  static bool VariantIsIDispatch(VARIANT value);
  static int ConvertVariantToJsonValue(const IECommandExecutor& executor,
                                       VARIANT variant_value,
                                       Json::Value* value);
  static std::wstring GetVariantObjectTypeName(VARIANT value);
  static bool GetVariantObjectPropertyValue(IDispatch* variant_object,
                                            std::wstring property_name,
                                            VARIANT* property_value);

 private:
  static int GetArrayLength(IDispatch* array_dispatch, long* length);
  static int GetArrayItem(const IECommandExecutor& executor,
                          IDispatch* array_dispatch,
                          long index,
                          Json::Value* item);

  static int GetPropertyNameList(IDispatch* object_dispatch,
                                 std::vector<std::wstring>* property_names);
};

} // namespace webdriver

#endif  // WEBDRIVER_IE_VARIANTUTILITIES_H
