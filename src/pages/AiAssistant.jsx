import { useState, useRef, useEffect, useCallback, memo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaPaperPlane, 
  FaLightbulb, 
  FaChartLine, 
  FaUser, 
  FaTrashAlt,
  FaMagic,
  FaMicrophone,
  FaVolumeUp
} from 'react-icons/fa';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/AiAssistant.module.css';

/**
 * PRODUCTION READINESS REVIEW: AI Assistant
 * 
 * Improvements made:
 * 1. Architecture: Extraction of sub-components and memoization for performance.
 * 2. UX: High-fidelity bouncing dot typing indicator instead of static text.
 * 3. Accessibility: Semantic form submission, aria-labels, and proper ARIA live regions.
 * 4. Logic: Improved auto-scroll synchronization and added "Clear Chat" capability.
 * 5. Visual Hierarchy: Better distinction between AI and User roles with structured avatars.
 */

// Static data defined outside to prevent re-creation on render
const QUICK_ACTIONS = [
  { 
    id: 'skill-gap',
    label: 'Analyze Skill Gap', 
    icon: <FaChartLine />, 
    prompt: 'I want to be a Senior React Developer. Can you analyze my skill gaps and suggest a roadmap?' 
  },
  { 
    id: 'internship',
    label: 'Match Internships', 
    icon: <FaLightbulb />, 
    prompt: 'Based on my student profile, which active internships align best with my rating?' 
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    icon: <FaMagic />,
    prompt: 'Can you practice a mock interview with me for a Frontend Engineer position?'
  }
];

const INITIAL_MESSAGE = { 
  id: 'init-0',
  role: 'ai', 
  content: "Welcome to Careerly Intelligence. I'm your private career strategist. How can I accelerate your professional journey today?" 
};

const AiAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (text = input) => {
    const messageText = typeof text === 'string' ? text : input;
    if (!messageText.trim() || isTyping) return;
    
    const userMsg = { 
      id: `u-${Date.now()}`, 
      role: 'user', 
      content: messageText 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiRes = await aiService.generateResponse(messageText, user);
      setMessages(prev => [...prev, { 
        id: `ai-${Date.now()}`, 
        role: 'ai', 
        content: aiRes 
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: `err-${Date.now()}`, 
        role: 'ai', 
        content: "I'm having trouble connecting to my neural core right now. Please try again in 30 seconds." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.chatWindow}>
        {/* Chat Header */}
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.botAvatar}>
              <FaRobot />
            </div>
            <div className={styles.headerText}>
              <h3>Careerly AI</h3>
              <div className={styles.statusIndicator}>
                <div className={styles.statusDot} />
                <span>Active Strategy Engine</span>
              </div>
            </div>
          </div>
          <button 
            className={styles.clearBtn} 
            onClick={handleClear} 
            title="Clear conversation"
            aria-label="Clear chat history"
          >
            <FaTrashAlt />
          </button>
        </header>

        {/* Message Stream */}
        <section className={styles.messageArea}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageItem key={msg.id} msg={msg} onSpeak={() => speak(msg.content)} />
            ))}
          </AnimatePresence>
          
          {isTyping && <TypingIndicator />}
          
          <div ref={scrollRef} />
        </section>

        {/* Console / Footer */}
        <footer className={styles.footer}>
          <div className={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => (
              <button 
                key={action.id} 
                className={styles.actionBtn}
                onClick={() => handleSend(action.prompt)}
                disabled={isTyping}
                aria-label={`Ask AI: ${action.label}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>

          <form 
            className={styles.inputArea} 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Query the career engine..."} 
              disabled={isTyping}
              aria-label="AI message input"
            />
            <button 
              type="button"
              className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
              onClick={toggleListening}
              title="Voice Input"
              disabled={isTyping}
            >
              <FaMicrophone />
            </button>
            <button 
              type="submit"
              className={styles.sendBtn}
              disabled={isTyping || !input.trim()}
              aria-label="Send query"
            >
              <FaPaperPlane />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const MessageItem = memo(({ msg, onSpeak }) => {
  const isAi = msg.role === 'ai';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`${styles.messageRow} ${isAi ? styles.ai : styles.user}`}
    >
      <div className={styles.avatarCircle}>
        {isAi ? <FaRobot size={18} /> : <FaUser size={16} />}
      </div>
      <div className={styles.bubble}>
        <ReactMarkdown>{msg.content}</ReactMarkdown>
        {isAi && (
          <button 
            className={styles.speakBtn} 
            onClick={onSpeak}
            title="Read aloud"
          >
            <FaVolumeUp size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
});

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className={styles.typingRow}
    aria-live="polite"
    aria-label="AI is generating a response"
  >
    <div className={styles.avatarCircle} style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
      <FaRobot size={18} />
    </div>
    <div className={styles.typingBubble}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  </motion.div>
);

export default AiAssistant;