enum EnumOne {
  first = 1,
  second = 2
}

export class ConfigOne {
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
   * An `enum` option
   */
  optionD: EnumOne = EnumOne.first

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
}
