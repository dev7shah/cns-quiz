"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export type PacketMode = "standard" | "ipsec-ah" | "ipsec-esp";

interface PacketBuilderProps {
  initialSrcIp?: string;
  initialDstIp?: string;
  initialProtocol?: "TCP" | "UDP" | "ICMP";
  initialDstPort?: number;
  initialFlags?: string[];
  initialMode?: PacketMode;
  className?: string;
}

export function PacketBuilder({
  initialSrcIp = "192.168.1.105",
  initialDstIp = "10.0.0.1",
  initialProtocol = "TCP",
  initialDstPort = 80,
  initialFlags = ["SYN"],
  initialMode = "standard",
  className = "",
}: PacketBuilderProps) {
  const [srcIp, setSrcIp] = useState(initialSrcIp);
  const [dstIp, setDstIp] = useState(initialDstIp);
  const [protocol, setProtocol] = useState(initialProtocol);
  const [dstPort, setDstPort] = useState(initialDstPort);
  const [flags, setFlags] = useState<string[]>(initialFlags);
  const [mode, setMode] = useState<PacketMode>(initialMode);
  const [isTunnelMode, setIsTunnelMode] = useState(false);

  const availableFlags = ["SYN", "ACK", "FIN", "RST", "PSH", "URG"];

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.filter(x => x !== f));
    } else {
      setFlags([...flags, f]);
    }
  };

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Interactive Packet Builder & Header Inspector
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {mode === "standard"
              ? "L3 / L4 Datagram Construction"
              : `IPsec Security Architecture (${mode === "ipsec-ah" ? "AH Authentication Header" : "ESP Encapsulating Security Payload"}) · ${isTunnelMode ? "Tunnel Mode" : "Transport Mode"}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={mode === "standard" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("standard")}
            className="h-7 text-xs font-mono"
          >
            Raw Packet
          </Button>
          <Button
            variant={mode === "ipsec-ah" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("ipsec-ah")}
            className="h-7 text-xs font-mono"
          >
            IPsec AH
          </Button>
          <Button
            variant={mode === "ipsec-esp" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("ipsec-esp")}
            className="h-7 text-xs font-mono"
          >
            IPsec ESP
          </Button>
          {mode !== "standard" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTunnelMode(t => !t)}
              className="h-7 text-xs font-mono border-signal text-signal"
            >
              {isTunnelMode ? "Tunnel: ON" : "Transport: ON"}
            </Button>
          )}
        </div>
      </div>

      {/* Visual Segmented Packet Bar */}
      <div className="space-y-3 font-mono text-xs select-none">
        <div className="flex flex-col sm:flex-row border-2 border-ink rounded-[2px] overflow-hidden shadow-[2px_2px_0_var(--rule)] divide-y sm:divide-y-0 sm:divide-x divide-ink bg-paper">
          {/* Outer IP (Tunnel Mode) */}
          {mode !== "standard" && isTunnelMode && (
            <div className="p-2.5 bg-signal/15 flex flex-col justify-center min-w-[120px]">
              <span className="text-[9px] uppercase tracking-wider text-signal font-bold">New Outer IP</span>
              <span className="font-semibold text-ink truncate">GW: 203.0.113.1</span>
            </div>
          )}

          {/* IPsec AH Header */}
          {mode === "ipsec-ah" && (
            <div className="p-2.5 bg-ok/20 border-r-2 border-ok flex flex-col justify-center min-w-[110px]">
              <span className="text-[9px] uppercase tracking-wider text-ok font-bold">AH Header</span>
              <span className="font-semibold text-ink text-[11px]">SPI | Seq | ICV</span>
            </div>
          )}

          {/* IPsec ESP Header */}
          {mode === "ipsec-esp" && (
            <div className="p-2.5 bg-info/20 border-r-2 border-info flex flex-col justify-center min-w-[100px]">
              <span className="text-[9px] uppercase tracking-wider text-info font-bold">ESP Header</span>
              <span className="font-semibold text-ink text-[11px]">SPI | Seq#</span>
            </div>
          )}

          {/* Base IP Header */}
          <div className="p-2.5 flex-1 bg-paper">
            <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-bold">
              {isTunnelMode ? "Inner IP Header (Original)" : "IP Header (20 Bytes)"}
            </span>
            <div className="flex justify-between items-center text-xs mt-0.5">
              <span>Src: <strong className="text-signal">{srcIp}</strong></span>
              <span>Dst: <strong className="text-ink">{dstIp}</strong></span>
            </div>
          </div>

          {/* Transport Header (TCP/UDP) */}
          <div className="p-2.5 bg-card min-w-[150px]">
            <span className="text-[9px] uppercase tracking-wider text-ink-soft block font-bold">
              {protocol} Header
            </span>
            <div className="flex justify-between items-center text-xs mt-0.5">
              <span>Port: <strong className="text-signal">{dstPort}</strong></span>
              <span className="text-[10px] text-signal font-bold">
                {flags.length > 0 ? flags.join("+") : "NONE"}
              </span>
            </div>
          </div>

          {/* Payload Data */}
          <div
            className={`p-2.5 flex-1 flex flex-col justify-center ${
              mode === "ipsec-esp"
                ? "bg-signal text-paper font-bold"
                : "bg-paper text-ink"
            }`}
          >
            <span className={`text-[9px] uppercase tracking-wider block font-bold ${mode === "ipsec-esp" ? "text-paper" : "text-ink-soft"}`}>
              {mode === "ipsec-esp" ? "Encrypted Payload (Confidential)" : "Payload Data (Cleartext)"}
            </span>
            <span className="text-xs truncate font-mono">
              {mode === "ipsec-esp" ? "3f7a81c0...[ENCRYPTED]" : "GET /index.html HTTP/1.1"}
            </span>
          </div>

          {/* ESP Trailer and Auth Tag */}
          {mode === "ipsec-esp" && (
            <div className="p-2.5 bg-ok/20 border-l-2 border-ok flex flex-col justify-center min-w-[120px]">
              <span className="text-[9px] uppercase tracking-wider text-ok font-bold">ESP Auth</span>
              <span className="font-semibold text-ink text-[11px]">ICV Tag (HMAC)</span>
            </div>
          )}
        </div>

        {/* IPsec Protection Legend */}
        {mode !== "standard" && (
          <div className="flex items-center gap-4 text-[10px] font-mono border-t border-rule pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-ok/40 border border-ok inline-block" />
              <span>Authenticated & Integrity Protected (HMAC-SHA256)</span>
            </div>
            {mode === "ipsec-esp" && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-signal border border-signal inline-block" />
                <span>Encrypted & Confidential (AES-GCM / CBC)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Controls Panel */}
      <div className="mt-4 pt-4 border-t border-rule grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        {/* Source IP */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-soft block font-bold mb-1">
            Source IP (Spoofing):
          </label>
          <input
            type="text"
            value={srcIp}
            onChange={e => setSrcIp(e.target.value)}
            className="w-full px-2 py-1 bg-paper border border-ink text-ink rounded-xs font-mono text-xs"
          />
        </div>

        {/* Destination IP & Protocol */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-soft block font-bold mb-1">
            Dst IP & Protocol:
          </label>
          <div className="flex gap-1.5 mb-1">
            <input
              type="text"
              value={dstIp}
              onChange={e => setDstIp(e.target.value)}
              className="flex-1 px-2 py-1 bg-paper border border-ink text-ink rounded-xs font-mono text-xs"
            />
            <div className="flex gap-1">
              {(["TCP", "UDP", "ICMP"] as const).map(pr => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setProtocol(pr)}
                  className={`px-1.5 py-0.5 border text-[10px] font-bold cursor-pointer rounded-xs ${
                    protocol === pr
                      ? "bg-signal text-paper border-signal"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dest Port */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-soft block font-bold mb-1">
            Destination Port:
          </label>
          <div className="flex gap-1.5">
            {[80, 443, 22, 53].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setDstPort(p)}
                className={`flex-1 py-1 border text-xs cursor-pointer rounded-xs ${
                  dstPort === p
                    ? "bg-signal text-paper border-signal font-bold"
                    : "bg-paper text-ink border-rule hover:border-ink"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* TCP Flags */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-ink-soft block font-bold mb-1">
            TCP Flags (Scanning):
          </label>
          <div className="flex flex-wrap gap-1">
            {availableFlags.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={`px-1.5 py-0.5 border text-[10px] font-bold cursor-pointer rounded-xs ${
                  flags.includes(f)
                    ? "bg-signal text-paper border-signal"
                    : "bg-paper text-ink-soft border-rule hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
