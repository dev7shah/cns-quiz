/**
 * Simulates generating a Time-based One-Time Password (TOTP).
 * In a real scenario, this uses HMAC-SHA1. For this demo, we'll
 * simulate it using the Web Crypto API or a simple hash simulation.
 */
export async function generateTOTP(secret: string, timeStepS: number = 30): Promise<{ code: string, timeLeft: number }> {
  // Current time in seconds
  const now = Math.floor(Date.now() / 1000)
  
  // The current time window counter
  const counter = Math.floor(now / timeStepS)
  const timeLeft = timeStepS - (now % timeStepS)

  // We combine the secret and counter to simulate HMAC
  const message = `${secret}:${counter}`
  
  // Use a simple hash simulation for the demo if crypto isn't available, 
  // or use the crypto API to generate a deterministic 6-digit number.
  let hashNum = 0
  for (let i = 0; i < message.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + message.charCodeAt(i)
    hashNum |= 0 // Convert to 32bit integer
  }
  
  // Get a 6 digit code
  const code = Math.abs(hashNum % 1000000).toString().padStart(6, '0')
  
  return { code, timeLeft }
}
