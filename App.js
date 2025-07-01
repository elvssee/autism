import { useState, useEffect } from "react";
import React, { useRef} from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { OpenAI } from "openai";
import questionsData from "./questions.json";
import "./styles.css";
import { motion } from "framer-motion";
import CommunityChat from "./CommunityChat";
import WebcamAnalysis from "./WebcamAnalysis";



const firebaseConfig = {
  apiKey: "AIzaSyBk3h5kIXfqn1ZUH6WMAtlboIh6zi-Qldk",
  authDomain: "autism-det.firebaseapp.com",
  projectId: "autism-det",
  storageBucket: "autism-det.firebasestorage.app",
  messagingSenderId: "181738957874",
  appId: "1:181738957874:web:e3942a71af1978d54f602b",
  measurementId: "G-S6MTQLMZQ7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);







function HomePage() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="top-bar">
          <motion.h1
            className="logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            AUTI-TRACK
          </motion.h1>
        </div>
        <div className="overlay">
          <motion.div
            className="quote-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3.5 }}
          >
            <p>
              "Autism isn't something a person has, or a 'shell' that a person is trapped inside. There's no normal child hidden behind the autism. Autism is a way of being. It is pervasive; it colors every experience, every sensation, perception, thought, emotion, and encounter, every aspect of existence."
            </p>
          </motion.div>
          <div className="button-group">
            <Link to="/signup" className="button button-pink">Start Assessment</Link>
            <Link to="/login" className="button button-gray">Login</Link>
          </div>
        </div>
      </header>

      
      <section className="awareness-section">
        <h2>Understanding Autism</h2>
        <p>Autism Spectrum Disorder (ASD) is a complex neurodevelopmental condition that affects communication, social interaction, and behavior in unique ways.</p>
        
        <div className="facts-container">
          <div className="fact">
            <strong>1 in 44</strong> children are diagnosed with Autism Spectrum Disorder (ASD) according to the CDC.
          </div>
          <div className="fact">
            ASD is about <strong>4 times more common</strong> among boys than among girls.
          </div>
          <div className="fact">
            Early detection can significantly improve outcomes. Most children can be reliably diagnosed <strong>by age 2</strong>.
          </div>
          <div className="fact">
            Autism is a <strong>spectrum</strong> - each person with autism has a distinct set of strengths and challenges.
          </div>
        </div>
      </section>

      
      <section className="testimonials">
        <h2>What People Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"This platform helped me understand autism better and connect with professionals. The early assessment tools gave us the confidence to seek proper diagnosis for our child."</p>
            <span>- Parent of an ASD child</span>
          </div>
          <div className="testimonial-card">
            <p>"As a therapist, I recommend Auti-Track to families concerned about developmental milestones. The detailed reports help initiate meaningful conversations about next steps."</p>
            <span>- Child Development Specialist</span>
          </div>
          <div className="testimonial-card">
            <p>"The resources provided by Auti-Track helped our family learn how to better support our son's unique needs and celebrate his strengths."</p>
            <span>- Mother of a 6-year-old with ASD</span>
          </div>
        </div>
      </section>

     
      <section className="resources-section">
        <h2>ASD Resources</h2>
        <p>Early detection and intervention are crucial for supporting individuals with autism.</p>
        
        <div className="resource-cards">
          <div className="resource-card">
            <h3>Signs & Symptoms</h3>
            <p>Learn about potential early indicators of autism spectrum disorder and when to seek professional guidance.</p>
          </div>
          <div className="resource-card">
            <h3>Support Networks</h3>
            <p>Connect with local and online communities of families, caregivers, and professionals.</p>
          </div>
          <div className="resource-card">
            <h3>Intervention Strategies</h3>
            <p>Discover evidence-based approaches to support development and enhance quality of life.</p>
          </div>
        </div>
      </section>

    
    </div>
  );
}



function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/questionnaire");
    } catch (error) {
      console.error("Google Signup Error:", error);
      setError("Signup failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-logo-section">
        <motion.h1 
          className="auth-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AUTI-TRACK
        </motion.h1>
        <p className="auth-tagline">Early detection leads to better outcomes</p>
      </div>

      <motion.div 
        className="auth-box signup-box"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join thousands of parents and professionals dedicated to understanding autism spectrum disorder</p>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </motion.div>
        )}

        <div className="auth-methods">
          <button
            onClick={handleGoogleSignup}
            className="auth-button google-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-text">
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                Creating your account...
              </span>
            ) : (
              <>
                <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Sign Up with Google
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          
        </div>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
          <div className="terms">
            By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </motion.div>

      <div className="auth-info-panel">
        <div className="auth-info-content">
          <h3>Why early screening matters</h3>
          <ul>
            <li>Early intervention improves outcomes</li>
            <li>Research shows intervention before age 4 has significant impact</li>
            <li>Identify developmental concerns sooner</li>
            <li>Connect with resources and professionals</li>
          </ul>
          <div className="auth-info-quote">
            "The earlier we identify ASD, the sooner appropriate interventions can begin."
            <span>- American Academy of Pediatrics</span>
          </div>
        </div>
      </div>
    </div>
  );
}


