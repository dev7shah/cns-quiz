/**
 * Playfair Digraphic Substitution Cipher
 * 5x5 Matrix (I and J share a single cell)
 */

export interface PlayfairCoords {
  r: number
  c: number
}

export function buildPlayfairMatrix(keyword: string): string[][] {
  const cleanKey = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '')
  const seen = new Set<string>()
  const sequence: string[] = []

  // Insert keyword letters
  for (const ch of cleanKey) {
    if (!seen.has(ch)) {
      seen.add(ch)
      sequence.push(ch)
    }
  }

  // Insert remaining alphabet letters (excluding J)
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ' // 25 letters, J omitted
  for (const ch of alphabet) {
    if (!seen.has(ch)) {
      seen.add(ch)
      sequence.push(ch)
    }
  }

  // Assemble into 5x5 matrix
  const matrix: string[][] = []
  for (let r = 0; r < 5; r++) {
    matrix.push(sequence.slice(r * 5, r * 5 + 5))
  }
  return matrix
}

export function findCharPosition(matrix: string[][], ch: string): PlayfairCoords {
  const target = ch.toUpperCase() === 'J' ? 'I' : ch.toUpperCase()
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === target) {
        return { r, c }
      }
    }
  }
  throw new Error(`Character '${ch}' not found in Playfair matrix`)
}

export function prepareDigraphs(plaintext: string): [string, string][] {
  const clean = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '')
  const digraphs: [string, string][] = []

  let i = 0
  while (i < clean.length) {
    const first = clean[i]
    if (i + 1 >= clean.length) {
      // Odd letter at the end, pad with X (or Z if first is X)
      const pad = first === 'X' ? 'Z' : 'X'
      digraphs.push([first, pad])
      i += 1
    } else {
      const second = clean[i + 1]
      if (first === second) {
        // Repeated letter, insert filler X
        const filler = first === 'X' ? 'Z' : 'X'
        digraphs.push([first, filler])
        i += 1 // Advance only 1 character
      } else {
        digraphs.push([first, second])
        i += 2
      }
    }
  }

  return digraphs
}

export function playfairEncrypt(plaintext: string, keyword: string): string {
  const matrix = buildPlayfairMatrix(keyword)
  const digraphs = prepareDigraphs(plaintext)

  let cipher = ''
  for (const [a, b] of digraphs) {
    const pA = findCharPosition(matrix, a)
    const pB = findCharPosition(matrix, b)

    if (pA.r === pB.r) {
      // Rule 1: Same row -> Shift right
      const cA = matrix[pA.r][(pA.c + 1) % 5]
      const cB = matrix[pB.r][(pB.c + 1) % 5]
      cipher += cA + cB
    } else if (pA.c === pB.c) {
      // Rule 2: Same column -> Shift down
      const cA = matrix[(pA.r + 1) % 5][pA.c]
      const cB = matrix[(pB.r + 1) % 5][pB.c]
      cipher += cA + cB
    } else {
      // Rule 3: Rectangle -> Swap columns
      const cA = matrix[pA.r][pB.c]
      const cB = matrix[pB.r][pA.c]
      cipher += cA + cB
    }
  }

  return cipher
}

export function playfairDecrypt(ciphertext: string, keyword: string): string {
  const matrix = buildPlayfairMatrix(keyword)
  const clean = ciphertext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '')
  if (clean.length % 2 !== 0) {
    throw new Error('Playfair ciphertext length must be even')
  }

  let plain = ''
  for (let i = 0; i < clean.length; i += 2) {
    const a = clean[i]
    const b = clean[i + 1]
    const pA = findCharPosition(matrix, a)
    const pB = findCharPosition(matrix, b)

    if (pA.r === pB.r) {
      // Rule 1: Same row -> Shift left
      const cA = matrix[pA.r][(pA.c - 1 + 5) % 5]
      const cB = matrix[pB.r][(pB.c - 1 + 5) % 5]
      plain += cA + cB
    } else if (pA.c === pB.c) {
      // Rule 2: Same column -> Shift up
      const cA = matrix[(pA.r - 1 + 5) % 5][pA.c]
      const cB = matrix[(pB.r - 1 + 5) % 5][pB.c]
      plain += cA + cB
    } else {
      // Rule 3: Rectangle -> Swap columns
      const cA = matrix[pA.r][pB.c]
      const cB = matrix[pB.r][pA.c]
      plain += cA + cB
    }
  }

  return plain
}
