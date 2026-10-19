import { Scene, SceneObject, SceneState, Action } from './types';

/**
 * Creates the initial scene state before any step actions are processed.
 */
export function getInitialSceneState(scene: Scene): SceneState {
  const objects: Record<string, SceneObject> = {};
  for (const obj of scene.objects) {
    objects[obj.id] = { ...obj };
  }

  const zones: Record<string, boolean> = {};
  if (scene.zones) {
    for (const z of scene.zones) {
      zones[z.id] = false;
    }
  }

  const firstStep = scene.steps[0];

  return {
    actors: scene.actors.map(a => ({ ...a })),
    objects,
    bubbles: {},
    zones,
    highlights: {},
    pulsing: {},
    gridCells: {},
    formula: undefined,
    currentStepIndex: 0,
    totalSteps: scene.steps.length,
    caption: firstStep ? firstStep.caption : '',
    eli5: firstStep ? firstStep.eli5 : undefined,
    script: firstStep ? firstStep.script : undefined,
  };
}

/**
 * Applies a single action to the current state, returning a new immutable state.
 */
export function applyAction(state: SceneState, action: Action): SceneState {
  switch (action.do) {
    case 'appear': {
      return {
        ...state,
        objects: {
          ...state.objects,
          [action.obj.id]: { ...action.obj },
        },
      };
    }

    case 'vanish': {
      const nextObjects = { ...state.objects };
      delete nextObjects[action.obj];
      return {
        ...state,
        objects: nextObjects,
      };
    }

    case 'move': {
      const existing = state.objects[action.obj];
      if (!existing) return state;
      return {
        ...state,
        objects: {
          ...state.objects,
          [action.obj]: {
            ...existing,
            at: action.to,
          },
        },
      };
    }

    case 'transform': {
      const existing = state.objects[action.obj];
      if (!existing) return state;
      return {
        ...state,
        objects: {
          ...state.objects,
          [action.obj]: {
            ...existing,
            ...action.into,
          },
        },
      };
    }

    case 'highlight': {
      const nextHighlights = { ...state.highlights };
      for (const target of action.target) {
        nextHighlights[target] = action.tone || 'signal';
      }
      return {
        ...state,
        highlights: nextHighlights,
      };
    }

    case 'pulse': {
      return {
        ...state,
        pulsing: {
          ...state.pulsing,
          [action.target]: true,
        },
      };
    }

    case 'cell': {
      const gridId = action.grid;
      const key = `${action.r}_${action.c}`;
      const existingGrid = state.gridCells[gridId] || {};
      return {
        ...state,
        gridCells: {
          ...state.gridCells,
          [gridId]: {
            ...existingGrid,
            [key]: {
              r: action.r,
              c: action.c,
              val: action.set,
              tone: action.tone,
            },
          },
        },
      };
    }

    case 'say': {
      return {
        ...state,
        bubbles: {
          ...state.bubbles,
          [action.actor]: action.text,
        },
      };
    }

    case 'zone': {
      return {
        ...state,
        zones: {
          ...state.zones,
          [action.id]: action.show,
        },
      };
    }

    case 'formula': {
      return {
        ...state,
        formula: {
          tex: action.tex,
          highlight: action.highlight,
        },
      };
    }

    default:
      return state;
  }
}

/**
 * Computes the deterministic scene state for any given step index [0 .. steps.length - 1].
 */
export function computeSceneState(scene: Scene, targetStepIndex: number): SceneState {
  if (!scene.steps || scene.steps.length === 0) {
    return getInitialSceneState(scene);
  }

  const boundedIndex = Math.max(0, Math.min(targetStepIndex, scene.steps.length - 1));
  let state = getInitialSceneState(scene);

  for (let stepIdx = 0; stepIdx <= boundedIndex; stepIdx++) {
    const step = scene.steps[stepIdx];

    // Clear transient bubbles, pulsing, and step-specific highlights when advancing to next step
    if (stepIdx > 0) {
      state = {
        ...state,
        bubbles: {},
        pulsing: {},
        highlights: {},
      };
    }

    for (const action of step.actions) {
      state = applyAction(state, action);
    }

    state.currentStepIndex = stepIdx;
    state.caption = step.caption;
    state.eli5 = step.eli5;
    state.script = step.script;
  }

  return state;
}
