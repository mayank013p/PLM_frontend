import { Send, Phone, Video, UserPlus, Users, Search, Settings, MoreVertical, X, Plus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import {
  loadChatMessages,
  addChatMessage,
  loadFriendsList,
  loadFriendRequests,
  loadUserProfile,
  sendFriendRequest,
  respondToFriendRequest
} from '../../utils/localStorage'
import './Chat.css'
import './CreateGroup.css'

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState('dr-sarah')
  const [showChatList, setShowChatList] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [showFriendRequests, setShowFriendRequests] = useState(false)
  const [showNewGroupModal, setShowNewGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [selectedFriends, setSelectedFriends] = useState([])
  const [friends, setFriends] = useState([
    { username: 'sarah_math' },
    { username: 'mike_tech' },
    { username: 'emma_lang' },
    { username: 'john_doe' },
    { username: 'alice_w' },
    { username: 'bob_smith' }
  ])
  const [friendRequests, setFriendRequests] = useState([])
  const [friendRequestStatus, setFriendRequestStatus] = useState({ type: '', message: '' })
  const [userProfile, setUserProfile] = useState({})
  const [createGroupSearch, setCreateGroupSearch] = useState('')
  const [chatSearch, setChatSearch] = useState('')
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState({
    'dr-sarah': [
      { id: 1, text: 'Hi! I have a question about the calculus assignment.', sender: 'other', timestamp: '10:30 AM', date: new Date().toDateString() },
      { id: 2, text: 'Could you help me understand the integration by parts method?', sender: 'other', timestamp: '10:31 AM', date: new Date().toDateString() },
      { id: 3, text: 'Sure! What specific part are you struggling with?', sender: 'me', timestamp: '10:35 AM', date: new Date().toDateString() },
      { id: 4, text: 'Integration by parts follows the formula: ∫u dv = uv - ∫v du', sender: 'me', timestamp: '10:36 AM', date: new Date().toDateString() },
      { id: 5, text: 'That makes sense! Could you show me an example?', sender: 'other', timestamp: '10:40 AM', date: new Date().toDateString() }
    ],
    'study-group': [
      { id: 1, text: 'Hey everyone! Ready for tomorrow\'s exam?', sender: 'other', timestamp: '9:15 AM', date: new Date().toDateString() },
      { id: 2, text: 'I\'m still reviewing chapter 5. Anyone want to study together?', sender: 'me', timestamp: '9:20 AM', date: new Date().toDateString() },
      { id: 3, text: 'Count me in! Let\'s meet at the library at 2 PM', sender: 'other', timestamp: '9:25 AM', date: new Date().toDateString() }
    ],
    'mentor-mike': [
      { id: 1, text: 'Great progress on your project! Keep up the good work.', sender: 'other', timestamp: '2:30 PM', date: new Date(Date.now() - 86400000).toDateString() },
      { id: 2, text: 'Thank you! I\'ve been working hard on it.', sender: 'me', timestamp: '2:45 PM', date: new Date(Date.now() - 86400000).toDateString() }
    ],
    'ai-tutor': [
      { id: 1, text: 'Hello! I can help with your math problems. What would you like to learn today?', sender: 'other', timestamp: '8:00 AM', date: new Date().toDateString() }
    ]
  })

  // Load user data on component mount
  useEffect(() => {
    const profile = loadUserProfile()
    setUserProfile(profile)
    setFriends(loadFriendsList())
    setFriendRequests(loadFriendRequests())
  }, [])

  const chatContacts = [
    {
      id: 'dr-sarah',
      name: 'Dr. Sarah Johnson',
      avatar: 'DS',
      lastMessage: 'Thanks for the question about...',
      status: 'online',
      unread: 2,
      type: 'direct'
    },
    {
      id: 'study-group',
      name: 'Math Study Group',
      avatar: 'MSG',
      lastMessage: 'New message in Calculus group',
      status: 'active',
      unread: 5,
      type: 'group',
      members: ['sarah_math', 'mike_tech', 'emma_lang']
    },
    {
      id: 'mentor-mike',
      name: 'Mentor Mike',
      avatar: 'MM',
      lastMessage: 'Great progress on your project!',
      status: 'away',
      unread: 0,
      type: 'direct'
    },
    {
      id: 'ai-tutor',
      name: 'AI Tutor',
      avatar: 'AI',
      lastMessage: 'I can help with your math problems',
      status: 'online',
      unread: 1,
      type: 'direct'
    },
    // Add friends as chat contacts
    ...friends.map(friend => ({
      id: friend.username,
      name: friend.username,
      avatar: friend.username.charAt(0).toUpperCase(),
      lastMessage: 'Start a conversation',
      status: friend.status || 'offline',
      unread: 0,
      type: 'direct'
    }))
  ]

  const currentChat = chatContacts.find(chat => chat.id === selectedChat)
  const currentMessages = messages[selectedChat] || []

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  // Format date for display
  const formatDate = (dateString) => {
    const messageDate = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return messageDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = []
    let currentDate = null

    messages.forEach((message) => {
      if (currentDate !== message.date) {
        currentDate = message.date
        grouped.push({
          type: 'date-separator',
          date: message.date,
          id: `date-${message.date}`
        })
      }
      grouped.push(message)
    })

    return grouped
  }

  const groupedMessages = groupMessagesByDate(currentMessages)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toDateString()
      }

      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMsg]
      }))

      setNewMessage('')

      // Simulate response after 1-2 seconds
      setTimeout(() => {
        const responses = {
          'dr-sarah': [
            'That\'s a great question! Let me explain...',
            'I\'ll send you some additional resources.',
            'Feel free to ask if you need more clarification.'
          ],
          'study-group': [
            'Thanks for sharing!',
            'That sounds like a good plan.',
            'See you all there!'
          ],
          'mentor-mike': [
            'Keep up the excellent work!',
            'I\'m proud of your progress.',
            'Let me know if you need any guidance.'
          ],
          'ai-tutor': [
            'I understand your question. Here\'s how to approach it...',
            'Would you like me to provide more examples?',
            'Let\'s break this down step by step.'
          ]
        }

        const responseTexts = responses[selectedChat] || ['Thanks for your message!']
        const randomResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)]

        const responseMsg = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toDateString()
        }

        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), responseMsg]
        }))
      }, 1000 + Math.random() * 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFriendRequestAction = async (request, action) => {
    console.log('Handling friend request:', request) // For debugging
    const requestId = request.id

    if (!requestId) {
      console.error('Friend request ID is missing.', request)
      setFriendRequestStatus({
        type: 'error',
        message: 'Cannot process request: Missing ID.'
      })
      // Clear the message after a few seconds
      setTimeout(() => {
        setFriendRequestStatus({ type: '', message: '' })
      }, 5000)
      return
    }

    const result = await respondToFriendRequest(requestId, action)
    setFriendRequestStatus({
      type: result.success ? 'success' : 'error',
      message: result.message
    })

    if (result.success) {
      setFriendRequests(loadFriendRequests())
      if (action === 'accept') {
        setFriends(loadFriendsList())
      }
    }

    // Clear the message after a few seconds
    setTimeout(() => {
      setFriendRequestStatus({ type: '', message: '' })
    }, 5000)
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat List Sidebar */}
        <div className={`chat-sidebar ${showChatList ? 'show' : 'hide'}`}>
          <div className="chat-sidebar-header">
            <h2 className="card-title">Messages</h2>
            <div className="chat-header-actions">
              <button
                className="chat-action-btn"
                onClick={() => setShowFriendRequests(!showFriendRequests)}
                title="Friend Requests"
              >
                <UserPlus size={18} />
                {friendRequests.length > 0 && (
                  <span className="notification-badge">{friendRequests.length}</span>
                )}
              </button>
              <button
                className="chat-action-btn"
                onClick={() => setShowNewGroupModal(true)}
                title="Create Group"
              >
                <Users size={18} />
              </button>
            </div>
          </div>

          <div className="chat-search-container">
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="chat-search-input"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
            />
          </div>

          {/* Friend Requests Section */}
          {showFriendRequests && (
            <div className="friend-requests-section">
              <h3>Friend Requests</h3>
              {friendRequestStatus.message && (
                <div className={`request-status-message ${friendRequestStatus.type}`}>
                  {friendRequestStatus.message}
                </div>
              )}
              {friendRequests.length > 0
                ? (
                    friendRequests.map(request => (
                <div key={request.id} className="friend-request-item">
                  <div className="friend-info">
                    <div className="friend-avatar">{request.from.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="friend-name">{request.from}</p>
                      <p className="friend-time">{new Date(request.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFriendRequestAction(request, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleFriendRequestAction(request, 'decline')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
                    ))
                  )
                : (
                <p>No new friend requests.</p>
                  )}
            </div>
          )}
          <div className="chat-contacts">
            {chatContacts
              .filter(contact =>
                contact.name.toLowerCase().includes(chatSearch.toLowerCase())
              )
              .map((contact) => (
              <div
                key={contact.id}
                className={`chat-contact ${selectedChat === contact.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChat(contact.id)
                  setShowChatList(false)
                }}
              >
                <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                  {contact.avatar}
                </div>
                <div className="chat-contact-info">
                  <div className="chat-contact-header">
                    <h4>{contact.name}</h4>
                    {contact.unread > 0 && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                  <p className="chat-last-message">{contact.lastMessage}</p>
                  <span className={`status-indicator ${contact.status}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Area */}
        <div className={`chat-area ${!showChatList ? 'show' : 'hide'}`}>
          {/* Chat Header */}
          <div className="chat-header">
            <button
              className="mobile-back-btn"
              onClick={() => setShowChatList(true)}
            >
              ←
            </button>
            <div className="chat-header-info">
              <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                {currentChat?.avatar}
              </div>
              <div>
                <h3 className="chat-contact-name">{currentChat?.name}</h3>
                <p className={`chat-status ${currentChat?.status}`}>
                  {currentChat?.status === 'online' && 'Online'}
                  {currentChat?.status === 'away' && 'Away'}
                  {currentChat?.status === 'active' && 'Active'}
                </p>
              </div>
            </div>
            <div className="chat-actions">
              <button className="material-action-btn">
                <Phone size={16} />
              </button>
              <button className="material-action-btn">
                <Video size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            <div className="messages-scroll-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div className="messages-container">
              {groupedMessages.map((item) => {
                if (item.type === 'date-separator') {
                  return (
                    <div key={item.id} className="date-separator">
                      <span className="date-text">{formatDate(item.date)}</span>
                    </div>
                  )
                }

                return (
                  <div key={item.id} className={`message ${item.sender === 'me' ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{item.text}</p>
                      <span className="message-time">{item.timestamp}</span>
                    </div>
                  </div>
                )
              })}
              {currentMessages.length === 0 && (
                <div className="empty-chat">
                  <p>Start a conversation with {currentChat?.name}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          </div>

          {/* Message Input */}
          <div className="chat-input">
            <div className="input-container">
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="modal-overlay" onClick={() => setShowNewGroupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Group Chat</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowNewGroupModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="form-input"
                />
              </div>
              <div className="create-group-form-group">
                <label>Add Members</label>
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="create-group-search"
                  value={createGroupSearch}
                  onChange={(e) => setCreateGroupSearch(e.target.value)}
                />
                <div className="create-group-friends-selection">
                  {friends
                    .filter(friend =>
                      friend.username.toLowerCase().includes(createGroupSearch.toLowerCase())
                    )
                    .map(friend => (
                      <div
                        key={friend.username}
                        className={`create-group-friend-checkbox ${
                          selectedFriends.includes(friend.username) ? 'selected' : ''
                        }`}
                        onClick={() => {
                          if (selectedFriends.includes(friend.username)) {
                            setSelectedFriends(prev => prev.filter(f => f !== friend.username))
                          } else {
                            setSelectedFriends(prev => [...prev, friend.username])
                          }
                        }}
                      >
                        <div className="create-group-friend-avatar">{friend.username.charAt(0).toUpperCase()}</div>
                        <label>{friend.username}</label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowNewGroupModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (newGroupName.trim() && selectedFriends.length > 0) {
                    // Create new group chat
                    const newGroupId = `group-${Date.now()}`
                    setMessages(prev => ({
                      ...prev,
                      [newGroupId]: [{
                        id: 1,
                        text: `${userProfile.displayName || 'You'} created the group`,
                        sender: 'system',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }]
                    }))

                    setSelectedChat(newGroupId)
                    setShowNewGroupModal(false)
                    setNewGroupName('')
                    setSelectedFriends([])
                    setShowChatList(false)
                  }
                }}
                disabled={!newGroupName.trim() || selectedFriends.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
