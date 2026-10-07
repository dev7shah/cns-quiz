import { Question } from "@/lib/quiz/types"

export const firewallQuestions: Question[] = [
  {
    id: "fw_1",
    topic: "firewall",
    round: "rapid",
    difficulty: 1,
    prompt: "What is the primary function of a network firewall?",
    options: ["To encrypt all network traffic", "To inspect and filter incoming and outgoing traffic based on rules", "To speed up internet connections", "To backup network data"],
    answerIndex: 1,
    explanation: "A firewall filters traffic based on a defined set of security rules to prevent unauthorized access.",
    tags: ["basics"]
  },
  {
    id: "fw_2",
    topic: "firewall",
    round: "rapid",
    difficulty: 2,
    prompt: "A stateless packet filter decides whether to allow or block a packet using:",
    options: ["Each packet's header fields alone", "The packet's payload content", "The history of the connection", "The user's identity"],
    answerIndex: 0,
    explanation: "Stateless firewalls keep no memory of connections; they evaluate every packet individually based only on headers (like IP and port).",
    tags: ["stateless", "packet-filtering"]
  },
  {
    id: "fw_3",
    topic: "firewall",
    round: "rapid",
    difficulty: 2,
    prompt: "Which type of firewall keeps track of active connections to allow return traffic automatically?",
    options: ["Stateless packet filter", "Stateful inspection firewall", "Application-level gateway (Proxy)", "Web Application Firewall (WAF)"],
    answerIndex: 1,
    explanation: "Stateful firewalls maintain a state table. Once an outbound connection is allowed, return traffic for that connection is automatically permitted.",
    tags: ["stateful"]
  },
  {
    id: "fw_4",
    topic: "firewall",
    round: "scenario",
    difficulty: 2,
    prompt: "An administrator adds a rule: 'ALLOW TCP from ANY to 192.168.1.5 PORT 80'. What service is being exposed to the internet?",
    scenario: "Configuring rules for a new server in the DMZ.",
    options: ["SSH", "HTTP (Web server)", "HTTPS", "DNS"],
    answerIndex: 1,
    explanation: "TCP Port 80 is the standard port for unencrypted HTTP web traffic.",
    tags: ["ports", "scenario"]
  },
  {
    id: "fw_5",
    topic: "firewall",
    round: "scenario",
    difficulty: 3,
    prompt: "A firewall has two rules in this order: 1. DENY ALL to PORT 22. 2. ALLOW IP 10.0.0.5 to PORT 22. Will IP 10.0.0.5 be able to access Port 22?",
    scenario: "A junior admin is trying to allow SSH access for their machine but block everyone else.",
    options: ["Yes", "No", "Only if it is a stateful firewall", "Only on UDP"],
    answerIndex: 1,
    explanation: "Firewalls typically evaluate rules top-down and stop at the first match (First-match wins). The first rule denies ALL traffic to port 22, so rule 2 is never reached.",
    tags: ["rules", "scenario"]
  },
  {
    id: "fw_6",
    topic: "firewall",
    round: "image",
    difficulty: 2,
    prompt: "In this network topology, which device acts as the DMZ web server?",
    imageComponent: "FirewallTopologyDiagram",
    options: ["Device A (Internal Laptop)", "Device B (Database Server)", "Device C (Public-facing Web Server)", "Device D (Router)"],
    answerIndex: 2,
    explanation: "A DMZ (Demilitarized Zone) is a subnet that exposes an organization's external-facing services (like web servers) to a larger untrusted network, usually the internet.",
    tags: ["dmz", "image", "topology"]
  },
  {
    id: "fw_7",
    topic: "firewall",
    round: "rapid",
    difficulty: 3,
    prompt: "What is a 'Default Deny' (or implicit deny) policy?",
    options: ["Deny traffic only if it matches a malware signature", "Deny all traffic unless specifically allowed by a rule", "Allow all traffic unless specifically denied by a rule", "Deny traffic only from outside the network"],
    answerIndex: 1,
    explanation: "Default deny means that if a packet does not match any of the explicitly allowed rules, it is dropped. This is a fundamental security best practice.",
    tags: ["policies", "default-deny"]
  },
  {
    id: "fw_8",
    topic: "firewall",
    round: "scenario",
    difficulty: 3,
    prompt: "An attacker is sending packets with forged source IP addresses to bypass firewall rules based on IP whitelists. What is this attack called?",
    scenario: "Analyzing firewall logs showing strange internal IPs arriving on the external interface.",
    options: ["IP Spoofing", "MAC Flooding", "ARP Poisoning", "Port Scanning"],
    answerIndex: 0,
    explanation: "IP spoofing is the creation of IP packets with a false source IP address, for the purpose of hiding the sender or impersonating another computing system.",
    tags: ["spoofing", "scenario"]
  },
  {
    id: "fw_9",
    topic: "firewall",
    round: "image",
    difficulty: 3,
    prompt: "In this stateful firewall connection table diagram, what does the 'ESTABLISHED' state indicate?",
    imageComponent: "StateTableDiagram",
    options: ["A packet that matches a DROP rule", "A connection where the three-way handshake has completed", "A new connection request (SYN packet)", "A connection that has been closed (FIN packet)"],
    answerIndex: 1,
    explanation: "ESTABLISHED means the firewall has seen packets traveling in both directions, confirming the connection is fully open (e.g., after the TCP handshake).",
    tags: ["stateful", "image"]
  },
  {
    id: "fw_10",
    topic: "firewall",
    round: "image",
    difficulty: 1,
    prompt: "Where is the best placement for the Network Firewall to protect the entire internal network from the internet?",
    imageComponent: "FirewallPlacementDiagram",
    options: ["Between the internal switch and the workstations", "Between the internet router and the core switch", "On every single workstation (Host firewall only)", "In the cloud provider's network"],
    answerIndex: 1,
    explanation: "A perimeter or edge firewall sits between the external untrusted network (internet router) and the internal trusted network (core switch).",
    tags: ["placement", "image"]
  }
]
