/**
 * Encrypts or decrypts a string using the Caesar cipher.
 * Non-alphabetic characters are preserved.
 * @param text The input string.
 * @param shift The number of positions to shift (use negative for decrypt).
 */
export function caesarCipher(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    // Uppercase
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65)
    }
    // Lowercase
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97)
    }
    return char
  }).join('')
}

/**
 * Brute-forces a Caesar cipher by trying all 26 possible shifts.
 * Returns an array of all possible decryptions.
 */
export function bruteForceCaesar(text: string): { shift: number, result: string }[] {
  const results = []
  for (let i = 1; i < 26; i++) {
    // To decrypt, we shift backwards, which is equivalent to shifting forward by (26 - i)
    results.push({ shift: i, result: caesarCipher(text, 26 - i) })
  }
  return results
}
