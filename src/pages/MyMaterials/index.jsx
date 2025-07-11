import { useState, useEffect } from 'react'
import {
  FileText,
  Video,
  Image,
  Music,
  Archive,
  Upload,
  Plus,
  Search,
  Settings,
  Filter,
  Grid3X3,
  List,
  Download,
  Eye,
  Trash2,
  Edit3,
  X,
  Calendar,
  Bookmark,
  Tag,
  FolderPlus,
  File
} from 'lucide-react'
import { useCategories } from '../../contexts/CategoryContext'
import {
  loadUserModules,
  saveUserModules
} from '../../utils/localStorage'
import './MyMaterials.css'

const MyMaterials = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [userModules, setUserModules] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [showViewer, setShowViewer] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#6366f1')
  const [editingCategory, setEditingCategory] = useState(null)
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: '',
    file: null
  })


  // Load user modules from localStorage on component mount
  useEffect(() => {
    const savedModules = loadUserModules()
    setUserModules(savedModules)
  }, [])

  // Save modules to localStorage whenever modules change
  useEffect(() => {
    if (userModules.length > 0) {
      saveUserModules(userModules)
    }
  }, [userModules])

  // Helper functions
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (fileType.includes('video')) return <Video className="h-5 w-5 text-blue-500" />
    if (fileType.includes('image')) return <Image className="h-5 w-5 text-green-500" />
    if (fileType.includes('audio')) return <Music className="h-5 w-5 text-purple-500" />
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-5 w-5 text-orange-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file: file
      }))
    }
  }

  const handleUploadSubmit = () => {
    if (!uploadForm.title || !uploadForm.file) {
      alert('Please provide a title and select a file')
      return
    }

    const newModule = {
      id: Date.now(),
      title: uploadForm.title,
      description: uploadForm.description,
      category: uploadForm.category,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      fileName: uploadForm.file.name,
      fileSize: uploadForm.file.size,
      fileType: uploadForm.file.type,
      uploadDate: new Date().toISOString(),
      lastAccessed: null,
      bookmarked: false,
      // In a real app, you would upload the file to a server and store the URL
      fileUrl: URL.createObjectURL(uploadForm.file)
    }

    setUserModules(prev => [newModule, ...prev])
    setUploadForm({
      title: '',
      description: '',
      category: 'general',
      tags: '',
      file: null
    })
    setShowUploadModal(false)
    
    notifyModuleUploaded(newModule.title, new Date().toLocaleDateString())
  }

  const deleteModule = (moduleId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      const updatedModules = userModules.filter(module => module.id !== moduleId)
      setUserModules(updatedModules)
      saveUserModules(updatedModules)
      notifyDataSaved()
    }
  }

  const toggleBookmark = (moduleId) => {
    const updatedModules = userModules.map(module => 
      module.id === moduleId 
        ? { ...module, bookmarked: !module.bookmarked }
        : module
    )
    setUserModules(updatedModules)
    saveUserModules(updatedModules)
  }

  const openModule = (module) => {
    // Update last accessed time
    setUserModules(prev => prev.map(m =>
      m.id === module.id
        ? { ...m, lastAccessed: new Date().toISOString() }
        : m
    ))
    setSelectedModule(module)
    setShowViewer(true)
  }

  // Category management functions
  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategoryPayload = {
        name: newCategoryName,
        color: newCategoryColor,
        icon: 'FileText'
      }
      const result = await addCategory(newCategoryPayload)
      if (result.success) {
        setNewCategoryName('')
        setNewCategoryColor('#6366f1')
        notifyDataSaved('Category added successfully')
      } else {
        alert('Failed to add category: ' + result.error)
      }
    }
  }

  const handleEditCategory = async (categoryId, newName, newColor) => {
    const updates = {
      name: newName,
      color: newColor
    }
    const result = await updateCategory(categoryId, updates)
    if (result.success) {
      // Update all modules with this category
      const updatedModules = userModules.map(module =>
        module.category === categoryId
          ? { ...module, category: categoryId }
          : module
      )
      setUserModules(updatedModules)
      saveUserModules(updatedModules)

      setEditingCategory(null)
      notifyDataSaved('Category updated successfully')
    } else {
      alert('Failed to update category: ' + result.error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? Materials will be moved to General.')) {
      const result = await deleteCategory(categoryId)
      if (result.success) {
        // Move all modules with this category to 'general'
        const updatedModules = userModules.map(module =>
          module.category === categoryId
            ? { ...module, category: 'general' }
            : module
        )
        setUserModules(updatedModules)
        saveUserModules(updatedModules)

        notifyDataSaved('Category deleted successfully')
      } else {
        alert('Failed to delete category: ' + result.error)
      }
    }
  }

const filteredModules = userModules.filter(module => {
  const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
  const matchesSearch = searchTerm === '' ||
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  const matchesBookmark = !showOnlyBookmarked || module.bookmarked
  return matchesCategory && matchesSearch && matchesBookmark
})

  return (
    <div className="materials-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">My Learning Materials</h1>
          <p className="page-subtitle">Upload and manage your study documents, videos, and resources</p>
        </div>
        <div className="page-header-actions">
          <button 
            className="action-btn primary"
            onClick={() => setShowUploadModal(true)}
          >
            <Plus size={16} />
            Upload Material
          </button>
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="course-search-container">
          <Search className="course-search-icon" />
          <input
            type="text"
            placeholder="Search your materials..."
            className="course-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          className="filter-button"
          onClick={() => setShowCategoryManager(true)}
          title="Manage Categories"
        >
          <Settings size={16} />
        </button>
        <button
  className={`filter-button ${showOnlyBookmarked ? 'active' : ''}`}
  onClick={() => setShowOnlyBookmarked(prev => !prev)}
  title="Show Bookmarked Only"
>
  <Bookmark size={16} />
</button>
      </div>

      {/* Empty State or Materials Display */}
      {filteredModules.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <FolderPlus size={64} className="empty-state-icon" />
            <h3 className="empty-state-title">No materials uploaded yet</h3>
            <p className="empty-state-description">
              Start building your personal learning library by uploading your study materials.
              You can upload PDFs, videos, images, audio files, and more!
            </p>
            <button 
              className="action-btn primary"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={16} />
              Upload Your First Material
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Materials Grid/List */}
          {viewMode === 'grid' ? (
            <div className="materials-gridd">
              {filteredModules.map((module) => (
                <div key={module.id} className="material-card">
                  <div className="material-header">
                    <div className="material-type">
                      <div className="material-type-icon">
                        {getFileIcon(module.fileType)}
                      </div>
                      <div>
                        <h3 className="material-title">{module.title}</h3>
                        <p className="material-subject">{formatFileSize(module.fileSize)}</p>
                      </div>
                      <button 
                        className={`material-action-btn ${module.bookmarked ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(module.id)}
                      >
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="material-content">
                    {module.description && (
                      <p className="material-description">{module.description}</p>
                    )}
                    <div className="material-tags">
                      {module.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="material-tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                      {module.tags.length > 3 && (
                        <span className="material-tag">+{module.tags.length - 3} more</span>
                      )}
                    </div>
                    <div className="material-footer">
                      <span className="material-date">
                        <Calendar size={12} />
                        {new Date(module.uploadDate).toLocaleDateString()}
                      </span>
                      <div className="material-actionss">
                        <button 
                          className="material-action-btn"
                          onClick={() => openModule(module)}
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="material-action-btn"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = module.fileUrl
                            link.download = module.fileName
                            link.click()
                          }}
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          className="material-action-btn danger"
                          onClick={() => deleteModule(module.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="materials-list">
              {filteredModules.map((module) => (
                <div key={module.id} className="material-list-item">
                  <div className="material-list-content">
                    <div className="material-type-icon">
                      {getFileIcon(module.fileType)}
                    </div>
                    <div className="material-list-info">
                      <h3 className="material-list-title">{module.title}</h3>
                      <p className="material-list-meta">
                        {formatFileSize(module.fileSize)} • {new Date(module.uploadDate).toLocaleDateString()}
                      </p>
                      {module.description && (
                        <p className="material-description">{module.description}</p>
                      )}
                    </div>
                    <div className="material-tags">
                      {module.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="material-tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="material-actionss">
                      <button
                        className={`material-action-btn ${module.bookmarked ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(module.id)}
                        title="Bookmark"
                      >
                        <Bookmark size={16} />
                      </button>
                      <button
                        className="material-action-btn"
                        onClick={() => openModule(module)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="material-action-btn"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = module.fileUrl
                          link.download = module.fileName
                          link.click()
                        }}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="material-action-btn danger"
                        onClick={() => deleteModule(module.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Learning Material</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-groupp">
                <label htmlFor="material-title">Title *</label>
                <input
                  id="material-title"
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter material title"
                  className="form-input"
                />
              </div>
              <div className="form-groupp">
                <label htmlFor="material-description">Description</label>
                <textarea
                  id="material-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the material"
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-groupp">
                  <label htmlFor="material-category">Category</label>
                  <select
                    id="material-category"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                    className="form-select"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-groupp">
                  <label htmlFor="material-tags">Tags</label>
                  <input
                    id="material-tags"
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-groupp">
                <label htmlFor="material-file">File *</label>
                <div className="file-upload-area">
                  <input
                    id="material-file"
                    type="file"
                    onChange={handleFileUpload}
                    className="file-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.avi,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <div className="file-upload-content">
                    <Upload size={32} />
                    <p>Click to select a file or drag and drop</p>
                    <p className="file-upload-hint">
                      Supported: PDF, DOC, PPT, TXT, MP4, MP3, Images, Archives
                    </p>
                    {uploadForm.file && (
                      <div className="selected-file">
                        <File size={16} />
                        <span>{uploadForm.file.name}</span>
                        <span className="file-size">({formatFileSize(uploadForm.file.size)})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="action-btn secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button
                className="action-btn primary"
                onClick={handleUploadSubmit}
                disabled={!uploadForm.title || !uploadForm.file}
              >
                Upload Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {showViewer && selectedModule && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>{selectedModule.title}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowViewer(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="file-viewer">
                {selectedModule.fileType.includes('pdf') && (
                  <iframe
                    src={selectedModule.fileUrl}
                    className="pdf-viewer"
                    title={selectedModule.title}
                  />
                )}
                {selectedModule.fileType.includes('video') && (
                  <video
                    src={selectedModule.fileUrl}
                    controls
                    className="video-viewer"
                  />
                )}
                {selectedModule.fileType.includes('image') && (
                  <img
                    src={selectedModule.fileUrl}
                    alt={selectedModule.title}
                    className="image-viewer"
                  />
                )}
                {selectedModule.fileType.includes('audio') && (
                  <audio
                    src={selectedModule.fileUrl}
                    controls
                    className="audio-viewer"
                  />
                )}
                {!selectedModule.fileType.includes('pdf') &&
                 !selectedModule.fileType.includes('video') &&
                 !selectedModule.fileType.includes('image') &&
                 !selectedModule.fileType.includes('audio') && (
                  <div className="file-preview">
                    <File size={64} />
                    <h4>{selectedModule.fileName}</h4>
                    <p>This file type cannot be previewed in the browser.</p>
                    <button
                      className="action-btn primary"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = selectedModule.fileUrl
                        link.download = selectedModule.fileName
                        link.click()
                      }}
                    >
                      <Download size={16} />
                      Download File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="modal-overlay" onClick={() => setShowCategoryManager(false)}>
          <div className="modal-content category-manager-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Categories</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCategoryManager(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {/* Add New Category */}
              <div className="add-category-section">
                <h4>Add New Category</h4>
                <div className="add-category-form">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="form-input"
                  />
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="color-input"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Existing Categories */}
              <div className="categories-list">
                <h4>Existing Categories</h4>
                {categories.map(category => (
                  <div key={category.id} className="category-item">
                    {editingCategory === category.id ? (
                      <div className="category-edit-form">
                        <input
                          type="text"
                          defaultValue={category.name}
                          onBlur={(e) => handleEditCategory(category.id, e.target.value, category.color)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditCategory(category.id, e.target.value, category.color)
                            }
                          }}
                          className="form-input"
                          autoFocus
                        />
                        <input
                          type="color"
                          defaultValue={category.color}
                          onChange={(e) => handleEditCategory(category.id, category.name, e.target.value)}
                          className="color-input"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="category-info">
                          <div
                            className="category-color-indicator"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="category-name">{category.name}</span>
                          <span className="category-count">
                            ({userModules.filter(m => m.category === category.id).length} materials)
                          </span>
                        </div>
                        <div className="category-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingCategory(category.id)}
                          >
                            <Edit3 size={14} />
                          </button>
                          {category.id !== 'general' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyMaterials
