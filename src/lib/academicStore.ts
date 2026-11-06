import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface ModulePortionProgress {
  moduleId: string
  code: string
  title: string
  totalTopics: number
  completedUpTo: number // 1-based topic index completed in class (e.g. 5)
  unlockedUpTo: number  // all topics open (equal to totalTopics)
  coveredTopics?: number[] // 1-based topic indices marked as done by faculty
  lastUpdatedDate: string
  updatedBy: string
}

export type MilestoneType = 'exam' | 'assessment' | 'submission' | 'checkpoint'
export type MilestoneStatus = 'upcoming' | 'active' | 'completed'

export interface AcademicMilestone {
  id: string
  title: string
  code: string
  type: MilestoneType
  position: string       // e.g. "After Module 3", "After Module 6"
  date: string           // e.g. "2026-02-26"
  time: string           // e.g. "10:30 AM – 12:30 PM"
  venue: string          // e.g. "Room 402 & 403"
  maxMarks: number       // e.g. 20, 25
  syllabusCoverage: string
  guidelines: string
  status: MilestoneStatus
}

export interface StudentSubjectMarks {
  id: string
  rollNo: string
  studentName: string
  department: string // e.g. "Information Technology (INFT)" | "Computer Engineering (CMPN)"
  batch: string
  subjectCode: string // e.g. "CSC602"
  subjectName: string // e.g. "Cryptography & Network Security"
  inCharge: string    // e.g. "Prof. S. R. Raman"
  ise1: number        // out of 20
  fa1: number         // out of 25
  ise2: number        // out of 20
  ise3: number        // out of 20
  fa2: number         // out of 25
  termWork: number    // out of 25
  totalMarks: number  // out of 135
  percentage: number
  grade: string       // "O" | "A+" | "A" | "B+" | "B" | "C" | "F"
  status: "Distinction" | "First Class" | "Pass" | "Needs Improvement"
  feedback?: string
}

export interface SubjectItem {
  code: string
  name: string
  semester: string
  credits: number
  inCharge: string
  department: string
}

export const ACADEMIC_SUBJECTS: SubjectItem[] = [
  {
    code: "CSC602",
    name: "Cryptography & Network Security",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Prof. S. R. Raman",
    department: "Computer Engineering (CMPN)",
  },
  {
    code: "ITC601",
    name: "Database Management Systems & Warehousing",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Dr. Archana Belge",
    department: "Information Technology (INFT)",
  },
  {
    code: "CSC404",
    name: "Operating Systems & Virtualization",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Prof. Shiwani Gupta",
    department: "Computer Engineering (CMPN)",
  },
  {
    code: "ITC602",
    name: "Computer Networks & Protocol Architectures",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Dr. Kamal Shah",
    department: "Information Technology (INFT)",
  },
  {
    code: "ITC603",
    name: "Software Engineering & Agile Methodologies",
    semester: "Semester VI",
    credits: 3,
    inCharge: "Prof. V. K. Singh",
    department: "Information Technology (INFT)",
  },
  {
    code: "ITC504",
    name: "Web Programming & Full-Stack Applications",
    semester: "Semester VI",
    credits: 4,
    inCharge: "Prof. V. K. Singh",
    department: "Information Technology (INFT)",
  },
]

