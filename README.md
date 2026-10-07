# CNS Security Lab

An interactive learning and quiz web application for Computer Network Security (CNS), built as an Innovative Exam project.

## Features

- **8 Comprehensive Modules:**
  - Cryptography (Caesar, Vigenere, RSA, Hashing)
  - Authentication (TOTP, Passwords, Salting)
  - Firewalls (Stateless Packet Filter Simulator)
  - Cloud Security (CSPM Configuration Checker)
  - Attacks (SQLi, XSS, DDoS)
  - Intrusion Detection Systems (IDS Analyzer)
  - SSL/TLS (Handshake Simulator)
  - AI Security (Prompt Injection Simulator)
- **Interactive Playgrounds:** Every module has a live, interactive simulator written purely in TypeScript (no real network or database required).
- **Quiz Engine:** Built-in quiz platform with Rapid-Fire and Scenario-based rounds, scored in real-time.
- **Revision Hub:** Flip-to-reveal Flashcards, Master Complexity Tables, and Top 10 Viva Questions.
- **100% Client-Side:** Static Next.js App Router application. Runs anywhere, works offline, and requires zero environment variables or backend.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

This project is optimized for [Vercel](https://vercel.com). Simply push the repository to GitHub and connect it to a new Vercel project. No environment variables are required.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom tokens
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React

## Project Structure

- `/src/app`: Next.js pages and routing
- `/src/components`: Reusable UI components (Cards, Buttons, Callouts, Tabs)
- `/src/modules`: The 8 core security modules (Learn, Playground, Complexity, Quiz, Cheat Sheet)
- `/src/lib`: Core logic and simulators (e.g., `lib/crypto`, `lib/auth`, `lib/firewall`)
- `/src/data`: Question banks for the Quiz Engine
- `/docs`: Project documentation, architecture, reports, and presentation outlines.
