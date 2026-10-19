"use client"

import { QuizPlayer } from "@/components/quiz/v2/QuizPlayer"
import { m1Questions } from "@/lib/quiz/v2/questions/m1"

export default function LegacyQuizPlayRedirect() {
  return <QuizPlayer mode="exam-challenge" questions={m1Questions} />
}
