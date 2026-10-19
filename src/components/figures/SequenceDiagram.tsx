"use client";

import React, { useState } from "react";
import { Tone } from "../scene/types";
import { Button } from "@/components/ui/Button";

export interface SequenceActor {
  id: string;
  label: string;
  subLabel?: string;
}

export interface SequenceMessage {
  id?: string;
  from: string;
  to: string;
  label: string;
  subLabel?: string;
  tone?: Tone;
  dashed?: boolean;
  note?: string;
}

interface SequenceDiagramProps {
  title?: string;
  actors: SequenceActor[];
  messages: SequenceMessage[];
  stepThrough?: boolean;
  className?: string;
}

export function SequenceDiagram({
  title,
  actors,
  messages,
  stepThrough = true,
  className = "",
}: SequenceDiagramProps) {
  const [activeStep, setActiveStep] = useState(
    stepThrough ? 0 : messages.length - 1
  );

  const visibleMessages = stepThrough
    ? messages.slice(0, activeStep + 1)
    : messages;

  const actorWidth = 140;
  const paddingX = 80;
  const totalWidth = Math.max(600, paddingX * 2 + (actors.length - 1) * actorWidth);
  const rowHeight = 54;
  const headerHeight = 70;
  const totalHeight = headerHeight + (messages.length + 1) * rowHeight;

  const getActorX = (actorId: string): number => {
    const idx = actors.findIndex(a => a.id === actorId);
    if (idx === -1) return paddingX;
    return paddingX + idx * actorWidth;
  };

  const getToneColor = (tone?: Tone) => {
    switch (tone) {
      case "signal":
        return "var(--signal)";
      case "ok":
        return "var(--ok)";
      case "bad":
        return "var(--bad)";
      case "info":
        return "var(--info)";
      case "warn":
        return "var(--warn)";
      default:
        return "var(--ink)";
    }
  };

  return (
    <div
      className={`bg-card border border-ink p-4 rounded-[2px] shadow-[3px_3px_0_var(--rule)] ${className}`}
    >
      {/* Title & Step Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-rule gap-2">
        <div>
          {title && (
            <h4 className="font-serif text-lg font-bold text-ink leading-tight">
              {title}
            </h4>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Sequence Protocol Flow (Step {Math.min(activeStep + 1, messages.length)} of {messages.length})
          </span>
        </div>

        {stepThrough && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className="h-7 px-2 font-mono text-[11px]"
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(s => Math.min(messages.length - 1, s + 1))}
              disabled={activeStep === messages.length - 1}
              className="h-7 px-2 font-mono text-[11px]"
            >
              Next →
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveStep(messages.length - 1)}
              className="h-7 px-1.5 font-mono text-[11px] text-ink-soft"
              title="Show all messages"
            >
              All
            </Button>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="w-full h-auto min-w-[500px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-default"
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
              id="arrow-signal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--signal)" />
            </marker>
            <marker
              id="arrow-bad"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--bad)" />
            </marker>
            <marker
              id="arrow-ok"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--ok)" />
            </marker>
          </defs>

          {/* Actor Boxes and Lifelines */}
          {actors.map(actor => {
            const x = getActorX(actor.id);
            return (
              <g key={actor.id}>
                {/* Lifeline vertical dashed line */}
                <line
                  x1={x}
                  y1={headerHeight - 10}
                  x2={x}
                  y2={totalHeight - 20}
                  stroke="var(--rule)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Actor Header Box */}
                <rect
                  x={x - 55}
                  y={12}
                  width="110"
                  height="36"
                  rx="2"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={28}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fontWeight="bold"
                  fill="var(--ink)"
                >
                  {actor.label}
                </text>
                {actor.subLabel && (
                  <text
                    x={x}
                    y={42}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9"
                    fill="var(--ink-soft)"
                  >
                    {actor.subLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Timed Messages */}
          {visibleMessages.map((msg, idx) => {
            const y = headerHeight + (idx + 1) * rowHeight - 15;
            const x1 = getActorX(msg.from);
            const x2 = getActorX(msg.to);
            const color = getToneColor(msg.tone);
            const markerId =
              msg.tone === "signal"
                ? "url(#arrow-signal)"
                : msg.tone === "bad"
                ? "url(#arrow-bad)"
                : msg.tone === "ok"
                ? "url(#arrow-ok)"
                : "url(#arrow-default)";

            const midX = (x1 + x2) / 2;
            const isSelf = msg.from === msg.to;

            return (
              <g key={idx} className="transition-opacity duration-300">
                {/* Step Index Badge */}
                <circle
                  cx={x1 < x2 ? x1 - 18 : x1 + 18}
                  cy={y}
                  r="7.5"
                  fill="var(--card)"
                  stroke={color}
                  strokeWidth="1"
                />
                <text
                  x={x1 < x2 ? x1 - 18 : x1 + 18}
                  y={y + 3}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="8"
                  fontWeight="bold"
                  fill={color}
                >
                  {idx + 1}
                </text>

                {!isSelf ? (
                  <>
                    {/* Message Arrow Line */}
                    <line
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={color}
                      strokeWidth={msg.tone ? "2" : "1.5"}
                      strokeDasharray={msg.dashed ? "4 3" : undefined}
                      markerEnd={markerId}
                    />

                    {/* Message Label Box */}
                    <rect
                      x={midX - 70}
                      y={y - 18}
                      width="140"
                      height="15"
                      fill="var(--paper)"
                      rx="1"
                    />
                    <text
                      x={midX}
                      y={y - 6}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontSize="10"
                      fontWeight="bold"
                      fill={color}
                    >
                      {msg.label}
                    </text>
                    {msg.subLabel && (
                      <text
                        x={midX}
                        y={y + 11}
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontSize="8.5"
                        fill="var(--ink-soft)"
                      >
                        {msg.subLabel}
                      </text>
                    )}
                  </>
                ) : (
                  // Self-directed processing step / calculation loop
                  <>
                    <path
                      d={`M ${x1} ${y - 10} h 25 v 20 h -25`}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      markerEnd={markerId}
                    />
                    <text
                      x={x1 + 32}
                      y={y + 4}
                      fontFamily="monospace"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill={color}
                    >
                      {msg.label}
                    </text>
                  </>
                )}

                {/* Optional Note / Callout on Right margin */}
                {msg.note && (
                  <text
                    x={totalWidth - 10}
                    y={y}
                    textAnchor="end"
                    fontFamily="monospace"
                    fontSize="9"
                    fill="var(--ink-soft)"
                  >
                    {"// " + msg.note}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