function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/questionnaire"); // Redirect after login
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p className="login-subtext">Log in to continue your journey.</p>
        <button onClick={handleGoogleLogin} className="login-button">
          
          Log In with Google
        </button>
        <p className="alternate-login">
          New here? <a href="/signup">Create an account</a>
        </p>
      </div>
    </div>
  );
}


function Questionnaire() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [asdCount, setAsdCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAsdMildDetected, setIsAsdMildDetected] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  
  const asdQuotes = [
    "Understanding differences in social communication is key to ASD awareness.",
    "Early screening can lead to better outcomes through timely intervention.",
    "Every person with autism has unique strengths and challenges.",
    "Autism is a different way of experiencing and processing the world around us.",
    "Neurodiversity enriches our society with different perspectives."
  ];

  
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % asdQuotes.length);
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, []);

  
  const asdIndicators = {
    1: "No",  // Question 1: No eye contact → ASD trait
    2: "No",  // Question 2: Doesn't respond to name → ASD trait
    3: "No",  // Question 3: Doesn't play with others → ASD trait
    4: "Yes", // Question 4: Repetitive behavior (hand-flapping) → ASD trait
    5: "No",  // Question 5: Doesn't enjoy social games → ASD trait
    6: "No",  // Question 6: Doesn't point to show interest → ASD trait
    7: "No",  // Question 7: Doesn't imitate gestures → ASD trait
    8: "No",  // Question 8: Doesn't respond to attention → ASD trait
    9: "Yes", // Question 10: Sensitive to sound, light, texture → ASD trait
    10: "Yes", // Question 11: Gets upset by small changes → ASD trait
    11: "No",  // Question 12: Doesn't communicate as expected → ASD trait
    12: "No",  // Question 13: Doesn't play pretend games → ASD trait
    13: "Yes", // Question 14: Repeats words (echolalia) → ASD trait
    14: "Yes", // Question 15: Trouble understanding emotions → ASD trait
    15: "Yes", // Question 16: Prefers to play alone → ASD trait
  };

  const handleAnswer = (answer) => {
    setResponses((prevResponses) => {
      const updatedResponses = [...prevResponses, answer];
  
      
      const asdTraitCount = updatedResponses.reduce((count, response, index) => {
        return response === questionsData[index].asd_indicator ? count + 1 : count;
      }, 0);
  
      const threshold = Math.ceil(questionsData.length * 0.3); 
  
      if (updatedResponses.length === questionsData.length) {
        if (asdTraitCount >= threshold) {
          setIsAsdMildDetected(true);
        }
        setShowResult(true);
      }
  
      return updatedResponses;
    });
  
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };
  
  
  

  return (
    <div className="questionnaire-container">
      <h2>ASD Questionnaire</h2>

      {/* Quote display */}
      <div className="quote-container">
        <p className="quote-text">"{asdQuotes[currentQuote]}"</p>
      </div>

      {currentQuestionIndex < questionsData.length ? (
        <>
          <div className="question-card">
            <p>{questionsData[currentQuestionIndex].question}</p>
            <div className="button-group">
              {questionsData[currentQuestionIndex].options.map((option) => (
                <button key={option} onClick={() => handleAnswer(option)} className="button">
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="progress-indicator">
            Question {currentQuestionIndex + 1} of {questionsData.length}
          </div>
        </>
      ) : (
        <div className="results-container">
          <p>Thank you for completing the questionnaire.</p>

          {isAsdMildDetected ? (
            <>
              <p className="detection-message detection-positive">
                <strong>ASD Mild Detected.</strong> Please proceed to further assessment.
              </p>
              <button className="button button-blue" onClick={() => navigate("/webcam-analysis")}>
                Proceed to Webcam Analysis
              </button>
            </>
          ) : (
            <p className="detection-message detection-negative">
              No ASD detected, but consult a professional if needed.
            </p>
          )}

          {/* Community Chat button for EVERYONE */}
          <button className="button button-green" onClick={() => navigate("/community-chat")}>
            Join Community Chat
          </button>
        </div>
      )}
    </div>
  );
}

const WebcamRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef 

= useRef([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("✅ Webcam access granted");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("✅ Video stream attached");

          const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
          
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
          
          recorder.onstop = () => {
            console.log("✅ Recording stopped, processing file...");
            const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setIsRecording(false);
          };

          mediaRecorderRef.current = recorder;
          console.log("✅ MediaRecorder initialized");
        } else {
          console.error("❌ videoRef.current is null, retrying...");
        }
      })
      .catch((error) => console.error("❌ Error accessing webcam:", error));
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      recordedChunksRef.current = [];
    
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("▶️ Recording started...");
    } else {
      console.error("❌ MediaRecorder is not ready.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      console.log("⏹️ Recording stopped.");
    } else {
      console.error("❌ MediaRecorder is not recording.");
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      {isRecording && <p>🔴 Recording...</p>}
      {downloadUrl && (
        <a href={downloadUrl} download="recorded-video.webm">Download Video</a>
      )}
    </div>
  );
};








function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/community-chat" element={<CommunityChat />} />
        <Route path="/webcam-analysis" element={<WebcamAnalysis />} /> 
        <Route path="/webcam-analysis" element={<WebcamRecorder />} />
    
      </Routes>
    </Router>
  );
}

export default App;
