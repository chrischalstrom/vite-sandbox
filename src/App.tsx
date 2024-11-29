import { Outlet } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="relative w-full h-full">
      <Outlet />
    </div>
  );
};

export default App;
