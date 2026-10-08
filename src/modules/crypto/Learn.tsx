import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"
import { Button } from "@/components/ui/Button"

// --- Diagrams ---

const DiagramHashing = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="text-4xl font-mono bg-card border border-ink p-4 w-full">
        {activeSubStep === 0 && "Hello"}
        {activeSubStep === 1 && "Hello!"}
        {activeSubStep === 2 && "Password123"}
      </div>
      <div className="text-signal text-2xl">↓</div>
      <div className="font-mono text-sm uppercase text-ink-soft bg-paper border border-rule px-3 py-1">SHA-256</div>
      <div className="text-signal text-2xl">↓</div>
      <div className="font-mono text-[10px] break-all max-w-[200px] bg-ink text-paper p-4 text-left">
        {activeSubStep === 0 && "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969"}
        {activeSubStep === 1 && "ce06092fb10d297531777d85311907fcb9a380a068e3678eb13e00b65a5cb356"}
        {activeSubStep === 2 && "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"}
      </div>
    </div>
  )
}

const DiagramSymmetric = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs">
        <span>Alice</span>
        <span>Bob</span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">A</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">B</div>
        
        {/* Animated flow */}
        {activeSubStep > 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-signal overflow-hidden">
             <div className="w-4 h-4 bg-signal absolute -top-1.5 left-0 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Both need the exact same key."}
        {activeSubStep === 1 && "Alice encrypts with Shared Key."}
        {activeSubStep === 2 && "Bob decrypts with Shared Key."}
      </div>
    </div>
  )
}

const DiagramAsymmetric = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs mb-4">
        <span className="flex flex-col items-center">
          Alice
          <span className="text-[10px] text-signal mt-1">Has Bob&apos;s Pub</span>
        </span>
        <span className="flex flex-col items-center">
          Bob
          <span className="text-[10px] text-ok mt-1">Priv + Pub</span>
        </span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">A</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">B</div>
        
        {activeSubStep > 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-rule">
            <div className={`w-3 h-3 ${activeSubStep === 1 ? 'bg-ok absolute right-0 -top-1 animate-[slide-reverse_2s_ease-in-out_infinite]' : 'bg-signal absolute left-0 -top-1 animate-[slide_2s_ease-in-out_infinite]'}`} />
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft px-4">
        {activeSubStep === 0 && "Bob generates a Key Pair (Public & Private)."}
        {activeSubStep === 1 && "Bob shares his Public Key with the world."}
        {activeSubStep === 2 && "Alice encrypts using Bob's Public Key. Only Bob's Private Key can decrypt it."}
      </div>
    </div>
  )
}

export const cryptoLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "hashing": DiagramHashing,
  "symmetric": DiagramSymmetric,
  "asymmetric": DiagramAsymmetric,
}

// --- Steps ---

