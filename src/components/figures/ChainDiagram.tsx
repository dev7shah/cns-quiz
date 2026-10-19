"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ChainNode {
  id: string;
  type: "root-ca" | "intermediate-ca" | "end-entity" | "hash-block";
  title: string;
  subject: string;
  issuer: string;
  keyType: string;
  status: "valid" | "invalid" | "untrusted";
}

interface ChainDiagramProps {
  initialMode?: "pki" | "hash";
  className?: string;
}

export function ChainDiagram({
  initialMode = "pki",
  className = "",
}: ChainDiagramProps) {
  const [mode, setMode] = useState<"pki" | "hash">(initialMode);
  const [isTampered, setIsTampered] = useState(false);

  const pkiNodes: ChainNode[] = [
    {
      id: "root",
      type: "root-ca",
      title: "Root Certificate Authority",
      subject: "CN = GlobalSign Root CA R3",
      issuer: "CN = GlobalSign Root CA R3 (Self-signed)",
      keyType: "RSA 4096 / SHA-384",
      status: "valid",
    },
    {
      id: "intermediate",
      type: "intermediate-ca",
      title: "Intermediate CA",
      subject: "CN = AlphaSSL CA - SHA256 - G4",
      issuer: isTampered ? "CN = Mallory Fake CA" : "CN = GlobalSign Root CA R3",
      keyType: "RSA 2048 / SHA-256",
      status: isTampered ? "invalid" : "valid",
    },
    {
      id: "leaf",
      type: "end-entity",
      title: "End-Entity Certificate (Website)",
      subject: "CN = *.bank-secure.com",
      issuer: "CN = AlphaSSL CA - SHA256 - G4",
      keyType: "ECDSA P-256",
      status: isTampered ? "invalid" : "valid",
    },
  ];

  const hashBlocks = [
    {
      index: 1,
      prevHash: "0000000000000000",
      data: isTampered ? "Alice -> Mallory $10,000 [TAMPERED]" : "Genesis: Alice -> Bob $100",
      hash: isTampered ? "9b1a03fc29b71e..." : "e4a8109bf48a91...",
      status: isTampered ? "invalid" : "valid",
    },
    {
      index: 2,
      prevHash: isTampered ? "e4a8109bf48a91... (MISMATCH!)" : "e4a8109bf48a91...",
      data: "Bob -> Charlie $50",
      hash: isTampered ? "CHAIN BROKEN" : "f82b721e04aa28...",
      status: isTampered ? "invalid" : "valid",
    },
    {
      index: 3,
      prevHash: isTampered ? "INVALID POINTER" : "f82b721e04aa28...",
      data: "Charlie -> Dave $25",
      hash: isTampered ? "CHAIN BROKEN" : "3c98aa2b175402...",
      status: isTampered ? "invalid" : "valid",
    },
  ];

  return (
    <div
      className={`bg-card border border-ink p-4 sm:p-6 rounded-[2px] shadow-[3px_3px_0_var(--rule)] text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-rule gap-3">
        <div>
          <h4 className="font-serif text-lg font-bold text-ink">
            {mode === "pki"
              ? "X.509 PKI Hierarchical Chain of Trust"
              : "Cryptographic Hash Chain Immutability"}
          </h4>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {mode === "pki"
              ? "Client Trust Store → Issuer Verification Path"
              : "Previous-Block Hash Dependency"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={mode === "pki" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("pki");
              setIsTampered(false);
            }}
            className="h-7 text-xs font-mono"
          >
            PKI Hierarchy
          </Button>
          <Button
            variant={mode === "hash" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("hash");
              setIsTampered(false);
            }}
            className="h-7 text-xs font-mono"
          >
            Hash Chain
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTampered(t => !t)}
            className={`h-7 text-xs font-mono ${
              isTampered ? "bg-bad text-paper border-bad font-bold" : "border-signal text-signal"
            }`}
          >
            {isTampered ? "Tampered: REVERT" : "⚡ Tamper Certificate"}
          </Button>
        </div>
      </div>

      {mode === "pki" ? (
        /* PKI Chain of Trust View */
        <div className="space-y-3 font-mono text-xs">
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-3">
            {pkiNodes.map((node, idx) => {
              const isInvalid = node.status === "invalid";
              const isRoot = node.type === "root-ca";

              return (
                <React.Fragment key={node.id}>
                  <div
                    className={`flex-1 p-4 border rounded-[2px] bg-paper shadow-[2px_2px_0_var(--rule)] transition-all ${
                      isInvalid
                        ? "border-bad bg-bad/5"
                        : isRoot
                        ? "border-info bg-info/5"
                        : "border-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rule">
                      <span className="text-[10px] uppercase font-bold text-ink-soft">
                        {node.type.replace("-", " ")}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-xs ${
                          isInvalid
                            ? "bg-bad text-paper"
                            : "bg-ok text-paper"
                        }`}
                      >
                        {isInvalid ? "SIGNATURE INVALID" : "TRUSTED"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-ink-soft block text-[9px] uppercase">Subject:</span>
                        <strong className="text-ink truncate block" title={node.subject}>
                          {node.subject}
                        </strong>
                      </div>
                      <div>
                        <span className="text-ink-soft block text-[9px] uppercase">Issuer:</span>
                        <span
                          className={`truncate block ${
                            isInvalid ? "text-bad font-bold" : "text-ink-soft"
                          }`}
                          title={node.issuer}
                        >
                          {node.issuer}
                        </span>
                      </div>
                      <div className="pt-1 text-[10px] text-ink-soft">
                        Key: {node.keyType}
                      </div>
                    </div>
                  </div>

                  {idx < pkiNodes.length - 1 && (
                    <div className="flex flex-col justify-center items-center py-1 md:py-0 text-signal font-bold text-lg select-none">
                      <span className="hidden md:inline">← Signs</span>
                      <span className="md:hidden">↓ Signs</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="p-3 bg-paper border-l-4 border-info font-sans text-xs text-ink leading-relaxed">
            <strong className="font-mono text-[10px] uppercase tracking-wider text-info block mb-1">
              Verification Flow:
            </strong>
            The browser comes pre-installed with the <strong>Root CA</strong> in its operating system trust store. It checks the Intermediate CA signature using the Root CA public key, and then verifies the website certificate using the Intermediate CA public key.
          </div>
        </div>
      ) : (
        /* Hash Chain View */
        <div className="space-y-3 font-mono text-xs">
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-3">
            {hashBlocks.map((b, idx) => {
              const isInvalid = b.status === "invalid";
              return (
                <React.Fragment key={b.index}>
                  <div
                    className={`flex-1 p-4 border rounded-[2px] bg-paper shadow-[2px_2px_0_var(--rule)] ${
                      isInvalid ? "border-bad bg-bad/5" : "border-ink"
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-rule pb-1 mb-2">
                      <span className="font-bold">Block #{b.index}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs ${
                          isInvalid ? "bg-bad text-paper" : "bg-ok text-paper"
                        }`}
                      >
                        {isInvalid ? "CORRUPTED" : "VERIFIED"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="text-[9px] text-ink-soft block uppercase">Prev Hash:</span>
                        <span
                          className={`font-mono text-[10px] block truncate ${
                            isInvalid && b.index > 1 ? "text-bad font-bold" : "text-ink-soft"
                          }`}
                        >
                          {b.prevHash}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-ink-soft block uppercase">Tx Data:</span>
                        <strong className="text-ink block truncate">{b.data}</strong>
                      </div>
                      <div className="pt-1">
                        <span className="text-[9px] text-ink-soft block uppercase">Block Hash:</span>
                        <span className="text-[10px] text-signal font-bold truncate block">
                          {b.hash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {idx < hashBlocks.length - 1 && (
                    <div className="flex flex-col justify-center items-center py-1 md:py-0 text-signal font-bold text-lg select-none">
                      <span className="hidden md:inline">→ Hash</span>
                      <span className="md:hidden">↓ Hash</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
