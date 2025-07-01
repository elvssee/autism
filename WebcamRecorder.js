import React, { useState, useRef } from "react";

const WebcamRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    console.log("🟢 Start Recording Button Clicked");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("✅ Webcam Access Granted");

      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log("📹 Data available: ", event.data);
        }
      };

      mediaRecorder.onstart = () => {
        console.log("✅ Recording started...");
        setRecording(true);
      };

      mediaRecorder.onstop = () => {
        console.log("🛑 Recording stopped.");
        setRecording(false);

        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        console.log("🎥 Video Saved: ", url);
        setVideoURL(url);

        // Stop webcam stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 sec

    } catch (error) {
      console.error("🚨 getUserMedia error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎥 Webcam Recorder</h2>

      <video ref={videoRef} autoPlay playsInline style={{ width: "400px", border: "2px solid black" }}></video>

      <div style={{ marginTop: "10px" }}>
        <button 
          onClick={startRecording} 
          disabled={recording} 
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: recording ? "gray" : "blue",
            color: "white",
            border: "none",
            cursor: recording ? "not-allowed" : "pointer"
          }}
        >
          {recording ? "⏺ Recording..." : "🎥 Start Recording"}
        </button>
      </div>

      {videoURL && (
        <div style={{ marginTop: "20px" }}>
          <h3>📹 Recorded Video:</h3>
          <video src={videoURL} controls style={{ width: "400px" }}></video>
          <br />
          <a href={videoURL} download="recorded-video.webm">
            ⬇️ Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default WebcamRecorder;
