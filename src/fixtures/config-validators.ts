/**
 * Fixture for testing use of validation decorators
 */

import {
  enumeration,
  multipleOf,
  maximum,
  exclusiveMaximum,
  minimum,
  exclusiveMinimum,
  maxLength,
  minLength,
  pattern,
  maxItems,
  minItems,
  uniqueItems,
  contains,
  maxContains,
  minContains,
  maxProperties,
  minProperties,
  required,
  dependentRequired,
} from '../define'

export class ConfigValidators {

  // Keywords for any instance type

  /**
   * Option with `enum` decorator
   */
  @enumeration(['a', 'b', 'c'])
  optionA = 'a'

  // Keywords for numeric instances

  /**
   * Option with `multipleOf` decorator
   */
  @multipleOf(2)
  optionC = 4

  /**
   * Option with `maximum` decorator
   */
  @maximum(10)
  optionD = 10

  /**
   * Option with `exclusiveMaximum` decorator
   */
  @exclusiveMaximum(10)
  optionE = 9

  /**
   * Option with `minimum` decorator
   */
  @minimum(10)
  optionF = 10

  /**
   * Option with `exclusiveMinimum` decorator
   */
  @exclusiveMinimum(10)
  optionG = 11


  // Keywords for strings

  /**
   * Option with `maxLength` decorator
   */
  @maxLength(3)
  optionH = 'foo'

  /**
   * Option with `minLength` decorator
   */
  @minLength(3)
  optionI = 'bar'

  /**
   * Option with `pattern` decorator
   */
  @pattern(/^https?:\/\/.+/)
  optionJ = 'http://example.com'


  // Keywords for arrays

  /**
   * Option with `maxItems` decorator
   */
  @maxItems(2)
  optionK = [1, 2]

  /**
   * Option with `minItems` decorator
   */
  @minItems(1)
  optionL = [1]

  /**
   * Option with `uniqueItems` decorator
   */
  @uniqueItems()
  optionM: Array<string> = []

  /**
   * Option with `maxContains` decorator
   */
  @contains({enum: ['a']})
  @maxContains(2)
  optionN = ['a', 'b', 'a']

  /**
   * Option with `minContains` decorator
   */
  @contains({enum: ['a']})
  @minContains(1)
  optionO = ['a']


  // Keywords for objects

  /**
   * Option with `maxProperties` decorator
   */
  @maxProperties(2)
  optionP = {a: 1, b: 2}

  /**
   * Option with `minProperties` decorator
   */
  @minProperties(1)
  optionQ = {a: 1}

  /**
   * Option with `required` decorator
   */
  @required(['a'])
  optionR = {a: 1}

  /**
   * Option with `dependentRequired` decorator
   */
  @dependentRequired({a: ['b']})
  optionS = {a: 1, b: 2}
}
