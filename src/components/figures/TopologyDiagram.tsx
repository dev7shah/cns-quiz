"use client";

import React, { useState } from "react";
import { ActorGlyph } from "../scene/ActorGlyphs";

export interface TopologyNode {
  id: string;
  label: string;
  kind: "client" | "server" | "firewall" | "router" | "honeypot" | "cloud" | "db";
  zone: "WAN" | "DMZ" | "LAN" | "CLOUD";
  ip: string;
  role: string;
  threats: string[];
  controls: string[];
  x: number;
  y: number;
}

interface TopologyDiagramProps {
  className?: string;
}

export function TopologyDiagram({ className = "" }: TopologyDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("dmz-web");

  const nodes: TopologyNode[] = [
    {
      id: "wan-client",
      label: "Public Client / Eve",
      kind: "client",
      zone: "WAN",
      ip: "198.51.100.42",
      role: "External untrusted visitor or attacker traversing the public internet.",
      threats: ["SYN Floods", "DDoS attacks", "Port Scans", "SQLi/XSS Probing"],
      controls: ["Edge Rate Limiting", "DDoS Scrubbing (Cloudflare/AWS Shield)", "WAF"],
      x: 60,
      y: 130,
    },
    {
      id: "edge-fw",
      label: "Edge Firewall",
      kind: "firewall",
      zone: "WAN",
      ip: "203.0.113.1",
      role: "Stateless/Stateful packet filter dropping unauthorized incoming traffic.",
      threats: ["State table exhaustion", "IP spoofing", "ACL bypass"],
      controls: ["Default Deny ACLs", "SYN Flood protection", "Anti-spoofing ingress filter"],
      x: 180,
      y: 130,
    },
    {
      id: "dmz-web",
      label: "Public Web Server",
      kind: "server",
      zone: "DMZ",
      ip: "192.168.1.10",
      role: "Public-facing HTTPS web server in Demilitarized Zone (DMZ).",
      threats: ["Zero-day RCE", "SQL injection", "Defacement"],
      controls: ["Isolated subnet", "No outbound connections into Internal LAN", "TLS 1.3"],
      x: 300,
      y: 80,
    },
    {
      id: "dmz-honeypot",
      label: "Decoy Honeypot",
      kind: "honeypot",
      zone: "DMZ",
      ip: "192.168.1.99",
      role: "Intentionally vulnerable server designed to detect and log attacker techniques.",
      threats: ["Attacker escape into real network", "Resource abuse"],
      controls: ["Strict sandboxing", "Full PCAP session logging", "Immediate SOC alert"],
      x: 300,
      y: 180,
    },
    {
      id: "internal-fw",
      label: "Internal Firewall",
      kind: "firewall",
      zone: "LAN",
      ip: "10.0.0.1",
      role: "Prevents compromised DMZ servers from pivoting into private database LAN.",
      threats: ["Lateral movement", "Credential reuse"],
      controls: ["Strict port 5432 whitelist only", "Zero Trust Mutual TLS (mTLS)"],
      x: 420,
      y: 130,
    },
    {
      id: "lan-db",
      label: "Production DB",
      kind: "db",
      zone: "LAN",
      ip: "10.0.0.50",
      role: "Internal crown-jewel database storing customer records and password hashes.",
      threats: ["Data exfiltration", "Ransomware encryption", "Privilege escalation"],
      controls: ["No public internet access", "Encryption at rest", "Parameterized queries"],
      x: 540,
      y: 130,
    },
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-2">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            Defense-in-Depth Network Topology
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Click any network node or security zone to inspect security controls
          </span>
        </div>
      </div>

      {/* SVG Architecture Canvas */}
      <div className="overflow-x-auto w-full">
        <div className="relative border border-ink bg-paper rounded-[2px] overflow-hidden select-none min-w-[550px]">
          <svg
            viewBox="0 0 620 250"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
          {/* Zone Rectangles */}
          {/* WAN / Internet Zone */}
          <rect
            x="15"
            y="20"
            width="100"
            height="210"
            fill="var(--bad)"
            fillOpacity="0.05"
            stroke="var(--bad)"
            strokeWidth="1"
            strokeDasharray="4 4"
            rx="4"
          />
          <text
            x="65"
            y="40"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            fill="var(--bad)"
          >
            WAN (UNTRUSTED)
          </text>

          {/* DMZ Zone */}
          <rect
            x="240"
            y="20"
            width="120"
            height="210"
            fill="var(--warn)"
            fillOpacity="0.05"
            stroke="var(--warn)"
            strokeWidth="1"
            strokeDasharray="4 4"
            rx="4"
          />
          <text
            x="300"
            y="40"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            fill="var(--warn)"
          >
            DMZ (BUFFER)
          </text>

          {/* Internal LAN Zone */}
          <rect
            x="480"
            y="20"
            width="120"
            height="210"
            fill="var(--ok)"
            fillOpacity="0.05"
            stroke="var(--ok)"
            strokeWidth="1"
            strokeDasharray="4 4"
            rx="4"
          />
          <text
            x="540"
            y="40"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="10"
            fontWeight="bold"
            fill="var(--ok)"
          >
            INTERNAL LAN
          </text>

          {/* Interconnecting Links */}
          <line x1="60" y1="130" x2="180" y2="130" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1="180" y1="130" x2="300" y2="80" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1="180" y1="130" x2="300" y2="180" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="300" y1="80" x2="420" y2="130" stroke="var(--ink)" strokeWidth="1.5" />
          <line x1="420" y1="130" x2="540" y2="130" stroke="var(--ink)" strokeWidth="1.5" />
        </svg>

        {/* Interactive Clickable Node Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {nodes.map(n => {
            const isSelected = n.id === selectedNodeId;
            const leftPct = (n.x / 620) * 100;
            const topPct = (n.y / 250) * 100;

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-1 rounded transition-all ${
                  isSelected ? "scale-110 ring-2 ring-signal" : "hover:scale-105"
                }`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                title={`${n.label} (${n.ip})`}
              >
                <ActorGlyph
                  kind={n.kind}
                  label={n.label}
                  size={46}
                  highlightTone={isSelected ? "signal" : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {/* Inspector Panel for Selected Node */}
      <div className="mt-4 p-4 bg-paper border border-ink rounded-[2px] shadow-[2px_2px_0_var(--rule)] space-y-3 font-sans text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rule pb-2 gap-1 font-mono">
          <div>
            <span className="font-bold text-sm text-ink">{selectedNode.label}</span>
            <span className="text-ink-soft ml-2">[{selectedNode.ip}]</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-signal px-2 py-0.5 border border-signal bg-card rounded-xs self-start sm:self-auto">
            Zone: {selectedNode.zone}
          </span>
        </div>

        <p className="text-ink font-medium leading-relaxed">
          {selectedNode.role}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 bg-bad/10 border-l-4 border-bad rounded-r-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-bad block mb-1">
              Top Threats:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-ink-soft">
              {selectedNode.threats.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 bg-ok/10 border-l-4 border-ok rounded-r-xs">
            <span className="font-mono text-[10px] uppercase font-bold text-ok block mb-1">
              Required Controls:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-ink-soft">
              {selectedNode.controls.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
