"use client";

import React from "react";
import { Tone } from "../scene/types";

interface MathBlockProps {
  expression?: string;
  matrix?: (string | number)[][];
  highlightTerms?: string[];
  tone?: Tone;
  caption?: string;
  className?: string;
}

export function MathBlock({
  expression,
  matrix,
  highlightTerms = [],
  tone = "signal",
  caption,
  className = "",
}: MathBlockProps) {
  const getHighlightClass = (term: string) => {
    if (highlightTerms.includes(term)) {
      return tone === "signal"
        ? "text-signal font-bold px-1 bg-signal/10 rounded-xs border border-signal"
        : tone === "ok"
        ? "text-ok font-bold px-1 bg-ok/10 rounded-xs border border-ok"
        : "text-info font-bold px-1 bg-info/10 rounded-xs border border-info";
    }
    return "";
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-3 sm:p-4 bg-paper border border-ink shadow-[2px_2px_0_var(--rule)] rounded-[2px] font-mono text-ink ${className}`}
    >
      {/* Matrix Display Mode */}
      {matrix && matrix.length > 0 ? (
        <div className="flex items-center text-sm font-semibold select-none">
          {/* Left Bracket */}
          <div className="w-2.5 self-stretch border-l-2 border-y-2 border-ink rounded-l-xs mr-2" />
          <table className="border-collapse">
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td
                      key={c}
                      className="px-2 py-1 text-center font-bold font-mono text-sm"
                    >
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Right Bracket */}
          <div className="w-2.5 self-stretch border-r-2 border-y-2 border-ink rounded-r-xs ml-2" />
        </div>
      ) : expression ? (
        /* Math Formula Expression */
        <div className="text-base sm:text-lg font-serif italic text-ink tracking-wide select-none flex items-center gap-1.5 flex-wrap">
          {expression.split(" ").map((token, idx) => {
            const isHighlighted = highlightTerms.includes(token);
            return (
              <span
                key={idx}
                className={isHighlighted ? getHighlightClass(token) : ""}
              >
                {/* Format subscripts and superscripts */}
                {token.includes("^") ? (
                  <>
                    <span>{token.split("^")[0]}</span>
                    <sup className="text-xs not-italic font-mono font-bold ml-0.5">
                      {token.split("^")[1]}
                    </sup>
                  </>
                ) : token.includes("_") ? (
                  <>
                    <span>{token.split("_")[0]}</span>
                    <sub className="text-xs not-italic font-mono ml-0.5">
                      {token.split("_")[1]}
                    </sub>
                  </>
                ) : (
                  <span>{token}</span>
                )}
              </span>
            );
          })}
        </div>
      ) : null}

      {caption && (
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft mt-2 border-t border-rule pt-1 w-full text-center">
          {caption}
        </span>
      )}
    </div>
  );
}
