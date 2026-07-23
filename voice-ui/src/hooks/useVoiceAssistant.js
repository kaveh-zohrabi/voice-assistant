import { useState, useRef, useCallback, useEffect } from 'react';

export default function useVoiceAssistant({ onMessage, onSpeaking, onListening }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isReady, setIsReady] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const isSpeakingRef = useRef(false);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fa-IR';

    recognition.onstart = () => {
      setIsListening(true);
      onListening?.(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        setTranscript(finalTranscript);
        onMessage?.(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error('Speech error:', event.error);
      }
    };

    recognition.onend = () => {
      // Auto restart if not speaking
      if (!isSpeakingRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
        onListening?.(false);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch {}
  }, [onMessage, onListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    onListening?.(false);
  }, [onListening]);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      // Clean text
      const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/\[FA\]|\[EN\]/g, '').trim();
      if (!cleanText) { resolve(); return; }

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.95;
      utterance.pitch = 1;

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setIsSpeaking(true);
        onSpeaking?.(true);
        // Pause recognition while speaking
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        onSpeaking?.(false);
        // Resume listening after speaking
        setTimeout(() => {
          if (!isSpeakingRef.current) {
            try {
              const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (SR && recognitionRef.current) {
                recognitionRef.current.start();
              }
            } catch {}
          }
        }, 300);
        resolve();
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        onSpeaking?.(false);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  }, [onSpeaking]);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    onSpeaking?.(false);
  }, [onSpeaking]);

  useEffect(() => {
    setIsReady(true);
    return () => {
      stopListening();
      synthRef.current.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    isReady,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setTranscript,
  };
}
