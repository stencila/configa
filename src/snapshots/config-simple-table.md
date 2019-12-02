
| Name    | Description                                                                         | Type              | Validators                  | Default            |
| ------- | ----------------------------------------------------------------------------------- | ----------------- | --------------------------- | ------------------ |
| optionA | A `string` option                                                                   | `string`          |                             | `"optionADefault"` |
| optionB | A `number` option                                                                   | `number`          |                             | `42`               |
| optionC | A `boolean` option                                                                  | `boolean`         |                             | `false`            |
| optionD | An `array` option                                                                   | `string[]`        |                             | `["a","b"]`        |
| optionE | Multiline description as a brief summary<a href="#optionE-details"><sup>1</sup></a> | `string`          |                             | `""`               |
| optionF | Option with a inline enum                                                           | `string`          | enumeration: `fig,foo,frog` | `"fig"`            |
| optionG | Option with pipe chars \| everyone<a href="#optionG-details"><sup>2</sup></a>       | `string | number` |                             | `"x |y |z"`        |


1. <a id="optionE-details"></a>Followed by more details on
the option which can be Markdown also
  - item 1
  - item 2
2. <a id="optionG-details"></a>To test that Markdown table generation works.

