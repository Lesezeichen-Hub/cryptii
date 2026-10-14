import assert from 'assert'
import { describe, it } from 'mocha'

import BrickFactory from '../src/Factory/Brick.js'
import ApacheMD5Encoder from '../src/Encoder/ApacheMD5.js'
import BasicAuthEncoder from '../src/Encoder/BasicAuth.js'
import EncoderTester from './Helper/EncoderTester.js'

describe('BasicAuthEncoder', () => {
  EncoderTester.test(BasicAuthEncoder, [
    {
      content: 'user:pass',
      expectedResult: 'Basic dXNlcjpwYXNz'
    },
    {
      content: 'user:päss',
      expectedResult: 'Basic dXNlcjpww6Rzcw=='
    },
    {
      direction: 'decode',
      content: 'dXNlcjpwYXNz',
      expectedResult: 'user:pass'
    }
  ])

  it('registers the Basic Auth encoder in the brick factory', () => {
    assert.strictEqual(BrickFactory.getInstance().exists('basic-auth'), true)
  })
})

describe('ApacheMD5Encoder', () => {
  EncoderTester.test(ApacheMD5Encoder, {
    direction: 'encode',
    settings: { username: 'alice', salt: 'iF.Z6P09' },
    content: 'password',
    expectedResult: 'alice:$apr1$iF.Z6P09$OxefdBfZD4IVoKFqzv2v8.'
  })

  it('registers as an encode-only encoder', () => {
    const encoder = BrickFactory.getInstance().create('apache-md5')
    assert.strictEqual(encoder.isEncodeOnly(), true)
  })

  it('keeps the generated salt out of the visible settings', () => {
    const encoder = new ApacheMD5Encoder()
    const visibleSettings = encoder.getSettingsForm().getVisibleFields().map(setting => setting.getName())
    assert.deepStrictEqual(visibleSettings, ['username'])
  })

  it('generates a random eight-character APR1 salt by default', async () => {
    const encoder = new ApacheMD5Encoder()
    const result = await encoder.encode('password')
    assert.match(result.getString(), /^username:\$apr1\$[./0-9A-Za-z]{8}\$[./0-9A-Za-z]{22}$/)
  })
})
