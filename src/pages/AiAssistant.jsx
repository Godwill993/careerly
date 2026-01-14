import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { aiService } from '../services/aiService';
import styles from '../styles/AiAssistant.module.css';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your BlueGold AI. How can I help your career today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const aiRes = await aiService.generateResponse(text);
    setMessages([...newMessages, { role: 'ai', content: aiRes }]);
    setIsTyping(false);
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
            <h3>BlueGold AI</h3>
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
          {isTyping && <div className={styles.typing}>AI is thinking...</div>}
        </div>

        <div className={styles.footer}>
          <div className={styles.quickActions}>
            {quickActions.map((action, i) => (
              <button key={i} onClick={() => handleSend(action.prompt)}>
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
            />
            <button onClick={() => handleSend()} className={styles.sendBtn}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;