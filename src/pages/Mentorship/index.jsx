import { Users, MessageCircle, Video, Star, Calendar, Clock, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { saveBookedSessions, loadBookedSessions, loadUserModules } from '../../utils/localStorage'
import './Mentorship.css'

const Mentorship = () => {
  const [currentView, setCurrentView] = useState('mentors') // 'mentors', 'groups', 'sessions'
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    topic: '',
    duration: 60,
    date: '',
    time: '',
    message: '',
    materialId: '', // Link to user material
    materialTitle: ''
  })
  const [bookedSessions, setBookedSessions] = useState([])
  const [userModules, setUserModules] = useState([])


  // Load booked sessions and user modules from localStorage on component mount
  useEffect(() => {
    const savedSessions = loadBookedSessions()
    if (savedSessions.length > 0) {
      setBookedSessions(savedSessions)
    } else {
      // Set default session if none exist
      const defaultSession = {
        id: 1,
        mentorName: 'Dr. Sarah Johnson',
        topic: 'Calculus Integration',
        date: '2024-06-25',
        time: '14:00',
        duration: 60,
        status: 'confirmed'
      }
      setBookedSessions([defaultSession])
      saveBookedSessions([defaultSession])
    }

    // Load user modules for material selection
    const modules = loadUserModules()
    setUserModules(modules)
  }, [])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (bookedSessions.length > 0) {
      saveBookedSessions(bookedSessions)
    }
  }, [bookedSessions])
  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      expertise: 'Mathematics & Physics',
      rating: 4.9,
      students: 150,
      avatar: '/api/placeholder/64/64',
      hourlyRate: 50,
      bio: 'PhD in Mathematics with 10+ years of teaching experience. Specializes in calculus, linear algebra, and physics.',
      availableSlots: [
        { date: '2024-06-25', time: '09:00', available: true },
        { date: '2024-06-25', time: '10:00', available: true },
        { date: '2024-06-25', time: '14:00', available: false },
        { date: '2024-06-25', time: '15:00', available: true },
        { date: '2024-06-26', time: '09:00', available: true },
        { date: '2024-06-26', time: '11:00', available: true }
      ]
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      expertise: 'Computer Science',
      rating: 4.8,
      students: 200,
      avatar: '/api/placeholder/64/64',
      hourlyRate: 60,
      bio: 'Professor of Computer Science with expertise in algorithms, data structures, and software engineering.',
      availableSlots: [
        { date: '2024-06-25', time: '10:00', available: true },
        { date: '2024-06-25', time: '13:00', available: true },
        { date: '2024-06-25', time: '16:00', available: true },
        { date: '2024-06-26', time: '10:00', available: true },
        { date: '2024-06-26', time: '14:00', available: true }
      ]
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      expertise: 'Chemistry & Biology',
      rating: 4.9,
      students: 120,
      avatar: '/api/placeholder/64/64',
      hourlyRate: 45,
      bio: 'Research scientist and educator with focus on organic chemistry and molecular biology.',
      availableSlots: [
        { date: '2024-06-25', time: '11:00', available: true },
        { date: '2024-06-25', time: '15:00', available: true },
        { date: '2024-06-26', time: '09:00', available: true },
        { date: '2024-06-26', time: '13:00', available: true }
      ]
    }
  ]

  const studyGroups = [
    {
      id: 1,
      name: 'Calculus Study Group',
      subject: 'Mathematics',
      members: 12,
      lastActive: 'Active now',
      description: 'Weekly sessions focusing on integration and differentiation techniques',
      nextMeeting: '2024-06-25 18:00',
      isJoined: true
    },
    {
      id: 2,
      name: 'Physics Problem Solving',
      subject: 'Physics',
      members: 8,
      lastActive: '2 hours ago',
      description: 'Collaborative problem-solving for mechanics and thermodynamics',
      nextMeeting: '2024-06-26 19:00',
      isJoined: false
    },
    {
      id: 3,
      name: 'CS Interview Prep',
      subject: 'Computer Science',
      members: 15,
      lastActive: '1 day ago',
      description: 'Practice coding interviews and algorithm discussions',
      nextMeeting: '2024-06-27 20:00',
      isJoined: true
    },
    {
      id: 4,
      name: 'Organic Chemistry Lab',
      subject: 'Chemistry',
      members: 6,
      lastActive: '3 hours ago',
      description: 'Lab techniques and reaction mechanisms study group',
      nextMeeting: '2024-06-28 17:00',
      isJoined: false
    }
  ]

  // Helper functions
  const openBookingModal = (mentor) => {
    setSelectedMentor(mentor)
    setShowBookingModal(true)
    setBookingForm({
      topic: '',
      duration: 60,
      date: '',
      time: '',
      message: ''
    })
  }

  const handleBookSession = () => {
    if (!bookingForm.topic || !bookingForm.date || !bookingForm.time) {
      alert('Please fill in all required fields')
      return
    }

    const newSession = {
      id: Date.now(),
      mentorName: selectedMentor.name,
      topic: bookingForm.topic,
      date: bookingForm.date,
      time: bookingForm.time,
      duration: bookingForm.duration,
      status: 'pending'
    }

    setBookedSessions([...bookedSessions, newSession])
    setShowBookingModal(false)

    // Show notification
    notifySessionBooked(
      selectedMentor.name,
      new Date(bookingForm.date).toLocaleDateString(),
      bookingForm.time
    )
  }

  const joinStudyGroup = (groupId) => {
    // In a real app, this would make an API call
    alert('Joined study group successfully!')
  }

  const leaveStudyGroup = (groupId) => {
    // In a real app, this would make an API call
    alert('Left study group successfully!')
  }

  return (
    <div className="mentorship-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Mentorship</h1>
          <p className="page-subtitle">Connect with expert mentors and join study groups</p>
        </div>
        <div className="page-header-actions">
          <div className="view-toggle">
            <button
              className={`tab-btn ${currentView === 'mentors' ? 'active' : ''}`}
              onClick={() => setCurrentView('mentors')}
            >
              <Users size={16} />
              <p>
              Mentors</p>
            </button>
            <button
              className={`tab-btn ${currentView === 'groups' ? 'active' : ''}`}
              onClick={() => setCurrentView('groups')}
            >
              <MessageCircle size={16} />
              <p>Study Groups</p>
            </button>
            <button
              className={`tab-btn ${currentView === 'sessions' ? 'active' : ''}`}
              onClick={() => setCurrentView('sessions')}
            >
              <Calendar size={16} />
              <p>
              My Sessions</p>
            </button>
          </div>
        </div>
      </div>

      {/* Mentors View */}
      {currentView === 'mentors' && (
        <div className="mentors-grid">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-header">
                <div className="mentor-avatar">
                  <Users size={32} color="white" />
                </div>
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <p className="mentor-expertise">{mentor.expertise}</p>
                  <div className="mentor-stats">
                    <span className="rating">
                      <Star size={14} fill="currentColor" />
                      {mentor.rating}
                    </span>
                    <span className="students">{mentor.students} students</span>
                    <span className="rate">${mentor.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              <div className="mentor-bio">
                <p>{mentor.bio}</p>
              </div>

              <div className="mentor-availability">
                <h4>Available Times</h4>
                <div className="time-slots">
                  {mentor.availableSlots.slice(0, 4).map((slot, index) => (
                    <span
                      key={index}
                      className={`time-slot ${slot.available ? 'available' : 'booked'}`}
                    >
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mentor-actions">
                <button
                  className="mentor-btn primary"
                  onClick={() => openBookingModal(mentor)}
                >
                  <Calendar size={16} />
                  Book Session
                </button>
                <button className="mentor-btn secondary">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Groups View */}
      {currentView === 'groups' && (
        <div className="groups-container">
          <div className="groups-header">
            <h2>Study Groups</h2>
            <button className="create-group-btn">
              <Plus size={16} />
              Create Group
            </button>
          </div>

          <div className="groups-grid">
            {studyGroups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <div className="group-icon">
                    <Users size={24} color="white" />
                  </div>
                  <div className="group-info">
                    <h3>{group.name}</h3>
                    <p className="group-subject">{group.subject}</p>
                  </div>
                  <div className="group-status">
                    {group.isJoined ? (
                      <span className="status-badge joined">Joined</span>
                    ) : (
                      <span className="status-badge available">Available</span>
                    )}
                  </div>
                </div>

                <div className="group-description">
                  <p>{group.description}</p>
                </div>

                <div className="group-stats">
                  <div className="stat">
                    <Users size={16} />
                    <span>{group.members} members</span>
                  </div>
                  <div className="stat">
                    <Clock size={16} />
                    <span>{group.lastActive}</span>
                  </div>
                </div>

                <div className="group-meeting">
                  <div className="meeting-info">
                    <Calendar size={16} />
                    <span>Next: {new Date(group.nextMeeting).toLocaleDateString()} at {new Date(group.nextMeeting).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>

                <div className="group-actions">
                  {group.isJoined ? (
                    <>
                      <button className="group-btn primary">
                        <Video size={16} />
                        Join Meeting
                      </button>
                      <button
                        className="group-btn secondary"
                        onClick={() => leaveStudyGroup(group.id)}
                      >
                        Leave Group
                      </button>
                    </>
                  ) : (
                    <button
                      className="group-btn primary"
                      onClick={() => joinStudyGroup(group.id)}
                    >
                      <Plus size={16} />
                      Join Group
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Sessions View */}
      {currentView === 'sessions' && (
        <div className="sessions-container">
          <div className="sessions-header">
            <h2>My Mentorship Sessions</h2>
            <div className="sessions-filter">
              <select className="filter-select">
                <option value="all">All Sessions</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="sessions-list">
            {bookedSessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-info">
                    <div className="session-mentor">
                      <div className="mentor-avatar small">
                        <Users size={20} color="white" />
                      </div>
                      <div>
                        <h3 className="session-title">{session.mentorName}</h3>
                        <p className="session-mentor">{session.topic}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`session-status ${session.status}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>

                <div className="session-description">
                  <p>One-on-one mentorship session focusing on {session.topic.toLowerCase()}. Get personalized guidance and expert insights.</p>
                </div>

                <div className="session-meta">
                  <div className="session-detail">
                    <Calendar size={16} /><span> </span>
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="session-detail">
                    <Clock size={16} /><span> </span>
                    <span>{session.time}</span>
                  </div>
                  <div className="session-detail">
                    <Users size={16} /><span> </span>
                    <span>{session.duration} minutes</span>
                  </div>
                </div>

                <div className="session-actions">
                  {session.status === 'confirmed' && (
                    <>
                      <button className="session-btn success">
                        <Video size={16} />
                        Join Session
                      </button>
                      <button className="session-btn primary">
                        <Calendar size={16} />
                        Reschedule
                      </button>
                      <button className="session-btn danger">
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  )}
                  {session.status === 'pending' && (
                    <>
                      <button className="session-btn primary">
                        <MessageCircle size={16} />
                        Message Mentor
                      </button>
                      <button className="session-btn danger">
                        <X size={16} />
                        Cancel Request
                      </button>
                    </>
                  )}
                  {session.status === 'completed' && (
                    <>
                      <button className="session-btn primary">
                        <Star size={16} />
                        Rate Session
                      </button>
                      <button className="session-btn">
                        <Calendar size={16} />
                        Book Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {bookedSessions.length === 0 && (
              <div className="empty-sessions">
                <Calendar size={48} color="var(--teams-text-muted)" />
                <h3>No sessions booked yet</h3>
                <p>Book a session with a mentor to get started</p>
                <button
                  className="empty-action-btn"
                  onClick={() => setCurrentView('mentors')}
                >
                  Browse Mentors
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Session with {selectedMentor.name}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="mentor-header">
                <div className="mentor-avatar">
                  <Users size={24} color="white" />
                </div>
                <div>
                  <h4>{selectedMentor.name}</h4>
                  <p>{selectedMentor.expertise}</p>
                  <p className="rate">${selectedMentor.hourlyRate}/hour</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>Session Topic *</label>
                  <input
                    type="text"
                    value={bookingForm.topic}
                    onChange={(e) => setBookingForm({...bookingForm, topic: e.target.value})}
                    placeholder="What would you like to discuss?"
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label>Duration</label>
                  <select
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: parseInt(e.target.value)})}
                    className="form-select"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Available Time Slots</label>
                  <div className="time-slots">
                    {selectedMentor.availableSlots.filter(slot => slot.available).map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedTimeSlot === `${slot.date} ${slot.time}` ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedTimeSlot(`${slot.date} ${slot.time}`)
                          setBookingForm({
                            ...bookingForm,
                            date: slot.date,
                            time: slot.time
                          })
                        }}
                      >
                        <div className="slot-date">{new Date(slot.date).toLocaleDateString()}</div>
                        <div className="slot-time">{slot.time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Additional Message (Optional)</label>
                  <textarea
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                    placeholder="Any specific topics or questions you'd like to cover?"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>

              <div className="booking-summary">
                <div className="summary-item">
                  <span>Duration: </span>
                  <span>{bookingForm.duration} minutes</span>
                </div>
                <div className="summary-item">
                  <span>Rate: </span>
                  <span>${selectedMentor.hourlyRate}/hour</span>
                </div>
                <div className="summary-item total">
                  <span>Total Cost: </span>
                  <span>${Math.round((selectedMentor.hourlyRate * bookingForm.duration) / 60)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={handleBookSession}
                disabled={!bookingForm.topic || !selectedTimeSlot}
              >
                <Calendar size={16} />
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Mentorship
