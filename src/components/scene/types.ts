export type Vec = { x: number; y: number };

export type ActorKind =
  | 'alice'
  | 'bob'
  | 'eve'
  | 'mallory'
  | 'server'
  | 'client'
  | 'ca'
  | 'kdc'
  | 'router'
  | 'switch'
  | 'firewall'
  | 'ids'
  | 'honeypot'
  | 'cloud'
  | 'db'
  | 'app';

export interface SceneActor {
  id: string;
  kind: ActorKind;
  label: string;
  pos: Vec;
}

export type ObjectKind =
  | 'plain'
  | 'cipher'
  | 'key-pub'
  | 'key-priv'
  | 'key-shared'
  | 'hash'
  | 'sig'
  | 'cert'
  | 'packet'
  | 'ticket'
  | 'text'
  | 'matrix'
  | 'bits';

export type Tone = 'signal' | 'ok' | 'bad' | 'info' | 'warn';

export interface SceneObject {
  id: string;
  kind: ObjectKind;
  label?: string;
  value?: string | number[][];
  at: Vec | { actor: string };
  tone?: Tone;
}

export type Action =
  | { do: 'move'; obj: string; to: Vec | { actor: string }; via?: Vec[] }
  | { do: 'appear'; obj: SceneObject }
  | { do: 'vanish'; obj: string }
  | { do: 'transform'; obj: string; into: Partial<SceneObject> }
  | { do: 'highlight'; target: string[]; tone?: 'signal' | 'ok' | 'bad' | 'info' | 'warn' }
  | { do: 'pulse'; target: string }
  | { do: 'cell'; grid: string; r: number; c: number; set?: string; tone?: string }
  | { do: 'say'; actor: string; text: string }
  | { do: 'zone'; id: string; show: boolean }
  | { do: 'formula'; tex: string; highlight?: string[] };

export interface SceneStep {
  caption: string; // One sentence (max 18 words)
  actions: Action[];
  eli5?: string;
  script?: string; // Presenter words
}

export interface SceneZone {
  id: string;
  label: string;
  rect: { x: number; y: number; width: number; height: number };
  dashed?: boolean;
  tone?: Tone;
}

export interface Scene {
  id: string;
  title: string;
  actors: SceneActor[];
  objects: SceneObject[];
  zones?: SceneZone[];
  steps: SceneStep[];
  legend?: string[];
  viewBox: string; // e.g. "0 0 800 450"
}

export interface GridCellState {
  r: number;
  c: number;
  val?: string;
  tone?: string;
}

export interface SceneState {
  actors: SceneActor[];
  objects: Record<string, SceneObject>;
  bubbles: Record<string, string>; // actorId -> text
  zones: Record<string, boolean>; // zoneId -> visible
  highlights: Record<string, Tone>; // targetId -> tone
  pulsing: Record<string, boolean>;
  gridCells: Record<string, Record<string, GridCellState>>; // gridId -> `${r}_${c}` -> cell
  formula?: { tex: string; highlight?: string[] };
  currentStepIndex: number;
  totalSteps: number;
  caption: string;
  eli5?: string;
  script?: string;
}
