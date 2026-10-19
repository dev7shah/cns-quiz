import { Scene } from "@/components/scene/types"

export type PlateKind =
  | 'hook'
  | 'analogy'
  | 'concept'
  | 'process'
  | 'worked-example'
  | 'attack-defense'
  | 'compare'
  | 'ask-the-room'
  | 'exam-words'

export interface SpeakerNotes {
  script: string // 40-70 words first-person narration
  likelyQuestions: { question: string; answer: string }[]
}

export interface WorkedStep {
  label: string
  formula: string
  substitution?: string
  result: string
  note?: string
}

export interface WorkedExampleData {
  problem: string
  given: Record<string, string | number>
  steps: WorkedStep[]
  finalAnswer: string
  checkVerification: string
  generateAnother?: () => WorkedExampleData
}

export interface CompareDifference {
  feature: string
  left: string
  right: string
  diffTone?: 'signal' | 'ok' | 'bad' | 'info' | 'warn'
}

export interface ComparisonData {
  leftTitle: string
  rightTitle: string
  differences: CompareDifference[]
  summaryTakeaway: string
}

export interface AttackDefenseData {
  attackName: string
  normalFlowDescription: string
  attackFlowDescription: string
  defenseFlowDescription: string
  normalScene?: Scene
  attackScene?: Scene
  defenseScene?: Scene
}

export interface AskTheRoomData {
  question: string
  options: [string, string, string, string]
  correctIndex: number
  explanation: string
  replayStep?: number
  replayTopicId?: string
}

export interface ExamWordsData {
  term: string
  definition: string
  keywords: string[]
  mustRememberPoints: [string, string, string]
  typicalMarks: number
}

export interface Plate {
  id: string
  kind: PlateKind
  title: string
  subtitle?: string
  caption: string // max 18 words, plain words
  eli5Caption?: string // simpler analogy caption
  speakerNotes: SpeakerNotes
  
  // Custom content based on kind
  scene?: Scene
  workedExample?: WorkedExampleData
  comparison?: ComparisonData
  attackDefense?: AttackDefenseData
  askTheRoom?: AskTheRoomData
  examWords?: ExamWordsData

  // Custom figure or interactive component name if not using declarative scene
  customFigure?: string
  customFigureProps?: Record<string, unknown>
}

export interface TopicPresentation {
  moduleId: string
  moduleTitle: string
  topicId: string
  topicTitle: string
  targetDurationMinutes: number
  plates: Plate[]
}
