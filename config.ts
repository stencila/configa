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
   * If `null` then parse the name from the
   * package name in `./package.json`.
   */
  appName: string | null = null

  /**
   * Path to the configuration file to be parsed.
   */
  configPath = 'config.ts'

  /**
   * Path to the README file to be updated.
   */
  readmePath = 'README.md'
}
