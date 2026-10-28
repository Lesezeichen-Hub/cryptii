import bcrypt from 'bcryptjs'
import Encoder from '../Encoder.js'
import InvalidInputError from '../Error/InvalidInput.js'

const meta = {
  name: 'bcrypt',
  title: 'bcrypt',
  category: 'Modern cryptography',
  type: 'encoder'
}

export default class BCryptEncoder extends Encoder {
  static getMeta () {
    return meta
  }

  constructor () {
    super()
    this.setEncodeOnly(true)
    this.addSettings([
      {
        name: 'cost',
        label: 'Cost factor',
        type: 'number',
        value: 12,
        integer: true,
        min: 4,
        max: 17,
        rotate: false,
        randomizable: false
      }
    ])
  }

  performEncode (content) {
    const password = content.getString()
    if (bcrypt.truncates(password)) {
      throw new InvalidInputError('bcrypt passwords must not exceed 72 UTF-8 bytes.')
    }
    return bcrypt.hash(password, this.getSettingValue('cost'))
  }
}
