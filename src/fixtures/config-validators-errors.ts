/**
 * Fixture for testing handling of errors with
 * validator decorators.
 */

import { enumeration, maximum, maxItems, maxProperties, minimum, minItems, multipleOf, pattern } from '../define';

export class ConfigValidatorErrors {

  // Errors that should get caught by Typescript

  /**
   * No argument
   */
  // @ts-ignore
  @enumeration()
  optionA = 'a'

  /**
   * Wrong type of argument
   *
   * Currently not checked for by Configa.
   */
  // @ts-ignore
  @multipleOf('2')
  optionB = 4

  // Errors that should be picked up by `parseDecorator`

  /**
   * Validation does not apply to option type
   */
  @minimum(0)
  @maximum(10)
  optionC = 'a string'

  /**
   * Validation does not apply to option type (array)
   */
  @pattern(/a regexp/)
  @maxProperties(1)
  optionD: Array<string> = ['a', 'b']

  /**
   * Default value is not valid
   */
  @minItems(6)
  @maxItems(4)
  optionE = ['a', 'b', 'c', 'd', 'e']
}
