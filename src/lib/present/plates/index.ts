import { TopicPresentation } from "@/lib/present/types"
import { principlesPresentation } from "./m1/principles"
import { osiArchitecturePresentation } from "./m1/osiArchitecture"
import { symmetricModelPresentation } from "./m1/symmetricModel"
import { caesarPresentation } from "./m1/caesar"
import { affinePresentation } from "./m1/affine"
import { playfairPresentation } from "./m1/playfair"
import { vigenerePresentation } from "./m1/vigenere"
import { hillPresentation } from "./m1/hill"
import { transpositionPresentation } from "./m1/transposition"
import { productCiphersPresentation } from "./m1/productCiphers"
import { cryptanalysisPresentation } from "./m1/cryptanalysis"

const presentations: Record<string, TopicPresentation> = {
  'm1/principles': principlesPresentation,
  'm1/osi-architecture': osiArchitecturePresentation,
  'm1/symmetric-model': symmetricModelPresentation,
  'm1/caesar': caesarPresentation,
  'm1/affine': affinePresentation,
  'm1/playfair': playfairPresentation,
  'm1/vigenere': vigenerePresentation,
  'm1/hill': hillPresentation,
  'm1/transposition': transpositionPresentation,
  'm1/product-ciphers': productCiphersPresentation,
  'm1/cryptanalysis': cryptanalysisPresentation
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

export {
  principlesPresentation,
  osiArchitecturePresentation,
  symmetricModelPresentation,
  caesarPresentation,
  affinePresentation,
  playfairPresentation,
  vigenerePresentation,
  hillPresentation,
  transpositionPresentation,
  productCiphersPresentation,
  cryptanalysisPresentation
}
