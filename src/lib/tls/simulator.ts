export type HandshakeStep = 
  | "CLIENT_HELLO"
  | "SERVER_HELLO"
  | "CERTIFICATE"
  | "SERVER_KEY_EXCHANGE"
  | "SERVER_HELLO_DONE"
  | "CLIENT_KEY_EXCHANGE"
  | "CHANGE_CIPHER_SPEC"
  | "FINISHED"

export interface TLSState {
  step: HandshakeStep
  messages: string[]
  isSecure: boolean
}

export function simulateTLSHandshake(currentStep: HandshakeStep): TLSState {
  switch (currentStep) {
    case "CLIENT_HELLO":
      return {
        step: "SERVER_HELLO",
        messages: ["Client: Hello! I support TLS 1.3 and these Cipher Suites (e.g., AES_256_GCM). Here is my random number (Client Random)."],
        isSecure: false
      }
    case "SERVER_HELLO":
      return {
        step: "CERTIFICATE",
        messages: ["Server: Hello! Let's use TLS 1.3 and AES_256_GCM. Here is my random number (Server Random)."],
        isSecure: false
      }
    case "CERTIFICATE":
      return {
        step: "SERVER_KEY_EXCHANGE",
        messages: ["Server: Here is my Digital Certificate (contains my Public Key), signed by a trusted CA (e.g., Let's Encrypt)."],
        isSecure: false
      }
    case "SERVER_KEY_EXCHANGE":
      return {
        step: "SERVER_HELLO_DONE",
        messages: ["Server: (Optional for RSA, required for Diffie-Hellman) Here are my parameters to generate the session key."],
        isSecure: false
      }
    case "SERVER_HELLO_DONE":
      return {
        step: "CLIENT_KEY_EXCHANGE",
        messages: ["Server: I am done sending my initial parameters."],
        isSecure: false
      }
    case "CLIENT_KEY_EXCHANGE":
      return {
        step: "CHANGE_CIPHER_SPEC",
        messages: ["Client: I verified your certificate. Here is the Pre-Master Secret, encrypted with your Public Key. Only your Private Key can decrypt it."],
        isSecure: false
      }
    case "CHANGE_CIPHER_SPEC":
      return {
        step: "FINISHED",
        messages: ["Client & Server: We both independently calculate the Master Secret (Symmetric Key). Switching to encrypted communication now!"],
        isSecure: true
      }
    case "FINISHED":
      return {
        step: "FINISHED",
        messages: ["Client & Server: Secure Connection Established. All HTTP traffic (HTTPS) is now encrypted with the Symmetric Key."],
        isSecure: true
      }
    default:
      return { step: "CLIENT_HELLO", messages: [], isSecure: false }
  }
}
