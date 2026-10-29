import assert from 'assert'
import { describe, it } from 'mocha'
import generatePassword, { characterSets, defaultGroups } from '../src/PasswordGenerator.js'

describe('PasswordGenerator', () => {
  it('includes every selected group at the requested length', () => {
    for (const length of [4, 20, 128]) {
      const password = generatePassword(length)
      assert.strictEqual(password.length, length)
      for (const group of defaultGroups) {
        assert.ok([...password].some(character => characterSets[group].includes(character)))
      }
    }
  })

  it('uses only selected characters', () => {
    const password = generatePassword(64, ['digits'])
    assert.match(password, /^\d{64}$/)
    assert.match(generatePassword(1, ['lowercase']), /^[a-z]$/)
  })

  it('keeps the existing default groups and offers ten selectable symbols', () => {
    assert.deepStrictEqual(defaultGroups, ['lowercase', 'uppercase', 'digits', 'underscore'])
    assert.deepStrictEqual(
      Object.keys(characterSets).slice(3).map(group => characterSets[group]),
      ['_', '-', '!', '@', '#', '$', '%', '&', '*', '?']
    )
    for (const group of Object.keys(characterSets).slice(3)) {
      assert.strictEqual(generatePassword(20, [group]), characterSets[group].repeat(20))
    }
  })

  it('includes only the individually selected symbols', () => {
    const password = generatePassword(128)
    assert.match(password, /^[a-zA-Z0-9_]{128}$/)
    assert.ok(password.includes('_'))
    const selected = generatePassword(64, ['lowercase', 'hyphen', 'hash'])
    assert.match(selected, /^[a-z#-]{64}$/)
    assert.ok(selected.includes('#'))
    assert.ok(selected.includes('-'))
  })

  it('includes a single user-selected custom character', () => {
    const password = generatePassword(20, ['lowercase', 'customCharacter'], '/')
    assert.match(password, /^[a-z/]{20}$/)
    assert.ok(password.includes('/'))
    assert.strictEqual(generatePassword(1, ['customCharacter'], '/'), '/')
    assert.match(generatePassword(8, ['customCharacter'], '🔐'), /^🔐{8}$/u)
  })

  it('rejects invalid lengths and selections', () => {
    for (const length of [0, -1, 129, 1.5, NaN, '20']) {
      assert.throws(() => generatePassword(length), /length/i)
    }
    for (const groups of [[], ['unknown'], ['toString'], null]) {
      assert.throws(() => generatePassword(20, groups), /group/i)
    }
    assert.throws(() => generatePassword(3), /each selected group/)
    assert.throws(() => generatePassword(20, ['customCharacter']), /exactly one custom character/)
    assert.throws(() => generatePassword(20, ['customCharacter'], 'ab'), /exactly one custom character/)
  })

  it('creates different passwords on repeated requests', () => {
    assert.notStrictEqual(generatePassword(), generatePassword())
  })
})