export const OTHER_SUBJECTS_DETAILS: Record<string, {
  syllabusHours: number
  description: string
  units: { code: string; title: string; desc: string; topics: string[] }[]
}> = {
  ITC601: {
    syllabusHours: 45,
    description: "Relational database modeling, SQL DDL/DML, functional dependencies, BCNF normalization, ACID transactions, and NoSQL warehousing.",
    units: [
      { code: "M1", title: "Introduction & Relational Model", desc: "Entity-Relationship (ER/EER) modeling, relational schema translation, and Relational Algebra operators.", topics: ["ER Diagrams", "Relational Algebra", "Tuple Calculus", "Integrity Constraints"] },
      { code: "M2", title: "Advanced SQL & Database Design", desc: "Complex nested queries, joins, triggers, assertions, stored procedures, and dynamic SQL.", topics: ["Subqueries & Joins", "Triggers & Views", "Stored Procedures", "Embedded SQL"] },
      { code: "M3", title: "Relational Design & Normalization", desc: "Functional dependencies, Armstrong's axioms, 1NF, 2NF, 3NF, BCNF, lossless join decomposition.", topics: ["Functional Dependency", "1NF to 3NF", "Boyce-Codd Normal Form", "Lossless Decomposition"] },
      { code: "M4", title: "Transaction Processing & Concurrency", desc: "ACID properties, serializability, lock-based protocols (2PL), deadlock prevention, and timestamp ordering.", topics: ["ACID Properties", "Two-Phase Locking (2PL)", "Deadlock Detection", "Timestamp Protocols"] },
      { code: "M5", title: "Crash Recovery Systems", desc: "Log-based recovery, write-ahead logging (WAL), checkpoints, ARIES algorithm, and shadow paging.", topics: ["Write-Ahead Logging", "Checkpoints", "ARIES Algorithm", "Shadow Paging"] },
      { code: "M6", title: "Data Warehousing & NoSQL", desc: "Star and snowflake dimensional schemas, ETL pipeline, OLAP cubes, MongoDB document storage, and CAP theorem.", topics: ["Star/Snowflake Schema", "OLAP Cubes", "MongoDB Document Store", "CAP Theorem"] }
    ]
  },
  CSC404: {
    syllabusHours: 45,
    description: "Operating system principles, kernel architecture, process scheduling, concurrency synchronization, virtual memory paging, and file systems.",
    units: [
      { code: "M1", title: "OS Architecture & Process Model", desc: "Monolithic vs microkernels, system calls, PCB structure, process state transitions, and context switching.", topics: ["Kernel Architecture", "Process Control Block (PCB)", "System Calls", "Context Switching"] },
      { code: "M2", title: "CPU Scheduling Algorithms", desc: "Preemptive vs non-preemptive algorithms: FCFS, SJF, Round Robin, Priority, and Multi-Level Feedback Queues.", topics: ["FCFS & SJF", "Round Robin (RR)", "Priority Scheduling", "Multilevel Queues"] },
      { code: "M3", title: "Process Synchronization & Deadlocks", desc: "Critical section problem, Peterson's algorithm, Semaphores, Monitors, Banker's algorithm for deadlock avoidance.", topics: ["Critical Section", "Counting Semaphores", "Dining Philosophers", "Banker's Algorithm"] },
      { code: "M4", title: "Memory Management & Paging", desc: "Contiguous allocation, paging, Page Table Base Register (PTBR), Translation Lookaside Buffer (TLB), and segmentation.", topics: ["Paging Hardware", "TLB Translation", "Segmentation", "Internal/External Frag"] },
      { code: "M5", title: "Virtual Memory & Page Replacement", desc: "Demand paging, page fault handling, FIFO, LRU, Optimal page replacement algorithms, and thrashing mitigation.", topics: ["Demand Paging", "FIFO vs LRU vs OPT", "Belady's Anomaly", "Thrashing & Working Set"] },
      { code: "M6", title: "Storage & File Systems", desc: "Disk scheduling (SSTF, SCAN, C-SCAN), inode structure, file allocation methods (contiguous, linked, indexed).", topics: ["Disk Scheduling", "Unix Inode Table", "File Allocation", "RAID Architectures"] }
    ]
  },
  ITC602: {
    syllabusHours: 45,
    description: "Computer network protocols, layered architecture, data link flow control, IP subnetting & CIDR, routing algorithms, and transport protocols.",
    units: [
      { code: "M1", title: "Network Reference Models & Physical Layer", desc: "OSI 7-layer model, TCP/IP 4-layer model, packet vs circuit switching, guided transmission media, and topologies.", topics: ["OSI 7-Layer", "TCP/IP Suite", "Packet Switching", "Transmission Media"] },
      { code: "M2", title: "Data Link Layer & MAC Protocols", desc: "Framing, error detection (CRC-32, Checksum), flow control (Stop-and-Wait, Go-Back-N, Selective Repeat), CSMA/CD.", topics: ["CRC-32 Calculation", "Go-Back-N vs SR", "Sliding Window", "Ethernet CSMA/CD"] },
      { code: "M3", title: "Network Layer & IP Subnetting", desc: "IPv4 addressing, Classless Inter-Domain Routing (CIDR), Variable Length Subnet Masking (VLSM), IPv6 header, ARP/RARP.", topics: ["CIDR Subnet Math", "VLSM Allocation", "IPv4 vs IPv6 Header", "ARP Protocol"] },
      { code: "M4", title: "Routing Protocols & Algorithms", desc: "Intra-domain vs inter-domain routing: Dijkstra's Link-State (OSPF), Bellman-Ford Distance Vector (RIP), and BGP.", topics: ["Dijkstra Shortest Path", "Bellman-Ford & Count-to-Inf", "OSPF Areas", "BGP Path Vector"] },
      { code: "M5", title: "Transport Layer: TCP & UDP", desc: "3-way handshake, connection teardown, TCP sliding window, flow control, and congestion control (AIMD, Slow Start).", topics: ["TCP 3-Way Handshake", "TCP vs UDP", "AIMD Congestion", "Fast Retransmit"] },
      { code: "M6", title: "Application Layer Services", desc: "Domain Name System (DNS) resolution, HTTP/1.1 vs HTTP/2, SMTP/IMAP email transfer, FTP, and DHCP dynamic allocation.", topics: ["DNS Hierarchy", "HTTP/2 Multiplexing", "SMTP & MIME", "DHCP DORA Flow"] }
    ]
  },
  ITC603: {
    syllabusHours: 40,
    description: "Software engineering methodologies, Agile Scrum, requirements modeling, design patterns, testing techniques, and CI/CD pipelines.",
    units: [
      { code: "M1", title: "Software Process Models", desc: "Waterfall, Incremental, Spiral, Agile Scrum framework (Sprints, Standups, Retrospectives), and Kanban boards.", topics: ["Waterfall vs Agile", "Scrum Framework", "User Stories", "Kanban Workflows"] },
      { code: "M2", title: "Requirements Engineering", desc: "Functional vs non-functional requirements, SRS document IEEE standard, use case modeling, and feasibility analysis.", topics: ["IEEE SRS Standard", "Use Case Diagrams", "Feasibility Study", "Requirement Traceability"] },
      { code: "M3", title: "Software Architecture & Design", desc: "Coupling and cohesion metrics, architectural styles (MVC, Microservices, Event-Driven), and GoF design patterns.", topics: ["Coupling & Cohesion", "MVC Architecture", "Microservices", "Design Patterns (GoF)"] },
      { code: "M4", title: "Software Testing & QA", desc: "Black-box testing (Equivalence Partitioning, BVA), White-box testing (Basis Path, Cyclomatic Complexity), unit & integration.", topics: ["Equivalence Partitioning", "Cyclomatic Complexity", "Basis Path Testing", "Unit vs Integration"] },
      { code: "M5", title: "Project Estimation & Risk", desc: "COCOMO I & II cost estimation, Function Point analysis, risk management matrix, and Gantt charts.", topics: ["COCOMO Estimation", "Function Points", "Risk Matrix", "Critical Path Method"] },
      { code: "M6", title: "DevOps & Quality Standards", desc: "Git workflows, CI/CD automated test pipelines, CMMI maturity levels, and ISO 9001 software quality benchmarks.", topics: ["Git Branching Flow", "CI/CD Pipelines", "CMMI Levels 1-5", "Software Maintenance"] }
    ]
  }
}

