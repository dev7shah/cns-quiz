"use client";

import React, { useState } from "react";

interface SceneLegendProps {
  customItems?: string[];
  className?: string;
}

export function SceneLegend({ customItems, className = "" }: SceneLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`absolute top-3 right-3 z-20 ${className}`}>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-2 py-1 bg-card/90 backdrop-blur-sm border border-rule text-ink hover:border-ink font-mono text-[10px] uppercase tracking-wider rounded-[3px] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          title="Open figure legend"
        >
          <span className="w-2 h-2 rounded-full bg-signal inline-block" />
          <span>Legend</span>
        </button>
      ) : (
        <div className="bg-card/95 backdrop-blur-md border border-ink p-3 rounded-[3px] shadow-[3px_3px_0_var(--rule)] text-left font-mono text-[10px] w-60 text-ink animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-rule pb-1.5 mb-2">
            <span className="font-bold uppercase tracking-wider text-ink">Visual Legend</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:text-signal cursor-pointer text-xs leading-none"
            >
              ✕
            </button>
          </div>

          {/* Color Meaning Guide */}
          <div className="space-y-1 mb-2.5">
            <div className="text-[9px] uppercase tracking-widest text-ink-soft font-bold mb-1">
              Colors by Meaning
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-signal border border-signal shrink-0" />
              <span>Vermilion: Encrypted / Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-ok border border-ok shrink-0" />
              <span>Green: Verified / Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-bad border border-bad shrink-0" />
              <span>Red: Attack / Vulnerability</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-info border border-info shrink-0" />
              <span>Blue: Public Key / Trust</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-warn border border-warn shrink-0" />
              <span>Amber: Caution / Warning</span>
            </div>
          </div>

          {/* Custom Figure Specific Items */}
          {customItems && customItems.length > 0 && (
            <div className="border-t border-rule pt-2">
              <div className="text-[9px] uppercase tracking-widest text-ink-soft font-bold mb-1">
                Figure Keys
              </div>
              <ul className="space-y-0.5 list-disc list-inside text-ink-soft">
                {customItems.map((item, idx) => (
                  <li key={idx} className="truncate" title={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
