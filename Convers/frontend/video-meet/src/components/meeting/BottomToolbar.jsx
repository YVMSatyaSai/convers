import { useRoomContext, useLocalParticipant, } from "@livekit/components-react";

import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

import { MdCallEnd } from "react-icons/md";

import ControlButton from "./ControlButton";

export default function BottomToolbar() {
    const room = useRoomContext();
    const { localParticipant } = useLocalParticipant();
  return (
    <div
      style={{
        height: "80px",
        background: "#202124",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <ControlButton
  icon={
    localParticipant.isMicrophoneEnabled
      ? <FaMicrophone size={22} />
      : <FaMicrophoneSlash size={22} />
  }
  active={localParticipant.isMicrophoneEnabled}
  onClick={async () => {
    await localParticipant.setMicrophoneEnabled(
      !localParticipant.isMicrophoneEnabled
    );
  }}
/>

      <ControlButton
  icon={
    localParticipant.isCameraEnabled
      ? <FaVideo size={22} />
      : <FaVideoSlash size={22} />
  }
  active={localParticipant.isCameraEnabled}
  onClick={async () => {
    await localParticipant.setCameraEnabled(
      !localParticipant.isCameraEnabled
    );
  }}
/>

      <ControlButton
  icon={<MdCallEnd size={24} />}
  danger
  onClick={() => room.disconnect()}
/>
    </div>
  );
}