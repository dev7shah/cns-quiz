import { Card, CardContent } from "@/components/ui/Card"

export default function CryptoCheatSheet() {
  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Cryptography Cheat Sheet</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Key Terms</h3>
              <ul className="space-y-3">
                <li><strong className="text-primary">Plaintext:</strong> The original readable message.</li>
                <li><strong className="text-primary">Ciphertext:</strong> The scrambled, unreadable message.</li>
                <li><strong className="text-primary">Key:</strong> A piece of information used by the cipher to encrypt/decrypt.</li>
                <li><strong className="text-primary">Symmetric:</strong> Same key for both sides (AES, DES).</li>
                <li><strong className="text-primary">Asymmetric:</strong> Public/Private key pair (RSA, ECC).</li>
                <li><strong className="text-primary">Hash:</strong> One-way mathematical function (SHA-256).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Algorithms</h3>
              <ul className="space-y-3">
                <li><strong>AES:</strong> Advanced Encryption Standard. The current symmetric standard. Fast and secure.</li>
                <li><strong>RSA:</strong> Rivest-Shamir-Adleman. Standard for asymmetric encryption and digital signatures.</li>
                <li><strong>Diffie-Hellman (DH):</strong> A protocol used to securely exchange symmetric keys over an insecure channel.</li>
                <li><strong>SHA-256:</strong> Secure Hash Algorithm 256-bit. Used for data integrity and password hashing.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Public Key Infrastructure (PKI) Rules</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>To send a secret message to Alice, encrypt with <strong>Alice&apos;s Public Key</strong>.</li>
              <li>To prove a message came from Alice (Digital Signature), Alice encrypts the hash with <strong>her Private Key</strong>.</li>
              <li>Anyone can verify Alice&apos;s signature using <strong>Alice&apos;s Public Key</strong>.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
