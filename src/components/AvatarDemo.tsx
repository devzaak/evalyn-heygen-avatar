"use client";

import { fetchAccessToken } from "@/app/actions";
import StreamingAvatar, { AvatarQuality, StreamingEvents } from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";

export default function AvatarDemo() {
  const [avatar, setAvatar] = useState<StreamingAvatar | null>(null);
  const [sessionData, setSessionData] = useState<{ sessionId: string; avatarUrl: string } | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userInput, setUserInput] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (avatar) {
        avatar.stopAvatar();
      }
    };
  }, [avatar]);

  async function initializeAvatarSession() {
    try {
      const token = await fetchAccessToken();
      const newAvatar = new StreamingAvatar({ token });

      const newSessionData = await newAvatar.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "default",
      });

      console.log("Session data:", newSessionData);

      setAvatar(newAvatar);
      setSessionData(newSessionData);
      setIsSessionActive(true);

      newAvatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
      newAvatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
    } catch (error) {
      console.error("Failed to initialize avatar session:", error);
      // Here you might want to set an error state and display it to the user
    }
  }

  function handleStreamReady(event: CustomEvent<MediaStream>) {
    if (event.detail && videoRef.current) {
      videoRef.current.srcObject = event.detail;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(console.error);
      };
    } else {
      console.error("Stream is not available");
    }
  }

  function handleStreamDisconnected() {
    console.log("Stream disconnected");
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsSessionActive(false);
  }

  async function terminateAvatarSession() {
    if (!avatar || !sessionData) return;

    await avatar.stopAvatar();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setAvatar(null);
    setSessionData(null);
    setIsSessionActive(false);
  }

  async function handleSpeak() {
    if (avatar && userInput) {
      await avatar.speak({
        text: userInput,
      });
      setUserInput(""); // Clear input after speaking
    }
  }

  return (
    <>
      <article style={{ width: "fit-content", backgroundColor: "#1f2937", padding: "1rem", borderRadius: "0.5rem" }}>
        <video ref={videoRef} autoPlay playsInline></video>
      </article>

      <section>
        <section role="group">
          <button onClick={initializeAvatarSession} disabled={isSessionActive}>
            Start Session
          </button>
          <button onClick={terminateAvatarSession} disabled={!isSessionActive}>
            End Session
          </button>
        </section>

        <section role="group">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type something to talk to the avatar..."
            aria-label="User input"
            style={{ backgroundColor: "#374151", color: "white", border: "1px solid #4b5563" }}
          />
          <button onClick={handleSpeak} disabled={!isSessionActive}>
            Speak
          </button>
        </section>
      </section>
    </>
  );
}
