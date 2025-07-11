-- This SQL script creates the tables for the Progress Tracker feature,
-- based on entities identified in 'src/pages/ProgressTracker/index.jsx'.

-- Table to store user-defined goals.
CREATE TABLE goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    progress INT DEFAULT 0,
    target INT NOT NULL,
    deadline DATE,
    category VARCHAR(100) DEFAULT 'General',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to log actual study sessions. This is distinct from the scheduled events in the planner.
CREATE TABLE study_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    material_id INT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL, -- Duration in minutes, calculated on save
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
);

-- Table to store results from mock tests or other assessments.
CREATE TABLE test_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    score DECIMAL(5, 2) NOT NULL, -- Score, can be a percentage
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to define all possible achievements in the system.
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Could be an emoji or an icon name
    metric ENUM('study_hours', 'uploaded_materials', 'study_streak', 'test_score', 'completed_goals') NOT NULL,
    target_value INT NOT NULL
);

-- Table to track user-specific achievement progress and earnings.
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    current_progress INT DEFAULT 0,
    earned_at TIMESTAMP, -- NULL if not yet earned
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE(user_id, achievement_id), -- Ensures a user has only one entry per achievement
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);
