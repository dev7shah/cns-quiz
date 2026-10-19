"use client"

import React, { useState } from "react"
import { StateGrid } from "@/components/figures/StateGrid"

export function CaesarConcentricDisks({ shift = 3 }: { shift?: number }) {
  const [currentShift, setCurrentShift] = useState(shift)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const radiusOuter = 130
  const radiusInner = 85
  const center = 170

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card border border-rule shadow-[4px_4px_0_var(--rule)]">
      <div className="relative w-[340px] h-[340px]">
        <svg viewBox="0 0 340 340" className="w-full h-full select-none">
          {/* Background circles */}
          <circle cx={center} cy={center} r={radiusOuter + 22} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={radiusOuter - 22} fill="var(--card)" stroke="var(--rule)" strokeWidth="1" />
          <circle cx={center} cy={center} r={radiusInner + 20} fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx={center} cy={center} r={radiusInner - 22} fill="var(--card)" stroke="var(--ink)" strokeWidth="1" />

          {/* Outer Ring: Plaintext Letters */}
          {letters.map((letter, i) => {
            const angle = (i * 360) / 26 - 90
            const rad = (angle * Math.PI) / 180
            const x = center + radiusOuter * Math.cos(rad)
            const y = center + radiusOuter * Math.sin(rad)
            return (
              <text
                key={`outer-${letter}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-[11px] font-bold fill-ink"
              >
                {letter}
              </text>
            )
          })}

          {/* Inner Ring: Ciphertext Letters (Rotated by shift) */}
          {letters.map((letter, i) => {
            const shiftedIdx = (i + currentShift) % 26
            const angle = (i * 360) / 26 - 90
            const rad = (angle * Math.PI) / 180
            const x = center + radiusInner * Math.cos(rad)
            const y = center + radiusInner * Math.sin(rad)
            return (
              <text
                key={`inner-${letter}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono text-[11px] font-bold fill-signal"
              >
                {letters[shiftedIdx]}
              </text>
            )
          })}

          {/* Center Pivot Pin */}
          <circle cx={center} cy={center} r="10" fill="var(--ink)" />
          <circle cx={center} cy={center} r="4" fill="var(--paper)" />

          {/* Alignment Marker */}
          <line
            x1={center}
            y1={center - radiusOuter - 18}
            x2={center}
            y2={center - radiusInner + 18}
            stroke="var(--signal)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-soft">Shift Offset (k):</span>
        <button
          onClick={() => setCurrentShift(s => (s - 1 + 26) % 26)}
          className="px-2 py-1 bg-paper border border-ink font-mono text-xs hover:bg-rule active:translate-y-0.5"
        >
          -1
        </button>
        <span className="font-mono text-base font-bold text-signal px-2">{currentShift}</span>
        <button
          onClick={() => setCurrentShift(s => (s + 1) % 26)}
          className="px-2 py-1 bg-paper border border-ink font-mono text-xs hover:bg-rule active:translate-y-0.5"
        >
          +1
        </button>
        <span className="font-mono text-xs text-ink-soft">
          Mapping: <strong className="text-ink">A</strong> → <strong className="text-signal">{letters[currentShift]}</strong>
        </span>
      </div>
    </div>
  )
}

export function CaesarModularFormula() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-rule shadow-[4px_4px_0_var(--rule)] space-y-6 max-w-xl mx-auto">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-soft border-b border-rule pb-2 w-full text-center">
        Algebraic Formulation Over Ring ℤ₂₆
      </div>

      <div className="space-y-4 text-center">
        <div className="p-4 bg-paper border border-ink font-mono text-xl sm:text-2xl text-ink">
          <span className="text-signal font-bold">C</span> ≡ ( <span className="font-bold">P</span> + <span className="text-info font-bold">k</span> ) <span className="text-ink-soft">mod 26</span>
        </div>
        <div className="p-4 bg-paper border border-ink font-mono text-xl sm:text-2xl text-ink">
          <span className="font-bold">P</span> ≡ ( <span className="text-signal font-bold">C</span> − <span className="text-info font-bold">k</span> ) <span className="text-ink-soft">mod 26</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full text-center font-mono text-xs">
        <div className="p-2 border border-rule bg-paper">
          <div className="text-ink-soft text-[10px]">PLAINTEXT</div>
          <div className="text-ink font-bold mt-1">P ∈ &#123;0..25&#125;</div>
        </div>
        <div className="p-2 border border-signal bg-paper">
          <div className="text-signal text-[10px]">KEY SPACE</div>
          <div className="text-signal font-bold mt-1">k ∈ &#123;1..25&#125;</div>
        </div>
        <div className="p-2 border border-rule bg-paper">
          <div className="text-ink-soft text-[10px]">CIPHERTEXT</div>
          <div className="text-ink font-bold mt-1">C ∈ &#123;0..25&#125;</div>
        </div>
      </div>
    </div>
  )
}

export function PlayfairRulesVisual() {
  const sampleMatrix = [
    ['M', 'O', 'N', 'A', 'R'],
    ['C', 'H', 'Y', 'B', 'D'],
    ['E', 'F', 'G', 'I', 'K'],
    ['L', 'P', 'Q', 'S', 'T'],
    ['U', 'V', 'W', 'X', 'Z']
  ]

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-card border border-rule shadow-[4px_4px_0_var(--rule)]">
      <div className="flex flex-col items-center">
        <span className="font-mono text-xs text-ink-soft uppercase tracking-wider mb-2">5×5 Key Matrix (&quot;MONARCHY&quot;)</span>
        <StateGrid
          rows={5}
          cols={5}
          cells={sampleMatrix}
          title="Playfair State"
          highlights={[
            { r: 0, c: 3, tone: 'signal' }, // A
            { r: 1, c: 3, tone: 'signal' }, // B
            { r: 2, c: 3, tone: 'ok' }      // I/J (shifted col)
          ]}
        />
      </div>

      <div className="space-y-3 max-w-xs font-sans text-xs">
        <div className="p-3 border border-rule bg-paper">
          <strong className="font-mono text-signal uppercase tracking-wider block mb-1">1. Same Row Rule</strong>
          Replace each letter with the one to its immediate right (wrap around left).
        </div>
        <div className="p-3 border border-rule bg-paper">
          <strong className="font-mono text-info uppercase tracking-wider block mb-1">2. Same Column Rule</strong>
          Replace each letter with the one immediately below it (wrap around top).
        </div>
        <div className="p-3 border border-rule bg-paper">
          <strong className="font-mono text-ok uppercase tracking-wider block mb-1">3. Rectangle Rule</strong>
          Replace each letter with the one in its own row, but in the other letter’s column.
        </div>
      </div>
    </div>
  )
}
