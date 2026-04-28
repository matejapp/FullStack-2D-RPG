import { useGameStore } from "./store/gameStore.js";
import { MainMenu } from "./screens/MainMenu.js";
import { MapScreen } from "./screens/MapScreen.js";
import { BattleScreen } from "./screens/BattleScreen.js";
import { MoveManagementScreen } from "./screens/MoveManagementScreen.js";

export function App() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case "menu":
      return <MainMenu />;
    case "map":
      return <MapScreen />;
    case "battle":
      return <BattleScreen />;
    case "moves":
      return <MoveManagementScreen />;
  }
}
