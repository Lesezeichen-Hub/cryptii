export const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '_'
}

export default function generatePassword (length = 20, groups = Object.keys(characterSets)) {
  if (!Number.isInteger(length) || length < 1 || length > 128) {
    throw new Error('Choose a password length between 1 and 128.')
  }
  if (!Array.isArray(groups) || groups.length === 0 ||
      groups.some(group => !Object.hasOwn(characterSets, group))) {
    throw new Error('Select at least one character group.')
  }
  const selectedSets = [...new Set(groups)].map(group => characterSets[group])
  if (length < selectedSets.length) {
    throw new Error('Length must allow at least one character from each selected group.')
  }
  if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
    throw new Error('Secure random generation is unavailable in this browser.')
  }

  const randomInteger = maximum => {
    const limit = 0x100000000 - (0x100000000 % maximum)
    const value = new Uint32Array(1)
    do {
      globalThis.crypto.getRandomValues(value)
    } while (value[0] >= limit)
    return value[0] % maximum
  }

  const alphabet = selectedSets.join('')
  const password = selectedSets.map(characters => characters[randomInteger(characters.length)])
  while (password.length < length) {
    password.push(alphabet[randomInteger(alphabet.length)])
  }
  for (let index = password.length - 1; index > 0; index--) {
    const target = randomInteger(index + 1)
    ;[password[index], password[target]] = [password[target], password[index]]
  }
  return password.join('')
}
