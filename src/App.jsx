import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { initializeMember } from "./services/memberService";

function App() {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeMember();
        setIsReady(true);
      } catch (error) {
        console.error("사용자 초기화 실패:", error);
        setInitError(error);
      }
    };

    init();
  }, []);

  if (initError) {
    return (
      <div>
        <p>사용자 초기화에 실패했습니다.</p>

        <button type="button" onClick={() => window.location.reload()}>
          다시 시도
        </button>
      </div>
    );
  }

  if (!isReady) {
    return <div>초기화 중...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;