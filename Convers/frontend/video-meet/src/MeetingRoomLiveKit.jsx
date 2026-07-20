import { useEffect, useState } from "react";

import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

const API = "";

export default function MeetingRoomLiveKit() {

  const meetingId = "demo-room";
  const [token, setToken] = useState("");

  useEffect(() => {

    async function loadToken() {

    console.log("Meeting ID:", meetingId);
    const response = await fetch(
        `/api/token?room=${meetingId}&identity=Satya`
    );

    const jwt = await response.text();
    console.log("JWT:", jwt);
    setToken(jwt);
}

    loadToken();

  }, [meetingId]);

  if (!token) {

    return <h2>Loading...</h2>;
  }

  return (

   <LiveKitRoom
    token={token}
    serverUrl="ws://localhost:7880"
    connect={true}
    video={true}
    audio={true}
    onConnected={() => console.log("✅ Connected")}
    onDisconnected={() => console.log("❌ Disconnected")}
    onError={(e) => console.error("LiveKit Error:", e)}
>
    <VideoConference />
</LiveKitRoom>

  );

}