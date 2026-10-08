import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramStateless = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs mb-2">
        <span>Internet</span>
        <span className="font-bold border px-2 border-rule">Firewall</span>
        <span>Internal Network</span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">Web</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">FW</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">PC</div>
        
        {activeSubStep === 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-signal overflow-hidden">
             <div className="w-4 h-4 bg-signal absolute -top-1.5 right-0 animate-[slide-reverse_2s_ease-in-out_infinite]" />
          </div>
        )}
        {activeSubStep === 1 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-bad overflow-hidden">
             <div className="w-4 h-4 bg-bad absolute -top-1.5 left-0 animate-[slide_2s_ease-in-out_infinite]" />
             <div className="absolute left-1/2 -ml-2 -mt-4 text-xs font-bold text-bad">X</div>
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft h-16">
        {activeSubStep === 0 && "PC sends request to Web Server (Allowed outbound)."}
        {activeSubStep === 1 && "Web Server replies. Firewall blocks it! (Stateless has no memory of the request)."}
      </div>
    </div>
  )
}

const DiagramStateful = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs mb-2">
        <span>Internet</span>
        <span className="font-bold border px-2 border-rule relative">
          Firewall
          {activeSubStep > 0 && (
            <div className="absolute -top-6 left-0 text-[8px] bg-paper border border-ok text-ok p-1">State: ESTABLISHED</div>
          )}
        </span>
        <span>Internal Network</span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">Web</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">FW</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center text-xs">PC</div>
        
        {activeSubStep === 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-signal overflow-hidden">
             <div className="w-4 h-4 bg-signal absolute -top-1.5 right-0 animate-[slide-reverse_2s_ease-in-out_infinite]" />
          </div>
        )}
        {activeSubStep === 1 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-ok overflow-hidden">
             <div className="w-4 h-4 bg-ok absolute -top-1.5 left-0 animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft h-16">
        {activeSubStep === 0 && "PC sends request. Firewall records 'ESTABLISHED' state."}
        {activeSubStep === 1 && "Web Server replies. Firewall sees state and allows return traffic."}
      </div>
    </div>
  )
}

export const firewallLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "stateless": DiagramStateless,
  "stateful": DiagramStateful,
}

// --- Steps ---

export const firewallLessonSteps: LessonStepType[] = [
  {
    id: "stateless",
    title: "Stateless Firewalls: The Bouncer with Amnesia",
    analogy: "A stateless firewall is like a bouncer checking IDs who immediately forgets you after you walk in. If you step out and come right back, they check your ID all over again.",
    diagram: "stateless",
    subSteps: [
      { caption: "PC initiates outbound traffic.", highlight: [] },
      { caption: "When the return traffic comes back, the stateless firewall blocks it because it has no memory of the request.", highlight: [] },
    ],
    examAnswer: "A firewall that evaluates each packet in isolation, without memory of previous packets or established connections.",
    watchOut: "Stateless firewalls are fast but require complex rules to handle return traffic.",
    glossary: ["Stateless", "ACL", "Packet Filtering"],
    presenterScript: "Stateless firewalls only look at headers. They don't know the context of the conversation.",
    checkpoint: {
      q: "Why is return traffic often a problem for stateless firewalls?",
      options: ["Return traffic uses different protocols.", "They don't remember the initial outbound request.", "Return traffic is encrypted.", "They can't read source IP addresses."],
      answerIndex: 1,
      why: "They evaluate every packet independently. They don't know a return packet belongs to a valid outbound request."
    }
  },
  {
    id: "stateful",
    title: "Stateful Firewalls: The Smart Concierge",
    analogy: "A stateful firewall is like a concierge. If you ask for a pizza delivery, they write it down (State Table). When the pizza guy arrives, the concierge sees your note and lets him up.",
    diagram: "stateful",
    subSteps: [
      { caption: "PC sends request. Firewall records connection state in its State Table.", highlight: [] },
      { caption: "Return traffic is dynamically allowed based on the State Table.", highlight: [] },
    ],
    examAnswer: "A firewall that maintains a state table of active connections to make intelligent filtering decisions.",
    realWorld: "Almost all modern consumer routers and enterprise firewalls (like Palo Alto or Cisco ASA) are stateful.",
    glossary: ["Stateful", "State Table", "ESTABLISHED"],
    presenterScript: "Stateful inspection is the modern standard. It dramatically simplifies rule creation and increases security.",
    checkpoint: {
      q: "What mechanism allows a stateful firewall to track connections?",
      options: ["Deep Packet Inspection", "A State Table", "Routing Protocols", "MAC Address Filtering"],
      answerIndex: 1,
      why: "The State Table keeps track of active connections, like IP addresses and ports."
    }
  }
]

export default function FirewallLearn() {
  return <GuidedLesson steps={firewallLessonSteps} diagrams={firewallLessonDiagrams} />
}
