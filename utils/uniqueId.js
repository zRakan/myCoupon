const MASK = 0x3d
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '1234567890'
const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('')
export default function(length) {
    const bytes = new Uint8Array(length)
    crypto.getRandomValues(bytes)
  
    return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '')
}