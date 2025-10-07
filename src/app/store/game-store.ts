import { create } from "zustand";

type Command =
  | "open"
  | "close"
  | "eat"
  | "drink"
  | "look"
  | "go"
  | "take"
  | "drop"
  | "use";

interface SceneItem {
  id: string;
  name: string;
  description: string;
}

interface SceneExit {
  id: string;
  name: string;
  description: string;
}

export interface Action {
  command: Command;
  target: string;
}

type GameStatus = "not_started" | "in_progress" | "game_over";

interface GameState {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;

  isCommandValid: boolean;
  setIsCommandValid: (isValid: boolean) => void;
  clearCommand: () => void;

  activeAction: string;
  setActiveAction: (action: string) => void;

  activeSceneItem: SceneItem | null;
  setActiveSceneItem: (itemId: string | null) => void;

  activePreposition: string;
  setActivePreposition: (preposition: string | null) => void;

  activeTarget: SceneItem | null;
  setActiveTarget: (itemId: string | null) => void;

  sceneItems: SceneItem[];
  removeSceneItems: (itemIds: string[]) => void;

  sceneExits: SceneExit[];

  createScene: (
    items: Omit<SceneItem, "id">[],
    exits: Omit<SceneExit, "id">[]
  ) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameStatus: "not_started",

  setGameStatus: (status: GameStatus) => set({ gameStatus: status }),

  isCommandValid: false,

  setIsCommandValid: (isValid: boolean) =>
    set((state) => ({ isCommandValid: isValid })),

  clearCommand: () =>
    set({
      activeAction: "",
      activeSceneItem: null,
      activePreposition: "",
      activeTarget: null,
      isCommandValid: false,
    }),

  activeAction: "",
  setActiveAction: (action: string) =>
    set({
      activeAction: action,
      activeSceneItem: null,
      activePreposition: "",
      activeTarget: null,
      isCommandValid: false,
    }),

  activeSceneItem: null,
  setActiveSceneItem: (itemId: string | null) =>
    set((state) => ({
      activeSceneItem:
        state.sceneItems.find((item) => item.id === itemId) || null,
      activePreposition: "",
      activeTarget: null,
      isCommandValid: !!state.activeAction,
    })),

  activePreposition: "",
  setActivePreposition: (preposition: string | null) =>
    set((state) =>
      state.activeAction === "use"
        ? {
            activePreposition: preposition || "",
            activeTarget: null,
            isCommandValid: false,
          }
        : {}
    ),

  activeTarget: null,
  setActiveTarget: (itemId: string | null) =>
    set((state) => ({
      activeTarget: state.sceneItems.find((item) => item.id === itemId) || null,
      isCommandValid:
        !!state.activeAction &&
        !!state.activeSceneItem &&
        !!state.activePreposition,
    })),

  sceneItems: [
    {
      id: crypto.randomUUID(),
      name: "self",
      description: "You, the player",
    },
  ],
  removeSceneItems: (itemIds) =>
    set((state) => ({
      sceneItems: state.sceneItems.filter((item) => itemIds.includes(item.id)),
    })),

  sceneExits: [],

  createScene: (
    items: Omit<SceneItem, "id">[],
    exits: Omit<SceneExit, "id">[]
  ) =>
    set((state) => {
      switch (state.gameStatus) {
        case "not_started":
          return {
            gameStatus: "in_progress",
            sceneItems: [
              {
                id: crypto.randomUUID(),
                name: "self",
                description: "You, the player",
              },
              ...items.map((item) => ({
                id: crypto.randomUUID(),
                ...item,
              })),
              ...exits.map((exit) => ({
                id: crypto.randomUUID(),
                ...exit,
              })),
            ],
            sceneExits: exits.map((exit) => ({
              id: crypto.randomUUID(),
              ...exit,
            })),
          };

        case "in_progress":
          return {
            sceneItems: [
              ...items.map((item) => ({
                id: crypto.randomUUID(),
                ...item,
              })),
              ...exits.map((exit) => ({
                id: crypto.randomUUID(),
                ...exit,
              })),
            ],
            sceneExits: exits.map((exit) => ({
              id: crypto.randomUUID(),
              ...exit,
            })),
          };

        case "game_over":
          return { gameStatus: "game_over" };
      }
    }),
}));
