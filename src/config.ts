/**
 * Configuration options for Configa itself.
 *
 * These are mostly used during development when using `cli.ts`
 * to generate configuration files and documentation.
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
   * Path to the README file to be updated.
   */
  readmePath = 'README.md'
}
