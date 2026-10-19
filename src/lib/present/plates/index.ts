import { TopicPresentation } from "@/lib/present/types"
import { caesarPresentation } from "./m1/caesar"
import { playfairPresentation } from "./m1/playfair"

const presentations: Record<string, TopicPresentation> = {
  'm1/caesar': caesarPresentation,
  'm1/playfair': playfairPresentation
}

export function getPresentation(moduleId: string, topicId: string): TopicPresentation | undefined {
  const key = `${moduleId.toLowerCase()}/${topicId.toLowerCase()}`
  if (presentations[key]) return presentations[key]

  // Fallback placeholder presentation for topics under construction
  return {
    moduleId,
    moduleTitle: moduleId.toUpperCase(),
    topicId,
    topicTitle: topicId.replace('-', ' ').toUpperCase(),
    targetDurationMinutes: 10,
    plates: [
      {
        id: `${topicId}-overview`,
        kind: 'concept',
        title: `${topicId.replace('-', ' ').toUpperCase()} Overview`,
        subtitle: 'Syllabus Topic in Progress',
        caption: 'This topic presentation plate shell is ready; full interactive figures scaling in Step 3.',
        speakerNotes: {
          script: `This topic is part of module ${moduleId.toUpperCase()}. The core concepts and animated figures are scheduled in the syllabus sequence.`,
          likelyQuestions: []
        }
      }
    ]
  }
}

export { caesarPresentation, playfairPresentation }
