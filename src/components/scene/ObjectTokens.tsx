"use client";

import React from "react";
import { ObjectKind, Tone } from "./types";

interface ObjectTokenProps {
  kind: ObjectKind;
  label?: string;
  value?: string | number[][];
  tone?: Tone;
  isPulsing?: boolean;
  className?: string;
}

export function ObjectToken({
  kind,
  label,
  value,
  tone,
  isPulsing,
  className = "",
}: ObjectTokenProps) {
  const toneBorder =
    tone === "signal"
      ? "border-signal text-signal shadow-[2px_2px_0_var(--signal)]"
      : tone === "ok"
      ? "border-ok text-ok shadow-[2px_2px_0_var(--ok)]"
      : tone === "bad"
      ? "border-bad text-bad shadow-[2px_2px_0_var(--bad)]"
      : tone === "info"
      ? "border-info text-info shadow-[2px_2px_0_var(--info)]"
      : tone === "warn"
      ? "border-warn text-warn shadow-[2px_2px_0_var(--warn)]"
      : "border-rule text-ink shadow-[2px_2px_0_var(--rule)]";

  const renderContent = () => {
    switch (kind) {
      case "plain":
        // Plaintext: ink-black text on a paper chip with 1px border
        return (
          <div
            className={`px-2.5 py-1 bg-paper border ${toneBorder} font-sans text-xs font-semibold flex items-center gap-1.5 rounded-[2px]`}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft bg-card px-1 border border-rule">
              TXT
            </span>
            <span>{typeof value === "string" ? value : label || "PLAINTEXT"}</span>
          </div>
        );

      case "cipher":
        // Ciphertext: vermilion scrambled chip with lock icon flourish
        return (
          <div
            className="px-2.5 py-1 bg-card border border-signal text-signal shadow-[2px_2px_0_var(--signal)] font-mono text-xs font-bold flex items-center gap-1.5 rounded-[2px]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="tracking-widest">
              {typeof value === "string" ? value : label || "C1PH3R#7X"}
            </span>
          </div>
        );

      case "key-pub":
        // Public key: outline key token
        return (
          <div
            className={`px-2 py-1 bg-paper border ${toneBorder} font-mono text-[11px] font-bold flex items-center gap-1.5 rounded-full`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="m21 2-9.6 9.6m5.6-5.6 2 2m-4 0 2 2" />
            </svg>
            <span>{label || "K_pub"}</span>
          </div>
        );

      case "key-priv":
        // Private key: filled key token
        return (
          <div
            className="px-2 py-1 bg-ink border border-ink text-paper font-mono text-[11px] font-bold flex items-center gap-1.5 rounded-full shadow-[2px_2px_0_var(--rule)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <span>{label || "K_priv"}</span>
          </div>
        );

      case "key-shared":
        // Shared secret: double-ringed key token
        return (
          <div
            className="px-2 py-1 bg-card border-2 border-signal text-signal font-mono text-[11px] font-bold flex items-center gap-1.5 rounded-full shadow-[2px_2px_0_var(--signal)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="15" r="5" />
              <circle cx="7" cy="15" r="2.5" />
              <path d="M12 10l9-9m-3 0l3 3m-5 1l2 2" />
            </svg>
            <span>{label || "K_shared"}</span>
          </div>
        );

      case "hash":
        // Hash: fixed-width mono strip with digest icon
        return (
          <div
            className="px-2 py-1 bg-card border border-rule text-ink font-mono text-[10px] tracking-wider flex items-center gap-1.5 rounded-[2px]"
          >
            <span className="font-bold text-ink-soft">#</span>
            <span className="truncate max-w-[120px]">
              {typeof value === "string" ? value : label || "e3b0c44298fc1c149afb"}
            </span>
          </div>
        );

      case "sig":
        // Digital Signature: chip with wax seal icon
        return (
          <div
            className="px-2.5 py-1 bg-paper border border-ok text-ok font-mono text-[11px] font-bold flex items-center gap-1.5 rounded-[2px] shadow-[2px_2px_0_var(--ok)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="6" />
              <path d="m15.5 13.5 2.5 8.5-6-3-6 3 2.5-8.5" />
            </svg>
            <span>{label || "SIG_Bob(H)"}</span>
          </div>
        );

      case "cert":
        // Certificate: card with ribbon icon
        return (
          <div
            className="px-2.5 py-1.5 bg-card border border-info text-info font-sans text-xs font-semibold flex items-center gap-2 rounded-[3px] shadow-[2px_2px_0_var(--info)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="10" r="3" />
              <path d="m9 16 3-2 3 2v3l-3-1-3 1z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] uppercase tracking-wider opacity-75">X.509 Cert</span>
              <span className="font-bold text-[11px]">{label || "example.com"}</span>
            </div>
          </div>
        );

      case "packet":
        // Packet: segmented bar showing header fields
        return (
          <div
            className="inline-flex items-center text-[10px] font-mono border border-ink bg-card rounded-[2px] overflow-hidden shadow-[2px_2px_0_var(--rule)]"
          >
            <span className="px-1.5 py-0.5 bg-ink text-paper font-bold">IP</span>
            <span className="px-1.5 py-0.5 border-r border-rule text-ink-soft">
              {label || "SRC:10.0.0.1"}
            </span>
            <span className="px-1.5 py-0.5 border-r border-rule font-bold text-signal">
              SYN
            </span>
            <span className="px-1.5 py-0.5 bg-paper font-bold">
              {typeof value === "string" ? value : "PAYLOAD"}
            </span>
          </div>
        );

      case "ticket":
        // Kerberos Ticket: dashed edge voucher with seal
        return (
          <div
            className="px-2 py-1 bg-card border-2 border-dashed border-warn text-ink font-mono text-[10px] flex items-center gap-1.5 rounded-[2px]"
          >
            <span className="bg-warn text-paper px-1 py-0.2 font-bold rounded-xs">TGS</span>
            <span>{label || "Ticket_Alice_Server"}</span>
          </div>
        );

      case "bits":
        // Bit strip: binary sequence
        return (
          <div
            className="inline-flex border border-rule font-mono text-[10px] bg-paper divide-x divide-rule rounded-[2px] overflow-hidden"
          >
            {(typeof value === "string" ? value : "10110010").split("").map((b, idx) => (
              <span
                key={idx}
                className={`w-4 text-center py-0.5 ${
                  b === "1" ? "bg-signal/15 text-signal font-bold" : "text-ink-soft"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        );

      case "matrix":
        return (
          <div className="inline-flex items-center font-mono text-xs px-2 py-1 bg-card border-x-2 border-ink border-y border-transparent">
            {label || "[2x2]"}
          </div>
        );

      case "text":
      default:
        return (
          <div className={`px-2 py-0.5 bg-paper border ${toneBorder} font-mono text-xs`}>
            {typeof value === "string" ? value : label || "DATA"}
          </div>
        );
    }
  };

  return (
    <div
      className={`inline-block select-none transition-all duration-300 ${
        isPulsing ? "scale-110 ring-2 ring-signal" : ""
      } ${className}`}
    >
      {renderContent()}
    </div>
  );
}
