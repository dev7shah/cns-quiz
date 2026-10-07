import { Question } from "@/lib/quiz/types"

export const cloudQuestions: Question[] = [
  {
    id: "cld_1",
    topic: "cloud",
    round: "rapid",
    difficulty: 1,
    prompt: "In the Shared Responsibility Model, who is responsible for the physical security of the data center?",
    options: ["The Customer", "The Cloud Service Provider (CSP)", "Both equally", "Third-party auditors"],
    answerIndex: 1,
    explanation: "The Cloud Provider (AWS, Azure, GCP) handles 'Security OF the Cloud', including physical data centers and server hardware.",
    tags: ["shared-responsibility"]
  },
  {
    id: "cld_2",
    topic: "cloud",
    round: "rapid",
    difficulty: 2,
    prompt: "What is the leading cause of cloud security breaches?",
    options: ["Zero-day exploits", "Insider threats at the CSP", "Customer misconfiguration", "DDoS attacks"],
    answerIndex: 2,
    explanation: "Customer misconfigurations, such as leaving an S3 bucket public or exposing a database, account for the vast majority of cloud breaches.",
    tags: ["misconfiguration"]
  },
  {
    id: "cld_3",
    topic: "cloud",
    round: "scenario",
    difficulty: 2,
    prompt: "A developer needs an IAM role to read objects from a specific S3 bucket. They are assigned the 'AdministratorAccess' policy. What security principle is violated?",
    scenario: "Reviewing IAM permissions during an audit.",
    options: ["Defense in Depth", "Separation of Duties", "Principle of Least Privilege", "Security through Obscurity"],
    answerIndex: 2,
    explanation: "The Principle of Least Privilege states that users should only have the exact permissions necessary to do their job, nothing more.",
    tags: ["iam", "scenario"]
  },
  {
    id: "cld_4",
    topic: "cloud",
    round: "rapid",
    difficulty: 2,
    prompt: "What does CSPM stand for?",
    options: ["Cloud Security Posture Management", "Customer Service Provisioning Model", "Cloud System Patch Management", "Critical Security Policy Module"],
    answerIndex: 0,
    explanation: "CSPM tools automatically identify misconfigurations and compliance risks in the cloud.",
    tags: ["cspm", "acronyms"]
  },
  {
    id: "cld_5",
    topic: "cloud",
    round: "scenario",
    difficulty: 3,
    prompt: "An attacker finds an AWS Access Key ID and Secret Access Key hardcoded in a public GitHub repository. What should the admin do FIRST?",
    scenario: "Incident Response to leaked credentials.",
    options: ["Delete the GitHub repository", "Find out who committed the code", "Deactivate or delete the leaked access keys in AWS IAM", "Change the root account password"],
    answerIndex: 2,
    explanation: "The immediate priority is to stop the bleeding. Deactivating the leaked keys prevents the attacker from using them, regardless of where they are posted.",
    tags: ["incident-response", "scenario"]
  },
  {
    id: "cld_6",
    topic: "cloud",
    round: "rapid",
    difficulty: 1,
    prompt: "What is a 'VPC' in cloud networking?",
    options: ["Virtual Private Cloud", "Verified Public Connection", "Variable Processing Core", "Virtual Protection Circuit"],
    answerIndex: 0,
    explanation: "A Virtual Private Cloud is a logically isolated section of the cloud where you can launch resources in a virtual network you define.",
    tags: ["vpc"]
  },
  {
    id: "cld_7",
    topic: "cloud",
    round: "rapid",
    difficulty: 3,
    prompt: "If an EC2 instance (IaaS) is compromised due to an unpatched Windows OS vulnerability, who is responsible according to the Shared Responsibility Model?",
    options: ["The Cloud Provider", "The Customer", "Microsoft", "The ISP"],
    answerIndex: 1,
    explanation: "In IaaS (Infrastructure as a Service), the customer is responsible for patching and securing the guest operating system.",
    tags: ["shared-responsibility", "iaas"]
  },
  {
    id: "cld_8",
    topic: "cloud",
    round: "image",
    difficulty: 2,
    prompt: "In this AWS architecture, what component acts as the virtual firewall controlling traffic in and out of the EC2 instances?",
    imageComponent: "AWSArchDiagram",
    options: ["S3 Bucket", "Security Group", "IAM Role", "CloudTrail"],
    answerIndex: 1,
    explanation: "Security Groups act as virtual, stateful firewalls for EC2 instances to control inbound and outbound traffic.",
    tags: ["security-groups", "image"]
  },
  {
    id: "cld_9",
    topic: "cloud",
    round: "scenario",
    difficulty: 3,
    prompt: "A company wants to ensure that even if an administrator's credentials are stolen, the attacker cannot permanently delete their S3 backups. What feature should they enable?",
    scenario: "Designing a ransomware-resilient backup strategy.",
    options: ["S3 Versioning with MFA Delete", "S3 Server-Side Encryption", "AWS Shield Advanced", "CloudFront CDN"],
    answerIndex: 0,
    explanation: "MFA Delete requires a valid MFA code to permanently delete an object version or suspend versioning on the bucket.",
    tags: ["s3", "mfa-delete", "scenario"]
  },
  {
    id: "cld_10",
    topic: "cloud",
    round: "rapid",
    difficulty: 2,
    prompt: "Which cloud service model shifts the most security responsibility to the Cloud Provider?",
    options: ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "FaaS (Function as a Service)"],
    answerIndex: 2,
    explanation: "In SaaS (like Gmail or Salesforce), the provider handles everything from the physical infrastructure up to the application code. The customer only manages their data and access.",
    tags: ["saas", "models"]
  }
]