export const cryptoLessonSteps: LessonStepType[] = [
  {
    id: "hashing",
    title: "Hashing: The One-Way Blender",
    analogy: "Think of a hash function like a blender. You can put a perfectly good apple in, and you get apple juice out. But you can never take apple juice and turn it back into an apple. It only goes one way.",
    diagram: "hashing",
    subSteps: [
      { caption: "We hash the word 'Hello'. It produces a 64-character hex string.", highlight: [] },
      { caption: "We change just one character (add '!'). The entire output changes completely. This is the Avalanche Effect.", highlight: [] },
      { caption: "We hash a password. The database stores the hash, never the plaintext password.", highlight: [] },
    ],
    examAnswer: "A one-way mathematical function that converts data of arbitrary length into a fixed-length output (digest). Used for data integrity.",
    watchOut: "Hashing is NOT encryption. You cannot 'decrypt' a hash. You can only compare a new hash to an old one.",
    realWorld: "When you download a Linux ISO, the site provides a SHA-256 checksum so you can verify the file wasn't tampered with.",
    glossary: ["Avalanche Effect", "Digest"],
    presenterScript: "Hashing is the foundation of integrity. It's a one-way street. If you memorize one thing, memorize that hashing is not encryption because you can't reverse it.",
    checkpoint: {
      q: "If I hash a 2 GB video file with SHA-256, how large is the output?",
      options: ["2 GB", "256 bits", "Variable depending on compression", "1024 bits"],
      answerIndex: 1,
      why: "Hash outputs are ALWAYS a fixed length regardless of input size."
    }
  },
  {
    id: "symmetric",
    title: "Symmetric Encryption: The Padlocked Box",
    analogy: "Imagine a strongbox with a padlock. To lock it, you need a specific physical key. To unlock it, you need that EXACT same physical key. If Alice wants to send a secret to Bob, she locks the box and mails it. But wait—how does she get the key to Bob without someone copying it in the mail?",
    diagram: "symmetric",
    subSteps: [
      { caption: "Alice and Bob must agree on a Shared Secret Key.", highlight: [] },
      { caption: "Alice uses the Shared Key to encrypt the plaintext into ciphertext.", highlight: [] },
      { caption: "Bob uses the exact same Shared Key to decrypt the ciphertext.", highlight: [] },
    ],
    examAnswer: "An encryption method where the same cryptographic key is used for both encryption of plaintext and decryption of ciphertext.",
    watchOut: "The algorithm (like AES) is public. The security relies entirely on keeping the key secret. If the key leaks, the encryption is broken.",
    glossary: ["Plaintext", "Ciphertext", "Key Distribution Problem"],
    presenterScript: "Symmetric encryption is incredibly fast, like AES. The big flaw? The Key Distribution Problem. How do I give you the secret key if the network is already compromised?",
    checkpoint: {
      q: "What is the primary drawback of symmetric encryption?",
      options: ["It is too slow for large files", "It cannot provide confidentiality", "Securely distributing the key is difficult", "It requires two keys per user"],
      answerIndex: 2,
      why: "Key distribution is the main issue. You need a secure channel to share the key before you can establish a secure channel."
    }
  },
  {
    id: "asymmetric",
    title: "Asymmetric Encryption: The Mailbox",
    analogy: "Bob buys a mailbox with a slot (Public Key). He leaves it on the street. Anyone can walk up and drop a letter in the slot—meaning anyone can encrypt a message to Bob. But only Bob has the physical key (Private Key) to open the back of the mailbox and read the letters.",
    diagram: "asymmetric",
    subSteps: [
      { caption: "Bob generates a Key Pair. The Private Key is kept secret. The Public Key is shared everywhere.", highlight: [] },
      { caption: "Alice gets Bob's Public Key.", highlight: [] },
      { caption: "Alice encrypts a message with Bob's Public Key. Only Bob's Private Key can decrypt it.", highlight: [] },
    ],
    examAnswer: "A cryptographic system that uses pairs of keys: public keys which may be disseminated widely, and private keys which are known only to the owner.",
    realWorld: "This is how TLS (HTTPS) works. Your browser gets the server's public key, and uses it to securely send a symmetric session key.",
    glossary: ["Key Pair", "Public Key", "Private Key", "RSA"],
    presenterScript: "Asymmetric solves the key distribution problem. We don't share secrets, we share public locks. It's brilliant, but it's computationally very slow.",
    checkpoint: {
      q: "If Alice wants to send a confidential message to Bob using asymmetric encryption, which key should she use to encrypt the message?",
      options: ["Alice's Public Key", "Alice's Private Key", "Bob's Public Key", "Bob's Private Key"],
      answerIndex: 2,
      why: "She uses Bob's Public Key. That way, only Bob (who holds Bob's Private Key) can decrypt it."
    }
  }
]

export default function CryptoLearn() {
  return <GuidedLesson steps={cryptoLessonSteps} diagrams={cryptoLessonDiagrams} />
}