export const INITIAL_MODULE_PROGRESS: Record<string, ModulePortionProgress> = {
  m1: {
    moduleId: "m1",
    code: "M1",
    title: "Introduction & Classical Cryptography",
    totalTopics: 11,
    completedUpTo: 5, // Faculty covered up to Part 5 (Playfair)
    unlockedUpTo: 11, // All topics open for self-study
    lastUpdatedDate: "2026-02-18",
    updatedBy: "Prof. S. R. Raman",
  },
  m2: {
    moduleId: "m2",
    code: "M2",
    title: "Block Ciphers & Public Key Cryptography",
    totalTopics: 12,
    completedUpTo: 3,
    unlockedUpTo: 12,
    lastUpdatedDate: "2026-02-18",
    updatedBy: "Prof. S. R. Raman",
  },
  m3: {
    moduleId: "m3",
    code: "M3",
    title: "Cryptographic Hashes & Digital Signatures",
    totalTopics: 9,
    completedUpTo: 2,
    unlockedUpTo: 9,
    lastUpdatedDate: "2026-02-17",
    updatedBy: "Prof. S. R. Raman",
  },
  m4: {
    moduleId: "m4",
    code: "M4",
    title: "Protection of Computing Resources & System Security",
    totalTopics: 8,
    completedUpTo: 0,
    unlockedUpTo: 8,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
  m5: {
    moduleId: "m5",
    code: "M5",
    title: "Network Security & Defense",
    totalTopics: 9,
    completedUpTo: 0,
    unlockedUpTo: 9,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
  m6: {
    moduleId: "m6",
    code: "M6",
    title: "Network Security Applications & Emerging Threats",
    totalTopics: 8,
    completedUpTo: 0,
    unlockedUpTo: 8,
    lastUpdatedDate: "2026-02-10",
    updatedBy: "Prof. S. R. Raman",
  },
  'wp-m1': {
    moduleId: 'wp-m1',
    code: 'M1',
    title: 'Web Technology Fundamentals, HTML5 and CSS3',
    totalTopics: 5,
    completedUpTo: 4,
    unlockedUpTo: 5,
    lastUpdatedDate: '2026-02-20',
    updatedBy: 'Prof. V. K. Singh',
  },
  'wp-m2': {
    moduleId: 'wp-m2',
    code: 'M2',
    title: 'JavaScript and Modern Client-Side Programming',
    totalTopics: 4,
    completedUpTo: 3,
    unlockedUpTo: 4,
    lastUpdatedDate: '2026-02-20',
    updatedBy: 'Prof. V. K. Singh',
  },
  'wp-m3': {
    moduleId: 'wp-m3',
    code: 'M3',
    title: 'Frontend Development with React and Next.js',
    totalTopics: 4,
    completedUpTo: 2,
    unlockedUpTo: 4,
    lastUpdatedDate: '2026-02-18',
    updatedBy: 'Prof. V. K. Singh',
  },
  'wp-m4': {
    moduleId: 'wp-m4',
    code: 'M4',
    title: 'Server-Side Programming: Node.js and Express.js',
    totalTopics: 3,
    completedUpTo: 1,
    unlockedUpTo: 3,
    lastUpdatedDate: '2026-02-15',
    updatedBy: 'Prof. V. K. Singh',
  },
  'wp-m5': {
    moduleId: 'wp-m5',
    code: 'M5',
    title: 'Server-Side Programming: PHP and MySQL',
    totalTopics: 4,
    completedUpTo: 0,
    unlockedUpTo: 4,
    lastUpdatedDate: '2026-02-12',
    updatedBy: 'Prof. V. K. Singh',
  },
  'wp-m6': {
    moduleId: 'wp-m6',
    code: 'M6',
    title: 'Full-Stack Architecture, Deployment & Web Security',
    totalTopics: 3,
    completedUpTo: 0,
    unlockedUpTo: 3,
    lastUpdatedDate: '2026-02-12',
    updatedBy: 'Prof. V. K. Singh',
  },
}

export const INITIAL_MILESTONES: AcademicMilestone[] = [
  {
    id: "m-ise1",
    title: "In-Semester Evaluation 1 (ISE 1)",
    code: "ISE 1",
    type: "exam",
    position: "After Module 3",
    date: "2026-02-26",
    time: "10:30 AM – 12:30 PM",
    venue: "Main Exam Hall 401 & 402",
    maxMarks: 20,
    syllabusCoverage: "Modules 1, 2, and 3 (Classical Ciphers, Block Ciphers, Hashes & Signatures)",
    guidelines: "Descriptive 20-mark written test. Covers Bloom Levels L1 to L3. Compulsory for continuous evaluation.",
    status: "upcoming",
  },
  {
    id: "m-fa1",
    title: "Formative Assessment 1 (FA 1)",
    code: "FA 1",
    type: "assessment",
    position: "After ISE 1",
    date: "2026-03-06",
    time: "02:00 PM – 05:00 PM",
    venue: "Network Security Lab 304",
    maxMarks: 25,
    syllabusCoverage: "Lab Experiments 1 to 4 (Classical Ciphers, DES, AES implementation)",
    guidelines: "Practical code execution, algorithm efficiency verification, and one-on-one technical viva.",
    status: "upcoming",
  },
  {
    id: "m-ise3",
    title: "Continuous Evaluation & Mini-Project (ISE 3)",
    code: "ISE 3",
    type: "checkpoint",
    position: "After Module 6",
    date: "2026-04-02",
    time: "11:00 AM – 04:00 PM",
    venue: "Project Innovation Center",
    maxMarks: 20,
    syllabusCoverage: "Full Course Project (Modules 1 through 6 applied security)",
    guidelines: "Team security case study submission, Wireshark PCAP telemetry inspection, and prototype defense.",
    status: "upcoming",
  },
  {
    id: "m-ise2",
    title: "In-Semester Evaluation 2 (ISE 2)",
    code: "ISE 2",
    type: "exam",
    position: "After ISE 3",
    date: "2026-04-10",
    time: "10:30 AM – 12:30 PM",
    venue: "Main Exam Hall 401 & 402",
    maxMarks: 20,
    syllabusCoverage: "Modules 4, 5, and 6 (Computing Resources, Network Defense, IPsec & TLS)",
    guidelines: "Terminal written exam covering advanced protocols, attacks, and defense architectures.",
    status: "upcoming",
  },
  {
    id: "m-fa2",
    title: "Formative Assessment 2 (FA 2)",
    code: "FA 2",
    type: "assessment",
    position: "After ISE 2",
    date: "2026-04-17",
    time: "02:00 PM – 05:00 PM",
    venue: "Network Security Lab 304",
    maxMarks: 25,
    syllabusCoverage: "Lab Experiments 5 to 8 (Firewalls, Snort IDS, IPsec VPN, Kerberos)",
    guidelines: "Live firewall packet filtering configuration and terminal oral examination.",
    status: "upcoming",
  },
  {
    id: "m-termwork",
    title: "Term Work (TW) & Journal Final Sign-Off",
    code: "TW",
    type: "submission",
    position: "Semester Final Submission",
    date: "2026-04-24",
    time: "05:00 PM Strict Deadline",
    venue: "Department Office / Faculty Cabin",
    maxMarks: 25,
    syllabusCoverage: "Complete Lab Journal (All 8 Experiments) + Continuous Evaluation Rubric",
    guidelines: "Certified lab manual submission stamped by faculty course in-charge and HOD.",
    status: "upcoming",
  },
  {
    id: "m-ese",
    title: "End Semester Examination (ESE)",
    code: "ESE",
    type: "exam",
    position: "University Final Exam",
    date: "2026-05-08",
    time: "10:30 AM – 01:30 PM",
    venue: "Autonomous Exam Wing · Halls 401–406",
    maxMarks: 60,
    syllabusCoverage: "Complete University Syllabus (Modules 1 to 6 across all courses)",
    guidelines: "Official autonomous end-semester theory examination. Covers Bloom Levels L1 to L4. Hall ticket and TCET student ID mandatory.",
    status: "upcoming",
  },
]

function computeGradeAndStatus(total: number, max: number): {
  percentage: number
  grade: string
  status: "Distinction" | "First Class" | "Pass" | "Needs Improvement"
} {
  const percentage = Math.round((total / max) * 100)
  let grade = "F"
  let status: "Distinction" | "First Class" | "Pass" | "Needs Improvement" = "Needs Improvement"

  if (percentage >= 85) {
    grade = "O"
    status = "Distinction"
  } else if (percentage >= 75) {
    grade = "A+"
    status = "Distinction"
  } else if (percentage >= 65) {
    grade = "A"
    status = "First Class"
  } else if (percentage >= 55) {
    grade = "B+"
    status = "Pass"
  } else if (percentage >= 50) {
    grade = "B"
    status = "Pass"
  } else if (percentage >= 40) {
    grade = "C"
    status = "Pass"
  }

  return { percentage, grade, status }
}

export function buildStudentMarks(
  rollNo: string,
  studentName: string,
  department: string,
  batch: string,
  subjectCode: string,
  subjectName: string,
  inCharge: string,
  marks: {
    ise1: number
    fa1: number
    ise2: number
    ise3: number
    fa2: number
    termWork: number
  },
  feedback?: string
): StudentSubjectMarks {
  const totalMarks = marks.ise1 + marks.fa1 + marks.ise2 + marks.ise3 + marks.fa2 + marks.termWork
  const { percentage, grade, status } = computeGradeAndStatus(totalMarks, 135)

  return {
    id: `${rollNo}-${subjectCode}`,
    rollNo,
    studentName,
    department,
    batch,
    subjectCode,
    subjectName,
    inCharge,
    ...marks,
    totalMarks,
    percentage,
    grade,
    status,
    feedback: feedback || "Consistent academic performance and active laboratory participation.",
  }
}

export const INITIAL_STUDENT_MARKS: StudentSubjectMarks[] = [
  // IT Student: Aarav Patel (21BIT015)
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 18, fa1: 23, ise2: 17, ise3: 19, fa2: 24, termWork: 23 },
    "Strong understanding of classical ciphers and public key algorithms."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 18, fa2: 23, termWork: 24 },
    "Excellent query optimization and ER modeling skills."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 16, fa1: 22, ise2: 17, ise3: 18, fa2: 22, termWork: 22 },
    "Good grasp of process scheduling and deadlock recovery."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 17, fa1: 23, ise2: 18, ise3: 17, fa2: 23, termWork: 23 },
    "Proficient in packet sniffing and subnet allocation."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 19, fa1: 24, ise2: 19, ise3: 19, fa2: 24, termWork: 25 },
    "Exceptional sprint documentation and agile methodology execution."
  ),
  buildStudentMarks(
    "21BIT015",
    "Aarav Patel",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC504",
    "Web Programming & Full-Stack Applications",
    "Prof. V. K. Singh",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 },
    "Proficient in React component state, asynchronous Fetch flows, and Express REST APIs."
  ),

  // IT Student: Priya Sharma (21BIT028)
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 20, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 18, fa1: 23, ise2: 17, ise3: 18, fa2: 23, termWork: 23 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 19, fa1: 25, ise2: 19, ise3: 20, fa2: 24, termWork: 25 }
  ),
  buildStudentMarks(
    "21BIT028",
    "Priya Sharma",
    "Information Technology (INFT)",
    "Batch IT-A",
    "ITC504",
    "Web Programming & Full-Stack Applications",
    "Prof. V. K. Singh",
    { ise1: 20, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 },
    "Distinction grade in modern JavaScript ES6+, Flexbox/Grid design, and full-stack integration."
  ),

  // CMPN Student: Dev Shah (21BCP042)
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 19, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 },
    "Top performing student in classical ciphers, DES, AES and terminal lab challenges."
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 18, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 19, fa1: 24, ise2: 18, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 18, fa1: 24, ise2: 19, ise3: 19, fa2: 24, termWork: 24 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 20, fa1: 25, ise2: 19, ise3: 20, fa2: 25, termWork: 25 }
  ),
  buildStudentMarks(
    "21BCP042",
    "Dev Shah",
    "Computer Engineering (CMPN)",
    "Batch A1",
    "ITC504",
    "Web Programming & Full-Stack Applications",
    "Prof. V. K. Singh",
    { ise1: 20, fa1: 25, ise2: 20, ise3: 20, fa2: 25, termWork: 25 },
    "Outstanding mastery of React Hooks, Next.js App Router, and full-stack API architectures."
  ),

  // IT Student: Rohan Mehta (21BIT044)
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC602",
    "Cryptography & Network Security",
    "Prof. S. R. Raman",
    { ise1: 15, fa1: 20, ise2: 14, ise3: 16, fa2: 21, termWork: 21 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC601",
    "Database Management Systems & Warehousing",
    "Dr. Archana Belge",
    { ise1: 16, fa1: 21, ise2: 15, ise3: 17, fa2: 22, termWork: 22 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "CSC404",
    "Operating Systems & Virtualization",
    "Prof. Shiwani Gupta",
    { ise1: 14, fa1: 19, ise2: 15, ise3: 16, fa2: 20, termWork: 20 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC602",
    "Computer Networks & Protocol Architectures",
    "Dr. Kamal Shah",
    { ise1: 15, fa1: 20, ise2: 16, ise3: 16, fa2: 21, termWork: 21 }
  ),
  buildStudentMarks(
    "21BIT044",
    "Rohan Mehta",
    "Information Technology (INFT)",
    "Batch IT-B",
    "ITC603",
    "Software Engineering & Agile Methodologies",
    "Prof. V. K. Singh",
    { ise1: 17, fa1: 22, ise2: 16, ise3: 18, fa2: 22, termWork: 23 }
  ),
]

export interface AcademicStoreState {
  moduleProgress: Record<string, ModulePortionProgress>
  milestones: AcademicMilestone[]
  studentMarks: StudentSubjectMarks[]

  // Portion completion actions
  setPortionProgress: (
    moduleId: string,
    completedUpTo: number,
    unlockedUpTo?: number,
    updatedBy?: string
  ) => void
  toggleTopicCovered: (moduleId: string, topicIndex1Based: number, updatedBy?: string) => void

  isTopicCompleted: (moduleId: string, topicIndex1Based: number) => boolean
  isTopicUnlocked: (moduleId: string, topicIndex1Based: number) => boolean

  // Timeline & Milestones actions
  updateMilestone: (id: string, updates: Partial<AcademicMilestone>) => void
  resetMilestones: () => void

  // Marks upload & management actions
  updateStudentSubjectMarks: (
    rollNo: string,
    subjectCode: string,
    field: "ise1" | "fa1" | "ise2" | "ise3" | "fa2" | "termWork",
    value: number
  ) => void
  addStudentMarksRecord: (record: StudentSubjectMarks) => void
  getStudentMarksByRoll: (rollNo: string) => StudentSubjectMarks[]
  getMarksBySubject: (subjectCode: string) => StudentSubjectMarks[]
  resetAllMarks: () => void
}

const memoryStorage = (() => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  }
})()

