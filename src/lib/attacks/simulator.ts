/**
 * Simulates a vulnerable SQL query execution.
 * We pretend there's a simple user table: [{id: 1, name: "admin", password: "123"}]
 * A safe query uses parameterized inputs. An unsafe one concatenates strings.
 */
export function simulateSQLi(usernameInput: string, passwordInput: string, isVulnerable: boolean) {
  const users = [
    { id: 1, username: "admin", password: "supersecretpassword123" },
    { id: 2, username: "alice", password: "alicepassword" }
  ]

  let queryExecuted = ""
  let isAuthenticated = false
  const error = null

  if (isVulnerable) {
    // Vulnerable string concatenation
    queryExecuted = `SELECT * FROM users WHERE username = '${usernameInput}' AND password = '${passwordInput}'`
    
    // Simple mock engine to parse basic SQLi payloads
    // E.g., if password is: ' OR '1'='1
    // The query becomes: SELECT ... WHERE username = 'admin' AND password = '' OR '1'='1'
    if (passwordInput.includes("' OR '1'='1") || usernameInput.includes("' OR '1'='1")) {
      isAuthenticated = true // The OR condition bypasses the check
    } else {
      // Normal check
      const user = users.find(u => u.username === usernameInput && u.password === passwordInput)
      isAuthenticated = !!user
    }
  } else {
    // Safe parameterized query
    queryExecuted = `SELECT * FROM users WHERE username = $1 AND password = $2`
    // Inputs are treated strictly as data, not executable code
    const user = users.find(u => u.username === usernameInput && u.password === passwordInput)
    isAuthenticated = !!user
  }

  return { queryExecuted, isAuthenticated, error }
}

/**
 * Simulates XSS (Cross-Site Scripting) by checking if the input contains a <script> tag.
 */
export function simulateXSS(input: string, sanitize: boolean) {
  let renderedOutput = input
  let isExploited = false

  if (sanitize) {
    // Basic sanitization replacing < and >
    renderedOutput = input.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  } else {
    // Vulnerable reflection
    if (input.toLowerCase().includes("<script>")) {
      isExploited = true
    }
  }

  return { renderedOutput, isExploited }
}
