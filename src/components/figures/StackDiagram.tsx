"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface StackDiagramProps {
  initialMode?: "memory" | "layers";
  className?: string;
}

export function StackDiagram({
  initialMode = "memory",
  className = "",
}: StackDiagramProps) {
  const [mode, setMode] = useState<"memory" | "layers">(initialMode);

  // Memory mode state
  const [inputLength, setInputLength] = useState(16); // buffer is 16 bytes
  const bufferCapacity = 16;

  // Layer mode state
  const [activeLayer, setActiveLayer] = useState<number>(3); // 0: Link, 1: Network, 2: Transport, 3: Application

  const layers = [
    {
      name: "Application Layer",
      protocols: "HTTP, DNS, TLS, SSH, SMTP",
      attacks: "DNS Spoofing, DNS Tunneling, Prompt Injection, SQLi",
      defense: "Input sanitization, DNSSEC, TLS encryption",
    },
    {
      name: "Transport Layer",
      protocols: "TCP, UDP",
      attacks: "TCP SYN Flood, Port Scanning, Session Hijacking",
      defense: "SYN Cookies, stateful firewall, rate limiting",
    },
    {
      name: "Network / Internet Layer",
      protocols: "IP, ICMP, ARP",
      attacks: "IP Spoofing, ICMP Ping of Death, Smurf Attack",
      defense: "Ingress/egress packet filtering, IPSec (AH/ESP)",
    },
    {
      name: "Data Link Layer",
      protocols: "Ethernet, Wi-Fi 802.11, ARP",
      attacks: "ARP Spoofing, MAC Flooding, Packet Sniffing",
      defense: "Dynamic ARP Inspection (DAI), 802.1X, Port Security",
    },
  ];

  const hasOverflow = inputLength > bufferCapacity;
  const canarySmashed = inputLength > bufferCapacity + 4;
  const returnAddrSmashed = inputLength > bufferCapacity + 8;

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            {mode === "memory"
              ? "Memory Stack Frame & Buffer Overflow Simulation"
              : "TCP/IP Layered Security Architecture"}
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {mode === "memory"
              ? "High Memory Address → Low Memory Address (Grows Downward)"
              : "Layer-wise Encapsulation & Threat Model"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={mode === "memory" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("memory")}
            className="h-7 text-xs font-mono"
          >
            Memory Stack Frame
          </Button>
          <Button
            variant={mode === "layers" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("layers")}
            className="h-7 text-xs font-mono"
          >
            Protocol Layers
          </Button>
        </div>
      </div>

      {mode === "memory" ? (
        /* Memory Stack Frame View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-paper border border-rule rounded-[2px] text-xs font-mono">
            <div>
              <span className="font-bold text-ink uppercase text-[11px] block">
                Simulated User Input (Payload Length: {inputLength} bytes)
              </span>
              <span className="text-ink-soft text-[10px]">
                Safe limit: {bufferCapacity} bytes | Canary at 20 bytes | Return address at 24 bytes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="32"
                value={inputLength}
                onChange={e => setInputLength(Number(e.target.value))}
                className="w-32 accent-signal cursor-pointer"
              />
              <span className="font-bold w-12 text-right">{inputLength} B</span>
            </div>
          </div>

          <div className="flex flex-col max-w-md mx-auto border-2 border-ink bg-paper divide-y divide-rule font-mono text-xs shadow-[3px_3px_0_var(--rule)]">
            {/* Function Arguments */}
            <div className="p-3 bg-card flex justify-between items-center text-ink-soft">
              <span>Function Arguments</span>
              <span className="text-[10px] opacity-60">[0x7fffffffe000] High</span>
            </div>

            {/* Return Address */}
            <div
              className={`p-3 transition-colors flex justify-between items-center ${
                returnAddrSmashed
                  ? "bg-bad text-paper font-bold animate-pulse"
                  : "bg-paper text-ink"
              }`}
            >
              <span>Saved Return Address (EIP / RIP)</span>
              <span className="text-[10px]">
                {returnAddrSmashed ? "0x41414141 (Hijacked!)" : "0x00401152 (main)"}
              </span>
            </div>

            {/* Saved Frame Pointer */}
            <div
              className={`p-3 transition-colors flex justify-between items-center ${
                canarySmashed ? "bg-bad/20 text-bad font-semibold" : "bg-paper text-ink"
              }`}
            >
              <span>Saved Frame Pointer (EBP / RBP)</span>
              <span className="text-[10px]">[0x7fffffffdfc0]</span>
            </div>

            {/* Stack Canary */}
            <div
              className={`p-2.5 transition-colors flex justify-between items-center ${
                canarySmashed
                  ? "bg-bad text-paper font-bold"
                  : "bg-ok/15 text-ok font-semibold"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{canarySmashed ? "✕" : "🛡️"}</span>
                <span>Stack Canary (Guard)</span>
              </div>
              <span className="text-[10px]">
                {canarySmashed ? "SMASHED (SIGABRT)" : "0x00f72b10"}
              </span>
            </div>

            {/* Local Buffer */}
            <div
              className={`p-4 transition-colors ${
                hasOverflow
                  ? "bg-signal/20 border-2 border-signal text-signal font-semibold"
                  : "bg-paper text-ink"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span>char buffer[16]</span>
                <span className="text-[10px] text-ink-soft">[0x7fffffffdfa0] Low</span>
              </div>
              <div className="w-full bg-card h-4 border border-rule rounded-xs overflow-hidden flex">
                <div
                  className={`h-full transition-all ${
                    hasOverflow ? "bg-signal" : "bg-ink"
                  }`}
                  style={{
                    width: `${Math.min(100, (inputLength / bufferCapacity) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Defense Callout */}
          <div className="p-3 bg-paper border-l-4 border-signal text-xs font-sans text-ink leading-relaxed">
            <strong className="font-mono text-[10px] uppercase tracking-wider text-signal block mb-1">
              Stack Defenses in Modern OS:
            </strong>
            1. <strong>Stack Canaries:</strong> Random integer preceding the return address checked before function epilogue.<br />
            2. <strong>DEP / NX (No-Execute):</strong> Marks stack memory as non-executable, preventing injected shellcode execution.<br />
            3. <strong>ASLR:</strong> Randomizes memory segment addresses on each run.
          </div>
        </div>
      ) : (
        /* Protocol Layers View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {layers.map((l, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveLayer(idx)}
                className={`p-3 text-left border rounded-[2px] transition-all cursor-pointer font-mono ${
                  activeLayer === idx
                    ? "bg-signal text-paper border-signal shadow-[2px_2px_0_var(--signal)] font-bold"
                    : "bg-card text-ink border-rule hover:border-ink"
                }`}
              >
                <div className="text-[9px] uppercase tracking-wider opacity-75">
                  Layer {4 - idx}
                </div>
                <div className="text-xs truncate">{l.name.replace(" Layer", "")}</div>
              </button>
            ))}
          </div>

          {/* Active Layer Details */}
          <div className="p-4 bg-paper border border-ink rounded-[2px] shadow-[2px_2px_0_var(--rule)] space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-rule pb-2">
              <h5 className="font-serif text-base font-bold text-ink">
                {layers[activeLayer].name}
              </h5>
              <span className="font-mono text-[10px] text-signal font-bold uppercase tracking-wider">
                Protocols: {layers[activeLayer].protocols}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-bad/10 border-l-4 border-bad rounded-r-[2px]">
                <strong className="font-mono text-[10px] uppercase tracking-wider text-bad block mb-1">
                  Layer Vulnerabilities & Attacks:
                </strong>
                <p className="text-ink font-medium leading-relaxed">
                  {layers[activeLayer].attacks}
                </p>
              </div>

              <div className="p-3 bg-ok/10 border-l-4 border-ok rounded-r-[2px]">
                <strong className="font-mono text-[10px] uppercase tracking-wider text-ok block mb-1">
                  Control Mechanisms & Defenses:
                </strong>
                <p className="text-ink font-medium leading-relaxed">
                  {layers[activeLayer].defense}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
