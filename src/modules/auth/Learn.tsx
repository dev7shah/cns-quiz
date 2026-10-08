import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramAuthNAuthZ = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs mb-4">
        <span className="flex flex-col items-center">
          User
        </span>
        <span className="flex flex-col items-center">
          Bouncer (AuthN)
        </span>
        <span className="flex flex-col items-center">
          Bartender (AuthZ)
        </span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">U</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">N</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">Z</div>
        
        {activeSubStep === 0 && (
          <div className="absolute top-1/2 left-12 right-1/2 h-px bg-signal">
            <div className="w-3 h-3 bg-signal absolute left-0 -top-1 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
        {activeSubStep === 1 && (
          <div className="absolute top-1/2 left-12 right-1/2 h-px bg-ok">
            <div className="text-[10px] text-ok absolute left-1/2 -top-4 -translate-x-1/2">Wristband Issued</div>
          </div>
        )}
        {activeSubStep === 2 && (
          <div className="absolute top-1/2 left-1/2 right-12 h-px bg-signal">
            <div className="w-3 h-3 bg-signal absolute left-0 -top-1 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft px-4">
        {activeSubStep === 0 && "User presents ID to Bouncer (Who are you?)."}
        {activeSubStep === 1 && "Identity verified. Bouncer issues a wristband (Token)."}
        {activeSubStep === 2 && "User shows wristband to Bartender (What can you do?)."}
      </div>
    </div>
  )
}

const DiagramPasswords = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex gap-4">
        <div className="font-mono bg-card border border-ink p-2 w-32">
          {activeSubStep === 0 ? "hunter2" : "hunter2"}
        </div>
        {activeSubStep > 0 && (
          <div className="font-mono bg-paper border border-ok text-ok p-2 w-32">
            + &quot;8aF2x&quot; (Salt)
          </div>
        )}
      </div>
      <div className="text-signal text-2xl">↓</div>
      <div className="font-mono text-sm uppercase text-ink-soft bg-paper border border-rule px-3 py-1">
        {activeSubStep === 2 ? "bcrypt (Cost=12)" : "SHA-256"}
      </div>
      <div className="text-signal text-2xl">↓</div>
      <div className="font-mono text-[10px] break-all max-w-[250px] bg-ink text-paper p-4 text-left">
        {activeSubStep === 0 && "f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7"}
        {activeSubStep === 1 && "7e49221199a093a8c17b8f047ff6909405d15c7e10df2bc9389f417f77f3e1b0"}
        {activeSubStep === 2 && "$2b$12$R.P1e9nU.0pIe1W/K5X6q.w2Ff8pY4qLq..."}
      </div>
      <div className="text-xs text-ink-soft mt-2">
        {activeSubStep === 0 && "Basic Hash: Vulnerable to Rainbow Tables."}
        {activeSubStep === 1 && "Salted Hash: Fixes Rainbow Tables, but still fast to brute-force."}
        {activeSubStep === 2 && "Key Derivation Function: Salted AND deliberately slow."}
      </div>
    </div>
  )
}

const DiagramMFA = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className={`p-4 border text-center ${activeSubStep >= 0 ? 'bg-card border-ink text-ink' : 'bg-paper border-rule text-ink-soft'} transition-all`}>
          <div className="font-bold mb-2">Knowledge</div>
          <div className="text-xs">Password / PIN</div>
        </div>
        <div className={`p-4 border text-center ${activeSubStep >= 1 ? 'bg-card border-ink text-ink' : 'bg-paper border-rule text-ink-soft'} transition-all`}>
          <div className="font-bold mb-2">Possession</div>
          <div className="text-xs">Phone (TOTP) / Token</div>
        </div>
        <div className={`p-4 border text-center ${activeSubStep >= 2 ? 'bg-card border-ink text-ink' : 'bg-paper border-rule text-ink-soft'} transition-all`}>
          <div className="font-bold mb-2">Inherence</div>
          <div className="text-xs">Fingerprint / Face</div>
        </div>
      </div>
      <div className="mt-4 text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Factor 1: Something you know."}
        {activeSubStep === 1 && "Factor 2: Something you have. (Stronger than just passwords)"}
        {activeSubStep === 2 && "Factor 3: Something you are. (Biometrics)"}
      </div>
    </div>
  )
}

export const authLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "authn-authz": DiagramAuthNAuthZ,
  "passwords": DiagramPasswords,
  "mfa": DiagramMFA,
}

// --- Steps ---

