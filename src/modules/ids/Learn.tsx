import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramIntro = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs">
        <span className="flex flex-col items-center text-ink-soft">
          Internet
        </span>
        <span className="flex flex-col items-center text-ink-soft">
          Internal Network
        </span>
      </div>
      <div className="flex justify-between w-full relative h-16 items-center">
        {/* Router / Internet */}
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">🌐</div>
        
        {/* IDS */}
        <div className="relative">
          <div className="w-16 h-16 bg-paper border border-ink flex flex-col items-center justify-center relative z-10">
            <span className="font-bold text-ink">IDS</span>
          </div>
          {activeSubStep > 0 && (
            <div className="absolute -top-6 -right-6 text-2xl animate-bounce">
              🚨
            </div>
          )}
        </div>

        {/* Internal Network */}
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">💻</div>
        
        {/* Animated flow */}
        <div className="absolute top-1/2 left-12 right-12 h-px bg-rule -z-0">
          <div className={`w-3 h-3 absolute left-0 -top-1.5 ${activeSubStep === 2 ? 'bg-bad' : 'bg-signal'} animate-[slide_2s_ease-in-out_infinite]`} />
        </div>
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft px-4">
        {activeSubStep === 0 && "Normal traffic flows through the network."}
        {activeSubStep === 1 && "The IDS passively monitors a copy of the traffic."}
        {activeSubStep === 2 && "When it spots an attack, it triggers an alert, but does NOT stop the traffic."}
      </div>
    </div>
  )
}

const DiagramSignature = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="w-full flex justify-around mb-2">
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs mb-2">Database</span>
          <div className="bg-card border border-ink p-2 text-[10px] font-mono text-left">
            <div>SIG01: &apos;DROP TABLE&apos;</div>
            <div>SIG02: &apos;/etc/passwd&apos;</div>
            <div>SIG03: &apos;UNION SELECT&apos;</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs mb-2">Incoming Packet</span>
          <div className={`bg-paper border ${activeSubStep === 1 ? 'border-bad bg-bad/10' : 'border-ink'} p-2 text-[10px] font-mono text-left w-32`}>
            {activeSubStep === 0 && "GET /home HTTP/1.1\nHost: example.com"}
            {activeSubStep === 1 && "GET /etc/passwd\nHost: example.com"}
            {activeSubStep === 2 && "GET /zero-day-exploit\nHost: example.com"}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm font-sans text-ink-soft h-12">
        {activeSubStep === 0 && "Safe packet. No match in database. Passed."}
        {activeSubStep === 1 && "Matches SIG02! Immediate alert generated. Zero false positives."}
        {activeSubStep === 2 && "Brand new attack (Zero-day). Not in database. Slips right past!"}
      </div>
    </div>
  )
}

const DiagramAnomaly = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="w-full h-32 bg-card border border-ink relative overflow-hidden flex items-end">
        {/* Baseline curve */}
        <svg viewBox="0 0 100 100" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
          <path d="M0,80 Q25,80 50,40 T100,80 L100,100 L0,100 Z" fill="rgba(var(--color-signal-rgb), 0.1)" stroke="var(--color-signal)" strokeWidth="1" />
        </svg>
        
        {/* Current traffic dot */}
        {activeSubStep === 0 && <div className="absolute w-3 h-3 bg-ok rounded-full left-[25%] top-[75%] shadow-[0_0_8px_var(--color-ok)]"></div>}
        {activeSubStep === 1 && <div className="absolute w-3 h-3 bg-bad rounded-full left-[50%] top-[10%] shadow-[0_0_8px_var(--color-bad)] animate-pulse"></div>}
        {activeSubStep === 2 && <div className="absolute w-3 h-3 bg-bad rounded-full left-[75%] top-[20%] shadow-[0_0_8px_var(--color-bad)] animate-pulse"></div>}
      </div>
      
      <div className="mt-4 text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Traffic matches learned baseline (normal hours)."}
        {activeSubStep === 1 && "Zero-Day Attack! Huge traffic spike at 3 AM. Alert generated!"}
        {activeSubStep === 2 && "False Positive: The CEO just logged in while traveling. Alert generated anyway!"}
      </div>
    </div>
  )
}

export const idsLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "intro": DiagramIntro,
  "signature": DiagramSignature,
  "anomaly": DiagramAnomaly,
}

// --- Steps ---

