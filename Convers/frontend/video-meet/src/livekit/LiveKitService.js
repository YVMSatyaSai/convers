import { Room } from "livekit-client";
import { getToken } from "./tokenService";

let room = null;

export async function connectToRoom(roomName, userName) {

    const token = await getToken(roomName, userName);

    room = new Room();

    await room.connect(
        "ws://localhost:7880",
        token
    );

    console.log("✅ Connected to LiveKit");

    return room;
}

export function getRoom() {
    return room;
}