import { notFound } from "next/navigation"
import { QuizModeId } from "@/lib/quiz/v2/types"
import { m1Questions } from "@/lib/quiz/v2/questions/m1"
import { QuizPlayer } from "@/components/quiz/v2/QuizPlayer"

export function generateStaticParams() {
  return [
    { mode: 'exam-challenge' },
    { mode: 'classroom' },
    { mode: 'numerical-lab' },
    { mode: 'diagram-quiz' },
    { mode: 'viva-mode' },
    { mode: 'self-test' }
  ]
}

export const instant = false

export default async function QuizPlayPage({
  params
}: {
  params: Promise<{ mode: string }>
}) {
  const { mode: modeParam } = await params
  const validModes: QuizModeId[] = [
    'exam-challenge',
    'classroom',
    'numerical-lab',
    'diagram-quiz',
    'viva-mode',
    'self-test'
  ]

  const mode = modeParam as QuizModeId
  if (!validModes.includes(mode)) {
    notFound()
  }

  // Filter or prioritize questions based on mode
  let filteredQuestions = [...m1Questions]
  if (mode === 'numerical-lab') {
    filteredQuestions = m1Questions.filter(q => q.type === 'numeric' || q.tags.includes('math'))
    if (filteredQuestions.length === 0) filteredQuestions = m1Questions
  } else if (mode === 'diagram-quiz') {
    filteredQuestions = m1Questions.filter(q => q.type === 'label' || q.type === 'order' || q.type === 'spot')
    if (filteredQuestions.length === 0) filteredQuestions = m1Questions
  }

  return <QuizPlayer mode={mode} questions={filteredQuestions} />
}
