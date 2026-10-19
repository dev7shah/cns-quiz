/**
 * Hill Cipher 2x2 Matrix Solver over Ring Z_26
 * C = K * P mod 26
 * P = K^-1 * C mod 26
 */

import { gcd, modInverse26 } from "./affine"

export type Matrix2x2 = [[number, number], [number, number]]

export function det2x2(matrix: Matrix2x2): number {
  const d = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  return ((d % 26) + 26) % 26
}

export function isValidHillMatrix(matrix: Matrix2x2): boolean {
  const d = det2x2(matrix)
  return d !== 0 && gcd(d, 26) === 1
}

export function invertMatrix2x2(matrix: Matrix2x2): Matrix2x2 {
  const d = det2x2(matrix)
  const dInv = modInverse26(d, 26)
  if (dInv === null) {
    throw new Error(`Matrix determinant ${d} is not coprime to 26; matrix is not invertible`)
  }

  // Adjugate matrix: [[k11, -k01], [-k10, k00]] mod 26
  const a00 = matrix[1][1]
  const a01 = -matrix[0][1]
  const a10 = -matrix[1][0]
  const a11 = matrix[0][0]

  const inv00 = ((dInv * a00) % 26 + 26) % 26
  const inv01 = ((dInv * a01) % 26 + 26) % 26
  const inv10 = ((dInv * a10) % 26 + 26) % 26
  const inv11 = ((dInv * a11) % 26 + 26) % 26

  return [
    [inv00, inv01],
    [inv10, inv11]
  ]
}

export function hillEncrypt2x2(plaintext: string, keyMatrix: Matrix2x2): string {
  if (!isValidHillMatrix(keyMatrix)) {
    throw new Error('Invalid Hill key matrix: determinant must be coprime to 26')
  }

  const clean = plaintext.toUpperCase().replace(/[^A-Z]/g, '')
  const padded = clean.length % 2 === 0 ? clean : clean + 'X'

  let cipher = ''
  for (let i = 0; i < padded.length; i += 2) {
    const p0 = padded.charCodeAt(i) - 65
    const p1 = padded.charCodeAt(i + 1) - 65

    const c0 = (keyMatrix[0][0] * p0 + keyMatrix[0][1] * p1) % 26
    const c1 = (keyMatrix[1][0] * p0 + keyMatrix[1][1] * p1) % 26

    cipher += String.fromCharCode(c0 + 65) + String.fromCharCode(c1 + 65)
  }

  return cipher
}

export function hillDecrypt2x2(ciphertext: string, keyMatrix: Matrix2x2): string {
  const invMatrix = invertMatrix2x2(keyMatrix)
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '')
  if (clean.length % 2 !== 0) {
    throw new Error('Hill ciphertext length must be even for 2x2 blocks')
  }

  let plain = ''
  for (let i = 0; i < clean.length; i += 2) {
    const c0 = clean.charCodeAt(i) - 65
    const c1 = clean.charCodeAt(i + 1) - 65

    const p0 = (invMatrix[0][0] * c0 + invMatrix[0][1] * c1) % 26
    const p1 = (invMatrix[1][0] * c0 + invMatrix[1][1] * c1) % 26

    plain += String.fromCharCode(p0 + 65) + String.fromCharCode(p1 + 65)
  }

  return plain
}
