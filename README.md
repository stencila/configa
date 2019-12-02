# Configa

> Application configuration: DRY, flexible and type-safe. Pick any three.

[![Build status](https://travis-ci.org/stencila/configa.svg?branch=master)](https://travis-ci.org/stencila/configa)
[![Code coverage](https://codecov.io/gh/stencila/configa/branch/master/graph/badge.svg)](https://codecov.io/gh/stencila/configa)
[![NPM](https://img.shields.io/npm/v/@stencila/configa.svg?style=flat)](https://www.npmjs.com/package/@stencila/configa)

> :warning: Configa is in early development. It's been factored out of [Sparkla](https://github.com/stencila/sparkla), another project in early development, for more general usage.

## Install

```bash
npm install --save @stencila/configa
```

## Quick start

### 1. Define a configuration class

Configa uses Typescript classes to define configuration options. Create a file `config.ts` with a single class defining your application configuration e.g.

```ts
import { minimum, maximum } from '@stencila/configa/dist/define'

/**
 * myapp ${version}: ${description}
 */
export class Config {
  /**
   * An option that can be a boolean of a string
   */
  optionA: boolean | string = 'default-value'

  /**
   * An option that is not required but has additional validations
   */
  @minimum(1)
  @maximum(10)
  optionA?: number
}
```

### 2. Generate configuration schema

Generate the JSON Schema that will be used at run time to validate and document your application's options:

```bash
configa schema
```

### 3. Use your configuration in your application code

```ts
import { collectOptions, helpUsage } from '@stencila/configa/dist/run'

// App config as Typescript for compile time type-checking
import { Config } from './config'

// App config as JSON Schema for run time type-checking and help generation
import configSchema from './config.schema.json'

// Generate a typed configuration object
const { args = [], config } = collectOptions<Config>('configa', configSchema)

// Generate help from the JSON Schema
if (args.includes('help')) console.log(helpUsage(configSchema))
```


### 4. Generate configuration documentation

In your `README.md` add comments to indicate where to insert documentation e.g.

```md
<\!-- CONFIGA-TABLE-BEGIN -->
<\!-- CONFIGA-TABLE-END -->
```

Then run,

```bash
configa readme
```

## Usage

<!-- CONFIGA-USAGE-BEGIN -->
All configuration options can be set, in descending order of priority, by:

- a command line argument e.g. `--<value> <value>`
- an environment variable prefixed with `CONFIGA_` e.g. `CONFIGA_<option>=<value>`
- a `.json` or `.ini` configuration file, set using the `--config` option, or `.configarc` by default
<!-- CONFIGA-USAGE-END -->

<!-- CONFIGA-TABLE-BEGIN -->
| Name           | Description                                                                                     | Type     | Validators | Default       |
| -------------- | ----------------------------------------------------------------------------------------------- | -------- | ---------- | ------------- |
| appName        | The name of the application.<a href="#appName-details"><sup>1</sup></a>                         | `string` |            | `undefined`   |
| configPath     | Path to the configuration file to be parsed.<a href="#configPath-details"><sup>2</sup></a>      | `string` |            | `undefined`   |
| jsonSchemaPath | Path to the JSON Schema file to be generated.<a href="#jsonSchemaPath-details"><sup>3</sup></a> | `string` |            | `undefined`   |
| readmePath     | Path to the README file to be updated.                                                          | `string` |            | `"README.md"` |


1. <a id="appName-details"></a>Determines the expected prefix on the names of
config files and environment variables.
If `undefined` then parse the name from the
package name in `./package.json`.
2. <a id="configPath-details"></a>If `undefined`, then will search for a file
`config.ts` in the current directory and its
subdirectories.
3. <a id="jsonSchemaPath-details"></a>If `undefined`, then will be the path of the
config file with extension `.json.schema` instead of
`.ts`.

<!-- CONFIGA-TABLE-END -->
