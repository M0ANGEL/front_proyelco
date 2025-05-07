import { HashRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { Suspense } from "react";

function App() {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter></AppRouter>
        </Suspense>
      </HashRouter>
    </>
  );
  // }
}

export default App;
