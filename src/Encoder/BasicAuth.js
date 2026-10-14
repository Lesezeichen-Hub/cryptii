import ByteEncoder from '../ByteEncoder.js'
import Encoder from '../Encoder.js'

const meta = {
  name: 'basic-auth',
  title: 'HTTP Basic authentication',
  category: 'Encoding',
  type: 'encoder'
}

/**
 * Encoder brick for HTTP Basic authentication header values.
 */
export default class BasicAuthEncoder extends Encoder {
  /**
   * Returns brick meta.
   * @return {object}
   */
  static getMeta () {
    return meta
  }

  /**
   * Encodes credentials as a Basic authentication header value.
   * @protected
   * @param {Chain} content Credentials in username:password form
   * @return {string} Basic authentication header value
   */
  performEncode (content) {
    return `Basic ${ByteEncoder.base64StringFromBytes(content.getBytes())}`
  }

  /**
   * Decodes a Basic authentication header value or Base64 token.
   * @protected
   * @param {Chain} content Basic authentication header value or Base64 token
   * @return {Uint8Array} Decoded credentials
   */
  performDecode (content) {
    let token = content.getString().trim()
    const prefix = token.match(/^Basic\s+/i)
    if (prefix) token = token.slice(prefix[0].length)
    return ByteEncoder.bytesFromBase64String(token)
  }
}
