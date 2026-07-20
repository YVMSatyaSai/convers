import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


function MeetingRoom() {

    const { meetingId } = useParams();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [userName, setUserName] = useState("");
    const [remoteUserName, setRemoteUserName] = useState("");
    const [nameEntered, setNameEntered] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [message, setMessage] = useState("");
    const [handRaised, setHandRaised] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [localCaption, setLocalCaption] = useState("");
    const [remoteCaption, setRemoteCaption] = useState("");
    const [remoteHandRaised, setRemoteHandRaised] = useState(false);
    const [captionEnabled, setCaptionEnabled] = useState(false);
    const [recording, setRecording] = useState(false);
    const [remoteMicOn, setRemoteMicOn] = useState(true);
    const [remoteCameraOn, setRemoteCameraOn] = useState(true);

    const startCaption = () => {

        if (
            !("webkitSpeechRecognition" in window)
        ) {

            alert(
                "Speech Recognition not supported"
            );

            return;
        }

        const recognition =
            new window.webkitSpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;
            }

            setLocalCaption(transcript);

            socketRef.current?.send(
                JSON.stringify({
                    meetingId,
                    type: "caption",
                    userName:
                        window.currentUserName,
                    text: transcript
                })
            );
        };

        recognition.onend = () => {

            console.log(
                "Caption Stopped"
            );

            setCaptionEnabled(false);
        };

        recognition.start();

        recognitionRef.current =
            recognition;

        setCaptionEnabled(true);

        console.log(
            "Caption Started"
        );
    };

    const stopCaption = () => {

        if (
            recognitionRef.current
        ) {

            recognitionRef.current.stop();

            setCaptionEnabled(false);

            console.log(
                "Caption Manually Stopped"
            );
        }
    };

    useEffect(() => {

        const name = prompt("Enter Your Name");

        if (name && name.trim()) {

            setUserName(name);
            setNameEntered(true);

            window.currentUserName = name;
        } else {

            alert("Name is required");
            window.location.href = "/";
            return;
        }

        peerRef.current =
            new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });

        peerRef.current.ontrack =
            (event) => {

                console.log(
                    "Remote Stream Received"
                );

                remoteVideoRef.current.srcObject =
                    event.streams[0];
            };

        peerRef.current.onicecandidate =
            (event) => {

                if (event.candidate) {

                    socketRef.current.send(
                        JSON.stringify({
                            meetingId: meetingId,
                            type: "candidate",
                            candidate: event.candidate
                        })
                    );

                    console.log(
                        "ICE Sent"
                    );
                }
            };

        console.log(
            "Peer Connection Created"
        );

        const startCamera = async () => {

            try {

                console.log("navigator =", navigator);
                console.log("mediaDevices =", navigator.mediaDevices);
                console.log("secure =", window.isSecureContext);

                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    });

                streamRef.current = stream;

                if ("webkitSpeechRecognition" in window) {

                    console.log("Speech Recognition Supported");

                    const recognition =
                        new window.webkitSpeechRecognition();

                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = "en-US";

                    recognition.onstart = () => {

                        console.log("Speech Started");
                    };

                    recognition.onresult = (event) => {

                        console.log("Speech Result Event");

                        let transcript = "";

                        for (
                            let i = event.resultIndex;
                            i < event.results.length;
                            i++
                        ) {

                            transcript +=
                                event.results[i][0].transcript;
                        }

                        console.log("Transcript:", transcript);

                        setLocalCaption(transcript);

                        if (
                            socketRef.current &&
                            socketRef.current.readyState === WebSocket.OPEN
                        ) {

                            console.log("Caption Sent:", transcript);

                            socketRef.current.send(
                                JSON.stringify({
                                    meetingId: meetingId,
                                    type: "caption",
                                    userName: window.currentUserName,
                                    text: transcript
                                })
                            );
                        } else {

                            console.log("WebSocket Not Open");
                        }
                    };

                    recognition.onerror = (event) => {

                        console.log("Speech Error:", event.error);
                    };

                    recognition.onend = () => {

                        console.log("Speech Ended");
                        
                    };

                    recognition.start();

                    recognitionRef.current =
                        recognition;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                stream.getTracks().forEach(track => {

                    peerRef.current.addTrack(
                        track,
                        stream
                    );
                });

            } catch (error) {
                console.error("Camera Error:", error);
                alert(error.name + " : " + error.message);
            }
        };

        startCamera();

        // socketRef.current =
        //     new WebSocket(
        //         // "ws://localhost:8080/signal"
        //         "ws://192.168.0.106:8080/signal"
        //     );

        const protocol =
    window.location.protocol === "https:"
        ? "wss"
        : "ws";

