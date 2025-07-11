-- This SQL script creates the tables for the Mock Tests feature,
-- based on entities identified in 'src/pages/MockTests/index.jsx'.

-- Table to define the mock tests available.
CREATE TABLE mock_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    field_category VARCHAR(100),
    sub_field VARCHAR(100),
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    time_limit_minutes INT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table to store all questions related to mock tests.
CREATE TABLE test_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mock_test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL, -- Storing options as a JSON array of strings
    correct_option_index INT NOT NULL,
    explanation TEXT,
    
    -- Foreign Key Constraint
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id) ON DELETE CASCADE
);

-- Table to log each user's attempt at a mock test.
-- This provides a more detailed summary than the generic 'test_results' table.
CREATE TABLE mock_test_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    mock_test_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    correct_answers INT NOT NULL,
    total_questions INT NOT NULL,
    time_spent_seconds INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id) ON DELETE CASCADE
);

-- Table to store the user's answer for each question in a specific attempt.
CREATE TABLE user_test_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_index INT, -- Can be NULL if not answered
    is_correct BOOLEAN NOT NULL,
    
    -- Foreign Key Constraints
    FOREIGN KEY (attempt_id) REFERENCES mock_test_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE
);
