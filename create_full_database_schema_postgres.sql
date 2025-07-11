-- PostgreSQL compatible combined SQL schema for the entire project database
-- This file consolidates all individual table creation scripts
-- and establishes relationships carefully without removing any existing definitions.

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    display_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    profile_picture_url VARCHAR(255),
    education_level VARCHAR(100),
    field_of_study VARCHAR(100),
    study_preferences JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings table
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    language VARCHAR(50) DEFAULT 'English',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    course_reminders BOOLEAN DEFAULT TRUE,
    assignment_deadlines BOOLEAN DEFAULT TRUE,
    weekly_progress BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    profile_visibility VARCHAR(10) DEFAULT 'public',
    show_progress BOOLEAN DEFAULT TRUE,
    show_achievements BOOLEAN DEFAULT TRUE,
    data_sharing BOOLEAN DEFAULT FALSE,
    analytics_tracking BOOLEAN DEFAULT TRUE,
    theme VARCHAR(10) DEFAULT 'system',
    font_size VARCHAR(20) DEFAULT 'medium',
    compact_mode BOOLEAN DEFAULT FALSE,
    reduced_motion BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials tables
CREATE TABLE material_categories (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES material_categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSONB,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    file_url VARCHAR(255) NOT NULL,
    bookmarked BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP
);

-- Study Planner tables
CREATE TABLE study_events (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id INT REFERENCES materials(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(20) NOT NULL,
    type VARCHAR(20) DEFAULT 'study',
    priority VARCHAR(10) DEFAULT 'medium',
    location VARCHAR(255),
    reminder INT DEFAULT 15,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress Tracker tables
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0,
    target INT NOT NULL,
    deadline DATE,
    category VARCHAR(100) DEFAULT 'General',
    priority VARCHAR(10) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id INT REFERENCES materials(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    metric VARCHAR(50) NOT NULL,
    target_value INT NOT NULL
);

CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    current_progress INT DEFAULT 0,
    earned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Mock Tests tables
CREATE TABLE mock_tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    field_category VARCHAR(100),
    sub_field VARCHAR(100),
    difficulty VARCHAR(10) DEFAULT 'Medium',
    time_limit_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_questions (
    id SERIAL PRIMARY KEY,
    mock_test_id INT NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT
);

CREATE TABLE mock_test_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id INT NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    correct_answers INT NOT NULL,
    total_questions INT NOT NULL,
    time_spent_seconds INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_test_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INT NOT NULL REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    selected_option_index INT,
    is_correct BOOLEAN NOT NULL
);

-- Mentorship and Chat tables
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    user_one_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_two_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(10) DEFAULT 'pending',
    action_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_one_id, user_two_id)
);

CREATE TABLE mentors (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    expertise VARCHAR(255),
    hourly_rate NUMERIC(10, 2),
    bio TEXT,
    rating NUMERIC(3, 2) DEFAULT 0.00
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    group_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_participants (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(chat_id, user_id)
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mentorship_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    mentee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chat_id INT REFERENCES chats(id) ON DELETE SET NULL,
    topic VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    status VARCHAR(10) DEFAULT 'pending'
);

CREATE TABLE study_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    chat_id INT UNIQUE REFERENCES chats(id) ON DELETE SET NULL,
    created_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_group_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- Career tables
CREATE TABLE career_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary_range VARCHAR(100),
    growth VARCHAR(50),
    education VARCHAR(255),
    experience VARCHAR(100),
    companies JSONB,
    skills JSONB
);

CREATE TABLE user_career_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_path_id INT NOT NULL REFERENCES career_paths(id) ON DELETE CASCADE,
    progress INT DEFAULT 0
);

CREATE TABLE skill_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level INT DEFAULT 0,
    trend VARCHAR(10) DEFAULT 'stable'
);

CREATE TABLE job_recommendations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    location VARCHAR(255),
    job_type VARCHAR(100),
    salary_range VARCHAR(100),
    match_percentage INT,
    posted_date DATE,
    requirements JSONB
);

CREATE TABLE user_job_applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id INT NOT NULL REFERENCES job_recommendations(id) ON DELETE CASCADE,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) DEFAULT 'applied'
);

CREATE TABLE learning_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    level VARCHAR(100),
    modules_count INT,
    skills JSONB
);

CREATE TABLE user_learning_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_path_id INT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    progress INT DEFAULT 0
);

-- AI Assistant tables
CREATE TABLE ai_chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL
);

CREATE TABLE ai_chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    suggestions JSONB
);
