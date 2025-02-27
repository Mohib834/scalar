import { parse } from 'src/helpers/parse'
import { describe, expect, it } from 'vitest'

import { preflight } from './preflight'

describe('preflight', () => {
  it('detects the title', async () => {
    const spec = { openapi: '3.1.0', info: { title: 'Example' }, paths: {} }

    expect(preflight(await parse(spec))).toMatchObject({
      hasTitle: true,
    })
  })
})
