import Encoder from '../Encoder.js'
import md5 from './Hash/md5.js'
import Random from '../Random.js'

const meta = {
  name: 'apache-md5',
  title: 'Apache .htpasswd (APR1)',
  category: 'Modern cryptography',
  type: 'encoder'
}

const saltAlphabet = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const cryptAlphabet = saltAlphabet
const magic = '$apr1$'

function randomSalt () {
  const random = Random.getInstance()
  return Array.from({ length: 8 }, () => random.nextChoice(saltAlphabet)).join('')
}

function concatBytes (parts) {
  const result = new Uint8Array(parts.reduce((length, part) => length + part.length, 0))
  let offset = 0
  parts.forEach(part => {
    result.set(part, offset)
    offset += part.length
  })
  return result
}

function bytesFromAscii (value) {
  return Uint8Array.from(value, character => character.charCodeAt(0))
}

function encodeCrypt64 (first, second, third, length) {
  let value = (first << 16) | (second << 8) | third
  let result = ''
  while (length-- > 0) {
    result += cryptAlphabet[value & 0x3f]
    value >>= 6
  }
  return result
}

function createApr1Hash (password, salt) {
  const saltBytes = bytesFromAscii(salt)
  const magicBytes = bytesFromAscii(magic)
  const alternate = md5(concatBytes([password, saltBytes, password]))
  const initialParts = [password, magicBytes, saltBytes]

  for (let remaining = password.length; remaining > 0; remaining -= alternate.length) {
    initialParts.push(alternate.subarray(0, Math.min(remaining, alternate.length)))
  }

  for (let remaining = password.length; remaining > 0; remaining >>= 1) {
    initialParts.push(remaining & 1 ? Uint8Array.of(0) : password.subarray(0, 1))
  }

  let digest = md5(concatBytes(initialParts))
  for (let round = 0; round < 1000; round++) {
    const parts = [round & 1 ? password : digest]
    if (round % 3) parts.push(saltBytes)
    if (round % 7) parts.push(password)
    parts.push(round & 1 ? digest : password)
    digest = md5(concatBytes(parts))
  }

  const encoded =
    encodeCrypt64(digest[0], digest[6], digest[12], 4) +
    encodeCrypt64(digest[1], digest[7], digest[13], 4) +
    encodeCrypt64(digest[2], digest[8], digest[14], 4) +
    encodeCrypt64(digest[3], digest[9], digest[15], 4) +
    encodeCrypt64(digest[4], digest[10], digest[5], 4) +
    encodeCrypt64(0, 0, digest[11], 2)

  return `${magic}${salt}$${encoded}`
}

export default class ApacheMD5Encoder extends Encoder {
  static getMeta () {
    return meta
  }

  constructor () {
    super()
    this.setEncodeOnly(true)
    this.addSettings([
      {
        name: 'username',
        type: 'text',
        value: 'username',
        minLength: 1,
        blacklistChars: ':\r\n',
        randomizable: false
      },
      {
        name: 'salt',
        type: 'text',
        value: randomSalt(),
        minLength: 1,
        maxLength: 8,
        whitelistChars: saltAlphabet,
        randomizable: false,
        visible: false
      }
    ])
  }

  performEncode (content) {
    const username = this.getSettingValue('username').getString()
    const passwordHash = createApr1Hash(content.getBytes(), this.getSettingValue('salt').getString())
    return `${username}:${passwordHash}`
  }
}