const safeStorage = createJSONStorage(() =>
  typeof window !== "undefined" && window.localStorage ? window.localStorage : memoryStorage
)

export const useAcademicStore = create<AcademicStoreState>()(
  persist(
    (set, get) => ({
      moduleProgress: INITIAL_MODULE_PROGRESS,
      milestones: INITIAL_MILESTONES,
      studentMarks: INITIAL_STUDENT_MARKS,

      setPortionProgress: (moduleId, completedUpTo, _customUnlockedUpTo, updatedBy = "Faculty In-Charge") => {
        set((state) => {
          const current = state.moduleProgress[moduleId] || {
            moduleId,
            code: moduleId.toUpperCase(),
            title: moduleId,
            totalTopics: Math.max(6, completedUpTo),
            completedUpTo: 0,
            unlockedUpTo: Math.max(6, completedUpTo),
            coveredTopics: [],
            lastUpdatedDate: new Date().toISOString().split("T")[0],
            updatedBy,
          }

          const safeCompleted = Math.max(0, Math.min(current.totalTopics, completedUpTo))
          // Entire module is open for learning once course is active; faculty marks what has been covered
          const safeUnlocked = current.totalTopics
          const coveredTopics = Array.from({ length: safeCompleted }, (_, i) => i + 1)

          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                ...current,
                completedUpTo: safeCompleted,
                unlockedUpTo: safeUnlocked,
                coveredTopics,
                lastUpdatedDate: new Date().toISOString().split("T")[0],
                updatedBy,
              },
            },
          }
        })
      },

      toggleTopicCovered: (moduleId, topicIndex1Based, updatedBy = "Faculty In-Charge") => {
        set((state) => {
          const current = state.moduleProgress[moduleId] || {
            moduleId,
            code: moduleId.toUpperCase(),
            title: moduleId,
            totalTopics: Math.max(6, topicIndex1Based),
            completedUpTo: 0,
            unlockedUpTo: Math.max(6, topicIndex1Based),
            coveredTopics: [],
            lastUpdatedDate: new Date().toISOString().split("T")[0],
            updatedBy,
          }

          const currentCovered = current.coveredTopics
            ? [...current.coveredTopics]
            : Array.from({ length: current.completedUpTo }, (_, i) => i + 1)

          const exists = currentCovered.includes(topicIndex1Based)
          const newCovered = exists
            ? currentCovered.filter((id) => id !== topicIndex1Based)
            : [...currentCovered, topicIndex1Based].sort((a, b) => a - b)

          const newCompletedUpTo = newCovered.length > 0 ? Math.max(...newCovered) : 0

          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                ...current,
                coveredTopics: newCovered,
                completedUpTo: newCompletedUpTo,
                unlockedUpTo: Math.max(current.totalTopics, newCompletedUpTo),
                lastUpdatedDate: new Date().toISOString().split("T")[0],
                updatedBy,
              },
            },
          }
        })
      },

      isTopicCompleted: (moduleId, topicIndex1Based) => {
        const prog = get().moduleProgress[moduleId]
        if (!prog) return false
        if (prog.coveredTopics && Array.isArray(prog.coveredTopics)) {
          return prog.coveredTopics.includes(topicIndex1Based)
        }
        return topicIndex1Based <= prog.completedUpTo
      },

      isTopicUnlocked: (_moduleId, _topicIndex1Based) => {
        // Entire module is open for self-study and student learning
        return true
      },

      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }))
      },

      resetMilestones: () => {
        set({ milestones: INITIAL_MILESTONES })
      },

      updateStudentSubjectMarks: (rollNo, subjectCode, field, value) => {
        set((state) => ({
          studentMarks: state.studentMarks.map((rec) => {
            if (
              rec.rollNo.toUpperCase() === rollNo.toUpperCase() &&
              rec.subjectCode.toUpperCase() === subjectCode.toUpperCase()
            ) {
              const updatedRec = { ...rec, [field]: Number(value) || 0 }
              const total =
                updatedRec.ise1 +
                updatedRec.fa1 +
                updatedRec.ise2 +
                updatedRec.ise3 +
                updatedRec.fa2 +
                updatedRec.termWork
              const { percentage, grade, status } = computeGradeAndStatus(total, 135)
              return {
                ...updatedRec,
                totalMarks: total,
                percentage,
                grade,
                status,
              }
            }
            return rec
          }),
        }))
      },

      addStudentMarksRecord: (record) => {
        set((state) => {
          const exists = state.studentMarks.findIndex(
            (r) =>
              r.rollNo.toUpperCase() === record.rollNo.toUpperCase() &&
              r.subjectCode.toUpperCase() === record.subjectCode.toUpperCase()
          )
          if (exists >= 0) {
            const copy = [...state.studentMarks]
            copy[exists] = record
            return { studentMarks: copy }
          }
          return { studentMarks: [...state.studentMarks, record] }
        })
      },

      getStudentMarksByRoll: (rollNo) => {
        const marks = get().studentMarks
        return marks.filter((m) => m.rollNo.toUpperCase() === rollNo.toUpperCase())
      },

      getMarksBySubject: (subjectCode) => {
        const marks = get().studentMarks
        return marks.filter((m) => m.subjectCode.toUpperCase() === subjectCode.toUpperCase())
      },

      resetAllMarks: () => {
        set({ studentMarks: INITIAL_STUDENT_MARKS })
      },
    }),
    {
      name: "tcet-academic-lms-store",
      storage: safeStorage,
    }
  )
)
