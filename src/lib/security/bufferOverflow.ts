/**
 * Memory Vulnerabilities: Buffer Overflow & Stack Frame Simulation
 * Covers:
 * - x86/x64 Stack frame layout: Local buffer, Compiler padding, Stack canary, Saved EBP, Saved Return Address (EIP)
 * - Buffer overflow mechanics (classic smash-the-stack)
 * - Defenses: Stack Canaries (StackGuard), DEP/NX (Non-executable stack), ASLR (Address Space Layout Randomization)
 * - Incomplete Mediation (Client-side validation bypass)
 */

export interface StackSlot {
  offset: number
  name: string
  originalValue: string
  currentValue: string
  isCorrupted: boolean
  isCanary?: boolean
  isSavedEbp?: boolean
  isReturnAddress?: boolean
}

export interface BufferOverflowResult {
  bufferCapacity: number
  inputLength: number
  overflowed: boolean
  bytesOverflowed: number
  canaryPresent: boolean
  canarySmashed: boolean
  canaryValue: string
  savedEbpCorrupted: boolean
  returnAddressOverwritten: boolean
  hijackedReturnAddress: string | null
  executionStatus: "safe" | "aborted_by_canary" | "dep_blocked" | "control_flow_hijacked"
  terminalOutput: string
  stackSlots: StackSlot[]
}

export interface StackProtectionConfig {
  enableCanary?: boolean
  enableDEP?: boolean
  enableASLR?: boolean
  canaryMagic?: string
}

/**
 * Simulates a classic stack-based buffer overflow:
 * Buffer of size `bufferCapacity` (default 16 bytes).
 * Next 4 bytes: Stack Canary (if enabled).
 * Next 4 bytes: Saved EBP (frame pointer).
 * Next 4 bytes: Saved EIP (return address).
 */
