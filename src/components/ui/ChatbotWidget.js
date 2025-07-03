import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const ChatbotWidget = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI career assistant. I can help you find jobs, analyze your skills, and provide career advice. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Find jobs matching my skills",
        "Analyze my skills gap",
        "Career advice",
        "Resume tips"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('job') || input.includes('position') || input.includes('career')) {
      return {
        id: Date.now(),
        text: "I found several great opportunities that match your profile! Based on your skills in React, Node.js, and Python, I recommend checking out the Senior Software Engineer position at TechCorp Inc. It has a 95% match score and offers excellent benefits. Would you like me to show you more details?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "Show me the job details",
          "Find more similar jobs",
          "Help me apply",
          "Analyze my fit for this role"
        ]
      };
    } else if (input.includes('skill') || input.includes('gap') || input.includes('develop')) {
      return {
        id: Date.now(),
        text: "Based on your profile analysis, I've identified 3 key skills that could boost your career: AWS Cloud Services, Docker containerization, and GraphQL. These skills are in high demand and could increase your market value by 25%. Would you like a personalized learning path?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "Show me the learning path",
          "Find courses for these skills",
          "How long will it take?",
          "What's the ROI?"
        ]
      };
    } else if (input.includes('resume') || input.includes('cv')) {
      return {
        id: Date.now(),
        text: "Great question! Here are some tips to make your resume stand out: 1) Use action verbs and quantifiable achievements, 2) Tailor it to each job description, 3) Include relevant keywords, 4) Keep it concise (1-2 pages). Would you like me to review your current resume?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "Review my resume",
          "Resume templates",
          "ATS optimization tips",
          "Cover letter help"
        ]
      };
    } else if (input.includes('advice') || input.includes('career')) {
      return {
        id: Date.now(),
        text: "Here's some career advice based on your profile: 1) Focus on building a strong personal brand on LinkedIn, 2) Network actively in your field, 3) Consider certifications in emerging technologies, 4) Stay updated with industry trends. What specific area would you like to focus on?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "Networking strategies",
          "Personal branding tips",
          "Industry trends",
          "Salary negotiation"
        ]
      };
    } else {
      return {
        id: Date.now(),
        text: "I understand you're asking about that. Let me help you with some options. You can ask me about job matching, skills analysis, career advice, resume tips, or salary information. What would you like to know more about?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: [
          "Find jobs matching my skills",
          "Analyze my skills gap",
          "Career advice",
          "Resume tips"
        ]
      };
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24, md: 32 },
          right: { xs: 16, sm: 24, md: 32 },
          zIndex: 1000
        }}
      >
        <Tooltip title="Chat with AI Assistant" placement="left">
          <IconButton
            onClick={onToggle}
            sx={{
              width: { xs: 56, sm: 64, md: 72 },
              height: { xs: 56, sm: 64, md: 72 },
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ChatIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 24, md: 32 },
        right: { xs: 16, sm: 24, md: 32 },
        zIndex: 1000,
        width: { xs: 'calc(100vw - 32px)', sm: 400, md: 450 },
        maxWidth: { xs: '100%', sm: 400, md: 450 },
        height: { xs: 'calc(100vh - 32px)', sm: isExpanded ? 600 : 500, md: isExpanded ? 650 : 550 },
        maxHeight: { xs: '100%', sm: isExpanded ? 600 : 500, md: isExpanded ? 650 : 550 }
      }}
    >
      <Paper
        elevation={24}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 }
              }}
            >
              <BotIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  lineHeight: 1.2
                }}
              >
                AI Career Assistant
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Online • Ready to help
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={isExpanded ? "Minimize" : "Expand"}>
              <IconButton
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                size="small"
              >
                {isExpanded ? (
                  <ExpandLessIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Close chat">
              <IconButton
                onClick={onToggle}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
                size="small"
              >
                <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
          className="chat-scrollbar"
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {message.sender === 'user' ? (
                      <PersonIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                    ) : (
                      <BotIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                    )}
                  </Avatar>
                  <Box
                    sx={{
                      background: message.sender === 'user' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      maxWidth: '100%',
                      wordBreak: 'break-word'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Suggestions */}
                {message.suggestions && message.sender === 'bot' && (
                  <Box
                    sx={{
                      mt: 1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      justifyContent: 'flex-start'
                    }}
                  >
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    bgcolor: 'secondary.main',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  <BotIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />
                </Avatar>
                <Box
                  sx={{
                    background: 'white',
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: 'text.secondary'
                    }}
                  >
                    AI is typing...
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Input */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: 'white'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end'
            }}
          >
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    }
                  }
                }
              }}
            />
            <Tooltip title="Send message">
              <IconButton
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                <SendIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatbotWidget; 