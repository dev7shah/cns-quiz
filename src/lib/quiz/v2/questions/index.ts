import { Question } from "../types"
import { m1Questions } from "./m1"
import { m2Questions } from "./m2"

export { m1Questions } from "./m1"
export { m2Questions } from "./m2"

export const allQuestions: Question[] = [
  ...m1Questions,
  ...m2Questions
]

export function getQuestionsByModule(moduleCode: string): Question[] {
  return allQuestions.filter(q => q.module.toLowerCase() === moduleCode.toLowerCase())
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter(q => q.topicId.toLowerCase() === topicId.toLowerCase())
}
