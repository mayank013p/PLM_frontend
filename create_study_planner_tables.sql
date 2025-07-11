-- This SQL script creates the tables for the Study Planner feature,
-- based on fields identified in 'src/pages/StudyPlanner/index.jsx'.

CREATE TABLE study_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                                 -- Foreign key to the 'users' table
    material_id INT,                                      -- Foreign key to the 'materials' table (optional)
    
    -- Event Details
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(20) NOT NULL,                      -- Storing time as a string (e.g., "09:00 - 10:30")
    
    -- Event Properties
    type ENUM('study', 'assignment', 'preparation', 'exam', 'meeting') DEFAULT 'study',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    location VARCHAR(255),
    reminder INT DEFAULT 15,                              -- Reminder time in minutes before the event
    
    -- Status
    completed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
);

-- Note: The 'material_id' allows linking a study event to a specific material.
-- If a material is deleted, the link in the study event will be set to NULL,
-- but the event itself will not be deleted.
