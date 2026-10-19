"use client";

import React from "react";
import { ActorKind } from "./types";

interface ActorGlyphProps {
  kind: ActorKind;
  label?: string;
  size?: number;
  highlightTone?: 'signal' | 'ok' | 'bad' | 'info' | 'warn';
  isPulsing?: boolean;
  className?: string;
}

export function ActorGlyph({
  kind,
  label,
  size = 54,
  highlightTone,
  isPulsing,
  className = "",
}: ActorGlyphProps) {
  const strokeColor =
    highlightTone === 'signal'
      ? "var(--signal)"
      : highlightTone === 'ok'
      ? "var(--ok)"
      : highlightTone === 'bad'
      ? "var(--bad)"
      : highlightTone === 'info'
      ? "var(--info)"
      : highlightTone === 'warn'
      ? "var(--warn)"
      : "var(--ink)";

  const renderIcon = () => {
    switch (kind) {
      case "alice":
        return (
          // Alice: Sender profile with circle head, distinct headband/hair line, confident posture
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="27" cy="18" r="9" />
            <path d="M20 17c1.5-3 5-5 8-5s6.5 2 7 5" />
            <path d="M14 42c0-7.5 6-12 13-12s13 4.5 13 12" />
            <path d="M36 29l4 4-4 4" strokeWidth="1.5" />
          </g>
        );

      case "bob":
        return (
          // Bob: Receiver profile with glasses/tie detail, receiving posture
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="27" cy="18" r="9" />
            <path d="M21 17h4m4 0h4" />
            <path d="M14 42c0-7.5 6-12 13-12s13 4.5 13 12" />
            <path d="M18 29l-4 4 4 4" strokeWidth="1.5" />
          </g>
        );

      case "eve":
        return (
          // Eve: Eavesdropper with large observing eye / headset listening
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="27" cy="24" rx="16" ry="10" />
            <circle cx="27" cy="24" r="5" fill="currentColor" fillOpacity="0.15" />
            <circle cx="27" cy="24" r="2" fill="currentColor" />
            <path d="M15 39c2-3 6-5 12-5s10 2 12 5" strokeDasharray="2 2" />
          </g>
        );

      case "mallory":
        return (
          // Mallory: Active attacker with spiked crown / injected bolt
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 40c0-6 6-10 13-10s13 4 13 10" />
            <circle cx="27" cy="20" r="8" />
            <path d="M21 12l2 4 4-5 4 5 2-4" />
            <path d="M35 15l8 6-6 1 4 6-9-5" strokeWidth="1.5" fill="var(--signal)" fillOpacity="0.2" />
          </g>
        );

      case "server":
        return (
          // Server: Stacked rack units with drive indicators
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="11" y="10" width="32" height="9" rx="1.5" />
            <rect x="11" y="22" width="32" height="9" rx="1.5" />
            <rect x="11" y="34" width="32" height="9" rx="1.5" />
            <circle cx="16" cy="14.5" r="1.5" fill="currentColor" />
            <circle cx="16" cy="26.5" r="1.5" fill="currentColor" />
            <circle cx="16" cy="38.5" r="1.5" fill="currentColor" />
            <line x1="33" y1="14.5" x2="38" y2="14.5" />
            <line x1="33" y1="26.5" x2="38" y2="26.5" />
            <line x1="33" y1="38.5" x2="38" y2="38.5" />
          </g>
        );

      case "client":
        return (
          // Client: Laptop / Desktop screen with keyboard base
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="13" y="12" width="28" height="20" rx="2" />
            <line x1="8" y1="36" x2="46" y2="36" />
            <path d="M13 32l-3 4h34l-3-4" />
            <circle cx="27" cy="22" r="3" fill="currentColor" fillOpacity="0.2" />
          </g>
        );

      case "ca":
        return (
          // Certificate Authority: Seal of trust with quill / ribbon
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="27" cy="22" r="12" />
            <path d="M21 22l4 4 8-8" strokeWidth="2" />
            <path d="M22 33l-3 10 8-3 8 3-3-10" />
          </g>
        );

      case "kdc":
        return (
          // KDC: Key Distribution Center (vault with dual keys)
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="14" width="30" height="26" rx="2" />
            <circle cx="27" cy="27" r="6" />
            <path d="M27 21v12m-6-6h12" />
            <path d="M22 10l5-4 5 4" />
          </g>
        );

      case "router":
        return (
          // Router: Puck cylinder with 4 crossing directional arrows
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="27" cy="27" rx="17" ry="11" />
            <path d="M19 25l8-4 8 4" />
            <path d="M19 29l8 4 8-4" />
            <path d="M23 20l-4 5 4 5" />
            <path d="M31 20l4 5-4 5" />
          </g>
        );

      case "switch":
        return (
          // Switch: Rectangular box with opposing bidirectional arrows
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="10" y="16" width="34" height="18" rx="2" />
            <path d="M16 22h14m-3-3l3 3-3 3" />
            <path d="M38 28H24m3-3l-3 3 3 3" />
          </g>
        );

      case "firewall":
        return (
          // Firewall: Brick wall with flame emblem
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="10" y="10" width="34" height="30" rx="1.5" />
            <line x1="10" y1="20" x2="44" y2="20" />
            <line x1="10" y1="30" x2="44" y2="30" />
            <line x1="21" y1="10" x2="21" y2="20" />
            <line x1="33" y1="10" x2="33" y2="20" />
            <line x1="16" y1="20" x2="16" y2="30" />
            <line x1="27" y1="20" x2="27" y2="30" />
            <line x1="38" y1="20" x2="38" y2="30" />
            <path d="M27 13c1 3-2 5 0 8 3-2 4-5 0-8z" fill="var(--signal)" stroke="var(--signal)" />
          </g>
        );

      case "ids":
        return (
          // IDS: Radar dish / sensor sweep beam
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 36c4-12 16-16 26-10" />
            <path d="M20 38c3-7 10-10 16-6" />
            <circle cx="34" cy="18" r="3" fill="currentColor" />
            <line x1="34" y1="18" x2="22" y2="28" />
            <path d="M16 42l8-8" />
          </g>
        );

      case "honeypot":
        return (
          // Honeypot: Jar with honey drip & decoy indicator
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="27" cy="12" rx="10" ry="3.5" />
            <path d="M17 12v4c0 3-4 6-4 14 0 7 6 11 14 11s14-4 14-11c0-8-4-11-4-14v-4" />
            <path d="M27 20c-2 2-3 5-1 7 2 2 4 1 3-3" fill="var(--warn)" stroke="var(--warn)" />
          </g>
        );

      case "cloud":
        return (
          // Cloud: Clean multi-arc cloud perimeter
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 35a8 8 0 0 1-2-15 9 9 0 0 1 17-5 11 11 0 0 1 14 9 7 7 0 0 1-5 11z" />
          </g>
        );

      case "db":
        return (
          // Database: Cylindrical storage disks
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="27" cy="13" rx="14" ry="5" />
            <path d="M13 13v9c0 2.8 6.3 5 14 5s14-2.2 14-5v-9" />
            <path d="M13 22v9c0 2.8 6.3 5 14 5s14-2.2 14-5v-9" />
            <path d="M13 31v9c0 2.8 6.3 5 14 5s14-2.2 14-5v-9" />
          </g>
        );

      case "app":
        return (
          // Application: Window frame with sidebar and content layout
          <g stroke={strokeColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="10" y="10" width="34" height="28" rx="2" />
            <line x1="10" y1="18" x2="44" y2="18" />
            <circle cx="15" cy="14" r="1.5" fill="currentColor" />
            <circle cx="20" cy="14" r="1.5" fill="currentColor" />
            <line x1="20" y1="18" x2="20" y2="38" />
          </g>
        );

      default:
        return (
          <g stroke={strokeColor} strokeWidth="1.75" fill="none">
            <circle cx="27" cy="27" r="18" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${
        isPulsing ? "animate-pulse" : ""
      } ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 54 54"
        className="transition-colors duration-200"
      >
        {/* Paper base circle for contrast */}
        <circle
          cx="27"
          cy="27"
          r="24"
          fill="var(--card)"
          stroke={strokeColor}
          strokeWidth="1"
          strokeDasharray={highlightTone ? undefined : "2 2"}
          className="transition-all"
        />
        {renderIcon()}
      </svg>
      {label && (
        <span
          className="font-mono text-[10px] tracking-widest uppercase mt-1 px-1 py-0.5 rounded border border-rule bg-paper text-ink max-w-[80px] truncate text-center"
          title={label}
        >
          {label}
        </span>
      )}
    </div>
  );
}
