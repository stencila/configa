/**
 * Configa ${version}
 */
export class Config {
  /**
   * The name of the application.
   *
   * Determines the expected prefix on the names of
   * config files and environment variables.
   * If `undefined` then parse the name from the
   * package name in `./package.json`.
   */
  appName?: string

  /**
   * Path to the configuration file to be parsed.
   *
   * If `undefined`, then will search for a file
   * `config.ts` in the current directory and its
   * subdirectories.
   */
  configPath?: string

  /**
   * Path to the JSON Schema file to be generated.
   *
   * If `undefined`, then will be the path of the
   * config file with extension `.json.schema` instead of
   * `.ts`.
   */
  jsonSchemaPath?: string

  /**
   * Path to the README file to be updated.
   */
  readmePath = 'README.md'
}
