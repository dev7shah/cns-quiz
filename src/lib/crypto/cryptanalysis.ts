/**
 * Classical Cryptanalysis Tools:
 * - Letter Frequency Analysis
 * - Index of Coincidence (IoC)
 * - Kasiski Examination
 */

export const ENGLISH_LETTER_FREQUENCIES: Record<string, number> = {
  E: 12.70, T: 9.06, A: 8.17, O: 7.51, I: 6.97, N: 6.75, S: 6.33, H: 6.09,
  R: 5.99, D: 4.25, L: 4.03, C: 2.78, U: 2.76, M: 2.41, W: 2.36, F: 2.23,
  G: 2.02, Y: 1.97, P: 1.93, B: 1.29, V: 0.98, K: 0.77, J: 0.15, X: 0.15,
  Q: 0.10, Z: 0.07
}

export function computeFrequencies(text: string): Record<string, number> {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '')
  const counts: Record<string, number> = {}
  for (let i = 65; i <= 90; i++) counts[String.fromCharCode(i)] = 0

  for (const ch of clean) {
    counts[ch] = (counts[ch] || 0) + 1
  }

  const total = clean.length || 1
  const freqs: Record<string, number> = {}
  for (const [ch, cnt] of Object.entries(counts)) {
    freqs[ch] = parseFloat(((cnt / total) * 100).toFixed(2))
  }
  return freqs
}

/**
 * Computes Index of Coincidence (IoC):
 * Ic = sum(fi * (fi - 1)) / (N * (N - 1))
 * English standard text: ~0.0667
 * Uniform random distribution (Polyalphabetic with long key): ~0.0385
 */
export function indexOfCoincidence(text: string): number {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '')
  const n = clean.length
  if (n <= 1) return 0

  const counts: Record<string, number> = {}
  for (const ch of clean) {
    counts[ch] = (counts[ch] || 0) + 1
  }

  let sum = 0
  for (const cnt of Object.values(counts)) {
    sum += cnt * (cnt - 1)
  }

  const ioc = sum / (n * (n - 1))
  return parseFloat(ioc.toFixed(4))
}

export interface KasiskiRepeat {
  sequence: string
  positions: number[]
  distances: number[]
}

export function kasiskiExamination(text: string, seqLength: number = 3): KasiskiRepeat[] {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '')
  const seen: Record<string, number[]> = {}

  for (let i = 0; i <= clean.length - seqLength; i++) {
    const sub = clean.slice(i, i + seqLength)
    if (!seen[sub]) seen[sub] = []
    seen[sub].push(i)
  }

  const repeats: KasiskiRepeat[] = []
  for (const [sub, posList] of Object.entries(seen)) {
    if (posList.length >= 2) {
      const distances: number[] = []
      for (let j = 1; j < posList.length; j++) {
        distances.push(posList[j] - posList[j - 1])
      }
      repeats.push({
        sequence: sub,
        positions: posList,
        distances
      })
    }
  }

  return repeats
}

export function estimateVigenereKeyLength(repeats: KasiskiRepeat[]): number[] {
  if (repeats.length === 0) return [1]
  const allDistances = repeats.flatMap(r => r.distances)
  const factorCounts: Record<number, number> = {}

  for (const dist of allDistances) {
    for (let f = 2; f <= Math.min(dist, 16); f++) {
      if (dist % f === 0) {
        factorCounts[f] = (factorCounts[f] || 0) + 1
      }
    }
  }

  // Sort candidate factors by frequency of occurrence
  return Object.entries(factorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(entry => parseInt(entry[0]))
    .slice(0, 3)
}
