import { Question } from "@/lib/quiz/types"

export const idsQuestions: Question[] = [
  {
    id: "ids_1",
    topic: "ids",
    round: "rapid",
    difficulty: 1,
    prompt: "What is the primary difference between an IDS and an IPS?",
    options: [
      "IDS blocks attacks, IPS only logs them",
      "IDS only logs and alerts, IPS can actively block attacks",
      "IDS operates at Layer 3, IPS operates at Layer 7",
      "IDS is hardware, IPS is software"
    ],
    answerIndex: 1,
    explanation: "Intrusion Detection Systems (IDS) detect and alert. Intrusion Prevention Systems (IPS) sit inline and can drop malicious packets.",
    tags: ["ids", "ips"]
  },
  {
    id: "ids_2",
    topic: "ids",
    round: "rapid",
    difficulty: 2,
    prompt: "Which detection method is best at catching Zero-Day (previously unknown) attacks?",
    options: [
      "Signature-based Detection",
      "Anomaly-based Detection",
      "Heuristic-based Detection",
      "Both Anomaly and Heuristic"
    ],
    answerIndex: 3,
    explanation: "Anomaly and Heuristic methods look for deviations from normal behavior rather than exact matches, allowing them to spot brand new attacks.",
    tags: ["anomaly", "zero-day"]
  },
  {
    id: "ids_3",
    topic: "ids",
    round: "scenario",
    difficulty: 3,
    prompt: "A security analyst notices that the IDS is generating 5,000 alerts a day for 'Failed SSH Login', but 99% of them are just legitimate users making typos. What is this problem called?",
    scenario: "Reviewing weekly Security Operations Center (SOC) metrics.",
    options: [
      "False Negatives leading to Alert Fatigue",
      "False Positives leading to Alert Fatigue",
      "True Positives leading to Alert Fatigue",
      "Signature Evasion"
    ],
    answerIndex: 1,
    explanation: "False positives occur when benign activity is flagged as malicious. Too many of these cause 'Alert Fatigue', where analysts start ignoring alerts.",
    tags: ["false-positive", "scenario"]
  },
  {
    id: "ids_4",
    topic: "ids",
    round: "rapid",
    difficulty: 2,
    prompt: "Which of the following is an open-source Network Intrusion Detection System (NIDS)?",
    options: [
      "Nmap",
      "Wireshark",
      "Snort",
      "Metasploit"
    ],
    answerIndex: 2,
    explanation: "Snort is one of the most famous open-source NIDS engines in the world, relying heavily on signature-based rules.",
    tags: ["snort", "tools"]
  },
  {
    id: "ids_5",
    topic: "ids",
    round: "scenario",
    difficulty: 3,
    prompt: "An attacker encrypts their malware payload using TLS before sending it across the network. The company's NIDS fails to detect it. Why?",
    scenario: "Investigating a missed malware infection.",
    options: [
      "The NIDS signatures were out of date",
      "The NIDS cannot inspect encrypted payloads without SSL Decryption (TLS Inspection)",
      "The attacker used a Zero-Day exploit",
      "The NIDS was in Promiscuous mode"
    ],
    answerIndex: 1,
    explanation: "Network IDS cannot see inside encrypted traffic unless the company implements a TLS interception proxy to decrypt, inspect, and re-encrypt the traffic.",
    tags: ["tls", "nids", "scenario"]
  }
]
