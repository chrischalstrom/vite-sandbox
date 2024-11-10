import { Outlet } from "react-router-dom";
import "./App.css";

// wrapped in <AppContexts>?
function App() {
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}

export default App;
