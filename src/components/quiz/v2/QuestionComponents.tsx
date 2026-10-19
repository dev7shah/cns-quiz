"use client"

import React, { useState } from "react"
import {
  McqQuestion,
  MultiQuestion,
  NumericQuestion,
  OrderQuestion,
  MatchQuestion,
  LabelQuestion,
  SpotQuestion,
  FillQuestion,
  TfWhyQuestion
} from "@/lib/quiz/v2/types"
import { ScenePlayer } from "@/components/scene/ScenePlayer"
import { caesarPresentation } from "@/lib/present/plates/m1/caesar"

// 1. MCQ Renderer: Ruled lines A-D, vermilion indicator on select, ink-stamp on reveal
export function McqRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer
}: {
  question: McqQuestion
  isRevealed: boolean
  onAnswerChange: (answer: number) => void
  userAnswer: number | null
}) {
  return (
    <div className="space-y-3 font-sans">
      {question.options.map((opt, idx) => {
        const isSelected = userAnswer === idx
        const isCorrect = idx === question.answerIndex

        let lineStyle = "border-rule bg-card hover:bg-paper"
        if (isSelected) {
          lineStyle = "border-ink bg-paper border-l-4 border-l-signal"
        }
        if (isRevealed) {
          if (isCorrect) {
            lineStyle = "border-ok bg-ok/10 border-l-4 border-l-ok"
          } else if (isSelected && !isCorrect) {
            lineStyle = "border-bad bg-bad/10 border-l-4 border-l-bad opacity-50"
          } else {
            lineStyle = "border-rule bg-paper opacity-40"
          }
        }

        return (
          <button
            key={idx}
            disabled={isRevealed}
            onClick={() => onAnswerChange(idx)}
            className={`w-full text-left p-4 border transition-all flex items-start justify-between relative cursor-pointer ${lineStyle}`}
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-ink-soft mt-0.5 shrink-0">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="text-sm text-ink leading-relaxed">{opt}</span>
            </div>

            {isRevealed && isCorrect && (
              <span className="font-mono text-xs uppercase px-2 py-0.5 border border-ok text-ok font-bold rotate-[-2deg] shrink-0 bg-paper">
                CORRECT ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// 2. MULTI Renderer: Checkbox lines
export function MultiRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = []
}: {
  question: MultiQuestion
  isRevealed: boolean
  onAnswerChange: (answer: number[]) => void
  userAnswer?: number[]
}) {
  const selected: number[] = Array.isArray(userAnswer) ? userAnswer : []

  const toggleOption = (idx: number) => {
    if (isRevealed) return
    if (selected.includes(idx)) {
      onAnswerChange(selected.filter(i => i !== idx))
    } else {
      onAnswerChange([...selected, idx].sort())
    }
  }

  return (
    <div className="space-y-3 font-sans">
      {question.options.map((opt, idx) => {
        const isSelected = selected.includes(idx)
        const isCorrect = question.answerIndexes.includes(idx)

        let lineStyle = isSelected ? "border-ink bg-paper border-l-4 border-l-signal" : "border-rule bg-card hover:bg-paper"
        if (isRevealed) {
          if (isCorrect) {
            lineStyle = "border-ok bg-ok/10 border-l-4 border-l-ok"
          } else if (isSelected && !isCorrect) {
            lineStyle = "border-bad bg-bad/10 border-l-4 border-l-bad opacity-50"
          } else {
            lineStyle = "border-rule bg-paper opacity-40"
          }
        }

        return (
          <button
            key={idx}
            disabled={isRevealed}
            onClick={() => toggleOption(idx)}
            className={`w-full text-left p-4 border transition-all flex items-start justify-between cursor-pointer ${lineStyle}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-4 h-4 border border-ink flex items-center justify-center shrink-0 mt-0.5">
                {isSelected && <span className="w-2 h-2 bg-signal" />}
              </div>
              <span className="font-mono text-xs font-bold text-ink-soft mt-0.5 shrink-0">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="text-sm text-ink leading-relaxed">{opt}</span>
            </div>

            {isRevealed && isCorrect && (
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-ok text-ok font-bold shrink-0">
                REQUIRED
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// 3. NUMERIC Renderer: Scratchpad, live Check feedback per-box, 3 hints, worked steps
export function NumericRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = ""
}: {
  question: NumericQuestion
  isRevealed: boolean
  onAnswerChange: (answer: string) => void
  userAnswer?: string
}) {
  const [hintLevel, setHintLevel] = useState(0)
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const handleCheck = () => {
    const val = parseFloat(userAnswer)
    const expected = typeof question.answer === 'number' ? question.answer : parseFloat(question.answer)
    const tol = question.tolerance || 0
    if (!isNaN(val) && Math.abs(val - expected) <= tol) {
      setCheckStatus('correct')
    } else {
      setCheckStatus('incorrect')
    }
  }

  return (
    <div className="space-y-6">
      {/* Given Parameters Card */}
      <div className="bg-paper p-4 border border-rule font-mono text-xs space-y-2">
        <span className="text-ink-soft uppercase text-[10px] font-bold block">Given Parameters:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(question.given).map(([k, v]) => (
            <div key={k} className="p-2 border border-rule bg-card">
              <span className="text-ink-soft text-[10px] block">{k}</span>
              <span className="text-ink font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Input Line */}
      <div className="space-y-2">
        <label className="font-mono text-xs uppercase tracking-wider text-ink-soft font-bold block">
          Calculated Value:
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            disabled={isRevealed}
            value={userAnswer ?? ""}
            onChange={e => {
              onAnswerChange(e.target.value)
              setCheckStatus('idle')
            }}
            placeholder="Enter numerical answer..."
            className="w-full sm:w-64 p-3 border border-ink bg-card font-mono text-base text-ink focus:outline-none focus:border-signal"
          />
          {question.unit && <span className="font-mono text-xs text-ink-soft">{question.unit}</span>}

          {!isRevealed && (
            <button
              onClick={handleCheck}
              className="px-4 py-3 bg-paper border border-ink font-mono text-xs uppercase hover:bg-rule"
            >
              Check Answer
            </button>
          )}
        </div>

        {checkStatus === 'correct' && (
          <div className="font-mono text-xs text-ok font-bold">✓ Value matches expected solution.</div>
        )}
        {checkStatus === 'incorrect' && (
          <div className="font-mono text-xs text-bad font-bold">✗ Incorrect value. Try another approach or use a hint.</div>
        )}
      </div>

      {/* 3-Level Hints */}
      {!isRevealed && (
        <div className="space-y-2 border-t border-rule pt-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">Need guidance?</span>
            <button
              onClick={() => setHintLevel(h => Math.min(h + 1, 3))}
              disabled={hintLevel >= 3}
              className="px-2.5 py-1 border border-rule font-mono text-xs hover:border-ink disabled:opacity-30 uppercase"
            >
              Hint ({hintLevel}/3) 💡
            </button>
          </div>

          {hintLevel >= 1 && (
            <div className="p-3 bg-card border border-rule font-sans text-xs text-ink">
              <strong>Hint 1:</strong> Identify the coprime condition or formula from number theory.
            </div>
          )}
          {hintLevel >= 2 && (
            <div className="p-3 bg-card border border-rule font-sans text-xs text-ink">
              <strong>Hint 2:</strong> {question.steps[0]}
            </div>
          )}
          {hintLevel >= 3 && (
            <div className="p-3 bg-card border border-rule font-sans text-xs text-ink">
              <strong>Hint 3:</strong> {question.steps[1]}
            </div>
          )}
        </div>
      )}

      {/* Worked Steps Revealed */}
      {isRevealed && (
        <div className="p-4 bg-paper border border-ok space-y-2">
          <div className="font-mono text-xs text-ok uppercase font-bold">Step-by-Step Derivation:</div>
          <div className="font-mono text-xs space-y-1.5 text-ink">
            {question.steps.map((st, i) => (
              <div key={i} className="p-1.5 bg-card border border-rule">
                {st}
              </div>
            ))}
          </div>
          <div className="font-mono text-sm font-bold text-ink border-t border-rule pt-2">
            Exact Answer: <span className="text-signal">{question.answer}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// 4. ORDER Renderer: Drag or Up/Down buttons to sort sequence
export function OrderRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer
}: {
  question: OrderQuestion
  isRevealed: boolean
  onAnswerChange: (answer: number[]) => void
  userAnswer?: number[]
}) {
  const currentOrder: number[] = userAnswer || question.items.map((_, i) => i)

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isRevealed) return
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return

    const copy = [...currentOrder]
    const temp = copy[index]
    copy[index] = copy[targetIndex]
    copy[targetIndex] = temp
    onAnswerChange(copy)
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="font-mono text-xs text-ink-soft uppercase tracking-wider mb-2">
        Reorder items into correct chronological sequence:
      </div>

      {currentOrder.map((itemIdx, pos) => {
        const itemText = question.items[itemIdx]
        const isPosCorrect = isRevealed && question.correctOrder[pos] === itemIdx

        return (
          <div
            key={itemIdx}
            className={`p-3.5 border flex items-center justify-between transition-all ${
              isRevealed
                ? isPosCorrect
                  ? "border-ok bg-ok/10"
                  : "border-bad bg-bad/10 opacity-70"
                : "border-rule bg-card"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-1 bg-paper border border-ink text-signal">
                {pos + 1}
              </span>
              <span className="text-sm text-ink">{itemText}</span>
            </div>

            {!isRevealed && (
              <div className="flex items-center gap-1 font-mono text-xs shrink-0">
                <button
                  disabled={pos === 0}
                  onClick={() => moveItem(pos, 'up')}
                  className="px-2 py-1 border border-rule bg-paper hover:bg-rule disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  disabled={pos === currentOrder.length - 1}
                  onClick={() => moveItem(pos, 'down')}
                  className="px-2 py-1 border border-rule bg-paper hover:bg-rule disabled:opacity-20"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// 5. MATCH Renderer: Interactive matching pairs
export function MatchRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = {}
}: {
  question: MatchQuestion
  isRevealed: boolean
  onAnswerChange: (answer: Record<string, string>) => void
  userAnswer?: Record<string, string>
}) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const matches: Record<string, string> = userAnswer || {}

  const leftItems = question.pairs.map(p => p[0])
  const rightItems = question.pairs.map(p => p[1])

  const handlePair = (right: string) => {
    if (isRevealed || !selectedLeft) return
    const updated = { ...matches, [selectedLeft]: right }
    onAnswerChange(updated)
    setSelectedLeft(null)
  }

  return (
    <div className="space-y-4">
      <div className="font-mono text-xs text-ink-soft uppercase tracking-wider">
        Click an item on the left, then click its corresponding match on the right:
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {leftItems.map((left, i) => {
            const isMatched = !!matches[left]
            const isSelected = selectedLeft === left

            return (
              <button
                key={i}
                disabled={isRevealed}
                onClick={() => setSelectedLeft(left)}
                className={`w-full text-left p-3 border font-mono text-xs transition-all ${
                  isSelected
                    ? "border-signal bg-paper font-bold shadow-[2px_2px_0_var(--signal)]"
                    : isMatched
                    ? "border-ink bg-paper"
                    : "border-rule bg-card hover:bg-paper"
                }`}
              >
                {left}
                {isMatched && <span className="text-signal block text-[10px] mt-1">↳ Matched</span>}
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {rightItems.map((right, i) => {
            const isMatched = Object.values(matches).includes(right)

            return (
              <button
                key={i}
                disabled={isRevealed || !selectedLeft}
                onClick={() => handlePair(right)}
                className={`w-full text-left p-3 border font-mono text-xs transition-all ${
                  isMatched
                    ? "border-ink bg-card opacity-80"
                    : selectedLeft
                    ? "border-signal/60 bg-paper hover:bg-rule"
                    : "border-rule bg-card opacity-50"
                }`}
              >
                {right}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 6. LABEL Renderer: Figure with numbered hotspots
export function LabelRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = {}
}: {
  question: LabelQuestion
  isRevealed: boolean
  onAnswerChange: (answer: Record<string, string>) => void
  userAnswer?: Record<string, string>
}) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const assignments: Record<string, string> = userAnswer || {}

  const handleAssign = (hotspotId: string) => {
    if (isRevealed || !selectedLabel) return
    onAnswerChange({ ...assignments, [hotspotId]: selectedLabel })
    setSelectedLabel(null)
  }

  return (
    <div className="space-y-4">
      {/* Diagram Canvas with Hotspots */}
      <div className="relative w-full h-64 bg-card border border-ink p-4 flex items-center justify-center">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <rect x="5" y="20" width="20" height="20" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.8" />
          <line x1="25" y1="30" x2="40" y2="30" stroke="var(--ink)" strokeWidth="0.8" />
          <rect x="40" y="20" width="20" height="20" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.8" />
          <line x1="60" y1="30" x2="75" y2="30" stroke="var(--ink)" strokeWidth="0.8" />
          <rect x="75" y="20" width="20" height="20" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.8" />
        </svg>

        {question.hotspots.map((hs, i) => {
          const assigned = assignments[hs.id]
          const isCorrect = isRevealed && assigned === hs.expected

          return (
            <button
              key={hs.id}
              onClick={() => handleAssign(hs.id)}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 border font-mono text-[10px] transition-all ${
                assigned
                  ? isRevealed
                    ? isCorrect
                      ? "bg-ok text-paper border-ok font-bold"
                      : "bg-bad text-paper border-bad"
                    : "bg-ink text-paper border-ink"
                  : selectedLabel
                  ? "bg-signal/20 border-signal border-dashed text-signal animate-pulse"
                  : "bg-paper border-rule text-ink-soft hover:border-ink"
              }`}
            >
              {assigned ? assigned : `Hotspot ${i + 1}`}
            </button>
          )
        })}
      </div>

      {/* Label Tray */}
      <div className="p-3 bg-paper border border-rule space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft font-bold block">
          Available Labels (Click a label, then click a hotspot above):
        </span>
        <div className="flex flex-wrap gap-2">
          {question.labels.map((lbl, idx) => {
            const isUsed = Object.values(assignments).includes(lbl)
            const isSelected = selectedLabel === lbl

            return (
              <button
                key={idx}
                disabled={isRevealed}
                onClick={() => setSelectedLabel(lbl)}
                className={`px-2.5 py-1 border font-mono text-xs transition-all ${
                  isSelected
                    ? "border-signal bg-signal text-paper font-bold"
                    : isUsed
                    ? "border-rule bg-card opacity-50"
                    : "border-ink bg-card hover:bg-paper"
                }`}
              >
                {lbl}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 7. SPOT Renderer: Embedded scene + choice options
export function SpotRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer
}: {
  question: SpotQuestion
  isRevealed: boolean
  onAnswerChange: (answer: number) => void
  userAnswer: number | null
}) {
  return (
    <div className="space-y-6">
      <div className="border border-ink bg-card p-2 shadow-[4px_4px_0_var(--rule)]">
        <ScenePlayer scene={caesarPresentation.plates[3].scene!} autoPlayIntervalMs={2000} />
      </div>

      <div className="space-y-3 font-sans">
        {question.options.map((opt, idx) => {
          const isSelected = userAnswer === idx
          const isCorrect = idx === question.answerIndex

          let lineStyle = isSelected ? "border-ink bg-paper border-l-4 border-l-signal" : "border-rule bg-card hover:bg-paper"
          if (isRevealed) {
            lineStyle = isCorrect
              ? "border-ok bg-ok/10 border-l-4 border-l-ok"
              : isSelected
              ? "border-bad bg-bad/10 opacity-50"
              : "border-rule bg-paper opacity-40"
          }

          return (
            <button
              key={idx}
              disabled={isRevealed}
              onClick={() => onAnswerChange(idx)}
              className={`w-full text-left p-4 border transition-all flex items-start gap-3 cursor-pointer ${lineStyle}`}
            >
              <span className="font-mono text-xs font-bold text-ink-soft mt-0.5">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="text-sm text-ink">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 8. FILL Renderer: In-sentence text inputs
export function FillRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = []
}: {
  question: FillQuestion
  isRevealed: boolean
  onAnswerChange: (answer: string[]) => void
  userAnswer?: string[]
}) {
  const values: string[] = Array.isArray(userAnswer) ? userAnswer : ["", ""]

  const updateBlank = (idx: number, val: string) => {
    if (isRevealed) return
    const copy = [...values]
    copy[idx] = val
    onAnswerChange(copy)
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-ink text-base sm:text-lg font-serif leading-loose text-ink">
        C = (19 + 5) mod 26 ={" "}
        <input
          type="text"
          disabled={isRevealed}
          value={values[0] || ""}
          onChange={e => updateBlank(0, e.target.value)}
          placeholder="b1"
          className="w-16 px-2 py-1 border border-ink bg-paper font-mono text-sm text-center mx-1 text-signal font-bold"
        />
        , which maps to the ciphertext letter{" "}
        <input
          type="text"
          disabled={isRevealed}
          value={values[1] || ""}
          onChange={e => updateBlank(1, e.target.value)}
          placeholder="b2"
          className="w-16 px-2 py-1 border border-ink bg-paper font-mono text-sm text-center mx-1 text-signal font-bold"
        />
        .
      </div>

      {isRevealed && (
        <div className="p-4 bg-paper border border-ok font-mono text-xs space-y-1">
          <div className="text-ok font-bold uppercase">Expected Values:</div>
          <div>Blank 1: {question.blanks[0]}</div>
          <div>Blank 2: {question.blanks[1]}</div>
        </div>
      )}
    </div>
  )
}

// 9. TF-WHY Renderer: Step 1 True/False, Step 2 Why rationale
export function TfWhyRenderer({
  question,
  isRevealed,
  onAnswerChange,
  userAnswer = { isTrue: null, whyIndex: null }
}: {
  question: TfWhyQuestion
  isRevealed: boolean
  onAnswerChange: (answer: { isTrue: boolean | null; whyIndex: number | null }) => void
  userAnswer?: { isTrue: boolean | null; whyIndex: number | null }
}) {
  const current = userAnswer || { isTrue: null, whyIndex: null }

  return (
    <div className="space-y-6 font-sans">
      <div className="p-5 bg-card border border-ink space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-soft font-bold">
          Statement to Evaluate:
        </span>
        <p className="font-serif text-lg text-ink italic leading-relaxed">
          &ldquo;{question.statement}&rdquo;
        </p>

        <div className="flex gap-4 pt-2">
          <button
            disabled={isRevealed}
            onClick={() => onAnswerChange({ ...current, isTrue: true })}
            className={`px-6 py-2.5 font-mono text-xs uppercase font-bold border transition-all ${
              current.isTrue === true
                ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--rule)]"
                : "bg-paper text-ink border-ink hover:bg-rule"
            }`}
          >
            True
          </button>
          <button
            disabled={isRevealed}
            onClick={() => onAnswerChange({ ...current, isTrue: false })}
            className={`px-6 py-2.5 font-mono text-xs uppercase font-bold border transition-all ${
              current.isTrue === false
                ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--rule)]"
                : "bg-paper text-ink border-ink hover:bg-rule"
            }`}
          >
            False
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-soft font-bold block">
          Select the Cryptographic Justification (&quot;Why?&quot;):
        </span>
        {question.whyOptions.map((opt, idx) => {
          const isSelected = current.whyIndex === idx
          const isCorrect = idx === question.whyIndex

          let lineStyle = isSelected ? "border-ink bg-paper border-l-4 border-l-signal" : "border-rule bg-card hover:bg-paper"
          if (isRevealed) {
            lineStyle = isCorrect
              ? "border-ok bg-ok/10 border-l-4 border-l-ok"
              : isSelected
              ? "border-bad bg-bad/10 opacity-50"
              : "border-rule bg-paper opacity-40"
          }

          return (
            <button
              key={idx}
              disabled={isRevealed}
              onClick={() => onAnswerChange({ ...current, whyIndex: idx })}
              className={`w-full text-left p-3.5 border transition-all flex items-start gap-3 cursor-pointer ${lineStyle}`}
            >
              <span className="font-mono text-xs font-bold text-ink-soft mt-0.5">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="text-xs text-ink leading-relaxed">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
