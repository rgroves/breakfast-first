import { useGameStore } from "../store/game-store";

export default function SceneItemPanel() {
  const sceneItems = useGameStore((state) => state.sceneItems);
  const activeSceneItem = useGameStore((state) => state.activeSceneItem);
  const activeSceneItemName = activeSceneItem ? activeSceneItem.name : "";

  return (
    <div>
      {/* <h3>Active Item: {activeSceneItemName}</h3> */}
      <div
        style={{
          border: "1px solid gray",
        }}
      >
        {sceneItems.map((item) => (
          <SceneItemButton
            key={item.id}
            itemId={item.id}
            active={item.id === activeSceneItem?.id}
          >
            {item.name}
          </SceneItemButton>
        ))}
      </div>
    </div>
  );
}

interface SceneItemButtonProps {
  active: boolean;
  itemId: string;
  children?: React.ReactNode;
}

function SceneItemButton({ active, itemId, children }: SceneItemButtonProps) {
  const activePreposition = useGameStore((state) => state.activePreposition);
  const setActive = !activePreposition
    ? useGameStore.getState().setActiveSceneItem
    : useGameStore.getState().setActiveTarget;
  const handleClick = () => {
    if (active) {
      setActive(null);
      return;
    } else {
      setActive(itemId);
    }
  };

  const activeButtonStyle = {
    backgroundColor: "blue",
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
      id={itemId}
      onClick={handleClick}
      style={{ ...style, padding: "8px", margin: "8px" }}
    >
      {children}
    </button>
  );
}
