# CNS Security Lab: REVAMP (v2)

## 1. What is wrong with the current site
- Learn tab is a wall of text. No animated diagram, no step controls, nothing that *shows* the idea.
- Icon renders as a literal `?` in front of "Exam-style Questions".
- Formulas lost their superscripts: "C = Me mod n" instead of C = M^e mod n.
- Home page is a plain title and 8 identical cards. Nothing tells the teacher what the project *does*.
- Quiz setup only has team count and names. PRD promised rounds, difficulty, scoring, host controls.
- Cards, tabs and layout are default-looking; no identity.
- Many features reported not working by the team.

## 2. Design direction: "Lab Notebook"
A printed lab notebook meets a precise instrument panel. Warm paper background, confident editorial typography, thin ruled lines and measurement marks, and one loud signal color.

### 2.1 Tokens
- `--paper`: Light `#F4F1EA`, Dark `#0E1116`
- `--card`: Light `#FBF9F4`, Dark `#151A21`
- `--ink`: Light `#16130F`, Dark `#ECE8DF`
- `--ink-soft`: Light `#5D574C`, Dark `#9A958A`
- `--rule`: Light `#D9D3C5`, Dark `#2A313B`
- `--signal`: Light `#E5390F`, Dark `#FF5A2C`
- `--ok`: Light `#1F7A4D`, Dark `#3CCB82`
- `--warn`: Light `#B7791F`, Dark `#E8B03A`
- `--bad`: Light `#B3261E`, Dark `#FF6B5E`
- `--info`: Light `#1F4FD8`, Dark `#6C8CFF`

### 2.2 Typography
- Display: **Instrument Serif**
- UI: **Geist Sans** or **Inter Tight**
- Code/Labels: **JetBrains Mono**

### 2.3 Layout Requirements
- 12-column grid. Left sticky rail on module pages for the 5 tabs.
- Buttons are square-ish with 1px border.
- Custom styled components (Tabs, Tooltips, Sliders, Steppers).
- Inline SVGs instead of emojis.

## 3. Teaching-first System
Every concept explained in three layers:
1. Picture it (analogy)
2. See it work (animated diagram)
3. Say it in exam words (definition)

### 3.1 Guided Lesson Component
Lesson steps containing an analogy, diagram key, substeps with captions/highlights, exam answers, and script. Uses scrollytelling.

### 3.2 Presenter Mode
Full screen, one step at a time, speaker notes drawer, shortcuts, recap, quiz launcher.

### 3.3 Content Depth
(Detailed per-module requirements outlined in the prompt).

## 4. Quiz Challenge
Rebuild setup (rounds, filters, timer), Play screen (big layout, scoreboard), Host bar (shortcuts), and Review/Export flow.

## 5. Priorities for Tonight
1. Step 1: Audit and fix broken features.
2. Step 3: Cryptography module (reference) + Presenter Mode.
3. Step 5: Quiz and Landing page.
4. Step 4: Remaining modules (TLS, Firewalls, Auth, Attacks, IDS, Cloud, AI).
