"use client";

import { s } from "@hashbrownai/core";
import type { UiChatMessage } from "@hashbrownai/react";

import {
  exposeComponent,
  HashbrownProvider,
  useTool,
  useUiChat,
} from "@hashbrownai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../store/game-store";
import MarkdownViewer from "./MarkdownViewer";
import ActionsPanel from "./ActionsPanel";
import SceneItemPanel from "./SceneItemPanel";
import CommandBar from "./CommandBar";
// Note: systemPrompt is relying on raw-loader & turbopack to import the markdown file as a string.
import systemPrompt from "@/data/system-prompt.md";
import BreakfastLoadingOverlay from "./BreakfastLoadingOverlay";

// const model = "gpt-5-nano";
// const model = "gpt-5-mini";
const model = "gpt-5";

export default function GamePanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <p>Cooking up something absurd...</p>;
  }

  return (
    <HashbrownProvider url="http://localhost:3333/chat">
      <GameControlsSurface />
    </HashbrownProvider>
  );
}

function GameControlsSurface() {
  const startMessageSentRef = useRef(false);

  const gameStatus = useGameStore((state) => state.gameStatus);
  const isCommandValid = useGameStore((state) => state.isCommandValid);
  const activeAction = useGameStore((state) => state.activeAction);
  const activeSceneItem = useGameStore((state) => state.activeSceneItem);
  const activeSceneItemName = activeSceneItem ? activeSceneItem.name : "";
  const activePreposition =
    useGameStore((state) => state.activePreposition) || "";
  const activeTarget = useGameStore((state) => state.activeTarget) || "";
  const activeTargetName = activeTarget ? activeTarget.name : "";

  const endGame = useTool({
    name: "endGame",
    description: "Ends the game.",
    handler: async () => {
      useGameStore.getState().setGameStatus("game_over");
      return Promise.resolve(true);
    },
    deps: [],
  });

  const getNextSceneNotes = useTool({
    name: "getNextSceneNotes",
    description: "Provides notes for the next scene to be created.",
    handler: async () => {
      // TODO: n
      console.log(">>> Preparing scene notes <<<");
      return Promise.resolve(`
        ### SCENE NOTES
        - Location: The Kitchen
        - Time of Day: Morning
        - Plot: The protagonist wakes and in their mono-unit. Emergency broadcast announces Earth's invasion—but not before a sponsor's ad. Outside, neighbors form a chaotic suburban militia with barbecue forks and spatulas. Drones break in and steal the hero's last bacon and eggs.  
        - Exits: 
          - The Garage
          - The Bedroom (not a scene transition, leads to game over)
        - Transition Notes (remember these for when the player chooses an exit):
          - If player issues command to go to garage, transition to next scene.
          - If player issues command to go to bedroom, generate narrative describing protagonists sleep induced demise and set end the game.
      `);
    },
    deps: [],
  });

  const createScene = useTool({
    name: "createScene",
    description: "Start a new game scene.",
    schema: s.object("Create scene input", {
      items: s.array(
        "Array of possible items in the scene for the player to interact with",
        s.object("An item in the scene", {
          name: s.string("The name of the item"),
          description: s.string("A brief description of the item"),
        })
      ),
      exits: s.array(
        "Array of possible exits from the scene",
        s.object("An exit from the scene", {
          name: s.string("The name of the exit location"),
          description: s.string("A brief description of the exit"),
        })
      ),
    }),

    handler: (input) => {
      const { items, exits } = input;
      useGameStore.getState().createScene(items, exits);
      return Promise.resolve(true);
    },
    deps: [],
  });

  const removeSceneItems = useTool({
    name: "removeSceneItem",
    description: "Remove an item from the scene.",
    schema: s.object("Remove scene item input", {
      itemIds: s.array(
        "Array of scene items to remove",
        s.string("The id of the scene item to remove")
      ),
    }),
    handler: (input) => {
      const { itemIds } = input;
      useGameStore.getState().removeSceneItems(itemIds);
      return Promise.resolve(true);
    },
    deps: [],
  });

  const {
    error,
    sendMessage,
    messages,
    isSending,
    isReceiving,
    isRunningToolCalls,
  } = useUiChat({
    components: [
      exposeComponent(MarkdownViewer, {
        name: "MarkdownViewer",
        description: "Render the narrative content in markdown format.",
        props: {
          content: s.streaming.string("Markdown formatted narrative content"),
        },
      }),
    ],
    debugName: "GamePanel",
    model,
    system: systemPrompt,
    messages: [],
    tools: [getNextSceneNotes, createScene, removeSceneItems, endGame],
  });

  const isWorking = useMemo(() => {
    return isSending || isReceiving || isRunningToolCalls;
  }, [isSending, isReceiving, isRunningToolCalls]);

  // useEffect(() => {
  //   console.log("Messages:", messages);
  // }, [messages]);

  useEffect(() => {
    if (!startMessageSentRef.current) {
      startMessageSentRef.current = true;
      sendMessage({ role: "user", content: "/START" });
    }
  }, []);

  return (
    <>
      <div>
        {messages.map((msg, index) => (
          <MessageDisplay key={index} message={msg}></MessageDisplay>
        ))}
      </div>

      {isWorking && <p>Cooking up the scene...</p>}
      {isWorking && !isReceiving && <BreakfastLoadingOverlay />}

      {gameStatus == "in_progress" && !isWorking && (
        <>
          <div>
            <CommandBar />
            {isCommandValid && (
              <button
                disabled={isWorking || !isCommandValid}
                onClick={() => {
                  sendMessage({
                    role: "user",
                    content: `${activeAction} ${activeSceneItemName} ${activePreposition} ${activeTargetName}`,
                  });
                  useGameStore.getState().clearCommand();
                }}
              >
                Execute Command
              </button>
            )}
          </div>

          <ActionsPanel />
          <SceneItemPanel />
        </>
      )}
      {gameStatus == "game_over" && (
        <div>
          <p>You're quest for breakfast ends here.</p>
          <h3>Game Over</h3>
        </div>
      )}
    </>
  );
}

function MessageDisplay({ message }: { message: UiChatMessage<any> }) {
  const content = (message.content as string) || "";
  return (
    <div>
      {message.role === "error" && <div>ERROR: {message.content}</div>}
      {message.role === "assistant" && <div>{message.ui}</div>}
      {message.role === "user" && !content.startsWith("/") && (
        <div>Player: {content}</div>
      )}
    </div>
  );
}
