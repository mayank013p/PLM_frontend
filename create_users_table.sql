-- This SQL script creates the 'users' table based on fields identified in the frontend application.
-- Fields were sourced from 'src/pages/Auth/index.jsx' and 'src/components/ui/UserProfile.jsx'.

CREATE TABLE users (
    -- Core Fields
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,         -- From UserProfile.jsx
    email VARCHAR(100) UNIQUE NOT NULL,           -- From Auth.jsx & UserProfile.jsx
    password_hash VARCHAR(255) NOT NULL,          -- From Auth.jsx (for storing hashed password)

    -- Personal Information
    first_name VARCHAR(50),                       -- From Auth.jsx
    last_name VARCHAR(50),                        -- From Auth.jsx
    display_name VARCHAR(100),                    -- From UserProfile.jsx
    phone VARCHAR(20),                            -- From Auth.jsx (optional)
    bio TEXT,                                     -- From Auth.jsx & UserProfile.jsx
    profile_picture_url VARCHAR(255),             -- Inferred from UserProfile.jsx avatar

    -- Academic & Preference Information
    education_level VARCHAR(100),                 -- From Auth.jsx
    field_of_study VARCHAR(100),                  -- From Auth.jsx
    study_preferences JSON,                       -- From UserProfile.jsx (for storing interests like ['Mathematics', 'Physics'])

    -- Status & Tracking
    is_verified BOOLEAN DEFAULT FALSE,            -- Standard practice for email verification
    last_login_at TIMESTAMP NULL,                 -- Standard practice for tracking user activity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Note: Features like 'friends' and 'friend_requests' seen in UserProfile.jsx
-- would typically be handled in separate tables with foreign keys referencing this 'users' table.
-- For example, a 'friendships' table could store pairs of user IDs.
