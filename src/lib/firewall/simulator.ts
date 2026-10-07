export type Action = "ALLOW" | "DENY"
export type Protocol = "TCP" | "UDP" | "ICMP" | "ANY"

export interface FirewallRule {
  id: string
  action: Action
  protocol: Protocol
  sourceIp: string
  destIp: string
  destPort: string // e.g. "80", "443", or "ANY"
}

export interface Packet {
  protocol: Protocol
  sourceIp: string
  destIp: string
  destPort: string
}

/**
 * Checks if an IP matches a rule's IP specification.
 * Currently supports exact match or "ANY".
 * For a real firewall, this would support CIDR subnet masks (e.g. 192.168.1.0/24).
 */
function ipMatches(ruleIp: string, packetIp: string): boolean {
  if (ruleIp === "ANY" || ruleIp === "*") return true
  return ruleIp === packetIp
}

function portMatches(rulePort: string, packetPort: string): boolean {
  if (rulePort === "ANY" || rulePort === "*") return true
  return rulePort === packetPort
}

function protocolMatches(ruleProto: Protocol, packetProto: Protocol): boolean {
  if (ruleProto === "ANY") return true
  return ruleProto === packetProto
}

/**
 * Simulates a stateless firewall packet evaluation.
 * Evaluates rules top-down. The first rule that matches the packet dictates the action.
 * If no rule matches, it falls back to a default DENY.
 */
export function evaluatePacket(rules: FirewallRule[], packet: Packet): { action: Action, matchedRuleId?: string } {
  for (const rule of rules) {
    if (
      protocolMatches(rule.protocol, packet.protocol) &&
      ipMatches(rule.sourceIp, packet.sourceIp) &&
      ipMatches(rule.destIp, packet.destIp) &&
      portMatches(rule.destPort, packet.destPort)
    ) {
      return { action: rule.action, matchedRuleId: rule.id }
    }
  }
  
  // Default Implicit Deny
  return { action: "DENY" }
}
