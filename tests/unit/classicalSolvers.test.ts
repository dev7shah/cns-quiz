import { describe, it, expect } from "vitest"
import { gcd, modInverse26, getValidAffineMultipliers, affineEncrypt, affineDecrypt } from "@/lib/crypto/affine"
import { buildPlayfairMatrix, prepareDigraphs, playfairEncrypt, playfairDecrypt } from "@/lib/crypto/playfair"
import { det2x2, isValidHillMatrix, invertMatrix2x2, hillEncrypt2x2, hillDecrypt2x2, Matrix2x2 } from "@/lib/crypto/hill"
import { railFenceEncrypt, railFenceDecrypt, columnarEncrypt, columnarDecrypt } from "@/lib/crypto/transposition"
import { indexOfCoincidence, computeFrequencies } from "@/lib/crypto/cryptanalysis"

describe("M1 Classical Cryptography Mathematical Solvers", () => {
  describe("Affine Cipher", () => {
    it("computes GCD correctly", () => {
      expect(gcd(7, 26)).toBe(1)
      expect(gcd(4, 26)).toBe(2)
      expect(gcd(13, 26)).toBe(13)
    })

    it("computes modular inverse mod 26", () => {
      expect(modInverse26(7, 26)).toBe(15) // 7 * 15 = 105 = 4*26 + 1
      expect(modInverse26(3, 26)).toBe(9)  // 3 * 9 = 27 = 1 mod 26
      expect(modInverse26(4, 26)).toBeNull() // Even, no inverse
    })

    it("identifies exactly 12 valid multipliers in Z_26", () => {
      const valid = getValidAffineMultipliers(26)
      expect(valid.length).toBe(12)
      expect(valid).toEqual([1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25])
    })

    it("encrypts and decrypts standard test vector (HOT -> AXG)", () => {
      const plaintext = "HOT"
      const a = 7
      const b = 3
      const cipher = affineEncrypt(plaintext, a, b)
      expect(cipher).toBe("AXG")

      const decrypted = affineDecrypt(cipher, a, b)
      expect(decrypted).toBe("HOT")
    })
  })

  describe("Playfair Cipher", () => {
    it("builds 5x5 key matrix from keyword MONARCHY", () => {
      const matrix = buildPlayfairMatrix("MONARCHY")
      expect(matrix.length).toBe(5)
      expect(matrix[0]).toEqual(['M', 'O', 'N', 'A', 'R'])
      expect(matrix[1]).toEqual(['C', 'H', 'Y', 'B', 'D'])
      expect(matrix[2]).toEqual(['E', 'F', 'G', 'I', 'K'])
      expect(matrix[3]).toEqual(['L', 'P', 'Q', 'S', 'T'])
      expect(matrix[4]).toEqual(['U', 'V', 'W', 'X', 'Z'])
    })

    it("prepares digraphs by inserting filler X for duplicates", () => {
      const digraphs = prepareDigraphs("BALLOON")
      expect(digraphs).toEqual([
        ['B', 'A'],
        ['L', 'X'],
        ['L', 'O'],
        ['O', 'N']
      ])
    })

    it("encrypts and decrypts test pair BA to IB", () => {
      const cipher = playfairEncrypt("BA", "MONARCHY")
      expect(cipher).toBe("IB")

      const decrypted = playfairDecrypt(cipher, "MONARCHY")
      expect(decrypted).toBe("BA")
    })

    it("round-trips full message with Playfair", () => {
      const message = "HIDETHEGOLD"
      const cipher = playfairEncrypt(message, "KEYWORD")
      const decrypted = playfairDecrypt(cipher, "KEYWORD")
      expect(decrypted.replace(/X/g, '')).toBe("HIDETHEGOLD")
    })
  })

  describe("Hill Cipher 2x2", () => {
    const keyMatrix: Matrix2x2 = [
      [3, 2],
      [5, 7]
    ]

    it("computes 2x2 determinant and checks invertibility", () => {
      const d = det2x2(keyMatrix) // 3*7 - 2*5 = 21 - 10 = 11
      expect(d).toBe(11)
      expect(isValidHillMatrix(keyMatrix)).toBe(true)
    })

    it("inverts 2x2 matrix modulo 26", () => {
      const inv = invertMatrix2x2(keyMatrix)
      // 11^-1 mod 26 = 19
      // Adjugate: [[7, -2], [-5, 3]] = [[7, 24], [21, 3]]
      // 19 * [[7, 24], [21, 3]] mod 26 = [[133, 456], [399, 57]] mod 26 = [[3, 14], [9, 5]]
      expect(inv).toEqual([
        [3, 14],
        [9, 5]
      ])
    })

    it("encrypts and decrypts 4-letter block HELP", () => {
      const plaintext = "HELP"
      const cipher = hillEncrypt2x2(plaintext, keyMatrix)
      expect(cipher.length).toBe(4)

      const decrypted = hillDecrypt2x2(cipher, keyMatrix)
      expect(decrypted).toBe("HELP")
    })
  })

  describe("Transposition Ciphers", () => {
    it("encrypts and decrypts using Rail Fence with 3 rails", () => {
      const text = "DEFENDTHEEASTWALL"
      const rails = 3
      const cipher = railFenceEncrypt(text, rails)
      const decrypted = railFenceDecrypt(cipher, rails)
      expect(decrypted).toBe(text)
    })

    it("encrypts and decrypts using Columnar Transposition", () => {
      const text = "ATTACKATDAWN"
      const key = "SECRET"
      const cipher = columnarEncrypt(text, key)
      const decrypted = columnarDecrypt(cipher, key)
      expect(decrypted.startsWith("ATTACKATDAWN")).toBe(true)
    })
  })

  describe("Cryptanalysis Metrics", () => {
    it("computes Index of Coincidence for English text", () => {
      const englishSample = "TOBEORNOTTOBETHATISTHEQUESTIONWHETHERTISNOBLERINTHEMINDTOSLOFFERTHESLINGSANDARROWSOFOUTRAGEOUSFORTUNE"
      const ioc = indexOfCoincidence(englishSample)
      expect(ioc).toBeGreaterThan(0.06)
    })

    it("computes unigram frequencies accurately", () => {
      const sample = "EEETA"
      const freqs = computeFrequencies(sample)
      expect(freqs['E']).toBe(60)
      expect(freqs['T']).toBe(20)
      expect(freqs['A']).toBe(20)
    })
  })
})
