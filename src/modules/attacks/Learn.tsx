import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramSQLi = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="bg-card border border-ink p-4 font-mono text-xs w-full max-w-md break-words">
        <span className="text-ink-soft">SELECT * FROM users WHERE name = &apos;</span>
        {activeSubStep === 0 && <span className="text-ok">Alice</span>}
        {activeSubStep > 0 && <span className="text-signal">&apos; OR &apos;1&apos;=&apos;1</span>}
        <span className="text-ink-soft">&apos;</span>
      </div>
      <div className="text-signal text-2xl">↓</div>
      <div className={`p-4 border ${activeSubStep > 0 ? 'bg-signal border-signal text-paper' : 'bg-paper border-ink'} w-full max-w-md text-center font-mono text-sm`}>
        {activeSubStep === 0 && "Returns 1 row (Alice)"}
        {activeSubStep === 1 && "Returns ALL rows (Bypass!)"}
        {activeSubStep === 2 && "Prepared Statements fix this!"}
      </div>
      <div className="mt-4 text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Normal usage: Input is treated as data."}
        {activeSubStep === 1 && "Attack: Input breaks out of quotes and changes the query logic."}
        {activeSubStep === 2 && "Defense: Parameterized queries separate code from data."}
      </div>
    </div>
  )
}

const DiagramXSS = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="flex justify-between w-full items-center">
        <div className="w-16 h-16 bg-card border border-signal flex flex-col items-center justify-center text-xs">
          <span className="text-signal font-bold">Attacker</span>
        </div>
        <div className="w-24 h-24 bg-paper border-2 border-ink flex flex-col items-center justify-center text-xs relative">
          Server
          {activeSubStep > 0 && (
            <div className="absolute bottom-2 bg-signal text-paper px-1 py-0.5 text-[8px] animate-pulse">
              &lt;script&gt;
            </div>
          )}
        </div>
        <div className="w-16 h-16 bg-card border border-ok flex flex-col items-center justify-center text-xs">
          <span className="text-ok font-bold">Victim</span>
        </div>
      </div>
      
      <div className="h-px bg-rule w-full relative">
        {activeSubStep === 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-signal">
             <div className="w-2 h-2 bg-signal absolute right-0 -top-[3px] animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
        {activeSubStep === 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-signal">
             <div className="w-2 h-2 bg-signal absolute right-0 -top-[3px] animate-[slide_2s_ease-in-out_infinite]" />
          </div>
        )}
        {activeSubStep === 2 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-ok">
             <div className="text-[10px] text-ok bg-paper px-2 absolute left-1/2 -translate-x-1/2 -top-2">Sanitized</div>
          </div>
        )}
      </div>

      <div className="text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Attacker saves malicious script to server (e.g., in a comment)."}
        {activeSubStep === 1 && "Victim views comment. Browser executes the script (Steals cookie)."}
        {activeSubStep === 2 && "Defense: Escape output! Treat input as text, not HTML."}
      </div>
    </div>
  )
}

const DiagramDDoS = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div className="w-12 h-12 bg-card border border-signal flex items-center justify-center text-xs text-signal font-bold">A</div>
      
      <div className="flex justify-between w-full relative">
        <div className="w-8 h-8 bg-card border border-ink flex items-center justify-center text-xs">B</div>
        <div className="w-8 h-8 bg-card border border-ink flex items-center justify-center text-xs">B</div>
        <div className="w-8 h-8 bg-card border border-ink flex items-center justify-center text-xs">B</div>
        <div className="w-8 h-8 bg-card border border-ink flex items-center justify-center text-xs">B</div>
        
        {activeSubStep > 0 && (
          <>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-signal" />
            <div className="absolute -top-6 left-0 w-full h-px bg-signal" />
            <div className="absolute -top-6 left-4 w-px h-6 bg-signal" />
            <div className="absolute -top-6 right-4 w-px h-6 bg-signal" />
            <div className="absolute -top-6 left-[30%] w-px h-6 bg-signal" />
            <div className="absolute -top-6 right-[30%] w-px h-6 bg-signal" />
          </>
        )}
      </div>
      
      <div className="w-16 h-16 bg-paper border-2 border-ok flex items-center justify-center relative">
        Target
        {activeSubStep > 1 && (
          <div className="absolute inset-0 bg-signal/20 animate-pulse flex items-center justify-center text-signal font-bold rotate-12">
            DOWN
          </div>
        )}
      </div>

      <div className="text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Attacker (A) controls a Botnet (B)."}
        {activeSubStep === 1 && "Attacker commands the Botnet to flood the Target."}
        {activeSubStep === 2 && "Target's resources are exhausted. Service is denied."}
      </div>
    </div>
  )
}

export const attacksLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "sqli": DiagramSQLi,
  "xss": DiagramXSS,
  "ddos": DiagramDDoS,
}

// --- Steps ---

