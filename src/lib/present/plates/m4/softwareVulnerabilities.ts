import { Plate, TopicPresentation } from "@/lib/present/types"

export const softwareVulnerabilitiesPlates: Plate[] = [
  // 1. Hook: Smashing the Stack
  {
    id: 'vuln-hook',
    kind: 'hook',
    title: 'Smashing the Stack for Fun and Profit',
    subtitle: 'From Unchecked C Buffers to Root Control (Aleph One 1996)',
    caption: 'In C, strings are raw byte arrays without boundary checks. Supplying more data than a buffer can hold overwrites the CPU return address, diverting program execution to malicious shellcode.',
    eli5Caption: 'Writing past the edge of the notebook line until you accidentally erase and rewrite the teacher’s next instruction.',
    speakerNotes: {
      script: 'Start with Aleph One’s landmark 1996 Phrack article: "Smashing the Stack for Fun and Profit". Functions like strcpy(), gets(), and sprintf() in C do not check destination array bounds. If an attacker inputs 80 bytes into a 64-byte buffer, the extra 16 bytes overwrite the stack frame pointer and return instruction pointer (EIP), hijacking the program.',
      likelyQuestions: [
        {
          question: 'Why does C not check array bounds automatically?',
          answer: 'C was designed in 1972 for low-level operating system performance on microcomputers; boundary checking instructions were omitted to minimize CPU cycle overhead.'
        }
      ]
    }
  },

  // 2. Process: The x86/x64 Stack Frame Anatomy
  {
    id: 'vuln-stack-layout',
    kind: 'process',
    title: 'The Architecture of a Stack Frame',
    subtitle: 'Memory Layout from High to Low Addresses',
    caption: 'The call stack grows downward from high to low memory. Local buffers sit below the Saved Frame Pointer (EBP) and Saved Return Address (EIP).',
    eli5Caption: 'A stack of dinner plates where your workspace is on top; write too much and it spills onto the control plate beneath.',
    customFigure: 'StackDiagram',
    speakerNotes: {
      script: 'Walk students through the stack frame from top to bottom: 1. Function arguments pushed by caller. 2. Return Address (EIP) pushed by CALL instruction. 3. Saved Frame Pointer (EBP). 4. Stack Canary (StackGuard). 5. Local variables and character buffers. Notice: buffers write upward toward higher memory, straight into the saved EIP!',
      likelyQuestions: [
        {
          question: 'Which direction does the stack grow, and which direction does buffer writing proceed?',
          answer: 'The stack grows downward toward lower memory addresses; string copying writes upward toward higher memory addresses. This directional mismatch is what enables buffer overflows.'
        }
      ]
    }
  },

  // 3. Attack & Defense: Stack Smashing vs Modern Defenses
  {
    id: 'vuln-attack-defense',
    kind: 'attack-defense',
    title: 'Vulnerability Spotlight: Stack Smashing & Defense Trio',
    subtitle: 'Shellcode Injection vs Canaries, DEP/NX, and ASLR',
    caption: 'Traditional shellcode execution is neutralized by three interlocking OS and compiler defenses: Stack Canaries, Non-Executable Stacks (DEP/NX), and ASLR.',
    eli5Caption: 'A tripwire canary that sounds an alarm, a bulletproof vest preventing execution on the stack, and a moving target that randomizes memory locations.',
    attackDefense: {
      attackName: 'Classic Stack Buffer Overflow & Control Flow Hijack',
      normalFlowDescription: 'Function allocates local buffer, reads user input safely via fgets(), restores saved EBP, and returns to caller via saved EIP.',
      attackFlowDescription: 'Attacker supplies NOP sled + shellcode + repeated address of buffer. Buffer overflows, overwriting saved EIP to point to the shellcode.',
      defenseFlowDescription: '1. Stack Canary terminates via __stack_chk_fail(). 2. DEP/NX marks stack non-executable (SIGSEGV). 3. ASLR randomizes stack address so hardcoded pointers miss.'
    },
    speakerNotes: {
      script: 'Emphasize the Defense Trio: 1. Stack Canaries (placed before EBP; smashed canary triggers abort). 2. DEP/NX (Data Execution Prevention / No-Execute bit; marks stack pages non-executable, stopping shellcode). 3. ASLR (Address Space Layout Randomization; randomizes library and stack base addresses). Attackers bypassed DEP using ROP (Return-Oriented Programming).',
      likelyQuestions: [
        {
          question: 'What is ROP (Return-Oriented Programming)?',
          answer: 'When DEP blocks code execution on the stack, attackers chain together short existing code sequences ending in RET (called gadgets) from legitimate libraries like libc.'
        }
      ]
    }
  },

  // 4. Concept: Incomplete Mediation
  {
    id: 'vuln-incomplete-mediation',
    kind: 'concept',
    title: 'Incomplete Mediation & Client-Side Bypass',
    subtitle: 'The Architectural Flaw of Blind Trust',
    caption: 'Incomplete mediation occurs when an application accepts sensitive inputs from untrusted clients without validating them independently on the server.',
    eli5Caption: 'Checking tickets at the front door, but leaving the back window wide open.',
    customFigure: 'SequenceDiagram',
    speakerNotes: {
      script: 'Define Incomplete Mediation clearly: A system checks data at point A (e.g., client-side HTML5 form or JavaScript validator) but fails to mediate or check it again at point B (the server backend). An attacker using curl or an interception proxy simply modifies the price or quantity parameter in transit.',
      likelyQuestions: [
        {
          question: 'Give a real-world example of incomplete mediation.',
          answer: 'An e-commerce website that calculates total price on the client side: user tampers with the HTTP POST request to send price = -100, crediting money to their account.'
        }
      ]
    }
  },

  // 5. Worked Example: Buffer Overflow Offset Calculation
  {
    id: 'vuln-worked',
    kind: 'worked-example',
    title: 'Worked Example: Calculating EIP Overwrite Offset',
    subtitle: 'Determining the Exact Payload Length to Overwrite Return Address',
    caption: 'Calculating the byte distance from buffer start to the saved return address (EIP) on 32-bit x86 architecture.',
    eli5Caption: 'Calculating how many characters you need to type before your words start overwriting the steering wheel.',
    workedExample: {
      problem: 'A C function declares "char buffer[64];". On 32-bit x86, compiler allocates 64 bytes with 8-byte alignment padding, followed by 4-byte saved EBP and 4-byte return address EIP. Find the exact byte offset where the new return address must begin.',
      given: {
        'Declared Buffer': '64 bytes',
        'Compiler Word Alignment': '4 bytes (total local space = 68 bytes)',
        'Saved EBP Size': '4 bytes',
        'Saved EIP Size': '4 bytes',
        'Target': 'Overwrite EIP with 0x080484B6'
      },
      steps: [
        {
          label: 'Determine Local Buffer and Alignment Space',
          formula: 'Local_Allocation = round_up(Buffer_Size, Word_Size)',
          substitution: '64 bytes + 4 bytes alignment padding',
          result: '68 bytes',
          note: 'Compilers align stack frames to 4-byte or 16-byte boundaries.'
        },
        {
          label: 'Determine Distance to Overwrite Saved EBP',
          formula: 'Offset_EBP = Local_Allocation',
          substitution: '68 bytes of junk data (e.g. "A" * 68)',
          result: 'Bytes 0 to 67 fill buffer and alignment padding',
          note: 'Bytes 68 to 71 overwrite the Saved Frame Pointer (EBP).'
        },
        {
          label: 'Determine Offset to Reach Return Address (EIP)',
          formula: 'Offset_EIP = Local_Allocation + sizeof(Saved_EBP)',
          substitution: '68 bytes + 4 bytes = 72 bytes',
          result: 'Byte 72',
          note: 'The 4 bytes placed at offsets 72..75 overwrite the Saved Return Address.'
        },
        {
          label: 'Construct Exploit Payload Structure',
          formula: 'Payload = Junk(72 bytes) || Target_Address(4 bytes)',
          substitution: '"A" * 72 + "\\xb6\\x84\\x04\\x08" (Little-Endian)',
          result: 'Total payload length = 76 bytes',
          note: 'x86 stores addresses in Little-Endian byte order.'
        }
      ],
      finalAnswer: 'Return address begins exactly at byte offset 72; total payload required to overwrite EIP is 76 bytes.',
      checkVerification: 'Check: 68 bytes (local) + 4 bytes (EBP) = 72 bytes to reach EIP; 72 + 4 = 76 bytes total.'
    },
    speakerNotes: {
      script: 'Point out Little-Endian representation: Address 0x080484B6 is written in memory as \\xb6\\x84\\x04\\x08. If students write big-endian in an exam, remind them that x86 places the least significant byte at the lowest address.',
      likelyQuestions: []
    }
  },

  // 6. Exam Words
  {
    id: 'vuln-exam',
    kind: 'exam-words',
    title: 'University Exam Keywords & Key Takeaways',
    subtitle: 'High-Yield Marking Criteria for Software Vulnerabilities',
    caption: 'Core terminology, stack registers, and defense mechanisms for examinations.',
    eli5Caption: 'The exact terms required for maximum marks on memory vulnerability questions.',
    speakerNotes: {
      script: 'Review the key terms: Buffer Overflow, EBP (Base Pointer), EIP (Instruction Pointer), Shellcode, Stack Canary, DEP/NX, ASLR, Incomplete Mediation. A standard 10-mark question is: "Explain the stack frame layout during a buffer overflow and discuss three countermeasures."',
      likelyQuestions: [
        {
          question: 'What is a heap overflow and how does it differ from stack overflow?',
          answer: 'Heap overflow corrupts dynamic memory allocated via malloc(); instead of overwriting return addresses directly, it corrupts heap chunk metadata (vtable pointers, function pointers) to redirect execution.'
        }
      ]
    },
    examWords: {
      term: 'Stack-Based Buffer Overflow',
      definition: 'A software vulnerability occurring when a program writes more data to a stack-allocated buffer than the buffer can hold, corrupting adjacent stack data including the saved return address.',
      keywords: [
        'Stack Frame Layout',
        'Instruction Pointer (EIP / RIP)',
        'Frame Pointer (EBP / RBP)',
        'Stack Canary (StackGuard)',
        'Data Execution Prevention (DEP / NX)',
        'Address Space Layout Randomization (ASLR)',
        'Incomplete Mediation',
        'Shellcode Injection'
      ],
      mustRememberPoints: [
        'Buffers grow upward toward higher memory, allowing overflow data to overwrite the Saved Frame Pointer (EBP) and Return Address (EIP).',
        'Stack Canaries place a random secret value before the saved EBP; if altered upon function return, the runtime terminates via __stack_chk_fail().',
        'Incomplete mediation occurs when servers fail to independently validate inputs that were only mediated on the client side.'
      ],
      typicalMarks: 5
    }
  }
]

export const softwareVulnerabilitiesPresentation: TopicPresentation = {
  moduleId: 'm4',
  moduleTitle: 'Protection of Computing Resources and Security Features',
  topicId: 'software-vulnerabilities',
  topicTitle: 'Software Vulnerabilities & Buffer Overflow',
  targetDurationMinutes: 12,
  plates: softwareVulnerabilitiesPlates
}