export const authLessonSteps: LessonStepType[] = [
  {
    id: "authn-authz",
    title: "AuthN vs AuthZ: The Bouncer and The Bartender",
    analogy: "Authentication (AuthN) is the bouncer at the club checking your ID to see WHO you are. Authorization (AuthZ) is the bartender checking your wristband to see WHAT you're allowed to do (e.g. VIP area).",
    diagram: "authn-authz",
    subSteps: [
      { caption: "Authentication verifies identity.", highlight: [] },
      { caption: "Upon successful AuthN, the system issues a token (like a wristband or session cookie).", highlight: [] },
      { caption: "Authorization verifies permissions using that token.", highlight: [] },
    ],
    examAnswer: "Authentication verifies identity. Authorization determines access rights and permissions.",
    watchOut: "Don't confuse the two! A 401 Unauthorized HTTP status actually means 'Unauthenticated'. A 403 Forbidden means 'Unauthorized'.",
    realWorld: "Logging into AWS Console is AuthN. IAM Policies deciding if you can delete an S3 bucket is AuthZ.",
    glossary: ["Authentication", "Authorization", "Session Token"],
    presenterScript: "It's a classic mix-up. Just remember the club analogy. AuthN gets you in the door. AuthZ lets you into the VIP section.",
    checkpoint: {
      q: "Which of the following is an example of Authorization?",
      options: ["Entering a password", "Scanning a fingerprint", "Checking if a user has 'admin' role", "Providing a TOTP code"],
      answerIndex: 2,
      why: "Roles determine what a user is allowed to do, which is Authorization."
    }
  },
  {
    id: "passwords",
    title: "Password Storage: Salting the Hash",
    analogy: "If you just hash a password, an attacker can use a pre-calculated dictionary (Rainbow Table). Adding a Salt is like adding a random, secret ingredient to a recipe before baking. Even if two people have the 'password123' recipe, their final baked goods (hashes) look completely different.",
    diagram: "passwords",
    subSteps: [
      { caption: "Basic Hashing is vulnerable because the same password always produces the same hash.", highlight: [] },
      { caption: "Salting adds a random string to the password before hashing, defeating Rainbow Tables.", highlight: [] },
      { caption: "Key Derivation Functions (like bcrypt) add a Work Factor, making them intentionally slow to prevent brute-force attacks.", highlight: [] },
    ],
    examAnswer: "Salting appends unique random data to a password before hashing to defend against rainbow table attacks.",
    watchOut: "Salts do NOT need to be secret! They are stored in plaintext right next to the hash. Their only job is to be unique.",
    glossary: ["Salt", "Rainbow Table", "Key Derivation Function (KDF)", "bcrypt"],
    presenterScript: "Salts are random, not secret. They just make sure every hash is unique. And we use bcrypt or Argon2 to make hashing slow, so attackers can't guess billions of passwords a second.",
    checkpoint: {
      q: "What is the primary purpose of a cryptographic salt?",
      options: ["To encrypt the password", "To prevent rainbow table attacks", "To make the hash shorter", "To hide the password length"],
      answerIndex: 1,
      why: "A salt ensures identical passwords have different hashes, rendering precomputed rainbow tables useless."
    }
  },
  {
    id: "mfa",
    title: "MFA: Layers of Defense",
    analogy: "MFA is like a bank vault that requires a combination code (something you know), a physical key (something you have), and a retinal scan (something you are). Stealing just one won't get you in.",
    diagram: "mfa",
    subSteps: [
      { caption: "Knowledge Factor: Password, PIN, Security Question.", highlight: [] },
      { caption: "Possession Factor: Smartphone, Security Key (YubiKey), Smartcard.", highlight: [] },
      { caption: "Inherence Factor: Fingerprint, Face ID, Voice recognition.", highlight: [] },
    ],
    examAnswer: "Multi-Factor Authentication requires two or more independent factors (Knowledge, Possession, Inherence) to grant access.",
    realWorld: "TOTP (Time-based One-Time Password) is a common possession factor where an app (like Google Authenticator) generates a new 6-digit code every 30 seconds based on a shared secret and the current time.",
    watchOut: "SMS is a weak possession factor due to SIM swapping attacks. Hardware tokens (FIDO2/WebAuthn) are much stronger.",
    glossary: ["MFA", "TOTP", "Inherence", "Knowledge", "Possession"],
    presenterScript: "MFA stops 99% of automated attacks. The exam loves asking you to categorize factors: Knowledge, Possession, and Inherence.",
    checkpoint: {
      q: "Which factor category does a fingerprint scan fall into?",
      options: ["Something you know (Knowledge)", "Something you have (Possession)", "Something you are (Inherence)", "Something you do (Action)"],
      answerIndex: 2,
      why: "Biometrics are inherent physical characteristics (something you are)."
    }
  }
]

export default function AuthLearn() {
  return <GuidedLesson steps={authLessonSteps} diagrams={authLessonDiagrams} />
}
