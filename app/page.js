"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image'

/**
 * Creates a custom dark theme using Material-UI's `createTheme` function.
 * The theme specifies the primary color and background colors for the application.
 */

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#26E2A3',
    },
    background: {
      default: '#0A192F',
      paper: '#0F2A4A',
    },
  },
});


/**
 * The main component for the Headstarter Chat application.
 * This component handles the chat interface, including message history and sending messages.
 */

export default function HeadstarterChat() {
  // State to store the chat history
  const [history, setHistory] = useState([]);

  // State to store the current message being typed
  const [message, setMessage] = useState('');

  // Reference to the chat container for scrolling purposes
  const chatContainerRef = useRef(null);

  // Initial message from the virtual assistant
  const firstMessage = "Hi there! I'm Headstarter AI's virtual assistant. How can I help?";

  // Scroll to the bottom of the chat container when the history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

/**
   * Function to handle sending a message.
   * It updates the chat history with the new message and sends the message to the server.
   */
  const sendMessage = async () => {
      // Prevent sending empty messages
    if (!message.trim()) return;
    
    // Add the user message to the chat history
    const newMessage = { role: 'user', parts: [{ text: message }] };

    setHistory((prev) => [...prev, newMessage]);

    // Clear the message input
    setMessage('');
    try {
      // Send the message to the server
      const response = await fetch('https://bbksiry4k3b7rq7fwbv2dzeria0vqivx.lambda-url.us-east-1.on.aws/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();
      setHistory((prev) => [...prev, { role: 'model', parts: [{ text: data.response }] }]);
    } 

    // Handle the server response (not shown in the provided code)
    catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to handle the Enter key press for sending messages
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Render the chat interface
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', left: 16 }}>
            <Image src="/headstarter.png" alt="Headstarter logo" width={100} height={50} />
          </Box>
          <Box sx={{ position: 'absolute', left: 16 }}>
          </Box>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            Headstarter AI Virtual Assistant
          </Typography>
        </Box>
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            gap: 2,
          }}
        >
          <Box
            sx={{
              alignSelf: 'flex-start',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 2,
              maxWidth: '70%',
            }}
          >
            <Typography color="text.primary">{firstMessage}</Typography>
          </Box>
          {history.map((item, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                bgcolor: item.role === 'user' ? 'primary.main' : 'background.paper',
                color: item.role === 'user' ? 'background.paper' : 'text.primary',
                borderRadius: 2,
                p: 2,
                maxWidth: '70%',
              }}
            >
              <Typography>{item.parts[0].text}</Typography>
            </Box>
          ))}
        </Box>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <TextField
            placeholder="Message Headstarter AI"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button
            onClick={sendMessage}
            sx={{
              bgcolor: 'primary.main',
              color: 'background.paper',
              borderRadius: '50%',
              minWidth: '56px',
              height: '56px',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
