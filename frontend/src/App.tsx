import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Game } from "./screens/Game";
import { Landing } from "./screens/Landing";

function App() {
  return (
    <div className="h-screen bg-slate-900">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
