import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMeetingId } from "../utils/meetingUtils";

export default function Home() {
  const [name, setName] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  function handleCreateMeeting() {
  if (!name.trim()) {
    alert("Please enter your name.");
    return;
  }

  const meetingId = generateMeetingId();

  navigate(
    `/meeting/${meetingId}?name=${encodeURIComponent(name)}`
  );
}

function handleJoinMeeting() {
  if (!name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!meetingId.trim()) {
    alert("Please enter Meeting ID.");
    return;
  }

  navigate(
    `/meeting/${meetingId.trim()}?name=${encodeURIComponent(name)}`
  );
}

  return (
    <div
      style={{
        height: "100vh",
        background: "#202124",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#2d2d2d",
          borderRadius: "16px",
          padding: "40px",
          color: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,.4)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Convers
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#bdbdbd",
            marginBottom: "35px",
          }}
        >
          Connect. Collaborate. Converse.
        </p>

        <label>Your Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "30px",
            borderRadius: "8px",
            border: "1px solid #555",
            background: "#3c4043",
            color: "white",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <button
          onClick={handleCreateMeeting}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: "#1a73e8",
              color: "white",
              fontSize: "16px",
            }}
          >
            Create Meeting
          </button>

          <button
  onClick={() => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setShowJoinDialog(true);
  }}
  style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #5f6368",
              cursor: "pointer",
              background: "transparent",
              color: "white",
              fontSize: "16px",
            }}
          >
            Join Meeting
          </button>
        </div>
            </div>

      {showJoinDialog && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "400px",
        background: "#2d2d2d",
        borderRadius: "12px",
        padding: "24px",
        color: "white",
      }}
    >
      <h2>Join Meeting</h2>

      <input
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
        placeholder="Meeting ID"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          marginBottom: "25px",
          borderRadius: "8px",
          border: "1px solid #555",
          background: "#3c4043",
          color: "white",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button onClick={() => setShowJoinDialog(false)}>
          Cancel
        </button>

        <button onClick={handleJoinMeeting}>
          Join
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}