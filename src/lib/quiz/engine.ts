import { QuizState, Question, Round, Team } from './types'

export type QuizAction =
  | { type: 'START'; payload: { teams: Team[]; rounds: Round[]; queue: Question[] } }
  | { type: 'NEXT' }
  | { type: 'REVEAL' }
  | { type: 'AWARD'; payload: { teamId: string; points: number } }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'FINISH' }

export const initialQuizState: QuizState = {
  teams: [],
  rounds: [],
  queue: [],
  currentIndex: 0,
  phase: 'setup',
  timeLeft: 0,
  paused: false,
}

// Pure reducer function for the quiz engine
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START': {
      const firstQuestion = action.payload.queue[0]
      return {
        ...state,
        phase: 'asking',
        teams: action.payload.teams,
        rounds: action.payload.rounds,
        queue: action.payload.queue,
        currentIndex: 0,
        timeLeft: firstQuestion?.timeLimitSec || 15,
        paused: false,
      }
    }
    case 'NEXT': {
      if (state.phase !== 'revealed') return state
      if (state.currentIndex >= state.queue.length - 1) {
        return { ...state, phase: 'finished' }
      }
      const nextIndex = state.currentIndex + 1
      const nextQuestion = state.queue[nextIndex]
      return {
        ...state,
        phase: 'asking',
        currentIndex: nextIndex,
        timeLeft: nextQuestion?.timeLimitSec || 15,
        paused: false,
      }
    }
    case 'REVEAL': {
      if (state.phase !== 'asking') return state
      return {
        ...state,
        phase: 'revealed',
        timeLeft: 0,
        paused: true,
      }
    }
    case 'AWARD': {
      if (state.phase !== 'revealed') return state
      return {
        ...state,
        teams: state.teams.map((t) =>
          t.id === action.payload.teamId
            ? { ...t, score: t.score + action.payload.points }
            : t
        ),
      }
    }
    case 'TICK': {
      if (state.paused || state.phase !== 'asking') return state
      const newTimeLeft = Math.max(0, state.timeLeft - 1)
      if (newTimeLeft === 0) {
        // Auto-reveal on timeout
        return {
          ...state,
          phase: 'revealed',
          timeLeft: 0,
          paused: true,
        }
      }
      return {
        ...state,
        timeLeft: newTimeLeft,
      }
    }
    case 'PAUSE': {
      if (state.phase !== 'asking') return state
      return {
        ...state,
        paused: !state.paused,
      }
    }
    case 'FINISH': {
      return { ...state, phase: 'finished' }
    }
    default:
      return state
  }
}
