import { Question } from "@/lib/quiz/types"

export const attacksQuestions: Question[] = [
  {
    id: "att_1",
    topic: "attacks",
    round: "rapid",
    difficulty: 1,
    prompt: "What does DoS stand for in network security?",
    options: ["Data on Server", "Denial of Service", "Directory of Systems", "Distributed over Syntax"],
    answerIndex: 1,
    explanation: "DoS stands for Denial of Service, an attack meant to shut down a machine or network, making it inaccessible to its intended users.",
    tags: ["dos"]
  },
  {
    id: "att_2",
    topic: "attacks",
    round: "scenario",
    difficulty: 2,
    prompt: "An attacker enters `' OR '1'='1` in a login box and successfully authenticates as the first user in the database. What is the best fix for this?",
    scenario: "Investigating a compromised web application login.",
    options: ["Encrypting the database", "Using parameterized queries", "Implementing rate limiting", "Installing a stateful firewall"],
    answerIndex: 1,
    explanation: "Parameterized queries keep user input separate from SQL code, ensuring that the database treats the input strictly as data and not executable code.",
    tags: ["sqli", "scenario"]
  },
  {
    id: "att_3",
    topic: "attacks",
    round: "rapid",
    difficulty: 2,
    prompt: "Which attack involves intercepting communication between two parties who believe they are directly communicating with each other?",
    options: ["Phishing", "Man-in-the-Middle (MitM)", "SQL Injection", "DDoS"],
    answerIndex: 1,
    explanation: "In a Man-in-the-Middle attack, the attacker secretly relays and possibly alters the communications between two parties.",
    tags: ["mitm"]
  },
  {
    id: "att_4",
    topic: "attacks",
    round: "image",
    difficulty: 2,
    prompt: "In this diagram showing an attacker secretly intercepting traffic between a client and a server, identify the attacker's position.",
    imageComponent: "MitMDiagram",
    options: ["Position A (Client)", "Position B (Proxy Server)", "Position C (Attacker Machine)", "Position D (Web Server)"],
    answerIndex: 2,
    explanation: "The attacker positions themselves between the client and the server to eavesdrop or alter data.",
    tags: ["mitm", "image"]
  },
  {
    id: "att_5",
    topic: "attacks",
    round: "scenario",
    difficulty: 3,
    prompt: "A company's web server is suddenly overwhelmed with millions of HTTP requests originating from thousands of different IP addresses worldwide. What type of attack is this?",
    scenario: "Network administrators notice a massive spike in traffic taking down the main website.",
    options: ["Denial of Service (DoS)", "Distributed Denial of Service (DDoS)", "Brute-force attack", "Ransomware"],
    answerIndex: 1,
    explanation: "Because the traffic comes from thousands of different sources (a botnet), it is a Distributed Denial of Service (DDoS) attack.",
    tags: ["ddos", "scenario"]
  },
  {
    id: "att_6",
    topic: "attacks",
    round: "rapid",
    difficulty: 2,
    prompt: "What is a characteristic of a 'Zero-Day' vulnerability?",
    options: ["It takes zero days to fix", "It is known only to the software vendor", "It is exploited before the vendor is aware of it or has a patch ready", "It only affects zero-client systems"],
    answerIndex: 2,
    explanation: "A zero-day is a vulnerability that attackers exploit before the vendor has 0 days of awareness or has released a patch.",
    tags: ["zero-day"]
  },
  {
    id: "att_7",
    topic: "attacks",
    round: "scenario",
    difficulty: 2,
    prompt: "A user receives an urgent email claiming their bank account will be closed unless they click a link and verify their password. The link goes to a fake lookalike site. Which attack is this?",
    scenario: "An employee reports a suspicious email to the IT desk.",
    options: ["Phishing", "Cross-Site Scripting (XSS)", "SQL Injection", "Eavesdropping"],
    answerIndex: 0,
    explanation: "Phishing relies on social engineering and deceptive emails/websites to trick users into revealing sensitive information.",
    tags: ["phishing", "scenario"]
  },
  {
    id: "att_8",
    topic: "attacks",
    round: "rapid",
    difficulty: 3,
    prompt: "Which defense mechanism is most effective against automated credential stuffing attacks?",
    options: ["Using TLS 1.3", "Rate limiting and CAPTCHAs", "Input validation", "Network segmentation"],
    answerIndex: 1,
    explanation: "Credential stuffing uses bots to try leaked passwords rapidly. Rate limiting and CAPTCHAs slow down or block these automated attempts.",
    tags: ["credential-stuffing", "defenses"]
  },
  {
    id: "att_9",
    topic: "attacks",
    round: "scenario",
    difficulty: 3,
    prompt: "An attacker injects malicious JavaScript into a blog comment section. When other users view the comments, their browsers execute the script. What attack is this?",
    scenario: "Users report that viewing a specific forum page causes weird popups and redirects.",
    options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Command Injection"],
    answerIndex: 1,
    explanation: "Stored Cross-Site Scripting (XSS) occurs when malicious scripts are injected into web pages and executed by victims' browsers.",
    tags: ["xss", "scenario"]
  },
  {
    id: "att_10",
    topic: "attacks",
    round: "image",
    difficulty: 1,
    prompt: "Identify the vulnerability shown in this snippet of server-side code: `query = \"SELECT * FROM users WHERE user='\" + req.body.username + \"'\"`",
    imageComponent: "SQLiCodeDiagram",
    options: ["SQL Injection", "Buffer Overflow", "XSS", "Insecure Deserialization"],
    answerIndex: 0,
    explanation: "Concatenating unsanitized user input directly into a SQL query string allows attackers to perform SQL Injection.",
    tags: ["sqli", "image"]
  }
]
