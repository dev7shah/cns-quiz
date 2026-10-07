# CNS Security Lab - Assumptions Document

During the development of the CNS Security Lab, the following technical and project constraints were assumed to be true based on the provided requirements:

1. **Client-Side Environment Only:**
   - It is assumed that the application will not have access to a traditional backend server, database, or secret management infrastructure. 
   - All cryptographic operations (RSA generation, Hashing) must be executed natively in the user's browser using JavaScript/TypeScript.

2. **Simulation over Real Exploits:**
   - It is assumed that the goal of the 'Attacks' module is educational visualization. We simulate vulnerabilities (like SQL Injection or Prompt Injection) using mock data objects and keyword-matching logic rather than attempting to build real, exploitable virtual machines.

3. **No Authentication Required:**
   - It is assumed that this is an open educational tool. There are no user accounts. Quiz progress is ephemeral (stored in memory via Zustand) and will reset upon page reload.

4. **Modern Browser Usage:**
   - The RSA simulator requires the `BigInt` JavaScript primitive. It is assumed that users (and the grading teachers) will be using a modern web browser (Chrome, Edge, Firefox, Safari) released after 2020 that supports ES2020+ features.

5. **Static Deployment:**
   - It is assumed that the Vercel deployment will utilize Next.js static generation. The `generateStaticParams()` function is heavily utilized to ensure instantaneous page loads.
