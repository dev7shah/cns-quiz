import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function CryptoLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">What is Cryptography?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Cryptography is the practice and study of techniques for secure communication in the presence of adversarial behavior. 
          It forms the mathematical foundation of all network security.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Symmetric Encryption</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Uses the <strong>same key</strong> for both encryption and decryption.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Pros:</strong> Very fast, suitable for bulk data (e.g., AES).</li>
              <li><strong>Cons:</strong> Key distribution problem (how do you safely share the key?).</li>
              <li><strong>Examples:</strong> Caesar Cipher, Vigenère, AES, DES, ChaCha20.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Asymmetric Encryption</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Uses a <strong>key pair</strong>: a Public Key to encrypt, and a Private Key to decrypt.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Pros:</strong> Solves the key distribution problem. Anyone can encrypt to you, only you can decrypt.</li>
              <li><strong>Cons:</strong> Very slow compared to symmetric ciphers.</li>
              <li><strong>Examples:</strong> RSA, Elliptic Curve (ECC), Diffie-Hellman.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">How RSA Works</h3>
        <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-3">
          <p>1. Choose two large primes: <strong>p</strong> and <strong>q</strong>.</p>
          <p>2. Compute modulus <strong>n = p × q</strong>.</p>
          <p>3. Compute totient <strong>φ(n) = (p - 1) × (q - 1)</strong>.</p>
          <p>4. Choose public exponent <strong>e</strong> coprime to φ(n).</p>
          <p>5. Compute private exponent <strong>d</strong> where <strong>(e × d) mod φ(n) = 1</strong>.</p>
          <p className="text-primary mt-4">Public Key: (n, e) &nbsp;&nbsp;|&nbsp;&nbsp; Private Key: (d)</p>
          <p>Encrypt: C = M<sup>e</sup> mod n</p>
          <p>Decrypt: M = C<sup>d</sup> mod n</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Hashing (One-way functions)</h3>
        <p className="text-muted-foreground mb-4">
          A hash function takes an arbitrary amount of data and deterministically maps it to a fixed-size string (like a digital fingerprint). 
          It is a one-way function—you cannot decrypt a hash back into the original data.
        </p>
        <Callout variant="warning">
          <strong>The Avalanche Effect:</strong> Changing just one single bit of the input data should change roughly 50% of the bits in the output hash. This ensures that similar inputs do not yield similar hashes.
        </Callout>
      </section>

      <section className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">?</span>
          Exam-style Questions
        </h3>
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <strong>Q: Why do we use both symmetric and asymmetric encryption together in TLS?</strong>
            <p className="text-muted-foreground mt-1">A: Asymmetric is used initially to securely exchange a symmetric key, because it solves the distribution problem. Then, symmetric encryption is used for the actual data transfer because it is much faster.</p>
          </li>
          <li>
            <strong>Q: If an attacker intercepts ciphertext encrypted with Bob&apos;s public key, can they decrypt it?</strong>
            <p className="text-muted-foreground mt-1">A: No. Only Bob possesses the corresponding private key required to mathematically reverse the operation (assuming RSA is implemented correctly with large enough primes).</p>
          </li>
        </ul>
      </section>
    </div>
  )
}
