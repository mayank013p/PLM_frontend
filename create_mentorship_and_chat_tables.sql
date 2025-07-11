-- This SQL script creates the tables for the Mentorship and Chat features,
-- including friendships, DMs, and group chats.

-- Table to manage friendships between users.
CREATE TABLE friendships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    -- The user who initiated the request
    action_user_id INT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE(user_one_id, user_two_id),
    FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store mentor-specific information, extending the users table.
CREATE TABLE mentors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    expertise VARCHAR(255),
    hourly_rate DECIMAL(10, 2),
    bio TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to manage chats, which can be DMs or group chats.
CREATE TABLE chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('direct', 'group') NOT NULL,
    group_name VARCHAR(255), -- NULL for direct messages
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to link users to chats.
CREATE TABLE chat_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    
    UNIQUE(chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store all chat messages.
CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to manage mentorship sessions.
CREATE TABLE mentorship_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    mentee_id INT NOT NULL,
    chat_id INT, -- A dedicated chat for each session
    topic VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE SET NULL
);

-- Table to define study groups.
CREATE TABLE study_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    chat_id INT UNIQUE, -- Each study group has one dedicated chat
    created_by_user_id INT NOT NULL,

    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to manage members of study groups.
CREATE TABLE study_group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    
    UNIQUE(group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
