"use client";

import React from "react";
import { Tone } from "../scene/types";

export interface CellHighlight {
  r: number;
  c: number;
  tone?: Tone;
  label?: string;
}

export interface GridArrow {
  from: { r: number; c: number };
  to: { r: number; c: number };
  tone?: Tone;
}

interface StateGridProps {
  rows: number;
  cols: number;
  cells: (string | number)[][];
  title?: string;
  subTitle?: string;
  rowLabels?: string[];
  colLabels?: string[];
  highlights?: CellHighlight[];
  arrows?: GridArrow[];
  onCellClick?: (r: number, c: number, val: string | number) => void;
  className?: string;
}

export function StateGrid({
  rows,
  cols,
  cells,
  title,
  subTitle,
  rowLabels,
  colLabels,
  highlights = [],
  onCellClick,
  className = "",
}: StateGridProps) {
  const getCellHighlight = (r: number, c: number) => {
    return highlights.find(h => h.r === r && h.c === c);
  };

  const getToneClass = (tone?: Tone) => {
    switch (tone) {
      case "signal":
        return "bg-signal/15 border-signal text-signal font-bold shadow-[inset_0_0_0_1px_var(--signal)]";
      case "ok":
        return "bg-ok/15 border-ok text-ok font-bold shadow-[inset_0_0_0_1px_var(--ok)]";
      case "bad":
        return "bg-bad/15 border-bad text-bad font-bold shadow-[inset_0_0_0_1px_var(--bad)]";
      case "info":
        return "bg-info/15 border-info text-info font-bold shadow-[inset_0_0_0_1px_var(--info)]";
      case "warn":
        return "bg-warn/15 border-warn text-warn font-bold shadow-[inset_0_0_0_1px_var(--warn)]";
      default:
        return "bg-card border-rule text-ink hover:border-ink";
    }
  };

  return (
    <div
      className={`inline-block bg-card border border-ink p-3 sm:p-4 rounded-[2px] shadow-[3px_3px_0_var(--rule)] ${className}`}
    >
      {(title || subTitle) && (
        <div className="mb-3 text-left">
          {title && (
            <h4 className="font-serif text-base font-bold text-ink leading-tight">
              {title}
            </h4>
          )}
          {subTitle && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {subTitle}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="border-collapse font-mono text-xs select-none">
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th className="w-6 h-6" />}
                {colLabels.map((lbl, c) => (
                  <th
                    key={c}
                    className="w-9 h-6 text-center text-[10px] text-ink-soft font-mono uppercase tracking-wider font-bold"
                  >
                    {lbl}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {rowLabels && (
                  <td className="w-6 text-center text-[10px] text-ink-soft font-mono uppercase tracking-wider font-bold pr-1">
                    {rowLabels[r] ?? r}
                  </td>
                )}
                {Array.from({ length: cols }).map((_, c) => {
                  const val = cells[r]?.[c] ?? "";
                  const hl = getCellHighlight(r, c);
                  const toneClass = getToneClass(hl?.tone);

                  return (
                    <td
                      key={c}
                      onClick={() => onCellClick?.(r, c, val)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 border text-center transition-all ${toneClass} ${
                        onCellClick ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="font-mono text-xs sm:text-sm font-semibold">
                          {String(val)}
                        </span>
                        {hl?.label && (
                          <span className="text-[8px] font-mono leading-none text-ink-soft uppercase mt-0.5">
                            {hl.label}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
