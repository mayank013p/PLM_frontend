-- This SQL script creates the tables for managing user materials,
-- based on fields identified in 'src/pages/MyMaterials/index.jsx'.

-- Table to store user-defined categories for materials.
CREATE TABLE material_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                                 -- Foreign key to the 'users' table
    name VARCHAR(100) NOT NULL,                           -- Name of the category (e.g., "Physics", "History")
    color VARCHAR(7) DEFAULT '#6366f1',                   -- Color code for the category
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store the user-uploaded materials.
CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                                 -- Foreign key to the 'users' table
    category_id INT,                                      -- Foreign key to the 'material_categories' table
    
    -- Material Information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSON,                                            -- Storing tags as a JSON array
    
    -- File Metadata
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,                                        -- Storing size in bytes
    file_url VARCHAR(255) NOT NULL,                       -- URL to the stored file in a cloud service (e.g., S3)
    
    -- Tracking & Status
    bookmarked BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP,

    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES material_categories(id) ON DELETE SET NULL
);

-- Note: The relationship between materials and categories is set to SET NULL on delete.
-- This means if a category is deleted, the associated materials will not be deleted but will have their category_id set to NULL.
-- This aligns with the frontend logic where deleting a category moves materials to 'General'.
