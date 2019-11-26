# Configa

[![Build status](https://travis-ci.org/stencila/configa.svg?branch=master)](https://travis-ci.org/stencila/configa)
[![Code coverage](https://codecov.io/gh/stencila/configa/branch/master/graph/badge.svg)](https://codecov.io/gh/stencila/configa)
[![NPM](https://img.shields.io/npm/v/@stencila/configa.svg?style=flat)](https://www.npmjs.com/package/@stencila/configa)

<!-- CONFIGA-USAGE-BEGIN -->
All configuration options can be set, in descending order of priority, by:

- a command line argument e.g. `--<value> <value>`
- an environment variable prefixed with `CONFIGA_` e.g. `CONFIGA_<option>=<value>`
- a `.json` or `.ini` configuration file, set using the `--config` option, or `.configarc` by default
<!-- CONFIGA-USAGE-END -->

<!-- CONFIGA-TABLE-BEGIN -->
| Name       | Description                                                             | Type           | Default       |
| ---------- | ----------------------------------------------------------------------- | -------------- | ------------- |
| appName    | The name of the application.<a href="#appName-details"><sup>1</sup></a> | string \| null | `null`        |
| configPath | Path to the configuration file to be parsed.                            | string         | `"config.ts"` |
| readmePath | Path to the README file to be updated.                                  | string         | `"README.md"` |


1. <a id="appName-details"></a>Determines the expected prefix on the names of
config files and environment variables.
If `null` then parse the name from the
package name in `./package.json`.

<!-- CONFIGA-TABLE-END -->
