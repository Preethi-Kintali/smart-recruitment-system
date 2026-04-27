import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Video, Send, CheckCircle, Loader2, Play } from 'lucide-react';
import api from '../api';

const MockInterview = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const questions = [
    "Welcome to your AI interview. Please tell us about yourself and your technical background.",
    "What are your core technical strengths, and how have you applied them in a project?",
    "Describe a challenging technical problem you solved recently.",
    "How do you stay updated with the latest technologies in your field?",
    "Why do you think you are the best fit for this specific role?"
  ];

  useEffect(() => {
    fetchApplication();
    setupCamera();
    return () => {
      if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    };
  }, [appId]);

  useEffect(() => {
    if (started && videoStream) {
      speakQuestion(questions[currentStep]);
      setTimeout(() => {
        const videoElement = document.getElementById('interview-video');
        if (videoElement) videoElement.srcObject = videoStream;
      }, 100);
    }
  }, [started, videoStream, currentStep]);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      const videoElement = document.getElementById('interview-video');
      if (videoElement) videoElement.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support speech recognition.");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
        console.log("Recognition started");
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript;
          setAnswers(prev => ({ 
            ...prev, 
            [currentStep]: (prev[currentStep] || '') + text + ' ' 
          }));
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please check your browser settings.");
        setIsListening(false);
      }
    };
    
    recognition.onend = () => {
      console.log("Recognition ended");
      // Only restart if we didn't explicitly call stopListening
      setIsListening(prev => {
        if (prev) {
            try {
                recognition.start();
            } catch (e) {}
        }
        return prev;
      });
    };

    recognition.start();
    window._recognition = recognition;
  };

  const stopListening = () => {
    setIsListening(false);
    if (window._recognition) {
      window._recognition.stop();
    }
  };

  const fetchApplication = async () => {
    try {
      const res = await api.get('/applications/job/all');
      const apps = Array.isArray(res.data) ? res.data : [];
      const app = apps.find(a => a._id === appId);
      setApplication(app);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    stopListening();
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In a real app, we'd send the full answers object to the server for AI analysis
      await api.put(`/applications/${appId}/status`, { 
        status: 'Interview',
        interviewAnswers: answers 
      });
      setCompleted(true);
    } catch (err) {
      alert('Failed to submit interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading Interview...</div>;

  if (completed) {
    return (
      <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <CheckCircle size={80} color="#10b981" style={{ marginBottom: '1.5rem' }} />
          <h1>Interview Completed!</h1>
          <p>The AI is now generating your performance report and sending it to the recruiter. You will be notified of the next steps shortly.</p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      {!started ? (
        <div className="glass-card" style={{ maxWidth: '700px', margin: '2rem auto', textAlign: 'center' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Video size={40} color="#6366f1" />
          </div>
          <h1>AI Voice Interview</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The AI will speak the questions. Use the "Answer by Voice" button to respond.
          </p>
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Instructions:</h4>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
              <li>The AI will read the questions aloud.</li>
              <li>Click "Start Speaking" and answer clearly.</li>
              <li>Your video and audio are being recorded for review.</li>
            </ul>
          </div>
          <button onClick={() => setStarted(true)} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            <Play size={20} /> Begin Voice Interview
          </button>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Question {currentStep + 1} of {questions.length}</span>
              <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ width: `${((currentStep + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--accent)' }}></div>
              </div>
            </div>
            
            <h2 style={{ marginBottom: '2rem', lineHeight: '1.4', color: 'var(--accent)' }}>{questions[currentStep]}</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', minHeight: '150px', border: isListening ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>YOUR ANSWER:</p>
                <textarea 
                  className="glass-input"
                  style={{ width: '100%', minHeight: '100px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', resize: 'none' }}
                  value={(answers[currentStep] || '') + transcript}
                  onChange={(e) => setAnswers({...answers, [currentStep]: e.target.value})}
                  placeholder={isListening ? "Listening... Speak clearly." : "Speak or type your answer here..."}
                ></textarea>
                {isListening && <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite' }}></div> 
                    Voice Recognition Active
                </p>}
            </div>

            <div className="flex" style={{ justifyContent: 'space-between' }}>
              <button 
                onClick={isListening ? stopListening : startListening} 
                className={isListening ? "btn-secondary" : "btn-primary"} 
                style={{ background: isListening ? '#ef4444' : 'var(--primary)', borderColor: isListening ? '#ef4444' : 'var(--primary)' }}
              >
                <Mic size={18} /> {isListening ? 'Stop Speaking' : 'Start Speaking'}
              </button>
              
              <button onClick={handleNext} className="btn-primary" disabled={submitting}>
                {submitting ? <Loader2 className="animate-spin" /> : currentStep === questions.length - 1 ? 'Submit Interview' : 'Next Question'} <Send size={18} />
              </button>
            </div>
          </div>

          <div>
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden', aspectRatio: '4/3', position: 'relative', background: '#000' }}>
              <video id="interview-video" autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.8)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite' }}></div> LIVE FEED
              </div>
            </div>
            <div className="glass-card">
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mic size={18} color={isListening ? "#ef4444" : "var(--accent)"} /> Audio Level
              </h4>
              <div style={{ display: 'flex', gap: '4px', height: '20px', alignItems: 'center' }}>
                {[...Array(15)].map((_, i) => (
                  <div key={i} style={{ 
                    width: '4px', 
                    height: isListening ? `${20 + Math.random() * 80}%` : '4px', 
                    background: isListening ? '#ef4444' : 'var(--accent)', 
                    borderRadius: '2px',
                    transition: 'height 0.1s ease'
                  }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
