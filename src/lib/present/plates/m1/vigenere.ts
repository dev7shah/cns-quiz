import { Plate, TopicPresentation } from "@/lib/present/types"

export const vigenerePlates: Plate[] = [
  // 1. Hook
  {
    id: 'vigenere-hook',
    kind: 'hook',
    title: 'The Indecipherable Cipher ("Le Chiffre Indéchiffrable")',
    subtitle: 'From Blaise de Vigenère to Charles Babbage (1863)',
    caption: 'For over 300 years, Vigenère resisted cryptanalysis by using multiple Caesar shifts cyclically.',
    eli5Caption: 'The first cipher that made the same letter look different every time it appeared.',
    speakerNotes: {
      script: 'First described in 1553 by Giovan Battista Bellaso and later misattributed to Blaise de Vigenère, this polyalphabetic cipher was thought to be unbreakable for over three centuries until Charles Babbage and Friedrich Kasiski cracked it.',
      likelyQuestions: [
        {
          question: 'Why was it considered unbreakable for 300 years?',
          answer: 'Because traditional unigram frequency analysis failed: the letter "E" might encrypt to "R", then "W", then "K", completely flattening the English letter frequency spike.'
        }
      ]
    }
  },

  // 2. Analogy / Picture-it
  {
    id: 'vigenere-analogy',
    kind: 'analogy',
    title: 'The Rotating Carousel of Shift Wheels',
    subtitle: 'Keystream Streaming Beneath Plaintext',
    caption: 'Each letter of the repeating keyword acts as a distinct Caesar shift applied in turn.',
    eli5Caption: 'Line up the secret key word under the message again and again. Each letter of the key is a separate shift.',
    speakerNotes: {
      script: 'Picture a row of 26 different Caesar cipher wheels. As we read each plaintext letter, we advance to the next wheel specified by the corresponding letter of our repeating keyword.',
      likelyQuestions: [
        {
          question: 'What is the Tabula Recta?',
          answer: 'A 26x26 table consisting of the alphabet repeated 26 times, each row shifted left by one position compared to the previous row.'
        }
      ]
    }
  },

  // 3. Concept
  {
    id: 'vigenere-concept',
    kind: 'concept',
    title: 'Polyalphabetic Keystream Arithmetic',
    subtitle: 'C_i = (P_i + K_(i mod m)) mod 26',
    caption: 'Encryption is modular addition of characters with the repeating key string of length m.',
    eli5Caption: 'Add the letter number to the key letter number, mod 26. Reverse by subtracting the key letter.',
    speakerNotes: {
      script: 'Mathematically, Vigenère is modular addition between the plaintext stream and the periodic key stream: C_i = (P_i + K_i) mod 26. Decryption is P_i = (C_i - K_i + 26) mod 26.',
      likelyQuestions: [
        {
          question: 'What happens if the key length equals the message length and never repeats?',
          answer: 'That becomes the Vernam One-Time Pad (OTP), which Claude Shannon proved provides perfect secrecy!'
        }
      ]
    }
  },

  // 4. Worked Example
  {
    id: 'vigenere-worked',
    kind: 'worked-example',
    title: 'Worked Numerical: Encrypting "MICHIGAN" with Key "HACK"',
    subtitle: 'Keystream Alignment and Modular Addition',
    caption: 'Align repeating key "HACKHACK", convert characters to indices, add modulo 26.',
    eli5Caption: 'Write "MICHIGAN", write "HACKHACK" underneath, add matching letter numbers together.',
    speakerNotes: {
      script: 'Notice how the repeated letter "I" in MICHIGAN encrypts to different letters: the first I (index 8) + A(0) = I(8), whereas the second I(8) + A(0) = I(8). Show that different positions yield different substitutions.',
      likelyQuestions: [
        {
          question: 'Can identical plaintext words produce identical ciphertext words?',
          answer: 'Yes! If the identical word repeats at a distance that is an exact multiple of the keyword length, it will be encrypted by the exact same keystream characters. That is the basis of Kasiski examination!'
        }
      ]
    },
    workedExample: {
      problem: 'Encrypt plaintext "MICHIGAN" using Vigenère cipher with keyword "HACK".',
      given: {
        'Plaintext (P)': '"MICHIGAN"',
        'Keyword (K)': '"HACK"',
        'Key Length (m)': 4
      },
      steps: [
        {
          label: 'Align repeating keystream beneath plaintext',
          formula: 'Repeat K to match length of P',
          substitution: 'P: M  I  C  H  I  G  A  N\nK: H  A  C  K  H  A  C  K',
          result: 'Keystream aligned'
        },
        {
          label: 'Map plaintext and key characters to Z_26 indices',
          formula: 'A=0, ..., Z=25',
          substitution: 'P: [12, 8, 2, 7, 8, 6, 0, 13]\nK: [7, 0, 2, 10, 7, 0, 2, 10]',
          result: 'Plaintext & Key vectors'
        },
        {
          label: 'Apply modular addition C_i = (P_i + K_i) mod 26',
          formula: 'C_i = (P_i + K_i) mod 26',
          substitution: '(12+7)=19(T), (8+0)=8(I), (2+2)=4(E), (7+10)=17(R), (8+7)=15(P), (6+0)=6(G), (0+2)=2(C), (13+10)=23(X)',
          result: '[19, 8, 4, 17, 15, 6, 2, 23] -> "TIERPGCX"'
        }
      ],
      finalAnswer: 'Ciphertext C = "TIERPGCX"',
      checkVerification: 'Decryption: "TIERPGCX" - "HACKHACK" mod 26 = [19-7=12(M), 8-0=8(I), 4-2=2(C), 17-10=7(H), 15-7=8(I), 6-0=6(G), 2-2=0(A), 23-10=13(N)] -> "MICHIGAN". Verified.'
    }
  },

  // 5. Compare
  {
    id: 'vigenere-compare',
    kind: 'compare',
    title: 'Monoalphabetic vs Polyalphabetic Cryptanalysis',
    subtitle: 'From Flat Frequency Histograms to Kasiski Examination',
    caption: 'Monoalphabetic preserves single-letter spikes; Polyalphabetic flattens them, requiring IoC or Kasiski to crack.',
    eli5Caption: 'Caesar has one telltale spike for E; Vigenère spreads E over several letters, so you first find the key length.',
    speakerNotes: {
      script: 'Explain the two-phase attack on Vigenère: Phase 1: find the key length m using Kasiski examination or Index of Coincidence (IoC). Phase 2: slice the ciphertext into m independent Caesar streams and solve each by frequency analysis!',
      likelyQuestions: [
        {
          question: 'What is Index of Coincidence (IoC)?',
          answer: 'The probability that two randomly selected letters from a text are identical. For English text it is ~0.0667; for uniform random polyalphabetic it drops to ~0.0385.'
        }
      ]
    },
    comparison: {
      leftTitle: 'Polyalphabetic (Vigenère)',
      rightTitle: 'Monoalphabetic (Caesar)',
      differences: [
        { feature: 'Mapping Type', left: '1-to-many (one letter maps to multiple ciphers)', right: '1-to-1 invariant mapping', diffTone: 'signal' },
        { feature: 'Letter Frequency Spikes', left: 'Significantly flattened across alphabet', right: 'Exact English frequency profile preserved', diffTone: 'ok' },
        { feature: 'Primary Attack', left: 'Kasiski test + Index of Coincidence', right: 'Single-letter frequency matching', diffTone: 'warn' },
        { feature: 'Key Space', left: '26^m for keyword length m', right: '25 valid shifts', diffTone: 'ok' }
      ],
      summaryTakeaway: 'Polyalphabetic substitution conceals single-letter frequencies, but periodic repetitions leak key length.'
    }
  },

  // 6. Exam Words
  {
    id: 'vigenere-exam',
    kind: 'exam-words',
    title: 'Exam Words: Vigenère Cipher & Kasiski Examination',
    subtitle: 'Syllabus Keyword Reference for University Examinations',
    caption: 'Recall the polyalphabetic formula, Kasiski method for key length, and Index of Coincidence.',
    eli5Caption: 'The definition, formulas, and 3 key points for Vigenère exam questions.',
    speakerNotes: {
      script: 'Ensure students know the name of both cryptanalysis techniques: Kasiski examination (finding distances between repeated substrings) and Friedman’s Index of Coincidence.',
      likelyQuestions: [
        {
          question: 'What is the Kasiski method in one sentence?',
          answer: 'A method that identifies repeated ciphertext substrings, computes the distances between their occurrences, and takes the greatest common divisor of those distances to estimate the keyword length.'
        }
      ]
    },
    examWords: {
      term: 'Vigenère Polyalphabetic Cipher & Kasiski Test',
      definition: 'A polyalphabetic substitution cipher based on a repeating keyword of length m applied over the Tabula Recta: C_i = (P_i + K_(i mod m)) mod 26. It is cryptanalyzed via Kasiski examination, which measures distances between repeated ciphertext strings whose common divisors reveal keyword length m, and the Index of Coincidence (IoC).',
      keywords: [
        'Polyalphabetic Substitution',
        'Tabula Recta (26×26 Table)',
        'Repeating Keystream (mod m)',
        'Kasiski Examination (GCD of distances)',
        'Index of Coincidence (IoC ≈ 0.0667 vs 0.0385)'
      ],
      mustRememberPoints: [
        'Each plaintext letter can map to multiple different ciphertext letters depending on its positional index.',
        'If keyword length m is known, ciphertext can be divided into m separate Caesar ciphers and solved individually.',
        'If the key is truly random, never repeats, and equals message length, Vigenère becomes an unbreakable One-Time Pad (OTP).'
      ],
      typicalMarks: 5
    }
  }
]

export const vigenerePresentation: TopicPresentation = {
  moduleId: 'm1',
  moduleTitle: 'Introduction and Classical Cryptography',
  topicId: 'vigenere',
  topicTitle: 'Vigenère Polyalphabetic Cipher',
  targetDurationMinutes: 10,
  plates: vigenerePlates
}
