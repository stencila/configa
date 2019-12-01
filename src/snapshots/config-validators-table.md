
| Name    | Description                               | Type       | Validators                                       | Default                |
| ------- | ----------------------------------------- | ---------- | ------------------------------------------------ | ---------------------- |
| optionA | Option with `enum` decorator              | `string`   | enumeration: `a,b,c`                             | `"a"`                  |
| optionC | Option with `multipleOf` decorator        | `number`   | multipleOf: `2`                                  | `4`                    |
| optionD | Option with `maximum` decorator           | `number`   | maximum: `10`                                    | `10`                   |
| optionE | Option with `exclusiveMaximum` decorator  | `number`   | exclusiveMaximum: `10`                           | `9`                    |
| optionF | Option with `minimum` decorator           | `number`   | minimum: `10`                                    | `10`                   |
| optionG | Option with `exclusiveMinimum` decorator  | `number`   | exclusiveMinimum: `10`                           | `11`                   |
| optionH | Option with `maxLength` decorator         | `string`   | maxLength: `3`                                   | `"foo"`                |
| optionI | Option with `minLength` decorator         | `string`   | minLength: `3`                                   | `"bar"`                |
| optionJ | Option with `pattern` decorator           | `string`   | pattern: `/^https?://.+/`                        | `"http://example.com"` |
| optionK | Option with `maxItems` decorator          | `number[]` | maxItems: `2`                                    | `[1,2]`                |
| optionL | Option with `minItems` decorator          | `number[]` | minItems: `1`                                    | `[1]`                  |
| optionM | Option with `uniqueItems` decorator       | `string[]` | uniqueItems: `true`                              | `[]`                   |
| optionN | Option with `maxContains` decorator       | `string[]` | contains: `[object Object]`,<br>maxContains: `2` | `["a","b","a"]`        |
| optionO | Option with `minContains` decorator       | `string[]` | contains: `[object Object]`,<br>minContains: `1` | `["a"]`                |
| optionP | Option with `maxProperties` decorator     | `object`   | maxProperties: `2`                               | `undefined`            |
| optionQ | Option with `minProperties` decorator     | `object`   | minProperties: `1`                               | `undefined`            |
| optionR | Option with `required` decorator          | `object`   | required: `a`                                    | `undefined`            |
| optionS | Option with `dependentRequired` decorator | `object`   | dependentRequired: `[object Object]`             | `undefined`            |




