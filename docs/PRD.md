# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1.1 Problem
Our group is weak at Computer Network Security (CNS). We must present a "Network Security Quiz Challenge" in our Innovative Exam, 6 students, quiz format with rapid-fire, scenario-based and image-based questions. Instead of a plain quiz, we build one app that **teaches each topic visually, lets you play with a working demo, shows its complexity, and then quizzes you**. The app is both our mini project (for the PPT and report) and our revision tool.

## 1.2 Goals
- G1: Cover all 8 topics in depth, each with explanation, live demo, complexity analysis and quiz.
- G2: Run the quiz challenge live in front of the teacher, with team scoring and a timer.
- G3: Strong frontend: clean, animated, diagram-driven explanations that a beginner can follow.
- G4: No database and no API routes. Deployed on Vercel (public link for the teacher), and also runs locally with `npm run dev`.
- G5: Be fully explainable by every group member. Code is readable, commented, simple.

## 1.3 Non-goals
- No user accounts, database or server.
- No real network scanning or attacking. All attack demos run on fake local data.
- No real exploit code. SQL injection and similar demos use a simulated in-memory "database".

## 1.4 Users
| User | Need |
|---|---|
| Student (us) | Learn quickly, revise, present confidently |
| Teacher (miss) | See coverage, run or watch the quiz, evaluate the project |
