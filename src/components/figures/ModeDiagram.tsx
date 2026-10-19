"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export type BlockCipherMode = "ECB" | "CBC" | "CFB" | "OFB" | "CTR";

interface ModeDiagramProps {
  initialMode?: BlockCipherMode;
  className?: string;
}

export function ModeDiagram({
  initialMode = "CBC",
  className = "",
}: ModeDiagramProps) {
  const [mode, setMode] = useState<BlockCipherMode>(initialMode);
  const [isDecrypt, setIsDecrypt] = useState(false);
  const [errorBlock, setErrorBlock] = useState<number | null>(null);

  const modes: BlockCipherMode[] = ["ECB", "CBC", "CFB", "OFB", "CTR"];

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      {/* Mode Selector and Encrypt/Decrypt Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Block Cipher Modes of Operation
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {mode} Mode · {isDecrypt ? "Decryption" : "Encryption"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex border border-rule rounded-[2px] overflow-hidden">
            {modes.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrorBlock(null);
                }}
                className={`px-2 py-1 font-mono text-xs transition-colors cursor-pointer ${
                  mode === m
                    ? "bg-signal text-paper font-bold"
                    : "bg-paper text-ink hover:bg-card"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-rule mx-1 hidden sm:block" />

          <Button
            variant={!isDecrypt ? "default" : "outline"}
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
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 650 260"
          className="w-full min-w-[580px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="m-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--ink)" />
            </marker>
            <marker
              id="m-arrow-signal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--signal)" />
            </marker>
          </defs>

          {/* Render 3 Blocks */}
          {[1, 2, 3].map(blockNum => {
            const x = 110 + (blockNum - 1) * 180;
            const isCorrupted =
              errorBlock === blockNum ||
              (mode === "CBC" && errorBlock === blockNum - 1 && isDecrypt);

            return (
              <g key={blockNum}>
                {/* Plaintext Block P_i (or Ciphertext if decrypt) */}
                <rect
                  x={x - 45}
                  y={20}
                  width="90"
                  height="30"
                  fill="var(--paper)"
                  stroke={isCorrupted ? "var(--bad)" : "var(--ink)"}
                  strokeWidth="1.5"
                  rx="2"
                />
                <text
                  x={x}
                  y={40}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isCorrupted ? "var(--bad)" : "var(--ink)"}
                >
                  {!isDecrypt ? `Plaintext P_${blockNum}` : `Ciphertext C_${blockNum}`}
                </text>

                {/* XOR Circle if applicable */}
                {mode !== "ECB" && (
                  <>
                    <circle
                      cx={x}
                      cy={85}
                      r="10"
                      fill="var(--card)"
                      stroke="var(--ink)"
                      strokeWidth="1.5"
                    />
                    <line x1={x} y1={78} x2={x} y2={92} stroke="var(--ink)" strokeWidth="1.5" />
                    <line x1={x - 7} y1={85} x2={x + 7} y2={85} stroke="var(--ink)" strokeWidth="1.5" />

                    {/* Down arrow into XOR */}
                    <line
                      x1={x}
                      y1={50}
                      x2={x}
                      y2={75}
                      stroke="var(--ink)"
                      strokeWidth="1.5"
                      markerEnd="url(#m-arrow)"
                    />
                  </>
                )}

                {/* Arrow from P_i straight to Block Cipher in ECB */}
                {mode === "ECB" && (
                  <line
                    x1={x}
                    y1={50}
                    x2={x}
                    y2={115}
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    markerEnd="url(#m-arrow)"
                  />
                )}

                {/* Arrow from XOR down to Block Cipher */}
                {mode !== "ECB" && (
                  <line
                    x1={x}
                    y1={95}
                    x2={x}
                    y2={115}
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    markerEnd="url(#m-arrow)"
                  />
                )}

                {/* Block Cipher Engine Box E_K / D_K */}
                <rect
                  x={x - 55}
                  y={115}
                  width="110"
                  height="45"
                  fill="var(--paper)"
                  stroke="var(--signal)"
                  strokeWidth="2"
                  rx="3"
                />
                <text
                  x={x}
                  y={138}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="bold"
                  fill="var(--signal)"
                >
                  {isDecrypt && (mode === "ECB" || mode === "CBC")
                    ? "Block Decrypt"
                    : "Block Encrypt"}
                </text>
                <text
                  x={x}
                  y={150}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="9"
                  fill="var(--ink-soft)"
                >
                  Key K
                </text>

                {/* Down arrow to Output */}
                <line
                  x1={x}
                  y1={160}
                  x2={x}
                  y2={195}
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                  markerEnd="url(#m-arrow)"
                />

                {/* Output Block C_i (or Decrypted P_i) */}
                <rect
                  x={x - 45}
                  y={195}
                  width="90"
                  height="30"
                  fill={isCorrupted ? "var(--bad)" : "var(--card)"}
                  stroke={isCorrupted ? "var(--bad)" : "var(--signal)"}
                  strokeWidth="1.5"
                  rx="2"
                />
                <text
                  x={x}
                  y={215}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isCorrupted ? "var(--paper)" : "var(--signal)"}
                >
                  {!isDecrypt
                    ? `Ciphertext C_${blockNum}`
                    : `Plaintext P_${blockNum}`}
                </text>
              </g>
            );
          })}

          {/* CBC Chaining Lines */}
          {mode === "CBC" && (
            <>
              {/* IV injection into Block 1 XOR */}
              <text
                x="30"
                y="89"
                fontFamily="monospace"
                fontSize="11"
                fontWeight="bold"
                fill="var(--info)"
              >
                IV →
              </text>
              <line
                x1="55"
                y1="85"
                x2="100"
                y2="85"
                stroke="var(--info)"
                strokeWidth="1.5"
                markerEnd="url(#m-arrow)"
              />

              {/* C_1 feeds into Block 2 XOR */}
              <path
                d="M 155 210 h 20 v -125 h 95"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="1.5"
                markerEnd="url(#m-arrow-signal)"
              />

              {/* C_2 feeds into Block 3 XOR */}
              <path
                d="M 335 210 h 20 v -125 h 95"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="1.5"
                markerEnd="url(#m-arrow-signal)"
              />
            </>
          )}

          {/* CTR Nonce + Counter Feed */}
          {mode === "CTR" && (
            <>
              <text
                x="110"
                y="12"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="9"
                fill="var(--info)"
              >
                Nonce || 1
              </text>
              <text
                x="290"
                y="12"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="9"
                fill="var(--info)"
              >
                Nonce || 2
              </text>
              <text
                x="470"
                y="12"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="9"
                fill="var(--info)"
              >
                Nonce || 3
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Mode Properties Checklist & Exam Takeaways */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs border-t border-rule pt-4">
        <div className="p-2.5 bg-paper border border-rule rounded-[2px]">
          <span className="text-[10px] uppercase text-ink-soft block font-bold">Parallelism:</span>
          <span className="font-semibold text-ink">
            {mode === "ECB" || mode === "CTR"
              ? "✓ High (Parallelizable)"
              : mode === "CBC" && isDecrypt
              ? "✓ Decryption is Parallel"
              : "✕ Sequential Chaining"}
          </span>
        </div>

        <div className="p-2.5 bg-paper border border-rule rounded-[2px]">
          <span className="text-[10px] uppercase text-ink-soft block font-bold">Needs IV / Nonce:</span>
          <span className="font-semibold text-ink">
            {mode === "ECB" ? "✕ None (Deterministic!)" : "✓ Required (Unique per message)"}
          </span>
        </div>

        <div className="p-2.5 bg-paper border border-rule rounded-[2px]">
          <span className="text-[10px] uppercase text-ink-soft block font-bold">Mode Category:</span>
          <span className="font-semibold text-ink">
            {mode === "CTR" || mode === "OFB" || mode === "CFB"
              ? "Stream Mode (No padding needed)"
              : "Block Mode (Padding required)"}
          </span>
        </div>
      </div>
    </div>
  );
}
