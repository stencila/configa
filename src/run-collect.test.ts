import { coerceOptions } from './run-collect'

test('coerceOptions', () => {
  expect(
    coerceOptions(
      { a: '1,2,3', b: '1,  2,3', c: [1, 2, 3] },
      {
        properties: {
          a: { type: 'array' },
          b: { type: 'array' },
          c: { type: 'array' }
        }
      }
    )
  ).toEqual({ a: ['1', '2', '3'], b: ['1', '2', '3'], c: [1, 2, 3] })
})
