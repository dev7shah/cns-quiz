"use client"

import { QuizPlayer } from "@/components/quiz/v2/QuizPlayer"
import { allQuestions } from "@/lib/quiz/v2/questions"

export default function LegacyQuizPlayRedirect() {
  return <QuizPlayer mode="exam-challenge" questions={allQuestions} />
}
