// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

const constant = 'a-value'

export class ConfigSimpleErrors {
  // No description
  optionA = ''

  /**
   * Any type (explicit)
   */
  optionC: any = 0

  /**
   * Any type and no default
   */
  optionD

  /**
   * Default can not be serialized
   */
  optionE = constant

  /**
   * Long descriptions generate a warning
   * because they are difficult to fit in CLI
   * help, Markdown tables etc.
   *
   * Details, like this, should be used instead.
   */
  optionF = ''
}
