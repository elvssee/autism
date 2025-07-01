import React, { useRef, useEffect, useState } from "react";
import axios from "axios"; // You'll need to install axios: npm install axios

const WebcamAnalysis = () => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [videoURL, setVideoURL] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);  
    const recordedChunksRef = useRef([]);
    const timerRef = useRef(null);
    const videoBlob = useRef(null);

    
    useEffect(() => {
        async function setupWebcam() {
            try {
                console.log("Requesting webcam access...");
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                console.log("Webcam access granted!");
                
                
                streamRef.current = stream;
                
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    console.log("Video stream connected to video element");
                    setInitialized(true);
                } else {
                    console.error("Video element reference is not available");
                    setError("Video element not found");
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError(`Webcam access error: ${err.message}`);
            }
        }
        
        setupWebcam();
        
        
        return () => {
            console.log("Cleaning up media resources...");
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    console.log(`Stopping track: ${track.kind}`);
                    track.stop();
                });
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    
    const startRecording = () => {
        console.log("Start recording requested");
        if (!streamRef.current) {
            console.error("No media stream available");
            setError("No media stream available. Please refresh and try again.");
            return;
        }
        
        try {
            
            setUploadSuccess(false);
            
            
            recordedChunksRef.current = [];
            
            
            const options = { mimeType: "video/webm" };
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
            
        
            mediaRecorderRef.current.ondataavailable = (event) => {
                console.log(`Data available event. Data size: ${event.data.size}`);
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            
         
            mediaRecorderRef.current.onstop = () => {
                console.log("MediaRecorder stopped. Processing recording...");
                console.log(`Recorded chunks: ${recordedChunksRef.current.length}`);
                
                if (recordedChunksRef.current.length === 0) {
                    console.error("No data was recorded");
                    setError("Recording failed: No data captured");
                    setRecording(false);
                    return;
                }
                
                
                const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
                videoBlob.current = blob;
                console.log(`Created blob of size: ${blob.size} bytes`);
                
                
                const url = URL.createObjectURL(blob);
                setVideoURL(url);
                setRecording(false);
                setCountdown(null);
            };
            
            
            mediaRecorderRef.current.start(100);
            console.log("MediaRecorder started");
            
            
            setRecording(true);
            setCountdown(5);
            
    
            timerRef.current = setTimeout(() => {
                console.log("5-second timer completed, stopping recording");
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                }
            }, 5000);
            
        } catch (err) {
            console.error("Error setting up recorder:", err);
            setError(`Recording setup failed: ${err.message}`);
        }
    };
    
    
    const stopRecording = () => {
        console.log("Manual stop requested");
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            console.log("Stopping media recorder");
            mediaRecorderRef.current.stop();
        } else {
            console.log("Media recorder is not in recording state");
            setRecording(false);
            setCountdown(null);
        }
    };
    
    
    const uploadVideo = async () => {
        if (!videoBlob.current) {
            setError("No video recorded to upload");
            return;
        }
    
        setUploading(true);
        setError(null);
    
        try {
            const formData = new FormData();
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `recording-${timestamp}.webm`;
    
            formData.append("video", videoBlob.current, filename);
    
            
            const response = await axios.post("http://localhost:3003/api/save-video", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("✅ Video automatically saved:", response.data);
            setUploadSuccess(true);
        } catch (err) {
            console.error("❌ Error uploading video:", err);
            setError(`Upload failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setUploading(false);
        }
    };
    
    
    
    useEffect(() => {
        let interval;
        if (recording && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [recording, countdown]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Webcam Analysis</h2>
            
            {error && (
                <div style={{ color: "red", margin: "10px 0", padding: "10px", backgroundColor: "#ffeeee", borderRadius: "5px" }}>
                    Error: {error}
                    <button 
                        onClick={() => setError(null)} 
                        style={{ marginLeft: "10px", padding: "2px 8px" }}
                    >
                        Dismiss
                    </button>
                </div>
            )}
            
            <div style={{ marginBottom: "20px" }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    style={{ 
                        width: "500px", 
                        height: "375px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        backgroundColor: "#000" 
                    }} 
                />
            </div>
            
            <div>
                {!recording ? (
                    <button 
                        onClick={startRecording} 
                        disabled={!initialized}
                        style={{
                            ...buttonStyle,
                            opacity: initialized ? 1 : 0.5,
                            cursor: initialized ? "pointer" : "not-allowed"
                        }}
                    >
                        {initialized ? "Start 5-Second Recording" : "Initializing Camera..."}
                    </button>
                ) : (
                    <div>
                        <button 
                            onClick={stopRecording} 
                            style={{ ...buttonStyle, backgroundColor: "red" }}
                        >
                            Stop Recording
                        </button>
                        <div style={{ 
                            margin: "10px", 
                            padding: "5px 10px", 
                            backgroundColor: "rgba(255,0,0,0.1)", 
                            display: "inline-block", 
                            borderRadius: "5px",
                            fontWeight: "bold"
                        }}>
                            Recording: {countdown} seconds remaining
                        </div>
                    </div>
                )}
            </div>
            
            {videoURL && (
                <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                    <h3>Recorded Video:</h3>
                    <video 
                        src={videoURL} 
                        controls 
                        style={{ 
                            width: "500px", 
                            border: "2px solid black",
                            borderRadius: "8px", 
                            backgroundColor: "#000"
                        }} 
                    />
                    <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
                        <a 
                            href={videoURL} 
                            download="asd-analysis-recording.webm"
                            style={{ textDecoration: "none" }}
                        >
                            <button style={{ ...buttonStyle, backgroundColor: "#2c3e50" }}>
                                Download Video
                            </button>
                        </a>
                        
                        <button 
                            onClick={uploadVideo} 
                            disabled={uploading}
                            style={{ 
                                ...buttonStyle, 
                                backgroundColor: "#27ae60",
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {uploading ? "Uploading..." : "Save to Project Folder"}
                        </button>
                    </div>
                    
                    {uploadSuccess && (
                        <div style={{ 
                            marginTop: "10px", 
                            padding: "10px", 
                            backgroundColor: "#e6ffe6", 
                            color: "#008000",
                            borderRadius: "5px",
                            fontWeight: "bold"
                        }}>
                            Video successfully saved to project folder!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    margin: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#16A085",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    transition: "all 0.3s"
};

export default WebcamAnalysis;