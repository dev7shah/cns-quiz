export type Topic = 'crypto' | 'auth' | 'attacks' | 'firewall' | 'ids' | 'tls' | 'ai' | 'cloud'
export type Round = 'rapid' | 'scenario' | 'image' | 'mixed'

export interface Question {
  id: string
  topic: Topic
  round: Round
  difficulty: 1 | 2 | 3
  prompt: string
  scenario?: string
  imageComponent?: string
  options: string[]
  answerIndex: number
  explanation: string
  timeLimitSec?: number
  tags: string[]
}

export interface Team {
  id: string
  name: string
  score: number
}

export interface QuizState {
  teams: Team[]
  rounds: Round[]
  queue: Question[]
  currentIndex: number
  phase: 'setup' | 'asking' | 'revealed' | 'finished'
  timeLeft: number
  paused: boolean
}

export interface ComplexityRow {
  algorithm: string
  time: string
  space: string
  meaning: string
  topic: Topic
}
