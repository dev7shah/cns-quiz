"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { Scene, Vec } from "./types";
import { computeSceneState } from "./reducer";
import { ActorGlyph } from "./ActorGlyphs";
import { ObjectToken } from "./ObjectTokens";
import { SceneLegend } from "./SceneLegend";
import { Button } from "@/components/ui/Button";

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface ScenePlayerProps {
  scene: Scene;
  initialStep?: number;
  autoPlayIntervalMs?: number;
  className?: string;
  onStepChange?: (stepIndex: number) => void;
}

export function ScenePlayer({
  scene,
  initialStep = 0,
  autoPlayIntervalMs = 2800,
  className = "",
  onStepChange,
}: ScenePlayerProps) {
  const [stepIndex, setStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEli5, setShowEli5] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const totalSteps = scene.steps.length;
  const state = computeSceneState(scene, stepIndex);

  const goToStep = useCallback(
    (target: number) => {
      const nextIndex = Math.max(0, Math.min(target, totalSteps - 1));
      setStepIndex(nextIndex);
      onStepChange?.(nextIndex);
    },
    [totalSteps, onStepChange]
  );

  const handleNext = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      goToStep(stepIndex + 1);
    } else {
      setIsPlaying(false);
    }
  }, [stepIndex, totalSteps, goToStep]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1);
    }
  }, [stepIndex, goToStep]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    goToStep(0);
  }, [goToStep]);

  const togglePlay = useCallback(() => {
    if (stepIndex >= totalSteps - 1) {
      goToStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(p => !p);
    }
  }, [stepIndex, totalSteps, goToStep]);

  // Autoplay ticker
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayIntervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext, autoPlayIntervalMs]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        setShowEli5(s => !s);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, togglePlay, handleReset]);

  // SVG Export for printable handouts
  const exportStaticSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${scene.id || "figure"}-final-frame.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // Helper to resolve an object's coordinates
  const resolveCoord = (at: Vec | { actor: string }): Vec => {
    if ("actor" in at) {
      const actor = state.actors.find(a => a.id === at.actor);
      if (actor) {
        return { x: actor.pos.x, y: actor.pos.y + 40 };
      }
      return { x: 50, y: 50 };
    }
    return at;
  };

  // Parse viewBox coordinates to scale objects accurately
  const [minX, minY, vbWidth, vbHeight] = scene.viewBox.split(" ").map(Number);

  return (
    <div
      className={`relative flex flex-col bg-card border border-ink shadow-[4px_4px_0_var(--rule)] rounded-[2px] overflow-hidden ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-rule bg-paper font-mono text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-signal uppercase tracking-wider text-[11px]">
            {scene.title}
          </span>
          <span className="text-rule hidden sm:inline">|</span>
          <span className="text-ink-soft text-[10px] hidden sm:inline">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowEli5(e => !e)}
            className={`px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider border transition-all rounded-[2px] cursor-pointer ${
              showEli5
                ? "bg-signal text-paper border-signal font-bold"
                : "bg-card text-ink-soft border-rule hover:border-ink hover:text-ink"
            }`}
            title="Toggle ELI5 / Plain English explanation"
          >
            {showEli5 ? "💡 ELI5: ON" : "💡 ELI5"}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={exportStaticSVG}
            className="h-6 px-1.5 text-[9px] uppercase font-mono text-ink-soft hover:text-ink"
            title="Download static SVG of this scene"
          >
            Export SVG
          </Button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] bg-paper select-none overflow-hidden">
        {/* Figure Corner Legend */}
        <SceneLegend customItems={scene.legend} />

        <svg
          ref={svgRef}
          viewBox={scene.viewBox}
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Lab Notebook Coordinate Grid */}
          <defs>
            <pattern
              id={`grid-${scene.id}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--rule)"
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${scene.id})`} />

          {/* Zones (Eavesdrop zones, trust boundaries, VPCs) */}
          {scene.zones?.map(zone => {
            const isVisible = state.zones[zone.id];
            if (!isVisible) return null;
            const strokeColor =
              zone.tone === "bad"
                ? "var(--bad)"
                : zone.tone === "signal"
                ? "var(--signal)"
                : "var(--rule)";
            const fillColor =
              zone.tone === "bad"
                ? "var(--bad)"
                : zone.tone === "signal"
                ? "var(--signal)"
                : "var(--ink)";

            return (
              <g key={zone.id} className="transition-opacity duration-300">
                <rect
                  x={zone.rect.x}
                  y={zone.rect.y}
                  width={zone.rect.width}
                  height={zone.rect.height}
                  fill={fillColor}
                  fillOpacity="0.06"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeDasharray={zone.dashed ? "6 4" : undefined}
                  rx="4"
                />
                <text
                  x={zone.rect.x + 8}
                  y={zone.rect.y + 16}
                  fill={strokeColor}
                  fontFamily="monospace"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  {zone.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Channels between adjacent actors */}
          {state.actors.map((actor, idx) => {
            const nextActor = state.actors[idx + 1];
            if (!nextActor) return null;
            return (
              <line
                key={`channel-${actor.id}-${nextActor.id}`}
                x1={actor.pos.x}
                y1={actor.pos.y}
                x2={nextActor.pos.x}
                y2={nextActor.pos.y}
                stroke="var(--rule)"
                strokeWidth="1.25"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* HTML Layer for Actors, Tokens, Bubbles with CSS transforms */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Render Actors */}
          {state.actors.map(actor => {
            const leftPct = ((actor.pos.x - minX) / vbWidth) * 100;
            const topPct = ((actor.pos.y - minY) / vbHeight) * 100;
            const highlightTone = state.highlights[actor.id];
            const isPulsing = state.pulsing[actor.id] && !prefersReducedMotion;
            const bubbleText = state.bubbles[actor.id];

            return (
              <div
                key={actor.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {/* Speech Bubble */}
                {bubbleText && (
                  <div className="mb-1.5 px-2 py-1 bg-ink text-paper text-[10px] font-sans font-medium rounded-[2px] shadow-sm relative whitespace-nowrap animate-in fade-in zoom-in-90 duration-200">
                    {bubbleText}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-ink border-t-4 border-x-transparent border-x-4 border-b-0" />
                  </div>
                )}

                <ActorGlyph
                  kind={actor.kind}
                  label={actor.label}
                  highlightTone={highlightTone}
                  isPulsing={isPulsing}
                />
              </div>
            );
          })}

          {/* Render Dynamic Objects (Tokens, Packets, Keys) */}
          {Object.entries(state.objects).map(([objId, obj]) => {
            const coord = resolveCoord(obj.at);
            const leftPct = ((coord.x - minX) / vbWidth) * 100;
            const topPct = ((coord.y - minY) / vbHeight) * 100;
            const isPulsing = state.pulsing[objId] && !prefersReducedMotion;

            return (
              <div
                key={objId}
                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto ${
                  prefersReducedMotion
                    ? ""
                    : "transition-all duration-500 ease-out"
                }`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                <ObjectToken
                  kind={obj.kind}
                  label={obj.label}
                  value={obj.value}
                  tone={obj.tone}
                  isPulsing={isPulsing}
                />
              </div>
            );
          })}

          {/* Active Formula Overlay */}
          {state.formula && (
            <div className="absolute bottom-3 left-4 px-3 py-1.5 bg-paper/95 border border-ink text-ink font-mono text-xs shadow-[2px_2px_0_var(--rule)] rounded-[2px]">
              <span className="font-bold text-signal mr-1.5">FORMULA:</span>
              <span className="tracking-wider">{state.formula.tex}</span>
            </div>
          )}
        </div>
      </div>

      {/* Caption Banner (One sentence, plain words, max 18 words) */}
      <div className="p-3 sm:p-4 bg-paper border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-signal font-bold">
              {showEli5 ? "In Plain English (ELI5)" : `Step ${stepIndex + 1}`}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed font-medium">
            {showEli5 && state.eli5 ? state.eli5 : state.caption}
          </p>
        </div>

        {/* Step Navigation Controls & Scrub Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="h-7 px-2 font-mono text-[11px]"
            title="Previous step (←)"
          >
            ← Back
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            className="h-7 px-2.5 font-mono text-[11px]"
            title="Auto-play / Pause (Space)"
          >
            {isPlaying ? "❚❚ Pause" : "▶ Play"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={stepIndex === totalSteps - 1}
            className="h-7 px-2 font-mono text-[11px]"
            title="Next step (→)"
          >
            Next →
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-1.5 font-mono text-[11px] text-ink-soft hover:text-ink"
            title="Reset figure to start (R)"
          >
            ↺
          </Button>
        </div>
      </div>

      {/* Interactive Scrub Bar */}
      <div className="h-1.5 w-full bg-rule/40 flex items-stretch cursor-pointer">
        {scene.steps.map((_, idx) => (
          <div
            key={idx}
            onClick={() => goToStep(idx)}
            className={`flex-1 transition-colors border-r border-paper last:border-0 ${
              idx <= stepIndex ? "bg-signal" : "hover:bg-ink-soft/40"
            }`}
            title={`Jump to step ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
