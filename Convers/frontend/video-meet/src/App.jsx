import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MeetingRoom from "./pages/MeetingRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/meeting/:meetingId"
          element={<MeetingRoom />}
        />
      </Routes>
    </BrowserRouter>
  );
}