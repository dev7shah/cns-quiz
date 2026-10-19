import { describe, it, expect } from "vitest"
import { m1Questions, generateAffineVariation } from "@/lib/quiz/v2/questions/m1"
import { McqQuestion, NumericQuestion, OrderQuestion, MatchQuestion } from "@/lib/quiz/v2/types"

describe("Quiz v2 Engine & M1 Questions Unit Tests", () => {
  it("includes all 9 required question types", () => {
    const typesPresent = new Set(m1Questions.map(q => q.type))
    const expectedTypes = ['mcq', 'multi', 'numeric', 'order', 'match', 'label', 'spot', 'fill', 'tf-why']

    expectedTypes.forEach(t => {
      expect(typesPresent.has(t as McqQuestion['type'])).toBe(true)
    })
  })

  it("verifies Caesar keyspace MCQ question has valid answer", () => {
    const mcq = m1Questions.find(q => q.id === 'm1-mcq-caesar-keyspace') as McqQuestion
    expect(mcq).toBeDefined()
    expect(mcq.answerIndex).toBe(1)
    expect(mcq.options[mcq.answerIndex]).toContain("25 keys")
  })

  it("verifies Affine numeric question generator produces valid questions", () => {
    const numQ = m1Questions.find(q => q.id === 'm1-num-affine-coprime') as NumericQuestion
    expect(numQ).toBeDefined()
    expect(numQ.answer).toBe(12)

    const generated = generateAffineVariation()
    expect(generated.type).toBe('numeric')
    expect(typeof generated.answer).toBe('number')
    expect(generated.answer).toBeGreaterThan(0)
  })

  it("verifies Playfair ordering question has correct sequence", () => {
    const orderQ = m1Questions.find(q => q.id === 'm1-order-playfair-steps') as OrderQuestion
    expect(orderQ).toBeDefined()
    expect(orderQ.items.length).toBe(4)
    expect(orderQ.correctOrder).toEqual([0, 1, 2, 3])
  })

  it("verifies Match question has valid pairs", () => {
    const matchQ = m1Questions.find(q => q.id === 'm1-match-ciphers-keys') as MatchQuestion
    expect(matchQ).toBeDefined()
    expect(matchQ.pairs.length).toBe(4)
    expect(matchQ.pairs[0][0]).toBe("Caesar Cipher")
  })

  it("verifies every question has an explanation and Bloom level", () => {
    m1Questions.forEach(q => {
      expect(q.prompt).toBeTruthy()
      expect(q.explanation).toBeTruthy()
      expect(['L1', 'L2', 'L3', 'L4']).toContain(q.bloom)
      expect(q.module).toBe('M1')
    })
  })
})