export const idsLessonSteps: LessonStepType[] = [
  {
    id: "intro",
    title: "IDS vs IPS: The Guard Dog vs The Bouncer",
    analogy: "An IDS (Intrusion Detection System) is like a guard dog. It watches everyone coming in. If it sees someone suspicious, it barks (alerts), but it can't physically stop them. An IPS (Intrusion Prevention System) is like a bouncer. It stands in the doorway and physically blocks suspicious people from entering.",
    diagram: "intro",
    subSteps: [
      { caption: "Normal traffic flows through the network without issues.", highlight: [] },
      { caption: "The IDS receives a copy of the traffic and analyzes it passively.", highlight: [] },
      { caption: "When it spots an attack, it triggers an alert, but the malicious packet still reaches the target.", highlight: [] },
    ],
    examAnswer: "An IDS is an out-of-band detection mechanism that alerts on malicious activity. An IPS is an in-band (inline) prevention mechanism that actively blocks malicious traffic.",
    watchOut: "Because an IDS doesn't block traffic, it cannot stop a fast-acting automated attack on its own. It relies on a human or another system (like a firewall) to take action.",
    realWorld: "Most companies use an IDS connected to a SPAN/Mirror port on their main switch to monitor all internal traffic without slowing the network down.",
    glossary: ["Out-of-band", "Inline", "SPAN Port"],
    presenterScript: "The most important distinction here is active versus passive. IDS detects, IPS prevents. Why not just use IPS everywhere? Because if an IPS makes a mistake, it blocks legitimate business traffic.",
    checkpoint: {
      q: "If an IDS successfully detects a SQL injection attack against your database server, what happens to the malicious packet?",
      options: ["It is dropped immediately.", "It is quarantined for review.", "It continues to the database server.", "It is sent back to the attacker."],
      answerIndex: 2,
      why: "An IDS only detects and alerts. It does not drop or block packets. The packet will reach the database."
    }
  },
  {
    id: "signature",
    title: "Signature-Based Detection: The Wanted Poster",
    analogy: "Signature-based detection is like giving the bouncer a book of 'Wanted' posters. The bouncer compares every person walking in to the posters. If there's an exact match, they trigger an alert. If there's no poster, they let them in.",
    diagram: "signature",
    subSteps: [
      { caption: "The IDS receives a normal web request. No signatures match.", highlight: [] },
      { caption: "The IDS receives a packet with '/etc/passwd'. This matches a known attack signature. Alert!", highlight: [] },
      { caption: "A brand new, unseen exploit is sent. Since there's no signature for it yet, it bypasses the IDS completely.", highlight: [] },
    ],
    examAnswer: "A detection method that relies on a database of known threat patterns (signatures).",
    watchOut: "Signature-based systems are blind to Zero-Day attacks (new vulnerabilities that don't have signatures yet).",
    glossary: ["Signature", "Zero-Day Exploit"],
    presenterScript: "Signature detection is incredibly fast and highly accurate for known threats. It has almost zero false positives. If it flags something as a SQL injection, it almost certainly is. But it completely fails against new attacks.",
    checkpoint: {
      q: "What is the primary weakness of signature-based detection?",
      options: ["It is very slow to process traffic.", "It generates a high number of false positives.", "It cannot detect new, unknown attacks.", "It requires an inline deployment."],
      answerIndex: 2,
      why: "It relies on a database of known patterns. If the attack is new (Zero-Day) and not in the database, it will not be detected."
    }
  },
  {
    id: "anomaly",
    title: "Anomaly-Based Detection: The Baseline",
    analogy: "Anomaly-based detection is like a bouncer who learns the 'vibe' of the club over a few weeks. If a guy walks in wearing a ski mask in July, the bouncer knows that's weird and flags him, even without a 'Wanted' poster.",
    diagram: "anomaly",
    subSteps: [
      { caption: "The IDS builds a statistical baseline of 'normal' network behavior over time.", highlight: [] },
      { caption: "A Zero-Day attack causes a massive spike in outbound traffic to an unknown IP. The IDS flags this anomaly!", highlight: [] },
      { caption: "An employee logs in at 3 AM to finish a presentation. This deviates from the baseline, triggering a False Positive alert.", highlight: [] },
    ],
    examAnswer: "A detection method that establishes a baseline of normal network behavior and alerts on significant deviations, capable of detecting unknown attacks.",
    realWorld: "Machine Learning (ML) is heavily used in anomaly detection today, analyzing thousands of features to figure out what is 'normal' for each specific user and device.",
    glossary: ["Baseline", "False Positive", "Alert Fatigue"],
    presenterScript: "Anomaly detection is the Holy Grail because it catches zero-days. But the cost is False Positives. If a user does something slightly unusual but legitimate, it fires an alert. Too many of these, and your security analysts get Alert Fatigue and stop paying attention.",
    checkpoint: {
      q: "Why are network administrators hesitant to run Anomaly-Based systems in IPS (Prevention) mode?",
      options: ["It cannot detect zero-day attacks.", "It is too fast and drops too many packets.", "High false positives could result in blocking legitimate users.", "It requires a database of known signatures."],
      answerIndex: 2,
      why: "Anomaly-based systems have high false positive rates. In prevention mode, a false positive means blocking a legitimate customer or employee from doing their job."
    }
  }
]

export default function IdsLearn() {
  return <GuidedLesson steps={idsLessonSteps} diagrams={idsLessonDiagrams} />
}
