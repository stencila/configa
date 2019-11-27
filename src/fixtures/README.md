# A test README

## Usage

<!-- CONFIGA-USAGE-BEGIN -->
All configuration options can be set, in descending order of priority, by:

- a command line argument e.g. `--<value> <value>`
- an environment variable prefixed with `TEST_` e.g. `TEST_<option>=<value>`
- a `.json` or `.ini` configuration file, set using the `--config` option, or `.testrc` by default
<!-- CONFIGA-USAGE-END -->

## Options

<!-- CONFIGA-TABLE-BEGIN -->
| Name    | Description                                                                         | Type                 | Default            |
| ------- | ----------------------------------------------------------------------------------- | -------------------- | ------------------ |
| optionA | A `string` option                                                                   | string               | `"optionADefault"` |
| optionB | A `number` option                                                                   | number               | `42`               |
| optionC | A `boolean` option                                                                  | boolean              | `false`            |
| optionD | An `enum` option                                                                    | EnumOne              | `""`               |
| optionE | Multiline description as a brief summary<a href="#optionE-details"><sup>1</sup></a> | string               | `""`               |
| optionF | Option with a inline enum                                                           | "fig", "foo", "frog" | `"fig"`            |


1. <a id="optionE-details"></a>Followed by more details on
the option which can be Markdown also
  - item 1
  - item 2

<!-- CONFIGA-TABLE-END -->
