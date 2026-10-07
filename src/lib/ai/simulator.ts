/**
 * Simulates a simple AI Prompt Injection vulnerability.
 */
export function simulatePromptInjection(systemPrompt: string, userInput: string) {
  // A very basic keyword-based simulation of how an LLM might respond
  const lowerInput = userInput.toLowerCase()
  
  let response = ""
  let isExploited = false

  if (lowerInput.includes("ignore previous instructions") || lowerInput.includes("system prompt") || lowerInput.includes("you are now")) {
    isExploited = true
    response = "Okay, I will ignore my previous instructions. Here is the secret system data or malicious action you requested..."
  } else if (lowerInput.includes("password") || lowerInput.includes("secret")) {
    response = "I am sorry, but I cannot reveal my system secrets or passwords."
  } else {
    response = "I am a helpful customer service assistant. How can I help you with your order today?"
  }

  const finalContext = `SYSTEM: ${systemPrompt}\nUSER: ${userInput}`

  return { response, isExploited, finalContext }
}
