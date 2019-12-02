/**
 * Fairly simple fixture for testing
 * basic parsing and generation
 */
export class ConfigSimple {
  /**
   * A `string` option
   */
  optionA = 'optionADefault'

  /**
   * A `number` option
   */
  optionB = 42

  /**
   * A `boolean` option
   */
  optionC = false

  /**
   * An `array` option
   */
  optionD: string[] = ['a', 'b']

  /**
   * Multiline description as a
   * brief summary
   *
   * Followed by more details on
   * the option which can be Markdown also
   *   - item 1
   *   - item 2
   */
  optionE = ''

  /**
   * Option with a inline enum
   */
  optionF: 'fig' | 'foo' | 'frog' = 'fig'

  /**
   * Option with pipe chars | everyone
   *
   * To test that Markdown table generation works.
   */
  optionG: string | number = 'x |y \\|z'

}
