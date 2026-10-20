import { describe, it, expect } from "vitest"
import { feistelEncrypt, feistelDecrypt } from "@/lib/crypto/feistel"
import {
  ecbEncrypt, ecbDecrypt,
  cbcEncrypt, cbcDecrypt,
  cfbEncrypt, cfbDecrypt,
  ofbEncrypt, ofbDecrypt,
  ctrEncrypt, ctrDecrypt,
  simulateErrorPropagation
} from "@/lib/crypto/modes"
import { sboxLookup, DES_SBOX_1, desExpansionE, tripleDesEncrypt, tripleDesDecrypt } from "@/lib/crypto/des"
import { gfMul, xtime, subBytes, shiftRows, invShiftRows } from "@/lib/crypto/aes"
import { generateRabinKeys, rabinEncrypt, rabinDecrypt } from "@/lib/crypto/rabin"
import { generateElGamalKey, elgamalEncrypt, elgamalDecrypt } from "@/lib/crypto/elgamal"
import { ECCurve, isCurveNonSingular, isPointOnCurve, ecAdd, ecMultiply, findCurvePoints } from "@/lib/crypto/ecc"
import { runNormalDH, runMitmDH } from "@/lib/crypto/diffieHellman"
import { teaEncrypt, teaDecrypt, TeaKey, TeaState } from "@/lib/crypto/tea"

