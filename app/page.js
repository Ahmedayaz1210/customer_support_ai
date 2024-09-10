"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image'



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

export default function HeadstarterChat() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);

  const firstMessage = "Hi there! I'm Headstarter AI's virtual assistant. How can I help?";

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMessage = { role: 'user', parts: [{ text: message }] };
    setHistory((prev) => [...prev, newMessage]);
    setMessage('');
    try {
      const response = await fetch('https://bbksiry4k3b7rq7fwbv2dzeria0vqivx.lambda-url.us-east-1.on.aws/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();
      setHistory((prev) => [...prev, { role: 'model', parts: [{ text: data.response }] }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

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