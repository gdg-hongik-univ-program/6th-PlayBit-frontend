import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { initializeMember } from "./services/gameService";

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeMember();
      } catch (error) {
        console.error("사용자 초기화 실패:", error);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return <div>초기화 중...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;