-- Combined SQL schema for the entire project database
-- This file consolidates all individual table creation scripts
-- and establishes relationships carefully without removing any existing definitions.

-- Users table
CREATE TABLE users (
    -- Core Fields
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Personal Information
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    display_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    profile_picture_url VARCHAR(255),

    -- Academic & Preference Information
    education_level VARCHAR(100),
    field_of_study VARCHAR(100),
    study_preferences JSON,

    -- Status & Tracking
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Settings table
CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Materials tables
CREATE TABLE material_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES material_categories(id) ON DELETE CASCADE
);

-- Study Planner tables
CREATE TABLE study_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Progress Tracker tables
CREATE TABLE goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

CREATE TABLE test_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    date_taken DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    date_earned DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

-- Mock Tests tables
CREATE TABLE mock_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE test_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mock_test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50),
    options JSON,
    correct_answer TEXT,
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id) ON DELETE CASCADE
);

CREATE TABLE mock_test_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mock_test_id INT NOT NULL,
    score DECIMAL(5,2),
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id) ON DELETE CASCADE
);

CREATE TABLE user_test_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_answer TEXT,
    is_correct BOOLEAN,
    FOREIGN KEY (attempt_id) REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE
);

-- Mentorship and Chat tables
CREATE TABLE friendships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    action_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_one_id, user_two_id),
    FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mentors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    expertise VARCHAR(255),
    hourly_rate DECIMAL(10, 2),
    bio TEXT,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('direct', 'group') NOT NULL,
    group_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    UNIQUE(chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mentorship_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mentor_id INT NOT NULL,
    mentee_id INT NOT NULL,
    chat_id INT,
    topic VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE SET NULL
);

CREATE TABLE study_groups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    chat_id INT UNIQUE,
    created_by_user_id INT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    UNIQUE(group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Career tables
CREATE TABLE career_paths (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary_range VARCHAR(100),
    growth VARCHAR(50),
    education VARCHAR(255),
    experience VARCHAR(100),
    companies JSON,
    skills JSON
);

CREATE TABLE user_career_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_path_id INT NOT NULL,
    progress INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (career_path_id) REFERENCES career_paths(id) ON DELETE CASCADE
);

CREATE TABLE skill_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

CREATE TABLE user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    level INT DEFAULT 0,
    trend ENUM('up', 'down', 'stable') DEFAULT 'stable',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE job_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    location VARCHAR(255),
    job_type VARCHAR(100),
    salary_range VARCHAR(100),
    match_percentage INT,
    posted_date DATE,
    requirements JSON
);

CREATE TABLE user_job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('applied', 'interview', 'offer', 'rejected') DEFAULT 'applied',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_recommendations(id) ON DELETE CASCADE
);

CREATE TABLE learning_paths (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    level VARCHAR(100),
    modules_count INT,
    skills JSON
);

CREATE TABLE user_learning_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    learning_path_id INT NOT NULL,
    progress INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
);

-- AI Assistant tables
CREATE TABLE ai_chat_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ai_chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    sender ENUM('user', 'ai') NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    suggestions JSON,
    FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id) ON DELETE CASCADE
);
