import { useRoomContext } from "@livekit/components-react";
import { useEffect } from "react";

export default function RoomDebugger() {
  console.log("RoomDebugger rendered");

  const room = useRoomContext();

  useEffect(() => {
    console.log("ROOM OBJECT:", room);
  }, [room]);

  return <div style={{ display: "none" }}>Debugger</div>;
}