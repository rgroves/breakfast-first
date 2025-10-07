import { useGameStore } from "../store/game-store";

export default function CommandBar() {
  const activeAction = useGameStore((state) => state.activeAction);
  const activeSceneItem = useGameStore((state) => state.activeSceneItem);
  const activePreposition = useGameStore((state) => state.activePreposition);
  const activeTarget = useGameStore((state) => state.activeTarget);

  return (
    <div>
      <h3>Command:</h3>
      <div
        style={{
          border: "1px solid gray",
        }}
      >
        {activeAction && <Pill color="green" label={activeAction} />}
        {activeSceneItem && <Pill color="blue" label={activeSceneItem.name} />}
        {activePreposition && <Pill color="orange" label={activePreposition} />}
        {activeTarget && <Pill color="purple" label={activeTarget.name} />}
      </div>
    </div>
  );
}

interface PillProps {
  label: string;
  color: string;
}

function Pill({ label, color }: PillProps) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "4px 8px",
        borderRadius: "16px",
        marginRight: "8px",
        fontWeight: "bold",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
