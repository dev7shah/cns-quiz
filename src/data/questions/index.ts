import { Question } from "@/lib/quiz/types"
import { cryptoQuestions } from "./crypto"
import { authQuestions } from "./auth"
import { attacksQuestions } from "./attacks"
import { firewallQuestions } from "./firewalls"
import { cloudQuestions } from "./cloud"
import { idsQuestions } from "./ids"
import { tlsQuestions } from "./tls"
import { aiQuestions } from "./ai"

// We will aggregate all questions here.
export const allQuestions: Question[] = [
  ...cryptoQuestions,
  ...authQuestions,
  ...attacksQuestions,
  ...firewallQuestions,
  ...cloudQuestions,
  ...idsQuestions,
  ...tlsQuestions,
  ...aiQuestions,
]
