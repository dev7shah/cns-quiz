/**
 * SHA-3 Sponge Construction Simulator (Keccak Principles)
 * Demonstrates:
 * - State division: Bitrate (r) + Capacity (c) = State width (b)
 * - Absorbing phase: Message blocks are XORed into the bitrate part, followed by permutation f
 * - Squeezing phase: Output blocks are extracted from the bitrate part, interleaved with permutation f
 * - Resistance to Length Extension Attacks (capacity part c is never exposed to attacker)
 */

export interface SpongeStateStep {
  stepIndex: number
  phase: "init" | "absorb" | "permute" | "squeeze"
  blockIndex?: number
  inputBlockHex?: string
  stateBitrateHex: string
  stateCapacityHex: string
  fullStateHex: string
  description: string
}

export interface SpongeSimulation {
  rateBytes: number
  capacityBytes: number
  stateWidthBytes: number
  outputBytesRequested: number
  inputPaddedHex: string
  steps: SpongeStateStep[]
  finalDigestHex: string
}

// Educational permutation function f (simplified round functions: non-linear substitution + rotate + mixing)
function educationalPermutationF(state: number[]): number[] {
  const next = [...state]
  const len = next.length
  // Substitution & diffusion round:
  for (let i = 0; i < len; i++) {
    const left = next[(i + len - 1) % len]
    const right = next[(i + 1) % len]
    // Non-linear operation: x ^ ((~y) & z) like Keccak Chi
    next[i] = (next[i] ^ ((~left & 0xff) & right) ^ 0x6a) & 0xff
  }
  // Circular rotate bytes (Theta/Rho/Pi analogue)
  const first = next[0]
  for (let i = 0; i < len - 1; i++) {
    next[i] = (next[i + 1] + (i * 17)) & 0xff
  }
  next[len - 1] = first
  return next
}

/**
 * Simulates a Keccak-style sponge construction.
 * Default: Rate r = 4 bytes, Capacity c = 4 bytes, State b = 8 bytes.
 */
export function simulateSponge(
  message: string,
  rateBytes: number = 4,
  capacityBytes: number = 4,
  outputBytesRequested: number = 8
): SpongeSimulation {
  const encoder = new TextEncoder()
  const rawBytes = Array.from(encoder.encode(message))
  const stateWidthBytes = rateBytes + capacityBytes

  // Pad message with Keccak 10*1 padding (pad with 0x01 then 0x00...0x80)
  const padded = [...rawBytes]
  padded.push(0x01)
  while (padded.length % rateBytes !== 0) {
    if (padded.length % rateBytes === rateBytes - 1) {
      padded.push(0x80)
    } else {
      padded.push(0x00)
    }
  }

  const toHex = (arr: number[]) => arr.map(b => b.toString(16).padStart(2, "0")).join("")
  const steps: SpongeStateStep[] = []

  let state = new Array(stateWidthBytes).fill(0x00)
  let stepIdx = 0

  steps.push({
    stepIndex: stepIdx++,
    phase: "init",
    stateBitrateHex: toHex(state.slice(0, rateBytes)),
    stateCapacityHex: toHex(state.slice(rateBytes)),
    fullStateHex: toHex(state),
    description: `Initialized ${stateWidthBytes}-byte state with zeros (Rate: ${rateBytes} bytes, Capacity: ${capacityBytes} bytes).`
  })

  // ABSORBING PHASE
  const numBlocks = padded.length / rateBytes
  for (let b = 0; b < numBlocks; b++) {
    const block = padded.slice(b * rateBytes, (b + 1) * rateBytes)
    const blockHex = toHex(block)

    // XOR block into bitrate portion
    for (let i = 0; i < rateBytes; i++) {
      state[i] = (state[i] ^ block[i]) & 0xff
    }

    steps.push({
      stepIndex: stepIdx++,
      phase: "absorb",
      blockIndex: b + 1,
      inputBlockHex: blockHex,
      stateBitrateHex: toHex(state.slice(0, rateBytes)),
      stateCapacityHex: toHex(state.slice(rateBytes)),
      fullStateHex: toHex(state),
      description: `Absorbed Block ${b + 1}/${numBlocks} (${blockHex}) into Rate portion via XOR.`
    })

    // Apply Permutation function f
    state = educationalPermutationF(state)

    steps.push({
      stepIndex: stepIdx++,
      phase: "permute",
      blockIndex: b + 1,
      stateBitrateHex: toHex(state.slice(0, rateBytes)),
      stateCapacityHex: toHex(state.slice(rateBytes)),
      fullStateHex: toHex(state),
      description: `Applied Keccak permutation f to all ${stateWidthBytes} bytes of state.`
    })
  }

  // SQUEEZING PHASE
  const output: number[] = []
  let squeezeRound = 1

  while (output.length < outputBytesRequested) {
    const needed = outputBytesRequested - output.length
    const extractCount = Math.min(rateBytes, needed)
    const extracted = state.slice(0, extractCount)
    output.push(...extracted)

    steps.push({
      stepIndex: stepIdx++,
      phase: "squeeze",
      stateBitrateHex: toHex(state.slice(0, rateBytes)),
      stateCapacityHex: toHex(state.slice(rateBytes)),
      fullStateHex: toHex(state),
      description: `Squeezed ${extractCount} bytes from Rate portion (${toHex(extracted)}).`
    })

    if (output.length < outputBytesRequested) {
      state = educationalPermutationF(state)
      steps.push({
        stepIndex: stepIdx++,
        phase: "permute",
        stateBitrateHex: toHex(state.slice(0, rateBytes)),
        stateCapacityHex: toHex(state.slice(rateBytes)),
        fullStateHex: toHex(state),
        description: `Applied permutation f before squeeze round ${++squeezeRound}.`
      })
    }
  }

  return {
    rateBytes,
    capacityBytes,
    stateWidthBytes,
    outputBytesRequested,
    inputPaddedHex: toHex(padded),
    steps,
    finalDigestHex: toHex(output)
  }
}
