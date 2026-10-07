/**
 * Encrypts or decrypts a string using the Vigenère cipher.
 * Non-alphabetic characters are preserved and do not advance the key stream.
 * @param text The input string.
 * @param key The alphabetic keyword.
 * @param decrypt Set to true to reverse the cipher.
 */
export function vigenereCipher(text: string, key: string, decrypt: boolean = false): string {
  const upperKey = key.toUpperCase().replace(/[^A-Z]/g, '')
  if (upperKey.length === 0) return text
  
  let result = ''
  let keyIndex = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = text.charCodeAt(i)
    const isUpper = code >= 65 && code <= 90
    const isLower = code >= 97 && code <= 122

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97
      const charShift = code - base
      const keyShift = upperKey.charCodeAt(keyIndex % upperKey.length) - 65
      
      let newShift = 0
      if (decrypt) {
        newShift = (charShift - keyShift + 26) % 26
      } else {
        newShift = (charShift + keyShift) % 26
      }
      
      result += String.fromCharCode(base + newShift)
      keyIndex++
    } else {
      result += char
    }
  }

  return result
}
