-- This SQL script creates the tables for the AI Assistant feature,
-- based on entities identified in 'src/pages/AIAssistant/index.jsx'.

-- Table to represent individual AI chat sessions per user.
CREATE TABLE ai_chat_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store messages exchanged in AI chat sessions.
CREATE TABLE ai_chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    suggestions JSON, -- Optional JSON array of suggestions
    
    FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id) ON DELETE CASCADE
);
