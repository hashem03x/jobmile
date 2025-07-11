import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatbotWidget from './ChatbotWidget';

const CompanyLayout = ({ children }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {children}
      <ChatbotWidget 
        isOpen={isChatbotOpen} 
        onToggle={handleToggleChatbot} 
      />
    </Box>
  );
};

export default CompanyLayout; 