export function simulateBufferOverflow(
  inputData: string,
  bufferCapacity: number = 16,
  config: StackProtectionConfig = {}
): BufferOverflowResult {
  const {
    enableCanary = true,
    enableDEP = false,
    enableASLR = false,
    canaryMagic = "0x00AFF00D"
  } = config

  const inputBytes = new TextEncoder().encode(inputData)
  const inputLength = inputBytes.length
  const overflowed = inputLength > bufferCapacity
  const bytesOverflowed = Math.max(0, inputLength - bufferCapacity)

  // Layout slots:
  // Offset 0 .. bufferCapacity-1: Local buffer
  // If canary: next 4 bytes
  // Next 4 bytes: Saved EBP
  // Next 4 bytes: Return Address (EIP)
  const defaultEbp = "0xBFFFEE40"
  const defaultEip = "0x080484A6" // normal return address in main()

  const canaryOffset = bufferCapacity
  const canaryLen = enableCanary ? 4 : 0
  const ebpOffset = bufferCapacity + canaryLen
  const eipOffset = ebpOffset + 4

  let canarySmashed = false
  let savedEbpCorrupted = false
  let returnAddressOverwritten = false
  let hijackedReturnAddress: string | null = null

  // Format written values
  let currentCanary = enableCanary ? canaryMagic : "NONE"
  let currentEbp = defaultEbp
  let currentEip = defaultEip

  if (enableCanary && inputLength > canaryOffset) {
    canarySmashed = true
    const smashedBytes = inputData.slice(canaryOffset, canaryOffset + 4)
    currentCanary = "0x" + Array.from(new TextEncoder().encode(smashedBytes)).map(b => b.toString(16).padStart(2, "0")).join("")
  }

  if (inputLength > ebpOffset) {
    savedEbpCorrupted = true
    const ebpBytes = inputData.slice(ebpOffset, ebpOffset + 4)
    currentEbp = "0x" + Array.from(new TextEncoder().encode(ebpBytes)).map(b => b.toString(16).padStart(2, "0")).join("")
  }

  if (inputLength > eipOffset) {
    returnAddressOverwritten = true
    const eipBytes = inputData.slice(eipOffset, eipOffset + 4)
    hijackedReturnAddress = "0x" + Array.from(new TextEncoder().encode(eipBytes)).map(b => b.toString(16).padStart(2, "0")).join("")
    currentEip = hijackedReturnAddress
  }

  // Determine execution outcome
  let executionStatus: BufferOverflowResult["executionStatus"] = "safe"
  let terminalOutput = "Program completed normally with return code 0."

  if (!overflowed) {
    executionStatus = "safe"
    terminalOutput = `Successfully read ${inputLength} bytes into ${bufferCapacity}-byte buffer.`
  } else if (enableCanary && canarySmashed) {
    executionStatus = "aborted_by_canary"
    terminalOutput = `*** stack smashing detected ***: terminated by __stack_chk_fail(). Core dumped.`
  } else if (returnAddressOverwritten) {
    if (enableDEP) {
      executionStatus = "dep_blocked"
      terminalOutput = `General Protection Fault: Execution prevented at ${currentEip} by DEP/NX (Non-executable stack).`
    } else if (enableASLR) {
      executionStatus = "dep_blocked"
      terminalOutput = `Segmentation fault (SIGSEGV): Stack address randomized by ASLR, shellcode target missed.`
    } else {
      executionStatus = "control_flow_hijacked"
      terminalOutput = `INSTRUCTION POINTER HIJACKED! Jumped to attacker shellcode at ${currentEip}.`
    }
  } else {
    executionStatus = "safe"
    terminalOutput = `Buffer overflowed by ${bytesOverflowed} bytes, but critical return address remained intact.`
  }

  // Construct stack slots for visualization
  const stackSlots: StackSlot[] = [
    {
      offset: 0,
      name: `buffer[0..${bufferCapacity - 1}]`,
      originalValue: "0x00",
      currentValue: inputData.slice(0, bufferCapacity) || "EMPTY",
      isCorrupted: false
    }
  ]

  if (enableCanary) {
    stackSlots.push({
      offset: canaryOffset,
      name: "Stack Canary (StackGuard)",
      originalValue: canaryMagic,
      currentValue: currentCanary,
      isCorrupted: canarySmashed,
      isCanary: true
    })
  }

  stackSlots.push({
    offset: ebpOffset,
    name: "Saved Frame Pointer (EBP)",
    originalValue: defaultEbp,
    currentValue: currentEbp,
    isCorrupted: savedEbpCorrupted,
    isSavedEbp: true
  })

  stackSlots.push({
    offset: eipOffset,
    name: "Saved Return Address (EIP)",
    originalValue: defaultEip,
    currentValue: currentEip,
    isCorrupted: returnAddressOverwritten,
    isReturnAddress: true
  })

  return {
    bufferCapacity,
    inputLength,
    overflowed,
    bytesOverflowed,
    canaryPresent: enableCanary,
    canarySmashed,
    canaryValue: currentCanary,
    savedEbpCorrupted,
    returnAddressOverwritten,
    hijackedReturnAddress,
    executionStatus,
    terminalOutput,
    stackSlots
  }
}

/**
 * Incomplete Mediation Simulation:
 * Demonstrates client-side validation bypass:
 * Attacker intercepts an HTTP form with price = 100, alters to price = -50 or quantity = -5.
 * If server does not mediate and blindly trusts client-filtered input, business logic breaks.
 */
export interface MediationResult {
  clientPrice: number
  clientQuantity: number
  serverSideMediation: boolean
  computedTotal: number
  isVulnerable: boolean
  verdict: string
}

export function simulateIncompleteMediation(
  price: number,
  quantity: number,
  serverValidates: boolean
): MediationResult {
  if (serverValidates) {
    // Robust server-side mediation checks
    if (price <= 0 || quantity <= 0 || !Number.isInteger(quantity)) {
      return {
        clientPrice: price,
        clientQuantity: quantity,
        serverSideMediation: true,
        computedTotal: 0,
        isVulnerable: false,
        verdict: "Server rejected malicious input: Price and quantity must be positive integers."
      }
    }
    return {
      clientPrice: price,
      clientQuantity: quantity,
      serverSideMediation: true,
      computedTotal: price * quantity,
      isVulnerable: false,
      verdict: `Valid order processed: Total $${price * quantity}.`
    }
  }

  // Incomplete mediation: server blindly trusts input passed past HTML form
  const rawTotal = price * quantity
  const isVulnerable = price <= 0 || quantity <= 0
  return {
    clientPrice: price,
    clientQuantity: quantity,
    serverSideMediation: false,
    computedTotal: rawTotal,
    isVulnerable,
    verdict: isVulnerable
      ? `INCOMPLETE MEDIATION EXPLOIT! Server credited user account with negative total $${rawTotal}.`
      : `Order processed: Total $${rawTotal} (Vulnerable architecture, zero server validation).`
  }
}
