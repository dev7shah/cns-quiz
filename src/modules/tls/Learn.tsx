import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Callout } from "@/components/ui/Callout"

export default function TLSLearn() {
  return (
    <div className="space-y-8 p-2">
      <section>
        <h2 className="text-2xl font-bold mb-4">Why do we need TLS?</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Without TLS, all HTTP traffic is sent in <strong>plaintext</strong>. Anyone on the same WiFi network, or any router between you and the server, can read your passwords and credit card numbers. 
          TLS (Transport Layer Security) encrypts this data, creating <strong>HTTPS</strong>.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>The Magic of PKI</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Public Key Infrastructure (PKI) solves the <em>Trust Problem</em>.</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>How do you know you are talking to the real Google.com?</li>
              <li>Google presents a <strong>Digital Certificate</strong>.</li>
              <li>This certificate is digitally signed by a <strong>Certificate Authority (CA)</strong> (like Let&apos;s Encrypt or DigiCert).</li>
              <li>Your browser has the CA&apos;s public keys pre-installed, so it can mathematically verify the signature!</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>The Hybrid Cryptography approach</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">TLS uses the best of both worlds:</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Asymmetric (RSA/ECC):</strong> Used only at the very beginning (The Handshake) to securely exchange a secret key, because it is slow but solves the distribution problem.</li>
              <li><strong>Symmetric (AES):</strong> Used for the rest of the session to encrypt the actual web traffic, because it is extremely fast.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="text-xl font-bold mb-4">TLS 1.2 vs TLS 1.3</h3>
        <p className="mb-4">
          TLS 1.3 is the modern standard. It removes old, vulnerable cryptographic algorithms (like MD5 or SHA-1) and reduces the handshake from 2 round-trips to <strong>1 round-trip</strong>, making secure connections significantly faster.
        </p>
      </section>
      
      <Callout variant="info">
        <strong>Perfect Forward Secrecy (PFS):</strong> Modern TLS uses Diffie-Hellman (ECDHE) for key exchange instead of just RSA. With PFS, a unique session key is generated for every single connection. If a hacker steals the server&apos;s Private Key in the future, they STILL cannot decrypt past recorded traffic!
      </Callout>
    </div>
  )
}