socketRef.current =
    new WebSocket(
        `${protocol}://${window.location.host}/signal`
    );

    // 

        socketRef.current.onopen = () => {

            console.log(
                "Connected to WebSocket"
            );

            socketRef.current.send(
                JSON.stringify({
                    meetingId: meetingId,
                    type: "join",
                    userName: window.currentUserName
                })
            );
        };

        socketRef.current.onmessage = async (event) => {

                try {

                    const data =
                        JSON.parse(
                            event.data
                        );

                    if (data.type === "join") {

                        setRemoteUserName(
                            data.userName
                        );

                        console.log(
                            "Remote User:",
                            data.userName
                        );

                        return;
                    }

                    console.log(
                        "Received",
                        data
                    );

                    if (data.type === "participants") {

                        setParticipants(data.users);

                        console.log(
                            "Participants:",
                            data.users
                        );

                        return;
                    }

                    if (data.type === "offer") {

                        console.log(
                            "Offer Received"
                        );

                        await peerRef.current.setRemoteDescription(
                            new RTCSessionDescription(
                                data.offer
                            )
                        );

                        const answer =
                            await peerRef.current.createAnswer();

                        await peerRef.current.setLocalDescription(
                            answer
                        );

                        socketRef.current.send(
                            JSON.stringify({
                                meetingId: meetingId,
                                type: "answer",
                                answer: answer
                            })
                        );

                        console.log(
                            "Answer Sent"
                        );
                    }

                    if (data.type === "mic") {

    if (data.userName !== userName) {
        setRemoteMicOn(data.enabled);
    }

    return;
}

if (data.type === "camera") {

    if (data.userName !== userName) {
        setRemoteCameraOn(data.enabled);
    }

    return;
}

                    if (data.type === "answer") {

                        console.log(
                            "Answer Received"
                        );

                        await peerRef.current.setRemoteDescription(
                            new RTCSessionDescription(
                                data.answer
                            )
                        );
                    }

                    if (data.type === "candidate") {

                        console.log(
                            "ICE Received"
                        );

                        await peerRef.current.addIceCandidate(
                            new RTCIceCandidate(
                                data.candidate
                            )
                        );
                    }
                    if (data.type === "chat") {

                        setChatMessages(prev => [
                            ...prev,
                            {
                                userName: data.userName,
                                message: data.message
                            }
                        ]);
                    }

    if (data.type === "hand") {

    console.log("Hand message received:", data);

    if (data.userName !== userName) {
        setRemoteHandRaised(data.raised);
    }

    return;
}

                    if (data.type === "caption") {

                        if (data.userName !== userName) {

                            setRemoteCaption(
                                data.text
                            );
                        }

                        return;
                    }

                    if (data.type === "recording") {

    if (data.status === "started") {

        alert(data.userName + " started recording the meeting.");

    } else {

        alert(data.userName + " stopped recording the meeting.");
    }

    return;
}

                    if (data.type === "user-left") {

                        console.log(
                            data.userName +
                            " left meeting"
                        );

                        setParticipants(prev =>
                            prev.filter(
                                user =>
                                    user !== data.userName
                            )
                        );

                        if (
                            data.userName ===
                            remoteUserName
                        ) {

                            setRemoteUserName("");

                            if (
                                remoteVideoRef.current
                            ) {

                                remoteVideoRef.current.pause();

                                remoteVideoRef.current.srcObject =
                                    null;

                                remoteVideoRef.current.load();
                            }

                            if (
                                peerRef.current
                            ) {

                                peerRef.current.close();

                                peerRef.current =
                                    new RTCPeerConnection({
                                        iceServers: [
                                            {
                                                urls:
                                                    "stun:stun.l.google.com:19302"
                                            }
                                        ]
                                    });

                                peerRef.current.ontrack =
                                    (event) => {

                                        console.log(
                                            "Remote Stream Received"
                                        );

                                        remoteVideoRef.current.srcObject =
                                            event.streams[0];
                                    };

                                peerRef.current.onicecandidate =
                                    (event) => {

                                        if (event.candidate) {

                                            socketRef.current.send(
                                                JSON.stringify({
                                                    meetingId:
                                                        meetingId,
                                                    type:
                                                        "candidate",
                                                    candidate:
                                                        event.candidate
                                                })
                                            );
                                        }
                                    };
                            }
                        }

                        return;
                    }


                } catch (error) {

                    console.log(
                        "Text Message:",
                        event.data
                    );
                }
            };

        socketRef.current.onclose = () => {

            console.log(
                "WebSocket Closed"
            );
        };

        return () => {

            if (
                socketRef.current
            ) {

                socketRef.current.close();
            }

            if (
                streamRef.current
            ) {

                streamRef.current
                    .getTracks()
                    .forEach(track =>
                        track.stop()
                    );
            }
        };

    }, []);

    const sendChatMessage = () => {

        if (
            !message.trim() ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            return;
        }

        socketRef.current.send(
            JSON.stringify({
                type: "chat",
                meetingId: meetingId,
                userName: userName,
                message: message
            })
        );

        setChatMessages(prev => [
            ...prev,
            {
                userName: userName,
                message: message
            }
        ]);

        setMessage("");
    };

    const startCall = async () => {

        const offer =
            await peerRef.current.createOffer();

        await peerRef.current.setLocalDescription(
            offer
        );

        socketRef.current.send(
            JSON.stringify({
                meetingId: meetingId,
                type: "offer",
                offer: offer
            })
        );

        console.log(
            "Offer Sent"
        );
    };

    const shareScreen = async () => {

        const screenStream =
            await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

        const screenTrack =
            screenStream.getVideoTracks()[0];

        screenTrack.onended = () => {

            const cameraTrack =
                streamRef.current
                    .getVideoTracks()[0];

            const sender =
                peerRef.current
                    .getSenders()
                    .find(sender =>
                        sender.track &&
                        sender.track.kind === "video"
                    );

            if (sender) {

                sender.replaceTrack(
                    cameraTrack
                );
            }

            console.log(
                "Returned To Camera"
            );
        };

        const sender =
            peerRef.current
                .getSenders()
                .find(sender =>
                    sender.track &&
                    sender.track.kind === "video"
                );

        if (sender) {

            sender.replaceTrack(
                screenTrack
            );
        }

        console.log(
            "Screen Sharing Started"
        );
    };
    const startRecording = () => {

        const stream =
            remoteVideoRef.current?.srcObject;

        if (!stream) {

            alert(
                "No remote stream available"
            );

            return;
        }

        recordedChunksRef.current = [];

        mediaRecorderRef.current =
            new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable =
            (event) => {

                if (
                    event.data.size > 0
                ) {

                    recordedChunksRef.current.push(
                        event.data
                    );
                }
            };

        mediaRecorderRef.current.start();

        setRecording(true);

        console.log(
            "Recording Started"
        );
        socketRef.current.send(
    JSON.stringify({
        type: "recording",
        meetingId: meetingId,
        userName: userName,
        status: "started"
    })
);
    };
    const stopRecording = () => {

        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop =
            () => {

                const blob =
                    new Blob(
                        recordedChunksRef.current,
                        {
                            type:
                                "video/webm"
                        }
                    );

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const a =
                    document.createElement(
                        "a"
                    );

                a.href = url;

                a.download =
                    "meeting-recording.webm";

                a.click();

                URL.revokeObjectURL(
                    url
                );
            };

        setRecording(false);

        console.log(
            "Recording Stopped"
        );
        socketRef.current.send(
    JSON.stringify({
        type: "recording",
        meetingId: meetingId,
        userName: userName,
        status: "stopped"
    })
);
    };
    const toggleCamera = () => {

        const videoTrack =
            streamRef.current
                .getVideoTracks()[0];

        videoTrack.enabled =
            !videoTrack.enabled;

        setCameraOn(
            videoTrack.enabled
        );
        socketRef.current.send(
    JSON.stringify({
        type: "camera",
        meetingId,
        userName,
        enabled: videoTrack.enabled
    })
);
    };

    const toggleMic = () => {

        const audioTrack =
            streamRef.current
                .getAudioTracks()[0];

        audioTrack.enabled =
            !audioTrack.enabled;

        setMicOn(audioTrack.enabled);
        socketRef.current.send(
    JSON.stringify({
        type: "mic",
        meetingId,
        userName,
        enabled: audioTrack.enabled
    })
);
    };

    const toggleHand = () => {

    const raised = !handRaised;

    setHandRaised(raised);

    if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
    ) {

        socketRef.current.send(
            JSON.stringify({
                type: "hand",
                meetingId: meetingId,
                userName: userName,
                raised: raised
            })
        );
    }
};

    const leaveMeeting = () => {

        if (recognitionRef.current) {

            recognitionRef.current.stop();
        }

        if (
            streamRef.current
        ) {

            streamRef.current
                .getTracks()
                .forEach(track =>
                    track.stop()
                );
        }

        if (
            socketRef.current
        ) {

            socketRef.current.close();
        }

        window.location.href = "/";
    };
    if (!nameEntered) {

        return null;
    }
    return (
        <div>

            <h1>Meeting Room</h1>
            <h2>
                Meeting ID : {meetingId}
            </h2>
            {/* <h3>
                Participants : {participants.length}
            </h3> */}

            <button
                onClick={toggleCamera}
            >
                {
                    cameraOn
                        ? "Turn Camera Off"
                        : "Turn Camera On"
                }
            </button>

            <button
                onClick={toggleMic}
                style={{
                    marginLeft: "10px"
                }}
            >
                {
                    micOn
                        ? "Mute Mic"
                        : "Unmute Mic"
                }
            </button>

            <button
                onClick={leaveMeeting}
                style={{
                    marginLeft: "10px"
                }}
            >
                Leave Meeting
            </button>

            <button
                onClick={startCall}
                style={{
                    marginLeft: "10px"
                }}
            >
                Start Call
            </button>

            <button
                onClick={
                    recording
                        ? stopRecording
                        : startRecording
                }
                style={{
                    marginLeft: "10px"
                }}
            >
                {
                    recording
                        ? "Stop Recording"
                        : "Start Recording"
                }
            </button>

            <button
                onClick={shareScreen}
                style={{
                    marginLeft: "10px"
                }}
            >
                Share Screen
            </button>

            <button onClick={toggleHand}>
    {handRaised ? "✋ Lower Hand" : "✋ Raise Hand"}
</button>

            <button
                onClick={
                    captionEnabled
                        ? stopCaption
                        : startCaption
                }
            >
                {
                    captionEnabled
                        ? "Stop Caption"
                        : "Start Caption"
                }
            </button>

            <br />
            <br />

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >
                

<div>

    <h3>{userName}</h3>

    <div
        style={{
            position: "relative",
            display: "inline-block"
        }}
    >

        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="400"
        />

        {/* Mic Icon */}
        {!micOn && (
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "30px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                🎤❌
            </div>
        )}

        {/* Camera Icon */}
        {!cameraOn && (
            <div
                style={{
                    position: "absolute",
                    top: "55px",
                    left: "10px",
                    fontSize: "30px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                📷❌
            </div>
        )}

        {/* Hand Raise */}
        {handRaised && (
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "35px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                ✋
            </div>
        )}

    </div>

    <div
        style={{
            color: "yellow",
            fontSize: "18px",
            marginTop: "10px",
            minHeight: "30px"
        }}
    >
        {localCaption}
    </div>

</div>

<div>

    <h3>{remoteUserName}</h3>

    <div
        style={{
            position: "relative",
            display: "inline-block"
        }}
    >

        <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            width="400"
        />

        {/* Remote Mic */}
        {!remoteMicOn && (
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "30px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                🎤❌
            </div>
        )}

        {/* Remote Camera */}
        {!remoteCameraOn && (
            <div
                style={{
                    position: "absolute",
                    top: "55px",
                    left: "10px",
                    fontSize: "30px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                📷❌
            </div>
        )}

        {/* Remote Hand */}
        {remoteHandRaised && (
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "35px",
                    background: "black",
                    borderRadius: "50%",
                    padding: "5px"
                }}
            >
                ✋
            </div>
        )}

    </div>

    <div
        style={{
            color: "cyan",
            fontSize: "18px",
            marginTop: "10px",
            minHeight: "30px"
        }}
    >
        {remoteCaption}
    </div>

</div>



            </div>
            <br />
            <br />

            <div
                style={{
                    width: "850px",
                    margin: "auto"
                }}
            >
                <h3>Chat</h3>

                <div
                    style={{
                        border: "1px solid white",
                        height: "200px",
                        overflowY: "auto",
                        padding: "10px",
                        textAlign: "left"
                    }}
                >
                    {chatMessages.map((msg, index) => (

                        <div
                            key={index}
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            <b>{msg.userName}</b> :
                            {" "}
                            {msg.message}
                        </div>

                    ))}
                </div>

                <br />

                <input
                    type="text"
                    value={message}
                    placeholder="Type a message..."
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    style={{
                        width: "70%",
                        padding: "8px"
                    }}
                />

                <button
                    onClick={sendChatMessage}
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Send
                </button>

            </div>
        </div>
    );
}

export default MeetingRoom;