import { describe, it, expect } from 'vitest';
import { Scene } from '../../src/components/scene/types';
import {
  getInitialSceneState,
  applyAction,
  computeSceneState,
} from '../../src/components/scene/reducer';

describe('Declarative Scene Reducer Unit Tests', () => {
  const sampleScene: Scene = {
    id: 'test-symmetric-cipher',
    title: 'Symmetric Cipher Demonstration',
    viewBox: '0 0 800 450',
    actors: [
      { id: 'alice', kind: 'alice', label: 'Alice', pos: { x: 100, y: 200 } },
      { id: 'eve', kind: 'eve', label: 'Eve', pos: { x: 400, y: 100 } },
      { id: 'bob', kind: 'bob', label: 'Bob', pos: { x: 700, y: 200 } },
    ],
    objects: [
      { id: 'plain1', kind: 'plain', label: 'M1', value: 'CONFIDENTIAL', at: { x: 100, y: 240 } },
      { id: 'key1', kind: 'key-shared', label: 'K_AB', at: { x: 100, y: 300 } },
    ],
    zones: [
      {
        id: 'eve-eavesdrop',
        label: 'Insecure Public Channel (Eavesdrop Zone)',
        rect: { x: 250, y: 50, width: 300, height: 250 },
        dashed: true,
        tone: 'bad',
      },
    ],
    steps: [
      {
        caption: 'Alice prepares a confidential message and holds the shared key.',
        eli5: 'Alice wants to send a secret letter to Bob.',
        actions: [
          { do: 'say', actor: 'alice', text: 'I have a secret!' },
          { do: 'highlight', target: ['plain1'], tone: 'signal' },
        ],
      },
      {
        caption: 'Alice encrypts the message using the shared key into ciphertext.',
        eli5: 'Alice locks the letter inside a strongbox with her key.',
        actions: [
          { do: 'transform', obj: 'plain1', into: { kind: 'cipher', value: '8F2C9B1E', tone: 'signal' } },
          { do: 'pulse', target: 'plain1' },
          { do: 'formula', tex: 'C = E_K(M)', highlight: ['E_K', 'M'] },
        ],
      },
      {
        caption: 'The ciphertext is transmitted over the insecure channel where Eve listens.',
        eli5: 'The box moves across the street where Eve can see it.',
        actions: [
          { do: 'zone', id: 'eve-eavesdrop', show: true },
          { do: 'move', obj: 'plain1', to: { x: 400, y: 240 } },
          { do: 'say', actor: 'eve', text: 'I see scrambled bytes!' },
        ],
      },
      {
        caption: 'Bob receives the ciphertext and decrypts it with the identical shared key.',
        eli5: 'Bob uses his matching key to unlock the box and read the letter.',
        actions: [
          { do: 'move', obj: 'plain1', to: { x: 700, y: 240 } },
          { do: 'transform', obj: 'plain1', into: { kind: 'plain', value: 'CONFIDENTIAL', tone: 'ok' } },
          { do: 'say', actor: 'bob', text: 'Got the secret!' },
        ],
      },
    ],
  };

  it('correctly initializes the scene state', () => {
    const initialState = getInitialSceneState(sampleScene);
    expect(initialState.actors).toHaveLength(3);
    expect(initialState.objects['plain1']).toBeDefined();
    expect(initialState.objects['plain1'].kind).toBe('plain');
    expect(initialState.zones['eve-eavesdrop']).toBe(false);
    expect(initialState.currentStepIndex).toBe(0);
    expect(initialState.caption).toBe(sampleScene.steps[0].caption);
  });

  it('applies appear action to add new objects', () => {
    const state = getInitialSceneState(sampleScene);
    const nextState = applyAction(state, {
      do: 'appear',
      obj: { id: 'cert1', kind: 'cert', label: 'BobCert', at: { x: 500, y: 150 } },
    });
    expect(nextState.objects['cert1']).toBeDefined();
    expect(nextState.objects['cert1'].kind).toBe('cert');
  });

  it('applies vanish action to remove objects', () => {
    const state = getInitialSceneState(sampleScene);
    const nextState = applyAction(state, { do: 'vanish', obj: 'plain1' });
    expect(nextState.objects['plain1']).toBeUndefined();
  });

  it('applies move action to translate an object', () => {
    const state = getInitialSceneState(sampleScene);
    const nextState = applyAction(state, { do: 'move', obj: 'plain1', to: { x: 250, y: 350 } });
    expect(nextState.objects['plain1'].at).toEqual({ x: 250, y: 350 });
  });

  it('applies transform action to update object kind and value', () => {
    const state = getInitialSceneState(sampleScene);
    const nextState = applyAction(state, {
      do: 'transform',
      obj: 'plain1',
      into: { kind: 'cipher', value: 'C1PH3R_TEXT', tone: 'signal' },
    });
    expect(nextState.objects['plain1'].kind).toBe('cipher');
    expect(nextState.objects['plain1'].value).toBe('C1PH3R_TEXT');
    expect(nextState.objects['plain1'].tone).toBe('signal');
  });

  it('applies cell action for grid matrices', () => {
    const state = getInitialSceneState(sampleScene);
    const nextState = applyAction(state, {
      do: 'cell',
      grid: 'aes-state',
      r: 1,
      c: 2,
      set: '0x4F',
      tone: 'ok',
    });
    expect(nextState.gridCells['aes-state']['1_2']).toEqual({
      r: 1,
      c: 2,
      val: '0x4F',
      tone: 'ok',
    });
  });

  it('deterministically computes scene state at step 1 (encryption)', () => {
    const state = computeSceneState(sampleScene, 1);
    expect(state.currentStepIndex).toBe(1);
    expect(state.caption).toBe(sampleScene.steps[1].caption);
    expect(state.objects['plain1'].kind).toBe('cipher');
    expect(state.objects['plain1'].value).toBe('8F2C9B1E');
    expect(state.formula?.tex).toBe('C = E_K(M)');
    // Transient bubbles from step 0 should have cleared
    expect(state.bubbles['alice']).toBeUndefined();
  });

  it('deterministically computes scene state at step 2 (transmission over eavesdrop zone)', () => {
    const state = computeSceneState(sampleScene, 2);
    expect(state.currentStepIndex).toBe(2);
    expect(state.zones['eve-eavesdrop']).toBe(true);
    expect(state.objects['plain1'].at).toEqual({ x: 400, y: 240 });
    expect(state.bubbles['eve']).toBe('I see scrambled bytes!');
  });

  it('deterministically computes final state at step 3 (decryption by Bob)', () => {
    const state = computeSceneState(sampleScene, 3);
    expect(state.currentStepIndex).toBe(3);
    expect(state.objects['plain1'].at).toEqual({ x: 700, y: 240 });
    expect(state.objects['plain1'].kind).toBe('plain');
    expect(state.objects['plain1'].value).toBe('CONFIDENTIAL');
    expect(state.bubbles['bob']).toBe('Got the secret!');
  });

  it('safely clamps out-of-bounds step indices', () => {
    const clampedUnder = computeSceneState(sampleScene, -5);
    expect(clampedUnder.currentStepIndex).toBe(0);

    const clampedOver = computeSceneState(sampleScene, 100);
    expect(clampedOver.currentStepIndex).toBe(3);
  });
});
