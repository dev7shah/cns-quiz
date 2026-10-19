"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Plate } from "@/lib/present/types"

interface PresenterToolsProps {
  currentPlate: Plate
  allPlates: Plate[]
  activePlateIndex: number
  onJumpToPlate: (index: number) => void
  isLaserActive: boolean
  isDrawActive: boolean
  isBlackout: boolean
  isNotesOpen: boolean
  showJumpGrid: boolean
  showHelp: boolean
  onToggleBlackout: () => void
  onToggleNotes: () => void
  onToggleJumpGrid: () => void
  onToggleHelp: () => void
  onPrintHandout: () => void
}

export function PresenterToolsOverlay({
  currentPlate,
  allPlates,
  activePlateIndex,
  onJumpToPlate,
  isLaserActive,
  isDrawActive,
  isBlackout,
  isNotesOpen,
  showJumpGrid,
  showHelp,
  onToggleBlackout,
  onToggleNotes,
  onToggleJumpGrid,
  onToggleHelp,
  onPrintHandout
}: PresenterToolsProps) {
  // Laser Pointer Coordinates
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null)

  // Drawing Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)

  // Mouse move handler for laser pointer
  useEffect(() => {
    if (!isLaserActive) return

    const handleMouseMove = (e: MouseEvent) => {
      setLaserPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isLaserActive])

  // Clear drawing canvas when plate index changes or on 'C'
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  useEffect(() => {
    clearCanvas()
  }, [activePlateIndex, clearCanvas])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "c" || e.key === "C") {
        clearCanvas()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [clearCanvas])

  // Canvas drawing events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawActive) return
    isDrawing.current = true
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.strokeStyle = "#E5390F" // Vermilion accent
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.stroke()
  }

  const stopDrawing = () => {
    isDrawing.current = false
  }

  return (
    <>
      {/* 1. Laser Pointer Dot */}
      {isLaserActive && laserPos && (
        <div
          className="fixed pointer-events-none z-[150] -translate-x-1/2 -translate-y-1/2"
          style={{ left: laserPos.x, top: laserPos.y }}
        >
          <div className="w-4 h-4 rounded-full bg-signal ring-4 ring-signal/30 shadow-[0_0_8px_#E5390F]" />
        </div>
      )}

      {/* 2. Drawing Canvas Overlay */}
      {isDrawActive && (
        <canvas
          ref={canvasRef}
          width={typeof window !== "undefined" ? window.innerWidth : 1200}
          height={typeof window !== "undefined" ? window.innerHeight : 800}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="fixed inset-0 z-[140] cursor-crosshair no-print"
        />
      )}

      {/* 3. Blackout Screen */}
      {isBlackout && (
        <div
          onClick={onToggleBlackout}
          className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center text-paper font-mono select-none cursor-pointer"
        >
          <div className="text-xl sm:text-2xl font-serif text-paper/80 mb-4">Focus on Presenter</div>
          <div className="text-xs text-paper/40 uppercase tracking-widest border border-paper/20 px-3 py-1.5">
            Press [B] or Click anywhere to resume
          </div>
        </div>
      )}

      {/* 4. Speaker Notes Drawer (Toggled by 'S') */}
      {isNotesOpen && (
        <div className="fixed right-0 top-12 bottom-12 w-full sm:w-96 bg-card border-l border-rule shadow-[-8px_0_0_var(--rule)] z-[130] p-6 flex flex-col overflow-y-auto no-print">
          <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-signal rounded-full" />
              <h3 className="font-serif text-lg text-ink font-bold">Presenter Script</h3>
            </div>
            <button
              onClick={onToggleNotes}
              className="text-xs font-mono uppercase text-ink-soft hover:text-ink px-2 py-1 border border-rule"
            >
              Close [S]
            </button>
          </div>

          <div className="mb-6">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block mb-2 font-bold">
              Spoken Script (40-70 words):
            </span>
            <p className="font-sans text-sm text-ink leading-relaxed bg-paper p-4 border border-rule italic">
              &ldquo;{currentPlate.speakerNotes.script}&rdquo;
            </p>
          </div>

          {currentPlate.speakerNotes.likelyQuestions && currentPlate.speakerNotes.likelyQuestions.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                Anticipated Student Questions:
              </span>
              {currentPlate.speakerNotes.likelyQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-paper border border-rule space-y-1.5">
                  <div className="font-sans text-xs font-bold text-signal">Q: {q.question}</div>
                  <div className="font-sans text-xs text-ink-soft">A: {q.answer}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-rule text-[11px] font-mono text-ink-soft">
            Plate {activePlateIndex + 1} of {allPlates.length} · Kind: {currentPlate.kind}
          </div>
        </div>
      )}

      {/* 5. Jump Grid Modal (Toggled by 'G') */}
      {showJumpGrid && (
        <div className="fixed inset-0 z-[160] bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8 no-print">
          <div className="bg-paper border border-ink max-w-4xl w-full max-h-[85vh] flex flex-col p-6 shadow-[8px_8px_0_var(--ink)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-rule pb-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl text-ink">Topic Plate Overview</h2>
                <span className="font-mono text-xs text-ink-soft">Click any plate thumbnail to jump directly</span>
              </div>
              <button
                onClick={onToggleJumpGrid}
                className="font-mono text-xs uppercase px-3 py-1.5 border border-ink bg-card hover:bg-rule"
              >
                Close [G / Esc]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto p-2">
              {allPlates.map((plate, index) => (
                <button
                  key={plate.id}
                  onClick={() => {
                    onJumpToPlate(index)
                    onToggleJumpGrid()
                  }}
                  className={`flex flex-col text-left p-3 border transition-all ${
                    index === activePlateIndex
                      ? "border-signal bg-card shadow-[3px_3px_0_var(--signal)]"
                      : "border-rule bg-card hover:border-ink hover:bg-paper"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-bold text-ink-soft">PLATE {index + 1}</span>
                    <span className="font-mono text-[9px] uppercase px-1 border border-rule text-signal">{plate.kind}</span>
                  </div>
                  <h4 className="font-serif text-sm text-ink line-clamp-1 font-bold">{plate.title}</h4>
                  <p className="font-sans text-[11px] text-ink-soft line-clamp-2 mt-1">{plate.caption}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Keyboard Help Overlay (Toggled by '?') */}
      {showHelp && (
        <div className="fixed inset-0 z-[170] bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-paper border border-ink max-w-lg w-full p-6 shadow-[8px_8px_0_var(--ink)] space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h3 className="font-serif text-xl text-ink font-bold">Presenter Keyboard Shortcuts</h3>
              <button
                onClick={onToggleHelp}
                className="font-mono text-xs uppercase px-2.5 py-1 border border-ink bg-card hover:bg-rule"
              >
                Esc
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">→ / ←</span>
                <span className="text-ink">Next / Prev</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">Space</span>
                <span className="text-ink">Auto-play Scene</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">S</span>
                <span className="text-ink">Speaker Notes</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">L</span>
                <span className="text-ink">Laser Pointer</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">D / C</span>
                <span className="text-ink">Draw / Clear</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">E</span>
                <span className="text-ink">Explain Simpler (ELI5)</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">B</span>
                <span className="text-ink">Blackout Screen</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">G</span>
                <span className="text-ink">Grid / Jump</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">Q</span>
                <span className="text-ink">Launch Quiz</span>
              </div>
              <div className="p-2 border border-rule bg-card flex justify-between">
                <span className="text-signal font-bold">1..4</span>
                <span className="text-ink">Vote in Poll</span>
              </div>
            </div>

            <div className="border-t border-rule pt-3 text-center">
              <button
                onClick={onPrintHandout}
                className="px-4 py-2 bg-ink text-paper font-mono text-xs uppercase tracking-wider hover:bg-signal transition-colors"
              >
                🖨 Print Student Handout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
