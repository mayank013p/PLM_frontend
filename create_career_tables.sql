-- This SQL script creates the tables for the Career feature,
-- based on entities identified in 'src/pages/Career/index.jsx'.

-- Table to store career paths.
CREATE TABLE career_paths (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary_range VARCHAR(100),
    growth VARCHAR(50),
    education VARCHAR(255),
    experience VARCHAR(100),
    companies JSON, -- List of top companies
    skills JSON -- List of required skills
);

-- Table to store user enrollments in career paths.
CREATE TABLE user_career_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    career_path_id INT NOT NULL,
    progress INT DEFAULT 0, -- Percentage progress
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (career_path_id) REFERENCES career_paths(id) ON DELETE CASCADE
);

-- Table to store skill assessments categories and skills.
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

-- Table to store user skill levels and trends.
CREATE TABLE user_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    level INT DEFAULT 0, -- Percentage level
    trend ENUM('up', 'down', 'stable') DEFAULT 'stable',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Table to store job recommendations.
CREATE TABLE job_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    location VARCHAR(255),
    job_type VARCHAR(100),
    salary_range VARCHAR(100),
    match_percentage INT,
    posted_date DATE,
    requirements JSON -- List of job requirements
);

-- Table to store user job applications.
CREATE TABLE user_job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('applied', 'interview', 'offer', 'rejected') DEFAULT 'applied',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_recommendations(id) ON DELETE CASCADE
);

-- Table to store learning paths.
CREATE TABLE learning_paths (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    level VARCHAR(100),
    modules_count INT,
    skills JSON -- List of skills learned
);

-- Table to store user enrollments in learning paths.
CREATE TABLE user_learning_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    learning_path_id INT NOT NULL,
    progress INT DEFAULT 0, -- Percentage progress
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
);