export const attacksLessonSteps: LessonStepType[] = [
  {
    id: "sqli",
    title: "SQL Injection (SQLi): The Jedi Mind Trick",
    analogy: "SQL Injection is like a Jedi mind trick for databases. You ask the database a question, but you sneak in a command. 'Show me user 5... AND give me all the passwords.' The database gets confused and obeys the smuggled command.",
    diagram: "sqli",
    subSteps: [
      { caption: "Normal usage works fine when user input is treated as simple text.", highlight: [] },
      { caption: "Attackers input characters like quotes (') to break out of the string and append SQL commands.", highlight: [] },
      { caption: "The fix is using Parameterized Queries, which separates the SQL logic from the user data entirely.", highlight: [] },
    ],
    examAnswer: "An attack where malicious SQL statements are inserted into entry fields for execution. Prevented by Prepared Statements.",
    watchOut: "Never concatenate strings to build SQL queries. Even if you 'sanitize' the input, you might miss something. Always use Prepared Statements.",
    realWorld: "A classic SQLi payload for bypassing login screens is: admin' OR '1'='1",
    glossary: ["SQLi", "Parameterized Query", "Prepared Statement"],
    presenterScript: "SQL injection is still one of the most common vulnerabilities. The fix is always parameterized queries. Never trust user input to build a query.",
    checkpoint: {
      q: "What is the most effective defense against SQL Injection?",
      options: ["Input Validation", "Web Application Firewall (WAF)", "Parameterized Queries", "Encrypting the database"],
      answerIndex: 2,
      why: "Parameterized queries (prepared statements) fundamentally separate the data from the code, making SQLi impossible."
    }
  },
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS): The Poisoned Apple",
    analogy: "XSS is like giving someone a poisoned apple. The attacker leaves a malicious script on a trusted website (like a forum post). When an innocent victim reads the post, their browser eats the apple and runs the script.",
    diagram: "xss",
    subSteps: [
      { caption: "The attacker injects malicious JavaScript into the application (e.g., Stored XSS).", highlight: [] },
      { caption: "The victim visits the page. The victim's browser executes the script, which could steal cookies.", highlight: [] },
      { caption: "The fix is Output Encoding (Context-Aware Escaping). Treat all dynamic content as text, not HTML.", highlight: [] },
    ],
    examAnswer: "An attack where malicious scripts are injected into otherwise benign and trusted websites. Prevented by output encoding.",
    watchOut: "SQLi attacks the backend database. XSS attacks the victim's frontend browser.",
    glossary: ["XSS", "Stored XSS", "Reflected XSS", "Output Encoding"],
    presenterScript: "XSS is all about attacking the user. If I can run JavaScript in your browser, I am you. I can steal your session or take actions on your behalf.",
    checkpoint: {
      q: "Which type of XSS involves a malicious script being permanently saved on the target server (e.g., in a database)?",
      options: ["Reflected XSS", "Stored XSS", "DOM-based XSS", "Blind XSS"],
      answerIndex: 1,
      why: "Stored XSS is permanently saved on the server and served to anyone who views the affected page."
    }
  },
  {
    id: "ddos",
    title: "DDoS: The Traffic Jam",
    analogy: "DDoS is like a thousand fake cars suddenly swarming a highway on-ramp. Legitimate drivers (real users) can't get onto the highway because it's completely jammed with fake traffic.",
    diagram: "ddos",
    subSteps: [
      { caption: "An attacker controls thousands of compromised devices (a Botnet).", highlight: [] },
      { caption: "They order the Botnet to simultaneously send requests to the target server.", highlight: [] },
      { caption: "The server's resources (bandwidth, CPU) are exhausted, denying service to legitimate users.", highlight: [] },
    ],
    examAnswer: "Distributed Denial of Service. An attempt to make a machine or network resource unavailable to its intended users by flooding it with superfluous requests from multiple sources.",
    realWorld: "DNS Amplification is a popular DDoS technique where the attacker sends a small request with a spoofed IP, and the victim gets hit with a massive response.",
    watchOut: "DoS is from a single source. DDoS (Distributed) is from multiple sources (a botnet).",
    glossary: ["DDoS", "Botnet", "Volumetric Attack", "Amplification"],
    presenterScript: "DDoS attacks don't steal data; they just break things. You mitigate them with services like Cloudflare that can absorb the massive traffic.",
    checkpoint: {
      q: "What is the primary difference between a DoS and a DDoS attack?",
      options: ["DDoS targets databases, DoS targets networks", "DoS uses malware, DDoS uses phishing", "DDoS originates from multiple distributed sources, DoS is from a single source", "DoS is volumetric, DDoS is protocol-based"],
      answerIndex: 2,
      why: "The 'Distributed' in DDoS means the attack traffic comes from many different sources, making it harder to block."
    }
  }
]

export default function AttacksLearn() {
  return <GuidedLesson steps={attacksLessonSteps} diagrams={attacksLessonDiagrams} />
}
