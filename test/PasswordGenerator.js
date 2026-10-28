import assert from 'assert'
import { describe, it } from 'mocha'
import generatePassword, { characterSets } from '../src/PasswordGenerator.js'

describe('PasswordGenerator', () => {
  it('includes every selected group at the requested length', () => {
    for (const length of [4, 20, 128]) {
      const password = generatePassword(length)
      assert.strictEqual(password.length, length)
      for (const characters of Object.values(characterSets)) {
        assert.ok([...password].some(character => characters.includes(character)))
      }
    }
  })

  it('uses only selected characters', () => {
    const password = generatePassword(64, ['digits'])
    assert.match(password, /^\d{64}$/)
    assert.match(generatePassword(1, ['lowercase']), /^[a-z]$/)
  })

  it('uses underscores as the only symbols', () => {
    assert.strictEqual(generatePassword(20, ['symbols']), '_'.repeat(20))
    const password = generatePassword(128)
    assert.match(password, /^[a-zA-Z0-9_]{128}$/)
    assert.ok(password.includes('_'))
  })

  it('rejects invalid lengths and selections', () => {
    for (const length of [0, -1, 129, 1.5, NaN, '20']) {
      assert.throws(() => generatePassword(length), /length/i)
    }
    for (const groups of [[], ['unknown'], ['toString'], null]) {
      assert.throws(() => generatePassword(20, groups), /group/i)
    }
    assert.throws(() => generatePassword(3), /each selected group/)
  })

  it('creates different passwords on repeated requests', () => {
    assert.notStrictEqual(generatePassword(), generatePassword())
  })
})
