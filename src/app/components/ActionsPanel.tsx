import { useGameStore } from "../store/game-store";

const validActions = [
  "use",
  "look",
  "take",
  "drop",
  "go",
  "open",
  "close",
  "eat",
  "drink",
];

// TODO: Make prepositions context-sensitive based on the active action
// const vp = {
//   use: ["on", "with"],
//   go: ["to", "into"],
//   look: ["at", "in"],
//   take: ["from"],
// };

const validPrepositions = ["on", "with", "at", "to", "in", "from", "into"];

export default function ActionsPanel() {
  const activeAction = useGameStore((state) => state.activeAction);
  const activeSceneItem = useGameStore((state) => state.activeSceneItem);
  const activePreposition = useGameStore((state) => state.activePreposition);

  return (
    <div>
      {/* <h3>Active Action: {activeAction}</h3> */}
      <div
        style={{
          border: "1px solid gray",
        }}
      >
        {validActions.map((action) => (
          <ActionButton
            key={action}
            active={activeAction == action}
            action={action}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </ActionButton>
        ))}
        {activeSceneItem !== null &&
          validPrepositions.map((preposition) => (
            <PrepositionButton
              key={preposition}
              active={activePreposition === preposition}
              preposition={preposition}
            >
              {preposition}
            </PrepositionButton>
          ))}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  action: string;
  active: boolean;
  children: React.ReactNode;
}

function ActionButton({ active, action, children }: ActionButtonProps) {
  const handleClick = () => {
    if (active) {
      useGameStore.getState().setActiveAction("");
    } else {
      useGameStore.getState().setActiveAction(action);
    }
  };

  const activeButtonStyle = {
    backgroundColor: "green",
    color: "white",
    fontWeight: "bold",
  };

  const inactiveButtonStyle = {
    backgroundColor: "gray",
    color: "black",
    fontWeight: "normal",
  };

  const style = active ? activeButtonStyle : inactiveButtonStyle;

  return (
    <button
      onClick={handleClick}
      style={{ ...style, minWidth: "7ch", padding: "8px", margin: "8px" }}
    >
      {children}
    </button>
  );
}

interface PrepositionButtonProps {
  preposition: string;
  active: boolean;
  children: React.ReactNode;
}

function PrepositionButton({
  active,
  preposition,
  children,
}: PrepositionButtonProps) {
  const handleClick = () => {
    if (active) {
      useGameStore.getState().setActivePreposition("");
    } else {
      useGameStore.getState().setActivePreposition(preposition);
    }
  };

  const activeButtonStyle = {
    backgroundColor: "orange",
    color: "white",
    fontWeight: "bold",
  };

  const inactiveButtonStyle = {
    backgroundColor: "gray",
    color: "black",
    fontWeight: "normal",
  };

  const style = active ? activeButtonStyle : inactiveButtonStyle;

  return (
    <button
      onClick={handleClick}
      style={{ ...style, minWidth: "7ch", padding: "8px", margin: "8px" }}
    >
      {children}
    </button>
  );
}
