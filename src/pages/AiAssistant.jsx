import { useState, useRef, useEffect } from 'react'; // Added useRef, useEffect
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { aiService } from '../services/aiService';
import styles from '../styles/AiAssistant.module.css';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your Careerly AI. How can I help your career today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Reference to the bottom of the chat for auto-scrolling
  const scrollRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg = { role: 'user', content: text };
    
    // Add User message immediately
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const aiRes = await aiService.generateResponse(text);
      // Wait for AI response, then append
      setMessages(prev => [...prev, { role: 'ai', content: aiRes }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Analyze Skill Gap', icon: <FaChartLine />, prompt: 'Can you analyze my skill gaps for a Web Developer role?' },
    { label: 'Recommend Internships', icon: <FaLightbulb />, prompt: 'Based on my profile, what internships should I apply for?' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        <div className={styles.header}>
          <FaRobot className={styles.botIcon} />
          <div>
            <h3>Careely AI</h3>
            <span>Online | Career Expert</span>
          </div>
        </div>

        <div className={styles.messageArea}>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={msg.role === 'ai' ? styles.aiMsg : styles.userMsg}
            >
              {msg.content}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.typing}>
              AI is thinking...
            </motion.div>
          )}
          {/* Hidden element to scroll into view */}
          <div ref={scrollRef} />
        </div>

        <div className={styles.footer}>
          <div className={styles.quickActions}>
            {quickActions.map((action, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(action.prompt)}
                disabled={isTyping} // Disable during thinking
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
          <div className={styles.inputWrapper}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your career..." 
              disabled={isTyping} // Disable input while AI thinks
            />
            <button 
              onClick={() => handleSend()} 
              className={styles.sendBtn}
              disabled={isTyping || !input.trim()} // Visual feedback for empty input
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;