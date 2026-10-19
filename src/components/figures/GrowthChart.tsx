"use client";

import React, { useState } from "react";

interface GrowthChartProps {
  initialN?: number;
  className?: string;
}

export function GrowthChart({ initialN = 8, className = "" }: GrowthChartProps) {
  const [n, setN] = useState<number>(initialN);

  const curves = [
    { label: "O(1)", name: "Constant", val: () => 1, color: "var(--ok)" },
    { label: "O(log n)", name: "Logarithmic (ModExp)", val: (x: number) => Math.log2(Math.max(1, x)), color: "var(--info)" },
    { label: "O(n)", name: "Linear (Hashing)", val: (x: number) => x, color: "var(--ink)" },
    { label: "O(n log n)", name: "Linearithmic", val: (x: number) => x * Math.log2(Math.max(1, x)), color: "var(--warn)" },
    { label: "O(n²)", name: "Quadratic (Naive Matching)", val: (x: number) => x * x, color: "var(--signal)" },
    { label: "O(2ⁿ)", name: "Exponential (Brute Force)", val: (x: number) => Math.pow(2, Math.min(20, x)), color: "var(--bad)" },
  ];

  // SVG dimensions
  const width = 500;
  const height = 240;
  const padding = 45;

  // Maximum value for log scaling
  const maxVal = Math.pow(2, 20); // 1,048,576
  const logMax = Math.log10(maxVal);

  const getCoordinates = (fn: (x: number) => number) => {
    const points: string[] = [];
    for (let x = 1; x <= 20; x++) {
      const yVal = fn(x);
      const logY = Math.log10(Math.max(1, yVal));
      const px = (padding + ((x - 1) / 19) * (width - padding * 2)).toFixed(2);
      const py = (height - padding - (logY / logMax) * (height - padding * 2)).toFixed(2);
      points.push(`${px},${py}`);
    }
    return points.join(" ");
  };

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Algorithmic Complexity & Keyspace Growth (Log Scale)
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Evaluate operations growth as input size or key length $n$ increases
          </span>
        </div>

        <div className="flex items-center gap-3 bg-paper px-3 py-1.5 border border-rule rounded-[2px] font-mono text-xs">
          <span className="text-ink-soft uppercase text-[10px] font-bold">Input Size (n):</span>
          <input
            type="range"
            min="1"
            max="20"
            value={n}
            onChange={e => setN(Number(e.target.value))}
            className="w-24 accent-signal cursor-pointer"
          />
          <strong className="text-signal w-6 text-right font-mono text-sm">{n}</strong>
        </div>
      </div>

      {/* SVG Growth Curves */}
      <div className="border border-ink bg-paper rounded-[2px] p-2 overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Axis lines */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {/* Grid lines and Log Y-Axis Labels */}
          {[1, 10, 100, 1000, 10000, 100000, 1000000].map((v, idx) => {
            const logV = Math.log10(v);
            const py = (height - padding - (logV / logMax) * (height - padding * 2)).toFixed(2);
            return (
              <g key={idx}>
                <line
                  x1={padding}
                  y1={py}
                  x2={width - padding}
                  y2={py}
                  stroke="var(--rule)"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding - 6}
                  y={Number(py) + 3}
                  textAnchor="end"
                  fontFamily="monospace"
                  fontSize="8"
                  fill="var(--ink-soft)"
                >
                  10^{Math.log10(v)}
                </text>
              </g>
            );
          })}

          {/* Current N vertical marker */}
          {(() => {
            const currentX = (padding + ((n - 1) / 19) * (width - padding * 2)).toFixed(2);
            return (
              <line
                x1={currentX}
                y1={padding}
                x2={currentX}
                y2={height - padding}
                stroke="var(--signal)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            );
          })()}

          {/* Plot curves */}
          {curves.map(curve => (
            <polyline
              key={curve.label}
              fill="none"
              stroke={curve.color}
              strokeWidth="2"
              points={getCoordinates(curve.val)}
            />
          ))}
        </svg>
      </div>

      {/* Computed Value Table at current N */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-[11px]">
        {curves.map(c => {
          const raw = c.val(n);
          const displayVal =
            raw >= 1000000
              ? raw.toExponential(2)
              : raw >= 1000
              ? raw.toLocaleString()
              : raw.toFixed(raw < 10 && raw % 1 !== 0 ? 2 : 0);

          return (
            <div
              key={c.label}
              className="p-2 border border-rule rounded-[2px] bg-paper"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c.color }} />
                <span className="font-bold text-ink">{c.label}</span>
              </div>
              <div className="text-ink font-bold">{displayVal}</div>
              <div className="text-[9px] text-ink-soft truncate">{c.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
