import assert from 'assert'
import { describe, it } from 'mocha'
import bcrypt from 'bcryptjs'
import BCryptEncoder from '../src/Encoder/BCrypt.js'
import BrickFactory from '../src/Factory/Brick.js'

describe('BCryptEncoder', () => {
  it('registers as an encode-only encoder with cost 12 by default', () => {
    const encoder = BrickFactory.getInstance().create('bcrypt')
    assert.ok(encoder instanceof BCryptEncoder)
    assert.strictEqual(encoder.isEncodeOnly(), true)
    assert.strictEqual(encoder.getSettingValue('cost'), 12)
  })

  it('hashes ASCII, Unicode and empty passwords at the selected cost', async () => {
    const encoder = new BCryptEncoder()
    encoder.setSettingValue('cost', 4)
    for (const password of ['password', 'p\u00e4ssw\u00f6rt\ud83d\udd10', '']) {
      const result = await encoder.encode(password)
      const hash = result.getString()
      assert.match(hash, /^\$2b\$04\$[./A-Za-z0-9]{53}$/)
      assert.strictEqual(await bcrypt.compare(password, hash), true)
      assert.strictEqual(await bcrypt.compare(password + 'wrong', hash), false)
      assert.strictEqual(encoder.hasView(), false)
    }
  })

  it('generates a fresh salt for every hash', async () => {
    const encoder = new BCryptEncoder()
    encoder.setSettingValue('cost', 4)
    const first = (await encoder.encode('password')).getString()
    const second = (await encoder.encode('password')).getString()
    assert.notStrictEqual(first, second)
  })

  it('accepts 72 UTF-8 bytes and rejects longer passwords without truncation', async () => {
    const encoder = new BCryptEncoder()
    encoder.setSettingValue('cost', 4)
    for (const password of ['a'.repeat(72), '\u00e4'.repeat(36)]) {
      const result = await encoder.encode(password)
      assert.strictEqual(await bcrypt.compare(password, result.getString()), true)
    }
    for (const password of ['a'.repeat(73), '\u00e4'.repeat(37)]) {
      await assert.rejects(encoder.encode(password), /72 UTF-8 bytes/)
    }
  })

  it('rejects cost factors outside the browser range', async () => {
    for (const cost of [3, 17]) {
      const encoder = new BCryptEncoder()
      encoder.setSettingValue('cost', cost)
      await assert.rejects(encoder.encode('password'), /invalid settings/)
    }
    const encoder = new BCryptEncoder()
    encoder.setSettingValue('cost', 16)
    assert.strictEqual(encoder.getSettingsForm().isValid(), true)
  })

  it('does not offer decoding', async () => {
    await assert.rejects(new BCryptEncoder().decode('hash'), /Decoding is not defined/)
  })
})
