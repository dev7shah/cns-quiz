# CNS Security Lab - Project Report

## 1. Introduction
The CNS Security Lab is a comprehensive, interactive learning application developed for the Computer Network Security (CNS) Innovative Exam. It addresses the common struggle students face with abstract security concepts by replacing traditional slideshows with live, interactive simulators and a competitive quiz engine.

## 2. Objectives
- **Interactive Learning:** To provide a visual, hands-on environment (Playgrounds) where abstract concepts (e.g., encryption algorithms, firewall rules, SQL injections) can be simulated locally.
- **Comprehensive Coverage:** To cover 8 critical modules of modern cybersecurity: Cryptography, Authentication, Firewalls, Cloud Security, Attacks, IDS, SSL/TLS, and AI Security.
- **Evaluation Mechanism:** To integrate a real-time Quiz Engine to test knowledge retention.
- **Zero-Backend Architecture:** To ensure high availability and simplicity by running entirely in the browser using static Next.js App Router technologies.

## 3. System Architecture
The application is built using Next.js 16 (App Router) with TypeScript. It is a 100% client-side application.
- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS + Framer Motion (for animations and 3D effects)
- **State Management:** Zustand (for Quiz Engine scoring and timer state)
- **Data Layer:** Hardcoded TypeScript objects (`src/data/questions`) serve as the database to eliminate external dependencies.

### 3.1 Design System: "The Lab Notebook"
The application utilizes a custom design system tokenized in CSS. It mimics a physical lab notebook combined with a precise instrument panel, utilizing:
- **Warm Themes:** Paper (`#F4F1EA`) and Ink (`#16130F`) backgrounds.
- **Typography:** Instrument Serif for display headers, JetBrains Mono for technical labels, and Geist Sans for UI.
- **Structural Integrity:** A strict 12-column grid and heavy use of 1px ruled lines to separate components.

### 3.2 Pedagogical Framework
Every concept across the 8 modules is taught using a strict "Three-Layer" approach implemented via the `<GuidedLesson>` component:
1. **Picture it:** A real-world analogy.
2. **See it work:** An interactive, animated SVG diagram.
3. **Say it in exam words:** A strict, formal definition.

Additionally, the application features a **Presenter Mode**, accessible via the `[P]` shortcut, providing a distraction-free overlay designed specifically for classroom projection.

### 3.3 Module Design
Each of the 8 modules follows a strict UI pattern for consistency:
1. **Learn:** Guided "scrollytelling" lesson and diagrams.
2. **Playground:** Pure TypeScript simulators (e.g., `src/lib/auth/totp.ts`).
3. **Complexity:** Analysis of algorithmic time and space complexity.
4. **Quiz:** Topic-specific practice questions.
5. **Cheat Sheet:** Quick reference guide.

## 4. Key Implementations

### 4.1 Simulators
Instead of relying on external backends, we built pure algorithmic simulators:
- **Cryptography:** Caesar and Vigenere ciphers, alongside BigInt-based RSA encryption logic.
- **Authentication:** A TOTP simulator that implements the HMAC-SHA1 logic based on a shared secret and current Unix timestamp.
- **Firewalls:** A stateless packet filtering engine that checks mock network packets against a top-down ACL (Access Control List).
- **Attacks & AI:** Simulators that parse mock inputs to demonstrate SQL Injection bypasses (`' OR '1'='1`) and AI Prompt Injection jailbreaks.

### 4.2 Revision Hub
A dedicated hub was built to assist students in exam preparation:
- **Flashcards:** Implemented using Framer Motion's `preserve-3d` for interactive flip cards.
- **Master Complexity Table:** A unified view of all algorithmic complexities (e.g., comparing O(1) hash lookups against O(log^3 N) RSA key generation).
- **Viva Questions:** Expected examiner questions and answers.

## 5. Challenges and Solutions
- **Handling Large Integers (RSA):** JavaScript's default `Number` type cannot handle the massive prime numbers required for RSA. We solved this by configuring `tsconfig.json` to target `ES2022` and utilizing native `BigInt` operations.
- **Instant Navigation Validation:** Next.js 16 enforces strict suspense boundaries for URL parameters. We resolved this by explicitly disabling instant validation flags on static routes that didn't require suspense wrappers, ensuring smooth builds on Vercel.

## 6. Conclusion
The CNS Security Lab successfully transforms theoretical cybersecurity concepts into an engaging, interactive platform. It fulfills all requirements of the Innovative Exam while providing a lasting revision tool for the student group.
