# CNS Security Lab - Viva Preparation Guide

This document is designed to help team members quickly prepare for the final presentation and teacher Viva. **Do not read from this document during the presentation.** Use it to memorize the core concepts of your assigned module.

## 1. Cryptography
- **Core Concept:** Math used to hide data. Symmetric uses 1 key (AES). Asymmetric uses 2 keys (RSA Public/Private).
- **The Code:** Look at `src/lib/crypto/rsa.ts`. We use `BigInt` because standard JavaScript numbers crash when trying to multiply 2048-bit prime numbers.
- **Viva Question:** "Why do we use RSA and AES together?" 
- **Answer:** RSA is too slow for large files. We use RSA just to securely share a small AES key, and then use AES for the rest of the communication.

## 2. Authentication
- **Core Concept:** Proving you are who you say you are. Passwords alone are weak.
- **The Code:** Look at `src/lib/auth/password.ts`. Notice how `salt` is randomly generated and prepended to the password before hashing.
- **Viva Question:** "What does Salting actually prevent?"
- **Answer:** It prevents Rainbow Table attacks. If two users have the password "password123", the salt ensures their final hashes in the database look completely different.

## 3. Firewalls
- **Core Concept:** Network bouncers. They sit at the edge and filter traffic based on rules.
- **The Code:** Look at `src/lib/firewall/simulator.ts`. It loops through an Access Control List (ACL) from top to bottom.
- **Viva Question:** "What is the default policy of a secure firewall?"
- **Answer:** Implicit Deny (Default-Deny). If a packet doesn't match any specific ALLOW rule, it is dropped by default at the bottom of the list.

## 4. Intrusion Detection Systems (IDS)
- **Core Concept:** Passive monitoring systems. They alert on bad behavior but do not block it themselves.
- **The Code:** Look at `src/lib/ids/simulator.ts`. It checks strings for known bad signatures (like `union select`).
- **Viva Question:** "What is the biggest problem with Anomaly-based IDS?"
- **Answer:** False Positives leading to Alert Fatigue. It flags too much normal behavior as an "anomaly", causing security analysts to ignore the dashboard entirely.

## 5. Attacks
- **Core Concept:** Exploiting bugs in software or limitations in network capacity.
- **The Code:** Look at `src/lib/attacks/simulator.ts`.
- **Viva Question:** "How do you fix SQL Injection?"
- **Answer:** Parameterized Queries (or Prepared Statements). They force the database to treat user input purely as data, not as executable code.

## 6. Cloud Security
- **Core Concept:** Securing infrastructure hosted by a third party (AWS, Azure).
- **The Code:** Look at `src/lib/cloud/checker.ts`.
- **Viva Question:** "What is the Shared Responsibility Model?"
- **Answer:** AWS is responsible for the physical security of the servers (Security OF the cloud). We are responsible for our IAM passwords, S3 bucket privacy, and code (Security IN the cloud).

## 7. SSL / TLS
- **Core Concept:** Encrypting HTTP traffic to create HTTPS.
- **The Code:** Look at `src/lib/tls/simulator.ts`.
- **Viva Question:** "What role does the Certificate Authority (CA) play?"
- **Answer:** The CA acts as a trusted third party. They digitally sign a website's certificate to prove that the Public Key actually belongs to Google, preventing Man-in-the-Middle attacks.

## 8. AI Security
- **Core Concept:** Vulnerabilities unique to Large Language Models.
- **The Code:** Look at `src/lib/ai/simulator.ts`.
- **Viva Question:** "Why is Prompt Injection so hard to fix?"
- **Answer:** Because LLMs cannot fundamentally distinguish between the developer's instructions and the user's input; they are both processed in the same natural language context window.
