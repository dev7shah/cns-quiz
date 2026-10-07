/**
 * Hashes a string using SHA-256 (Web Crypto API).
 * Returns the hex string representation of the hash.
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  }
  
  // Fallback for Node.js (during SSR/tests if needed)
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    const crypto = await import("crypto")
    return crypto.createHash("sha256").update(message).digest("hex")
  }
  
  return ""
}
