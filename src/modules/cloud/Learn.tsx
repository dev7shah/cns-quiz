import * as React from "react"
import { GuidedLesson, LessonStepType } from "@/components/layout/GuidedLesson"

// --- Diagrams ---

const DiagramShared = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center w-full max-w-sm">
      <div className="flex w-full">
        <div className={`w-1/2 p-4 border ${activeSubStep === 0 ? 'bg-card border-signal text-signal' : 'bg-paper border-ink text-ink-soft'}`}>
          <div className="font-mono text-xs uppercase mb-2">Provider</div>
          <div className="text-sm">Physical Data Center</div>
          <div className="text-sm">Hardware</div>
        </div>
        <div className={`w-1/2 p-4 border ${activeSubStep === 1 || activeSubStep === 2 ? 'bg-card border-signal text-signal' : 'bg-paper border-ink text-ink-soft'}`}>
          <div className="font-mono text-xs uppercase mb-2">Customer</div>
          <div className="text-sm">IAM Policies</div>
          <div className="text-sm">Customer Data</div>
        </div>
      </div>
      
      {activeSubStep === 2 && (
        <div className="w-full font-mono text-[10px] break-all max-w-[250px] bg-bad text-paper p-2 mt-2 text-center animate-pulse">
          ALERT: S3 BUCKET EXPOSED
        </div>
      )}
      <div className="mt-4 text-center text-sm font-sans text-ink-soft">
        {activeSubStep === 0 && "Provider secures the infrastructure (Security OF the Cloud)."}
        {activeSubStep === 1 && "Customer secures the configuration (Security IN the Cloud)."}
        {activeSubStep === 2 && "If the customer misconfigures an S3 bucket, it's their responsibility."}
      </div>
    </div>
  )
}

const DiagramIAM = ({ activeSubStep }: { activeSubStep: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="flex justify-between w-full items-center font-mono text-xs mb-4">
        <span className="flex flex-col items-center">
          Admin
          <span className="text-[10px] text-ink-soft mt-1">Bob</span>
        </span>
        <span className="flex flex-col items-center">
          Cloud
          <span className="text-[10px] text-ink-soft mt-1">AWS</span>
        </span>
      </div>
      <div className="flex justify-between w-full relative">
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">B</div>
        <div className="w-12 h-12 bg-card border border-ink flex items-center justify-center">☁️</div>
        
        {activeSubStep > 0 && (
          <div className="absolute top-1/2 left-12 right-12 h-px bg-rule">
            <div className={`w-3 h-3 ${activeSubStep === 2 ? 'bg-bad absolute left-0 -top-1 animate-[slide_2s_ease-in-out_infinite]' : 'bg-signal absolute left-0 -top-1 animate-[slide_2s_ease-in-out_infinite]'}`} />
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-sm font-sans text-ink-soft px-4">
        {activeSubStep === 0 && "Bob gets AdministratorAccess instead of S3ReadOnly."}
        {activeSubStep === 1 && "Bob's account is compromised (no MFA)."}
        {activeSubStep === 2 && "Attacker deletes databases and mines crypto."}
      </div>
    </div>
  )
}

export const cloudLessonDiagrams: Record<string, React.FC<{ activeSubStep: number }>> = {
  "shared": DiagramShared,
  "iam": DiagramIAM,
}

// --- Steps ---

export const cloudLessonSteps: LessonStepType[] = [
  {
    id: "shared",
    title: "Shared Responsibility: The Landlord and Tenant",
    analogy: "Think of the cloud like renting an apartment. The landlord (Cloud Provider) secures the building doors, fixes the plumbing, and maintains the elevator. But if you (the Tenant) leave your apartment door unlocked and get robbed, that's your fault.",
    diagram: "shared",
    subSteps: [
      { caption: "Provider secures physical data centers, hardware, and networks (Security OF the Cloud).", highlight: [] },
      { caption: "Customer manages IAM, encrypts data, and configures firewalls (Security IN the Cloud).", highlight: [] },
      { caption: "A misconfigured S3 bucket exposing PII is a failure of the Customer, not the Provider.", highlight: [] },
    ],
    examAnswer: "A security framework where the cloud provider is responsible for the physical infrastructure and hypervisor, while the customer is responsible for the OS, applications, data, and access configuration.",
    watchOut: "You can outsource the work to the cloud, but you can NEVER outsource the accountability. If there's a breach due to misconfiguration, you are responsible.",
    realWorld: "Capital One was breached because of a misconfigured Web Application Firewall on AWS. AWS was not held responsible; Capital One was.",
    glossary: ["CSP", "Security OF the Cloud", "Security IN the Cloud"],
    presenterScript: "The most important concept in cloud security is the Shared Responsibility Model. If you only remember one thing, remember that the cloud provider gives you the tools to be secure, but they don't configure them for you.",
    checkpoint: {
      q: "Under the Shared Responsibility Model (IaaS), who is responsible for patching the guest operating system on an EC2 instance?",
      options: ["The Cloud Service Provider", "The Customer", "It is a shared responsibility", "The hypervisor vendor"],
      answerIndex: 1,
      why: "In IaaS (Infrastructure as a Service), the customer manages the guest OS, including all patching and updates."
    }
  },
  {
    id: "iam",
    title: "IAM & Misconfiguration: The Master Key",
    analogy: "Giving someone the master key to your entire office building when they only need to check the mailbox out front.",
    diagram: "iam",
    subSteps: [
      { caption: "Bob is incorrectly given 'AdministratorAccess' policy instead of least privilege.", highlight: [] },
      { caption: "Bob doesn't use MFA. His password is stolen in a phishing attack.", highlight: [] },
      { caption: "The attacker uses Bob's Admin credentials to compromise the entire cloud environment.", highlight: [] },
    ],
    examAnswer: "Identity and Access Management (IAM) is the central control plane of the cloud. Misconfiguration of IAM is the leading cause of cloud breaches.",
    watchOut: "Over-permissive IAM roles allow attackers to move laterally and escalate privileges rapidly in a cloud environment.",
    glossary: ["Principle of Least Privilege (PoLP)", "MFA", "Lateral Movement"],
    presenterScript: "In the cloud, identity is the new perimeter. If an attacker compromises an identity with overly broad permissions, they don't need to 'hack' anything—they just log in and use the APIs.",
    checkpoint: {
      q: "What is the Principle of Least Privilege (PoLP)?",
      options: ["Encrypting all data at rest and in transit", "Giving users Administrator access for convenience", "Granting a user only the minimum permissions necessary to perform their job", "Requiring MFA for all logins"],
      answerIndex: 2,
      why: "PoLP ensures that if an account is compromised, the potential damage is limited to only what that account is explicitly allowed to do."
    }
  }
]

export default function CloudLearn() {
  return <GuidedLesson steps={cloudLessonSteps} diagrams={cloudLessonDiagrams} />
}
