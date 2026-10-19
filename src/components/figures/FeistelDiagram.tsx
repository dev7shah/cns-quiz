"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FeistelDiagramProps {
  roundCount?: number;
  initialRound?: number;
  className?: string;
}

export function FeistelDiagram({
  roundCount = 16,
  initialRound = 1,
  className = "",
}: FeistelDiagramProps) {
  const [currentRound, setCurrentRound] = useState(initialRound);
  const [isDecrypt, setIsDecrypt] = useState(false);

  const subKeyLabel = isDecrypt
    ? `K_{${roundCount - currentRound + 1}}`
    : `K_{${currentRound}}`;

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Feistel Cipher Structure
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Round {currentRound} of {roundCount} · {isDecrypt ? "Decryption (Reversed Keys)" : "Encryption"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isDecrypt ? "outline" : "default"}
            size="sm"
            onClick={() => setIsDecrypt(false)}
            className="h-7 text-xs font-mono"
          >
            Encrypt
          </Button>
          <Button
            variant={isDecrypt ? "default" : "outline"}
            size="sm"
            onClick={() => setIsDecrypt(true)}
            className="h-7 text-xs font-mono"
          >
            Decrypt
          </Button>
          <div className="h-4 w-px bg-rule mx-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRound(r => Math.max(1, r - 1))}
            disabled={currentRound === 1}
            className="h-7 px-2 font-mono text-xs"
          >
            ←
          </Button>
          <span className="font-mono text-xs font-bold px-1">{currentRound}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentRound(r => Math.min(roundCount, r + 1))}
            disabled={currentRound === roundCount}
            className="h-7 px-2 font-mono text-xs"
          >
            →
          </Button>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 500 360"
          className="w-full max-w-[500px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="f-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--ink)" />
            </marker>
            <marker
              id="f-arrow-signal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--signal)" />
            </marker>
          </defs>

          {/* Top 64-bit Block Header */}
          <rect
            x="100"
            y="15"
            width="300"
            height="32"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            rx="2"
          />
          <text
            x="250"
            y="35"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="11"
            fontWeight="bold"
            fill="var(--ink)"
          >
            Input to Round {currentRound} (64 bits)
          </text>

          {/* Left Register L_{i-1} */}
          <rect
            x="100"
            y="65"
            width="130"
            height="36"
            fill="var(--card)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            rx="2"
          />
          <text
            x="165"
            y="87"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="12"
            fontWeight="bold"
            fill="var(--ink)"
          >
            L_{currentRound - 1} (32 bits)
          </text>

          {/* Right Register R_{i-1} */}
          <rect
            x="270"
            y="65"
            width="130"
            height="36"
            fill="var(--card)"
            stroke="var(--signal)"
            strokeWidth="2"
            rx="2"
          />
          <text
            x="335"
            y="87"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="12"
            fontWeight="bold"
            fill="var(--signal)"
          >
            R_{currentRound - 1} (32 bits)
          </text>

          {/* Downward line from L_{i-1} to XOR */}
          <line
            x1="165"
            y1="101"
            x2="165"
            y2="175"
            stroke="var(--ink)"
            strokeWidth="1.5"
            markerEnd="url(#f-arrow)"
          />

          {/* Right flow into Round Function F */}
          <line
            x1="335"
            y1="101"
            x2="335"
            y2="155"
            stroke="var(--signal)"
            strokeWidth="2"
            markerEnd="url(#f-arrow-signal)"
          />

          {/* Round Function Box F */}
          <rect
            x="285"
            y="155"
            width="100"
            height="50"
            fill="var(--paper)"
            stroke="var(--signal)"
            strokeWidth="2"
            rx="3"
          />
          <text
            x="335"
            y="185"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="bold"
            fill="var(--signal)"
          >
            F (Round Fun)
          </text>

          {/* Subkey Ki injection from the right */}
          <line
            x1="460"
            y1="180"
            x2="385"
            y2="180"
            stroke="var(--info)"
            strokeWidth="2"
            markerEnd="url(#f-arrow)"
          />
          <rect
            x="410"
            y="160"
            width="55"
            height="22"
            fill="var(--paper)"
            stroke="var(--info)"
            strokeWidth="1"
            rx="1"
          />
          <text
            x="437"
            y="175"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            fill="var(--info)"
          >
            {subKeyLabel}
          </text>

          {/* Output of F going left into XOR circle */}
          <line
            x1="285"
            y1="180"
            x2="180"
            y2="180"
            stroke="var(--signal)"
            strokeWidth="1.75"
            markerEnd="url(#f-arrow-signal)"
          />

          {/* XOR Circle ⊕ */}
          <circle
            cx="165"
            cy="180"
            r="12"
            fill="var(--card)"
            stroke="var(--ink)"
            strokeWidth="1.75"
          />
          <line x1="165" y1="172" x2="165" y2="188" stroke="var(--ink)" strokeWidth="1.75" />
          <line x1="157" y1="180" x2="173" y2="180" stroke="var(--ink)" strokeWidth="1.75" />

          {/* Cross-over lines (The Swap) */}
          {/* XOR output goes diagonally right to become R_i */}
          <path
            d="M 165 192 L 165 220 L 335 255"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.5"
            markerEnd="url(#f-arrow)"
          />

          {/* R_{i-1} branch taps off and goes diagonally left to become L_i */}
          <circle cx="335" cy="125" r="3" fill="var(--signal)" />
          <path
            d="M 335 125 L 335 220 L 165 255"
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            markerEnd="url(#f-arrow-signal)"
          />

          {/* Output Registers for Round i */}
          <rect
            x="100"
            y="265"
            width="130"
            height="36"
            fill="var(--card)"
            stroke="var(--signal)"
            strokeWidth="1.5"
            rx="2"
          />
          <text
            x="165"
            y="287"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="12"
            fontWeight="bold"
            fill="var(--signal)"
          >
            L_{currentRound} = R_{currentRound - 1}
          </text>

          <rect
            x="270"
            y="265"
            width="130"
            height="36"
            fill="var(--card)"
            stroke="var(--ink)"
            strokeWidth="1.5"
            rx="2"
          />
          <text
            x="335"
            y="287"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="11"
            fontWeight="bold"
            fill="var(--ink)"
          >
            R_{currentRound} = L ⊕ F(R, K)
          </text>

          {/* Final Round Note */}
          {currentRound === roundCount && (
            <text
              x="250"
              y="330"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="10"
              fontWeight="bold"
              fill="var(--signal)"
            >
              * Last round typically omits the final swap!
            </text>
          )}
        </svg>
      </div>

      {/* Must-Say Mathematical Insight Callout */}
      <div className="mt-4 p-3 bg-paper border-l-4 border-signal font-sans text-xs text-ink leading-relaxed">
        <strong className="font-mono text-[11px] uppercase tracking-wider text-signal block mb-1">
          Feistel Reversibility Property:
        </strong>
        The round function <code className="font-mono font-bold">F()</code>{" "}
        <strong>does not need to be invertible</strong>. Because{" "}
        <code className="font-mono">A ⊕ B ⊕ B = A</code>, applying the same subkeys in
        reverse order reconstructs the plaintext regardless of how complex or
        one-way <code className="font-mono">F</code> is!
      </div>
    </div>
  );
}
