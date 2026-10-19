"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface BitStripProps {
  initialBitsA?: string;
  initialBitsB?: string;
  bitLength?: number;
  className?: string;
}

export function BitStrip({
  initialBitsA = "11001010",
  initialBitsB = "10110011",
  bitLength = 8,
  className = "",
}: BitStripProps) {
  const [bitsA, setBitsA] = useState(initialBitsA.padEnd(bitLength, "0").slice(0, bitLength));
  const [bitsB, setBitsB] = useState(initialBitsB.padEnd(bitLength, "0").slice(0, bitLength));
  const [operation, setOperation] = useState<"XOR" | "SHL" | "ROTL" | "AVALANCHE">("XOR");

  const toggleBitA = (idx: number) => {
    const chars = bitsA.split("");
    chars[idx] = chars[idx] === "1" ? "0" : "1";
    setBitsA(chars.join(""));
  };

  const toggleBitB = (idx: number) => {
    const chars = bitsB.split("");
    chars[idx] = chars[idx] === "1" ? "0" : "1";
    setBitsB(chars.join(""));
  };

  // Compute results
  const computeResult = () => {
    if (operation === "XOR") {
      return bitsA.split("").map((b, i) => (b === bitsB[i] ? "0" : "1")).join("");
    }
    if (operation === "SHL") {
      return bitsA.slice(1) + "0";
    }
    if (operation === "ROTL") {
      return bitsA.slice(1) + bitsA[0];
    }
    // Avalanche difference: 1 if bit changed, 0 if identical
    return bitsA.split("").map((b, i) => (b !== bitsB[i] ? "1" : "0")).join("");
  };

  const resultBits = computeResult();
  const diffCount = bitsA.split("").filter((b, i) => b !== bitsB[i]).length;
  const avalanchePercent = Math.round((diffCount / bitLength) * 100);

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Bitwise Engine & Avalanche Visualizer
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Click any bit below to flip (0 ↔ 1)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(["XOR", "SHL", "ROTL", "AVALANCHE"] as const).map(op => (
            <Button
              key={op}
              variant={operation === op ? "default" : "outline"}
              size="sm"
              onClick={() => setOperation(op)}
              className="h-7 text-xs font-mono"
            >
              {op === "SHL" ? "Shift Left (<< 1)" : op === "ROTL" ? "Rotate Left (<<< 1)" : op}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4 font-mono select-none">
        {/* Row A */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ink-soft mb-1 flex justify-between">
            <span>Register A ({bitLength} bits)</span>
            <span className="text-signal">Hex: 0x{parseInt(bitsA, 2).toString(16).toUpperCase().padStart(2, "0")}</span>
          </div>
          <div className="flex border border-ink bg-paper divide-x divide-rule rounded-[2px] overflow-hidden">
            {bitsA.split("").map((bit, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleBitA(i)}
                className={`flex-1 py-2 text-center text-xs font-bold transition-colors cursor-pointer hover:bg-signal/10 ${
                  bit === "1" ? "bg-ink text-paper" : "text-ink-soft"
                }`}
                title={`Bit ${i}: Click to flip`}
              >
                {bit}
              </button>
            ))}
          </div>
        </div>

        {/* Row B (if binary op) */}
        {(operation === "XOR" || operation === "AVALANCHE") && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-soft mb-1 flex justify-between">
              <span>{operation === "AVALANCHE" ? "Perturbed Register B (1-bit flip)" : "Register B (Subkey / Mask)"}</span>
              <span className="text-info">Hex: 0x{parseInt(bitsB, 2).toString(16).toUpperCase().padStart(2, "0")}</span>
            </div>
            <div className="flex border border-rule bg-paper divide-x divide-rule rounded-[2px] overflow-hidden">
              {bitsB.split("").map((bit, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleBitB(i)}
                  className={`flex-1 py-2 text-center text-xs font-bold transition-colors cursor-pointer hover:bg-signal/10 ${
                    bit === "1" ? "bg-card border-b-2 border-signal text-signal" : "text-ink-soft"
                  }`}
                  title={`Bit ${i}: Click to flip`}
                >
                  {bit}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Divider */}
        <div className="flex items-center gap-2">
          <div className="h-px bg-rule flex-1" />
          <span className="text-[10px] uppercase font-bold text-signal px-2 py-0.5 border border-rule bg-card rounded-xs">
            {operation === "XOR" ? "A ⊕ B Output" : operation === "AVALANCHE" ? "Difference Heatmap" : "Result"}
          </span>
          <div className="h-px bg-rule flex-1" />
        </div>

        {/* Output Row */}
        <div>
          <div className="flex border-2 border-signal bg-card divide-x divide-rule rounded-[2px] overflow-hidden shadow-[2px_2px_0_var(--signal)]">
            {resultBits.split("").map((bit, i) => {
              const isDiff = operation === "AVALANCHE" && bit === "1";
              return (
                <div
                  key={i}
                  className={`flex-1 py-2 text-center text-xs font-bold ${
                    isDiff
                      ? "bg-bad text-paper animate-pulse"
                      : bit === "1"
                      ? "bg-signal text-paper"
                      : "text-ink-soft"
                  }`}
                >
                  {bit}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avalanche Metric Callout */}
      {operation === "AVALANCHE" && (
        <div className="mt-4 p-3 bg-paper border-l-4 border-bad font-sans text-xs">
          <div className="flex items-center justify-between font-mono mb-1">
            <span className="font-bold uppercase tracking-wider text-bad">Hamming Distance:</span>
            <span className="font-bold">{diffCount} / {bitLength} bits changed ({avalanchePercent}%)</span>
          </div>
          <p className="text-ink-soft leading-relaxed">
            Strict Avalanche Criterion (SAC) states that flipping a single input bit must change each output bit with a probability of 50%.
          </p>
        </div>
      )}
    </div>
  );
}
