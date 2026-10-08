import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramHandshake = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs">
        <span>Client</span>
        <span>Server</span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">C</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">S</div>
        
        {activeSubStep === 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-signal overflow-hidden">
             <div className="w-4 h-4 bg-signal absolute -top-1.5 left-0 animate-[slide_2s_ease-in-out_infinite]" />
             <div className="text-[10px] text-center mt-2">Client Hello</div>
          </div>
        )}
        {activeSubStep === 1 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-rule overflow-hidden">
             <div className="w-4 h-4 bg-ok absolute -top-1.5 right-0 animate-[slide-reverse_2s_ease-in-out_infinite]" />
             <div className="text-[10px] text-center mt-2">Server Hello + Certificate</div>
          </div>
        )}
        {activeSubStep === 2 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-signal overflow-hidden">
             <div className="w-4 h-4 bg-signal absolute -top-1.5 left-0 animate-[slide_2s_ease-in-out_infinite]" />
             <div className="text-[10px] text-center mt-2">Finished (Secure)</div>
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft h-16">
        {activeSubStep === 0 && "Client sends supported ciphers and a random number."}
        {activeSubStep === 1 && "Server chooses cipher, sends certificate, and server random."}
        {activeSubStep === 2 && "Both calculate symmetric key. Secure channel established."}
      </div>
    </div>
  )
}

const DiagramPKI = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-card border-2 border-ok flex items-center justify-center rounded-full text-xs font-bold">CA</div>
        <div className="text-[10px] text-ink-soft">Certificate Authority</div>
      </div>
      <div className="flex justify-between w-full items-center">
        {activeSubStep > 0 && <div className="text-2xl text-signal">↙</div>}
        {activeSubStep > 1 && <div className="text-2xl text-ok">↘</div>}
      </div>
      <div className="flex justify-between w-full">
        <div className="w-16 h-16 bg-card border border-ink flex flex-col items-center justify-center text-xs">
          <span>Server</span>
          {activeSubStep > 0 && <span className="text-[10px] text-signal mt-1">Signed Cert</span>}
        </div>
        <div className="w-16 h-16 bg-card border border-ink flex flex-col items-center justify-center text-xs">
          <span>Client</span>
          {activeSubStep > 1 && <span className="text-[10px] text-ok mt-1">Verifies</span>}
        </div>
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft h-16">
        {activeSubStep === 0 && "CA is trusted by both."}
        {activeSubStep === 1 && "CA signs the Server's certificate."}
        {activeSubStep === 2 && "Client uses CA's public key to verify Server's certificate."}
      </div>
    </div>
  )
}

export const tlsLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "handshake": DiagramHandshake,
  "pki": DiagramPKI,
}

// --- Steps ---

export const tlsLessonSteps: LessonStepType[] = [
  {
    id: "pki",
    title: "PKI: The Trust Anchor",
    analogy: "Think of a Certificate Authority (CA) like a passport agency. Anyone can print a card saying 'I am Google', but your browser only trusts cards stamped by a recognized passport agency.",
    diagram: "pki",
    subSteps: [
      { caption: "We have a Certificate Authority (CA).", highlight: [] },
      { caption: "Server gets its Certificate signed by the CA.", highlight: [] },
      { caption: "Client verifies the signature using the CA's pre-installed public key.", highlight: [] },
    ],
    examAnswer: "Public Key Infrastructure (PKI) manages digital certificates and public-key encryption.",
    watchOut: "If a CA is compromised, attackers can issue fake certificates that browsers will trust.",
    realWorld: "Let's Encrypt provides free TLS certificates to millions of websites.",
    glossary: ["CA", "Digital Certificate", "Trust Store"],
    presenterScript: "PKI solves the problem of authentication. Without it, you wouldn't know if you're securely talking to your bank or securely talking to a hacker.",
    checkpoint: {
      q: "What role does the Certificate Authority (CA) play in TLS?",
      options: ["It encrypts the session data.", "It signs the server's digital certificate.", "It stores the symmetric session keys.", "It hosts the website."],
      answerIndex: 1,
      why: "The CA acts as a trusted third party, signing certificates to prove the server's identity."
    }
  },
  {
    id: "handshake",
    title: "The TLS Handshake",
    analogy: "Like two spies meeting. Spy 1: 'I speak French and Spanish, my code is 123'. Spy 2: 'Let's speak French, here is my ID badge, my code is 456'. Then they use those codes to generate a shared secret language.",
    diagram: "handshake",
    subSteps: [
      { caption: "Client Hello: Client sends supported ciphers and a random number.", highlight: [] },
      { caption: "Server Hello: Server chooses cipher, sends certificate, and its own random number.", highlight: [] },
      { caption: "Key Generation: Both sides calculate the same symmetric session key. Secure channel established.", highlight: [] },
    ],
    examAnswer: "The process where a client and server verify identity and establish a symmetric session key.",
    watchOut: "The initial handshake uses asymmetric encryption (slow). The actual data transfer uses symmetric encryption (fast).",
    glossary: ["Client Hello", "Server Hello", "Session Key", "PFS"],
    presenterScript: "The handshake is where the magic happens. We use slow asymmetric math just long enough to safely agree on a fast symmetric key.",
    checkpoint: {
      q: "Why does TLS switch to symmetric encryption after the handshake?",
      options: ["Symmetric encryption is more secure.", "Symmetric encryption is much faster for bulk data.", "Asymmetric encryption cannot encrypt files.", "Symmetric encryption doesn't require keys."],
      answerIndex: 1,
      why: "Asymmetric encryption is computationally expensive. We use it only to distribute the symmetric key, then switch to symmetric for performance."
    }
  }
]

export default function TLSLearn() {
  return <GuidedLesson steps={tlsLessonSteps} diagrams={tlsLessonDiagrams} />
}