describe('Module 2 Cryptographic Solvers', () => {

  // 1. Feistel Network
  it('Feistel encrypts and decrypts restoring original 32-bit halves', () => {
    const subkeys = [0x1234, 0x5678, 0x9ABC, 0xDEF0]
    const left = 0xAABBCCDD
    const right = 0x11223344

    const enc = feistelEncrypt(left, right, subkeys)
    expect(enc.trace.length).toBe(4)

    const dec = feistelDecrypt(enc.left, enc.right, subkeys)
    expect(dec.left).toBe(left >>> 0)
    expect(dec.right).toBe(right >>> 0)
  })

  // 2. Modes of Operation
  it('ECB, CBC, CFB, OFB, CTR modes correctly encrypt and decrypt', () => {
    const plainBlocks = [0x1234, 0x5678, 0x9ABC, 0xDEF0]
    const key = 0xABCD
    const iv = 0x1337

    // ECB
    const ecbC = ecbEncrypt(plainBlocks, key)
    const ecbP = ecbDecrypt(ecbC, key)
    expect(ecbP).toEqual(plainBlocks)

    // CBC
    const cbcC = cbcEncrypt(plainBlocks, key, iv)
    const cbcP = cbcDecrypt(cbcC, key, iv)
    expect(cbcP).toEqual(plainBlocks)

    // CFB
    const cfbC = cfbEncrypt(plainBlocks, key, iv)
    const cfbP = cfbDecrypt(cfbC, key, iv)
    expect(cfbP).toEqual(plainBlocks)

    // OFB
    const ofbC = ofbEncrypt(plainBlocks, key, iv)
    const ofbP = ofbDecrypt(ofbC, key, iv)
    expect(ofbP).toEqual(plainBlocks)

    // CTR
    const ctrC = ctrEncrypt(plainBlocks, key, iv)
    const ctrP = ctrDecrypt(ctrC, key, iv)
    expect(ctrP).toEqual(plainBlocks)
  })

  it('Error propagation simulation produces correct blast radius for CBC vs ECB', () => {
    const ecbImpact = simulateErrorPropagation('ECB', 4, 1)
    expect(ecbImpact.affectedPlainBlocks).toEqual([1])

    const cbcImpact = simulateErrorPropagation('CBC', 4, 1)
    expect(cbcImpact.affectedPlainBlocks).toEqual([1, 2])
  })

  // 3. DES & 3DES
  it('DES S-box correctly indexes rows from outer bits and columns from inner bits', () => {
    // Input 0b011001 = 25
    // Outer bits: bit 5 = 0, bit 0 = 1 -> row 1
    // Inner bits: bits 4..1 = 1100 = 12 -> col 12
    const s1Val = sboxLookup(25, DES_SBOX_1)
    expect(s1Val).toBe(DES_SBOX_1[1][12])
  })

  it('DES expansion table maps 32 bits to 48 bits', () => {
    const expanded = desExpansionE(0x12345678)
    expect(expanded > BigInt(0)).toBe(true)
  })

  it('3DES EDE mode roundtrip restores block', () => {
    const keys = { k1: 0x1111, k2: 0x2222, k3: 0x3333 }
    const cipherFn = (b: number, k: number) => (b ^ k) & 0xFFFF
    const decipherFn = (b: number, k: number) => (b ^ k) & 0xFFFF

    const enc = tripleDesEncrypt(0x55AA, keys, cipherFn, decipherFn)
    const dec = tripleDesDecrypt(enc, keys, cipherFn, decipherFn)
    expect(dec).toBe(0x55AA)
  })

  // 4. AES
  it('AES GF(2^8) multiplication and xtime operate correctly', () => {
    expect(xtime(0x57)).toBe(0xAE)
    expect(xtime(0xAE)).toBe(0x47) // 0xAE << 1 = 0x15C ^ 0x11B = 0x47
    expect(gfMul(0x57, 0x13)).toBe(0xFE)
  })

  it('AES ShiftRows and InvShiftRows are inverses', () => {
    const state = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15]
    ]
    const shifted = shiftRows(state)
    const unshifted = invShiftRows(shifted)
    expect(unshifted).toEqual(state)
  })

  it('AES SubBytes transforms state non-linearly', () => {
    const state = [
      [0x00, 0x01, 0x02, 0x03],
      [0x04, 0x05, 0x06, 0x07],
      [0x08, 0x09, 0x0A, 0x0B],
      [0x0C, 0x0D, 0x0E, 0x0F]
    ]
    const sub = subBytes(state)
    expect(sub[0][0]).toBe(0x63) // S-Box(0x00) = 0x63
  })

  // 5. Rabin
  it('Rabin cryptosystem encrypts and recovers 4 roots containing original message', () => {
    // p = 7 ≡ 3 mod 4, q = 11 ≡ 3 mod 4
    const key = generateRabinKeys(7, 11)
    expect(key).not.toBeNull()
    if (!key) return

    const message = BigInt(20) // message < 77
    const ciphertext = rabinEncrypt(message, key.n)
    expect(ciphertext).toBe(BigInt(400 % 77)) // 400 mod 77 = 15

    const roots = rabinDecrypt(ciphertext, key.p, key.q)
    const allRoots = [roots.r1, roots.r2, roots.r3, roots.r4]
    expect(allRoots).toContain(message)
  })

  // 6. ElGamal
  it('ElGamal encrypts and decrypts message over Z_p*', () => {
    // p = 23, primitive root g = 5, private key x = 6
    const key = generateElGamalKey(23, 5, 6)
    const message = BigInt(15)
    const k = BigInt(3) // ephemeral key

    const ciphertext = elgamalEncrypt(message, key.p, key.g, key.y, k)
    const decrypted = elgamalDecrypt(ciphertext, key.p, key.x)
    expect(decrypted).toBe(message)
  })

  // 7. ECC
  it('ECC verifies curve non-singularity and performs point addition / doubling', () => {
    // Curve: y^2 ≡ x^3 + x + 1 (mod 23)
    const curve: ECCurve = { a: 1, b: 1, p: 23 }
    expect(isCurveNonSingular(curve)).toBe(true)

    // Point (0, 1): 1^2 ≡ 0^3 + 0 + 1 (mod 23) -> valid!
    const P = { x: 0, y: 1 }
    expect(isPointOnCurve(P, curve)).toBe(true)

    // Point Doubling: 2P
    const twoP = ecAdd(P, P, curve)
    expect(twoP).not.toBeNull()
    expect(isPointOnCurve(twoP, curve)).toBe(true)

    // Scalar mult: 2 * P should equal 2P
    const mult2P = ecMultiply(2, P, curve)
    expect(mult2P).toEqual(twoP)

    // Enumerate points
    const points = findCurvePoints(curve)
    expect(points.length).toBeGreaterThan(0)
    expect(points).toContainEqual(P)
  })

  // 8. Diffie-Hellman
  it('Diffie-Hellman completes shared secret exchange and detects MitM attack', () => {
    // Normal exchange: p=23, g=5, a=6, b=15
    const normal = runNormalDH(23, 5, 6, 15)
    expect(normal.match).toBe(true)
    expect(normal.sharedSecretAlice).toBe(normal.sharedSecretBob)

    // MitM attack: Mallory rogue key m=7
    const mitm = runMitmDH(23, 5, 6, 15, 7)
    expect(mitm.compromised).toBe(true)
    expect(mitm.alice.sharedSecret).toBe(mitm.mallory.secretWithAlice)
    expect(mitm.bob.sharedSecret).toBe(mitm.mallory.secretWithBob)
  })

  // 9. TEA (Tiny Encryption Algorithm)
  it('TEA encrypts 64-bit block and decrypts back to identical values', () => {
    const key: TeaKey = [0xA1B2C3D4, 0xE5F60718, 0x99AABBCC, 0xDDEEFF00]
    const block: TeaState = { v0: 0x01234567, v1: 0x89ABCDEF }

    const encrypted = teaEncrypt(block, key, 32)
    expect(encrypted.v0).not.toBe(block.v0)

    const decrypted = teaDecrypt(encrypted, key, 32)
    expect(decrypted.v0).toBe(block.v0)
    expect(decrypted.v1).toBe(block.v1)
  })

})
