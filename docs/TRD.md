# TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 2.1 Architecture
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (animations are critical for the presentation)
- **State:** Zustand (for Quiz score, timer, team turns)
- **Database:** None. All quiz questions, simulator logic, and config are hardcoded TypeScript files (e.g. `src/data/questions.ts`).
- **Deployment:** Vercel (static/edge deployment, zero config)

## 2.2 Core Components

1.  **Dashboard (`/`)**
    - Grid of 8 modules.
    - Progress indicator for completed modules.
    - "Start Quiz Challenge" button.
2.  **Module Page (`/modules/[slug]`)**
    - Reusable layout for each topic.
    - Contains 5 tabs:
        1.  **Learn**: Visual, diagram-heavy explanation of the topic.
        2.  **Playground**: Interactive demo.
        3.  **Complexity**: Time/space complexity analysis (crucial for passing the exam viva).
        4.  **Quiz**: 5 topic-specific questions.
        5.  **Cheat Sheet**: 1-pager summary.
3.  **Quiz Challenge Engine (`/quiz`)**
    - The main event. A rapid-fire timed quiz pulling from all 8 modules.
    - Two Teams (Team A, Team B). Scoreboard tracks points.
4.  **Revision Hub (`/revision`)**
    - Final polish area. Contains Flashcards, Master Complexity Table, and Top 25 Viva Questions.

## 2.3 The 8 Modules & Playground Logic

| Module | Playground Concept (Must be 100% Client-Side) |
| :--- | :--- |
| **Cryptography** | Caesar/Vigenere cipher interactive tool. Plus a simplified RSA math simulator. |
| **Authentication** | Password entropy calculator and a TOTP simulator (Google Auth style). |
| **Attacks** | SQLi bypass simulator (typing `' OR '1'='1` unlocks a fake login box). XSS simulator. |
| **Firewalls** | A "Packet Filter" simulator where you write an ACL and see which packets pass/drop. |
| **IDS** | Intrusion Detection simulator analyzing fake logs for signatures vs anomalies. |
| **SSL/TLS** | Interactive step-by-step TLS 1.3 handshake visualizer. |
| **AI Security** | Prompt Injection simulator (try to trick the "bot" to give you a secret). |
| **Cloud Security** | CSPM (Cloud Security Posture Management) configuration checker (find the public bucket). |
