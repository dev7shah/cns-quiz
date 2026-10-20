/**
 * Feistel Network Simulation
 * L_{i} = R_{i-1}
 * R_{i} = L_{i-1} ^ F(R_{i-1}, K_i)
 * 
 * Reversibility property: Decryption is identical to encryption
 * with subkeys applied in reverse order: K_N down to K_1.
 */

export interface FeistelRoundState {
  round: number
  left: number
  right: number
  subkey: number
  fOutput: number
}

export function defaultFeistelF(right: number, subkey: number): number {
  // A non-linear round function: bitwise rotation and non-linear mix
  const rotated = ((right << 3) | (right >>> 29)) >>> 0
  const mixed = (rotated ^ (subkey * 0x9E3779B9)) >>> 0
  return ((mixed * 31) ^ (mixed >>> 11)) >>> 0
}

export function feistelEncrypt(
  left: number,
  right: number,
  subkeys: number[],
  f: (r: number, k: number) => number = defaultFeistelF
): { left: number; right: number; trace: FeistelRoundState[] } {
  let l = left >>> 0
  let r = right >>> 0
  const trace: FeistelRoundState[] = []

  for (let i = 0; i < subkeys.length; i++) {
    const k = subkeys[i] >>> 0
    const fOut = f(r, k) >>> 0
    const nextL = r
    const nextR = (l ^ fOut) >>> 0
    trace.push({
      round: i + 1,
      left: l,
      right: r,
      subkey: k,
      fOutput: fOut
    })
    l = nextL
    r = nextR
  }

  // Final 32-bit halves (usually round swap is cancelled on final round or preserved)
  return { left: l, right: r, trace }
}

export function feistelDecrypt(
  left: number,
  right: number,
  subkeys: number[],
  f: (r: number, k: number) => number = defaultFeistelF
): { left: number; right: number; trace: FeistelRoundState[] } {
  // In Feistel, if ciphertext is (L_n, R_n), we run in reverse with swapped keys:
  // L_{i-1} = R_i ^ F(L_i, K_i)
  // R_{i-1} = L_i
  let l = left >>> 0
  let r = right >>> 0
  const trace: FeistelRoundState[] = []

  for (let i = subkeys.length - 1; i >= 0; i--) {
    const k = subkeys[i] >>> 0
    const fOut = f(l, k) >>> 0
    const prevR = l
    const prevL = (r ^ fOut) >>> 0
    trace.push({
      round: subkeys.length - i,
      left: l,
      right: r,
      subkey: k,
      fOutput: fOut
    })
    l = prevL
    r = prevR
  }

  return { left: l, right: r, trace }
}
