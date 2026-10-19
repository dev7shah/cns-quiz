import { Plate, TopicPresentation } from "@/lib/present/types"

export const playfairPlates: Plate[] = [
  {
    id: 'playfair-hook',
    kind: 'hook',
    title: 'Breaking the Single-Letter Barrier',
    subtitle: 'The First Practical Digraphic Substitution Cipher (1854)',
    caption: 'Invented by Charles Wheatstone, promoted by Lord Playfair for British battlefield dispatches.',
    eli5Caption: 'Instead of encrypting one letter at a time, Playfair encrypts letter pairs to fool frequency analysis.',
    speakerNotes: {
      script: 'Playfair was invented in 1854 to eliminate the frequency analysis weakness of monoalphabetic substitution. Instead of replacing single characters, it encrypts pairs of letters known as digraphs.',
      likelyQuestions: [
        {
          question: 'Why does encrypting pairs make frequency analysis harder?',
          answer: 'There are 26 single letters, but 26 x 26 = 676 digraph combinations. The statistical frequency curve is much flatter and requires far more ciphertext to break.'
        }
      ]
    },
    customFigure: 'PlayfairOverview'
  },
  {
    id: 'playfair-analogy',
    kind: 'analogy',
    title: 'The 5×5 Matrix Rectangle Rule',
    subtitle: 'Geometric Coordinate Mapping',
    caption: 'Letters form the corners of a rectangle in a 5x5 grid (I and J share a cell); cipher letters take the opposite corners.',
    eli5Caption: 'Find two letters on a 5x5 grid: if they form a box, swap horizontal corners.',
    speakerNotes: {
      script: 'The heart of Playfair is a 5 by 5 grid filled with a keyword followed by remaining letters. Letters I and J occupy the same cell to fit 25 positions.',
      likelyQuestions: [
        {
          question: 'What if both letters fall on the same row or column?',
          answer: 'Same row shifts one position to the right (wrapping around). Same column shifts one position down.'
        }
      ]
    },
    customFigure: 'PlayfairRulesVisual'
  },
  {
    id: 'playfair-concept',
    kind: 'concept',
    title: 'The Three Digraph Rules',
    subtitle: 'Deterministic Geometric Transformations',
    caption: 'Rule 1: Same row -> Shift right. Rule 2: Same column -> Shift down. Rule 3: Rectangle -> Opposite horizontal corners.',
    eli5Caption: 'Row: slide right. Column: slide down. Rectangle: horizontal switcheroo.',
    speakerNotes: {
      script: 'Always check: repeated letters in a pair are separated with filler X. An odd final letter is padded with X. Then apply Row, Column, or Rectangle rules.',
      likelyQuestions: [
        {
          question: 'Why must identical letters in a pair be separated?',
          answer: 'Because two identical letters like "EE" cannot form a rectangle, row, or column pair deterministically.'
        }
      ]
    },
    customFigure: 'PlayfairRulesSummary'
  },
  {
    id: 'playfair-worked',
    kind: 'worked-example',
    title: 'Worked Example: Keyword "MONARCHY"',
    subtitle: 'Encrypting Digraph "BA" to "IB" / "JB"',
    caption: 'Construct the matrix from "MONARCHY", locate letters B and A, and apply the rectangle rule.',
    eli5Caption: 'Locate B and A on the grid, notice they form a rectangle, and take the opposite horizontal corners.',
    speakerNotes: {
      script: 'Walk through placing M-O-N-A-R-C-H-Y, then remaining letters B, D, E, F, G, etc. Locate B (row 2, col 1) and A (row 0, col 3). Opposite corners are I (or J) and B.',
      likelyQuestions: [
        {
          question: 'How do you know whether to output I or J?',
          answer: 'Both are acceptable in Playfair. The receiver decodes based on the contextual meaning of the word.'
        }
      ]
    },
    workedExample: {
      problem: 'Using keyword "MONARCHY", encrypt the digraph pair "BA".',
      given: {
        'Keyword': '"MONARCHY"',
        'Matrix Size': '5 × 5 (I/J merged)',
        'Digraph': '"BA"'
      },
      steps: [
        {
          label: 'Construct the 5x5 matrix starting with unique letters of MONARCHY',
          formula: 'Fill Keyword then unused alphabet',
          result: 'Row 0: [M, O, N, A, R], Row 1: [C, H, Y, B, D], Row 2: [E, F, G, I/J, K], Row 3: [L, P, Q, S, T], Row 4: [U, V, W, X, Z]'
        },
        {
          label: 'Locate positions of B and A in the matrix',
          formula: 'Find (row, col) coordinates',
          substitution: 'B is at (row 1, col 3); A is at (row 0, col 3)',
          result: 'Same Column! (Column 3)'
        },
        {
          label: 'Apply Column Rule: Shift 1 row down (wrap around)',
          formula: 'NewRow = (OldRow + 1) mod 5',
          substitution: 'B (1,3) -> I/J (2,3); A (0,3) -> B (1,3)',
          result: 'Digraph "BA" encrypts to "IB" (or "JB")'
        }
      ],
      finalAnswer: 'Ciphertext digraph: "IB" (or "JB")',
      checkVerification: 'Decryption reverses the shift: shift 1 row up -> I/J becomes B, B becomes A. Restores "BA". Verified.'
    }
  },
  {
    id: 'playfair-compare',
    kind: 'compare',
    title: 'Playfair vs Caesar vs Hill',
    subtitle: 'From Unigram to Digram to Matrix Block Substitution',
    caption: 'Playfair expands alphabet combinations to 676 digraphs, flattening unigram frequencies significantly.',
    eli5Caption: 'Caesar is 1 letter, Playfair is 2 letters, Hill is matrix algebra on multiple letters.',
    speakerNotes: {
      script: 'Highlight the difference in key size and vulnerability. Playfair resisted analysis for decades until digraph frequency tables were compiled.',
      likelyQuestions: [
        {
          question: 'Can Playfair be broken with frequency analysis?',
          answer: 'Yes, but it requires digram frequency analysis, which needs roughly 100 to 200 letters of ciphertext instead of 25 for monoalphabetic.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Playfair Cipher (Digraphic)',
      rightTitle: 'Caesar Cipher (Unigraphic)',
      differences: [
        { feature: 'Block Size', left: '2 characters (digraph)', right: '1 character (unigram)', diffTone: 'signal' },
        { feature: 'Alphabet Space', left: '25 letters (I/J merged)', right: '26 letters', diffTone: 'info' },
        { feature: 'Symbol Space', left: '25 × 25 = 625 digraphs', right: '26 unigrams', diffTone: 'ok' },
        { feature: 'Frequency Resistance', left: 'Flattens single-letter frequency', right: 'Completely reveals letter frequency', diffTone: 'ok' },
        { feature: 'Reverse Symmetry', left: 'If AB -> XY, then BA -> YX', right: 'Direct shift invariance', diffTone: 'warn' }
      ],
      summaryTakeaway: 'Playfair hides unigram frequency but leaks digram patterns due to reversible corner properties.'
    }
  },
  {
    id: 'playfair-exam',
    kind: 'exam-words',
    title: 'Exam Words: Playfair Digraphic Cipher',
    subtitle: 'Standard 5-Mark Question Definitions & Rules',
    caption: 'Recall the 5x5 key matrix structure, filler X rule, and the three positional transformation rules.',
    eli5Caption: 'The three rules: row right, column down, rectangle opposite horizontal corners.',
    speakerNotes: {
      script: 'State the three rules clearly on the board. Make sure students know identical consecutive letters must be split with X.',
      likelyQuestions: [
        {
          question: 'What is the most common student mistake?',
          answer: 'Forgetting to split repeated letters like "BALLOON" into "BA LX LO ON" before applying the rules.'
        }
      ]
    },
    examWords: {
      term: 'Playfair Digraphic Substitution Cipher',
      definition: 'A polygraphic substitution cipher that encrypts pairs of letters (digraphs) using a 5×5 key matrix constructed from a secret keyword, merging I and J into one cell. It transforms plaintext digraphs according to three geometric rules: same row (shift right), same column (shift down), and rectangle (swap columns).',
      keywords: [
        'Digraph Substitution',
        '5×5 Key Matrix (I/J merged)',
        'Filler letter X',
        'Same Row / Same Column / Rectangle Rules',
        'Digram Frequency Resistance'
      ],
      mustRememberPoints: [
        'Repeated letters in a pair (e.g. "EE") must be separated by inserting a filler letter (typically "X").',
        'In the rectangle rule, replace each letter with the one in its own row but in the column of the other letter.',
        'Playfair preserves reverse symmetry: if digraph AB encrypts to XY, then BA always encrypts to YX.'
      ],
      typicalMarks: 5
    }
  }
]

export const playfairPresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'playfair',
  topicTitle: 'Playfair Digraphic Cipher',
  targetDurationMinutes: 10,
  plates: playfairPlates
}
