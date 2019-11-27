/**
 * @module develop-parse
 *
 * Module for parsing of Typescript configuration definitions
 * during development of a package using Configa.
 */

import * as typedoc from '@gerrit0/typedoc'
import json5 from 'json5'
import { log, Option, Validator } from './common'
import { validateDefault } from './develop-schema'

/**
 * Parse a Typescript configuration file.
 *
 * @param filePath The path the to file
 * @returns An array of configuration options
 */
export function parseConfig(filePath: string): Option[] {
  const app = new typedoc.Application({
    module: 'commonjs',
    target: 'es2017',
    esModuleInterop: true,
    experimentalDecorators: true
  })

  const files = app.convert([filePath])
  if (files === undefined || files.children === undefined) return []

  // Get the declaration object for the file
  const file = files.children.filter(decl => decl.originalName === filePath)[0]
  if (file.children === undefined) return []

  // Get the first class defined in the file
  const clas = Object.values(file.children).filter(
    decl => decl.kindString === 'Class'
  )[0]
  if (clas.children === undefined) return []

  // Sort properties by declaration order within the class
  const props = clas.children.sort((a, b) =>
    a.sources !== undefined && b.sources !== undefined
      ? a.sources[0].line > b.sources[0].line
        ? 1
        : -1
      : 0
  )

  // Convert properties into `Options` for easier processing
  // and generate error messages where needed
  const parent = clas.name
  return props.map((prop: typedoc.DeclarationReflection) => {
    const {
      name,
      comment,
      type: typeObj,
      defaultValue: defaultString,
      decorators = []
    } = prop
    const id = `${parent}.${name}`

    let description
    let details
    if (comment === undefined) {
      description = ''
      log.error(`Option is missing description: ${id}`)
    } else {
      description = comment.shortText.trim()
      if (description.length > 100)
        log.warn(`Option has long description: ${id}`)
      details = comment.text.trim().length > 0 ? comment.text.trim() : undefined
    }

    let type
    if (typeObj === undefined || typeObj.toString() === 'any') {
      type = 'any'
      log.error(`Option has type 'any': ${id}`)
    } else {
      type = typeObj.toString()
      // Normalize type name for arrays to suffix `[]` form
      type = type.replace(/Array<([^>]+)>/, '$1[]')
    }

    let defaultValue
    if (defaultString === undefined) {
      if (type === 'object') {
        defaultValue = {}
        log.warn(
          `Default values for options of type object can not be handled: ${id}`
        )
      }
    } else {
      try {
        defaultValue = json5.parse(defaultString)
      } catch (error) {
        defaultValue = ''
        log.error(
          `Option default value can not be parsed: ${id}: ${error.message}`
        )
      }
    }

    const option: Option = {
      parent,
      name,
      description,
      details,
      type,
      defaultValue
    }

    option.validators = decorators.map(decorator =>
      parseDecorator(option, decorator)
    )

    validateDefault(option)

    return option
  })
}

/**
 * Convert a property decorator to a validator.
 *
 * Checks that the validation keyword is valid for the
 * type of the option
 *
 * @param decorator The TypeDoc decorator to parse
 * @param id An identifier for the option to used for logs
 */
export const parseDecorator = (
  option: Option,
  decorator: typedoc.Decorator
): Validator => {
  const { parent, name, type } = option
  const { name: decoratorName, arguments: decoratorArgs } = decorator
  const id = `${parent}.${name}`

  const logWrongType = (): void =>
    log.error(
      `Option validator "${keyword}" does not apply to option of type "${type}": ${id}`
    )

  const keyword = decoratorName as Validator['keyword']
  let arg = Object.values(decoratorArgs)[0] as string
  switch (keyword) {
    /* eslint-disable no-fallthrough */

    // Keywords for any instance type
    case 'enumeration':
      break

    // Keywords for numeric instances
    case 'multipleOf':
    case 'maximum':
    case 'exclusiveMaximum':
    case 'minimum':
    case 'exclusiveMinimum':
      if (type !== 'number') logWrongType()
      break

    // Keywords for strings
    case 'pattern':
      // Wrap the RegExp in quotes for parsing
      arg = `"${arg}"`
    case 'maxLength':
    case 'minLength':
      if (type !== 'string') logWrongType()
      break

    // Keywords for arrays
    case 'uniqueItems':
      // Default arg is true
      arg = arg === undefined ? 'true' : arg
    case 'maxItems':
    case 'minItems':
    case 'contains':
    case 'maxContains':
    case 'minContains':
      if (!(type === 'array' || type.includes('Array<') || type.includes('[]')))
        logWrongType()
      break

    // Keywords for objects
    case 'maxProperties':
    case 'minProperties':
    case 'required':
    case 'dependentRequired':
      if (type !== 'object') logWrongType()
      break

    /* eslint-enable no-fallthrough */

    // Unknown keyword
    default:
      log.error(`Option has unknown validator "${keyword}": ${id}`)
  }

  let value
  if (arg === undefined) {
    log.error(`Option validator "${keyword}" has no argument: ${id}`)
  } else {
    // Parse the validation value. No type checking is
    // done since that should be done by Typescript on the definition
    try {
      value = json5.parse(arg)
    } catch (error) {
      log.error(
        `Option validator has argument that can not be parsed: ${id}: ${error.message}`
      )
    }
  }

  return {
    keyword,
    value
  }
}