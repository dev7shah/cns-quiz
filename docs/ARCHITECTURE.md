# CNS Security Lab - Architecture Document

## Overview
The CNS Security Lab is a purely client-side Next.js application. By explicitly omitting a backend server and a database, we guarantee that the application is:
1. Extremely fast to deploy (zero configuration).
2. Capable of running entirely offline once loaded.
3. Easy for students to modify and experiment with.

## Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom tokens (`src/styles/tokens.css`)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Testing:** Vitest

## Directory Structure

```text
cns-lab/
├── docs/                   # Project documentation (PRD, TRD, Report, etc.)
├── src/
│   ├── app/                # Next.js App Router definitions
│   │   ├── modules/        # Dynamic route for [slug]/page.tsx
│   │   ├── quiz/           # Quiz engine routes
│   │   ├── revision/       # Revision hub routes
│   │   ├── layout.tsx      # Global layout and font definitions
│   │   └── template.tsx    # Global Framer Motion page transitions
│   ├── components/
│   │   ├── layout/         # Shell components (Navbar, ModuleShell)
│   │   └── ui/             # Reusable atomic UI (Card, Button, Callout, Tabs)
│   ├── data/
│   │   └── questions/      # Hardcoded TypeScript arrays for the Quiz Engine
│   ├── lib/                # Core logic & Simulators (NO UI HERE)
│   │   ├── auth/           # Password entropy, TOTP math
│   │   ├── crypto/         # RSA BigInt math, Ciphers, Hashing
│   │   ├── firewall/       # Packet filtering ACLs
│   │   ├── ids/            # Log analysis
│   │   ├── tls/            # Handshake states
│   │   └── quiz/           # Quiz scoring engine
│   └── modules/            # UI composition for the 8 topics
│       ├── ai/             
│       ├── attacks/        
│       ├── auth/           
│       ├── cloud/          
│       ├── crypto/         
│       ├── firewall/       
│       ├── ids/            
│       └── tls/            
└── tsconfig.json           # Set to ES2022 for BigInt support
```

## Architectural Decisions
1. **Separation of Concerns:** All algorithmic complexity (RSA math, Firewall ACLs) is strictly isolated in `src/lib/`. The UI files in `src/modules/` only handle React state and DOM rendering.
2. **Static Generation:** The dynamic route `src/app/modules/[slug]/page.tsx` uses `generateStaticParams()` to pre-render all 8 modules at build time.
3. **No Database:** The `src/data/questions` folder acts as an in-memory document store. This is sufficient for the scope of a static learning application and avoids the complexity of Prisma/Postgres.
