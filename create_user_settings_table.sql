-- This SQL script creates the 'user_settings' table based on fields identified in 'src/pages/Settings/index.jsx'.
-- This table is designed to hold user-specific settings and preferences.

CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,                          -- Foreign key to the 'users' table

    -- Preferences (from Profile section)
    timezone VARCHAR(50) DEFAULT 'America/New_York',      -- User's preferred timezone
    language VARCHAR(50) DEFAULT 'English',               -- User's preferred language

    -- Notification Settings
    email_notifications BOOLEAN DEFAULT TRUE,             -- Toggle for receiving email notifications
    push_notifications BOOLEAN DEFAULT TRUE,              -- Toggle for receiving browser push notifications
    sound_enabled BOOLEAN DEFAULT TRUE,                   -- Toggle for notification sounds
    course_reminders BOOLEAN DEFAULT TRUE,                -- Toggle for course reminders
    assignment_deadlines BOOLEAN DEFAULT TRUE,            -- Toggle for assignment deadline notifications
    weekly_progress BOOLEAN DEFAULT TRUE,                 -- Toggle for weekly progress reports
    marketing_emails BOOLEAN DEFAULT FALSE,               -- Toggle for promotional emails

    -- Privacy & Data Sharing Settings
    profile_visibility ENUM('public', 'friends', 'private') DEFAULT 'public', -- Profile visibility setting
    show_progress BOOLEAN DEFAULT TRUE,                   -- Toggle for showing learning progress to others
    show_achievements BOOLEAN DEFAULT TRUE,               -- Toggle for showing achievements publicly
    data_sharing BOOLEAN DEFAULT FALSE,                   -- Toggle for sharing anonymized data for research
    analytics_tracking BOOLEAN DEFAULT TRUE,              -- Toggle for analytics tracking

    -- Appearance Settings
    theme ENUM('light', 'dark', 'system') DEFAULT 'system', -- UI theme preference
    font_size VARCHAR(20) DEFAULT 'medium',               -- UI font size preference
    compact_mode BOOLEAN DEFAULT FALSE,                   -- Toggle for compact UI mode
    reduced_motion BOOLEAN DEFAULT FALSE,                 -- Toggle for reduced UI animations
    high_contrast BOOLEAN DEFAULT FALSE,                  -- Toggle for high contrast mode

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Note: The 'user_id' is marked as UNIQUE to ensure a one-to-one relationship
-- between a user and their settings.
