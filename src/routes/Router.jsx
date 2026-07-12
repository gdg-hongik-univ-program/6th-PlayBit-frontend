import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import CreateRoomPage from "../pages/CreateRoomPage";
import GamePage from "../pages/GamePage";
import ResultPage from "../pages/ResultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/rooms/create",
    element: <CreateRoomPage />,
  },
  {
    path: "/rooms/:entryCode/game",
    element: <GamePage />,
  },
  {
    path: "/rooms/:entryCode/result",
    element: <ResultPage />,
  },
]);

export default router;