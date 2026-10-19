"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CurvePoint {
  x: number;
  y: number;
}

interface CurvePlotProps {
  prime?: number;
  a?: number;
  b?: number;
  className?: string;
}

export function CurvePlot({
  prime = 17,
  a = 2,
  b = 2,
  className = "",
}: CurvePlotProps) {
  const [selectedPointA, setSelectedPointA] = useState<CurvePoint | null>(null);
  const [selectedPointB, setSelectedPointB] = useState<CurvePoint | null>(null);

  // Compute all points on y^2 = x^3 + ax + b (mod p)
  const computePoints = (): CurvePoint[] => {
    const points: CurvePoint[] = [];
    for (let x = 0; x < prime; x++) {
      const rhs = (x * x * x + a * x + b) % prime;
      for (let y = 0; y < prime; y++) {
        const lhs = (y * y) % prime;
        if (lhs === rhs) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  const validPoints = computePoints();

  // Point addition on the prime field
  const addPoints = (p1: CurvePoint, p2: CurvePoint): CurvePoint | null => {
    let slope: number;
    if (p1.x === p2.x && p1.y === p2.y) {
      // Doubling: slope = (3*x1^2 + a) / (2*y1) mod p
      const num = (3 * p1.x * p1.x + a) % prime;
      const den = (2 * p1.y) % prime;
      if (den === 0) return null; // Point at infinity
      const invDen = modInverse(den, prime);
      if (invDen === null) return null;
      slope = (num * invDen) % prime;
    } else if (p1.x === p2.x) {
      return null; // Vertical line (point at infinity)
    } else {
      // Addition: slope = (y2 - y1) / (x2 - x1) mod p
      const num = (p2.y - p1.y + prime) % prime;
      const den = (p2.x - p1.x + prime) % prime;
      const invDen = modInverse(den, prime);
      if (invDen === null) return null;
      slope = (num * invDen) % prime;
    }

    const x3 = ((slope * slope - p1.x - p2.x) % prime + prime) % prime;
    const y3 = ((slope * (p1.x - x3) - p1.y) % prime + prime) % prime;
    return { x: x3, y: y3 };
  };

  function modInverse(val: number, m: number): number | null {
    val = (val % m + m) % m;
    for (let x = 1; x < m; x++) {
      if ((val * x) % m === 1) return x;
    }
    return null;
  }

  const resultPoint =
    selectedPointA && selectedPointB
      ? addPoints(selectedPointA, selectedPointB)
      : null;

  const handlePointClick = (pt: CurvePoint) => {
    if (!selectedPointA) {
      setSelectedPointA(pt);
    } else if (!selectedPointB) {
      setSelectedPointB(pt);
    } else {
      setSelectedPointA(pt);
      setSelectedPointB(null);
    }
  };

  const gridSize = 320;
  const padding = 30;
  const step = (gridSize - padding * 2) / (prime - 1);

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Elliptic Curve over Finite Field 𝔽<sub>{prime}</sub>
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Curve: y² ≡ x³ + {a}x + {b} (mod {prime}) · Valid Points: {validPoints.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPointA(null);
              setSelectedPointB(null);
            }}
            className="h-7 text-xs font-mono"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* SVG Dot Grid */}
        <div className="border border-ink bg-paper rounded-[2px] p-2 shadow-[2px_2px_0_var(--rule)]">
          <svg
            width={gridSize}
            height={gridSize}
            viewBox={`0 0 ${gridSize} ${gridSize}`}
            className="select-none"
          >
            {/* Grid Lines */}
            {Array.from({ length: prime }).map((_, i) => {
              const pos = padding + i * step;
              return (
                <g key={i}>
                  <line
                    x1={pos}
                    y1={padding}
                    x2={pos}
                    y2={gridSize - padding}
                    stroke="var(--rule)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={padding}
                    y1={pos}
                    x2={gridSize - padding}
                    y2={pos}
                    stroke="var(--rule)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                  {/* Axis labels */}
                  {i % 4 === 0 && (
                    <>
                      <text
                        x={pos}
                        y={gridSize - padding + 15}
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontSize="9"
                        fill="var(--ink-soft)"
                      >
                        {i}
                      </text>
                      <text
                        x={padding - 10}
                        y={gridSize - (padding + i * step) + 3}
                        textAnchor="end"
                        fontFamily="monospace"
                        fontSize="9"
                        fill="var(--ink-soft)"
                      >
                        {i}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Connecting line between Point A and Point B if both chosen */}
            {selectedPointA && selectedPointB && (
              <line
                x1={padding + selectedPointA.x * step}
                y1={gridSize - (padding + selectedPointA.y * step)}
                x2={padding + selectedPointB.x * step}
                y2={gridSize - (padding + selectedPointB.y * step)}
                stroke="var(--signal)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}

            {/* Valid Curve Points (Dots) */}
            {validPoints.map(pt => {
              const cx = padding + pt.x * step;
              const cy = gridSize - (padding + pt.y * step);
              const isA = selectedPointA?.x === pt.x && selectedPointA?.y === pt.y;
              const isB = selectedPointB?.x === pt.x && selectedPointB?.y === pt.y;
              const isR = resultPoint?.x === pt.x && resultPoint?.y === pt.y;

              const fillColor = isA
                ? "var(--signal)"
                : isB
                ? "var(--info)"
                : isR
                ? "var(--ok)"
                : "var(--ink)";

              const r = isA || isB || isR ? 7 : 4;

              return (
                <g key={`${pt.x}_${pt.y}`} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={fillColor}
                    stroke="var(--paper)"
                    strokeWidth="1.5"
                    onClick={() => handlePointClick(pt)}
                    className="transition-transform hover:scale-150"
                  />
                  {(isA || isB || isR) && (
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize="10"
                      fontWeight="bold"
                      fill={fillColor}
                    >
                      {isA ? "P" : isB ? "Q" : "R=P+Q"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Math & Point Operations Panel */}
        <div className="flex-1 space-y-4 font-mono text-xs">
          <div className="p-3 bg-paper border border-rule rounded-[2px] space-y-2">
            <span className="text-[10px] uppercase text-ink-soft block font-bold">
              Arithmetic Operations:
            </span>
            <div>
              Point P:{" "}
              <strong className="text-signal">
                {selectedPointA ? `(${selectedPointA.x}, ${selectedPointA.y})` : "Click a point"}
              </strong>
            </div>
            <div>
              Point Q:{" "}
              <strong className="text-info">
                {selectedPointB ? `(${selectedPointB.x}, ${selectedPointB.y})` : "Click 2nd point"}
              </strong>
            </div>
            <div className="border-t border-rule pt-2">
              Sum R = P + Q:{" "}
              <strong className="text-ok">
                {resultPoint ? `(${resultPoint.x}, ${resultPoint.y})` : selectedPointA && selectedPointB ? "Point at ∞ (O)" : "—"}
              </strong>
            </div>
          </div>

          {/* Key Size Comparison Bar */}
          <div className="p-3 bg-paper border-l-4 border-signal rounded-r-[2px] space-y-2 font-sans">
            <strong className="font-mono text-[10px] uppercase tracking-wider text-signal block">
              ECC vs RSA Equivalent Security:
            </strong>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span>256-bit ECC:</span>
                <span className="text-ok font-bold">32 Bytes (High Efficiency)</span>
              </div>
              <div className="w-full bg-card h-2 border border-rule rounded-xs overflow-hidden">
                <div className="bg-ok h-full w-[8%]" />
              </div>

              <div className="flex justify-between pt-1">
                <span>3072-bit RSA:</span>
                <span className="text-bad font-bold">384 Bytes (12x larger!)</span>
              </div>
              <div className="w-full bg-card h-2 border border-rule rounded-xs overflow-hidden">
                <div className="bg-signal h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
