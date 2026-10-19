/**
 * Transposition Ciphers:
 * 1. Rail Fence (Keyless zigzag)
 * 2. Columnar Transposition (Keyed permutation)
 */

export function railFenceEncrypt(text: string, rails: number): string {
  if (rails <= 1) return text
  const clean = text.replace(/\s+/g, '')
  if (clean.length === 0) return ''

  const fence: string[][] = Array.from({ length: rails }, () => [])
  let rail = 0
  let direction = 1 // 1 for down, -1 for up

  for (const ch of clean) {
    fence[rail].push(ch)
    rail += direction
    if (rail === rails - 1) direction = -1
    else if (rail === 0) direction = 1
  }

  return fence.map(row => row.join('')).join('')
}

export function railFenceDecrypt(ciphertext: string, rails: number): string {
  if (rails <= 1) return ciphertext
  const clean = ciphertext.replace(/\s+/g, '')
  const len = clean.length
  if (len === 0) return ''

  // Mark positions in the fence grid
  const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(len).fill(null))
  let rail = 0
  let direction = 1

  for (let c = 0; c < len; c++) {
    fence[rail][c] = '*'
    rail += direction
    if (rail === rails - 1) direction = -1
    else if (rail === 0) direction = 1
  }

  // Fill in the ciphertext characters row-by-row
  let charIdx = 0
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < len; c++) {
      if (fence[r][c] === '*' && charIdx < len) {
        fence[r][c] = clean[charIdx++]
      }
    }
  }

  // Read off characters along zigzag path
  let result = ''
  rail = 0
  direction = 1
  for (let c = 0; c < len; c++) {
    result += fence[rail][c]
    rail += direction
    if (rail === rails - 1) direction = -1
    else if (rail === 0) direction = 1
  }

  return result
}

export function getColumnOrder(key: string): number[] {
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '')
  const indexed = cleanKey.split('').map((char, originalIndex) => ({ char, originalIndex }))

  // Sort alphabetically, stable by original index
  indexed.sort((a, b) => {
    if (a.char < b.char) return -1
    if (a.char > b.char) return 1
    return a.originalIndex - b.originalIndex
  })

  // Return the reading column sequence
  return indexed.map(item => item.originalIndex)
}

export function columnarEncrypt(plaintext: string, key: string, padChar: string = 'X'): string {
  const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '')
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '')
  const colCount = cleanKey.length
  if (colCount <= 1) return cleanText

  const rowCount = Math.ceil(cleanText.length / colCount)
  const paddedLen = rowCount * colCount
  const paddedText = cleanText.padEnd(paddedLen, padChar)

  // Write row-by-row
  const grid: string[][] = []
  for (let r = 0; r < rowCount; r++) {
    grid.push(paddedText.slice(r * colCount, (r + 1) * colCount).split(''))
  }

  // Read column-by-column in sorted key order
  const colOrder = getColumnOrder(cleanKey)
  let ciphertext = ''
  for (const colIdx of colOrder) {
    for (let r = 0; r < rowCount; r++) {
      ciphertext += grid[r][colIdx]
    }
  }

  return ciphertext
}

export function columnarDecrypt(ciphertext: string, key: string): string {
  const cleanCipher = ciphertext.toUpperCase().replace(/[^A-Z]/g, '')
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '')
  const colCount = cleanKey.length
  if (colCount <= 1) return cleanCipher

  const rowCount = Math.ceil(cleanCipher.length / colCount)
  const colOrder = getColumnOrder(cleanKey)

  // Fill grid columns in sorted order
  const grid: string[][] = Array.from({ length: rowCount }, () => Array(colCount).fill(''))
  let charIdx = 0

  for (const colIdx of colOrder) {
    for (let r = 0; r < rowCount; r++) {
      if (charIdx < cleanCipher.length) {
        grid[r][colIdx] = cleanCipher[charIdx++]
      }
    }
  }

  // Read row-by-row
  let plaintext = ''
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      plaintext += grid[r][c]
    }
  }

  return plaintext
}
