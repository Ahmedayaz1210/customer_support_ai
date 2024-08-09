"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material"
import { useState, useRef, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
export default function Home() {
  const [history, setHistory] = useState([])
  const firstMessage = "Hi there! I'm Harvard University's virtual assistant. How can I help?"

  const [message, setMessage] = useState("")
  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
    setHistory((history) => [...history, { role: "user", parts: [{ text: message }] }])
    setMessage('')
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...history, { role: "user", parts: [{ text: message }] }])
    })
    const data = await response.json()
    setHistory((history) => [...history, { role: "model", parts: [{ text: data }] }])
  }
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <Box
        ref={chatContainerRef}
        
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          gap: 2
        }}
      >
        <Box
          sx={{
            alignSelf: 'flex-start',
            bgcolor: 'black',
            borderRadius: 10,
            p: 2,
            mb: 2,
            color: 'white',
          }}
        >
          <Typography>{firstMessage}</Typography>
        </Box>
        {history.map((textObject, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: textObject.role === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: textObject.role === 'user' ? '#9a0000' : 'black',
              color: 'white',
              borderRadius: 10,
              p: 2,
              maxWidth: '70%'
            }}
          >
            <Typography>{textObject.parts[0].text}</Typography>
          </Box>
        ))}
      </Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: '70%',
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <TextField 
          placeholder='Message HUIT Bot' 
          value={message}
          // multiline
          // maxRows={4}
          onChange={(e) => setMessage(e.target.value)} 
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{border: '3px solid #9a0000', borderRadius: 10, '& fieldset': { border: 'none' }}}
        />
        <Button sx={{backgroundColor: 'black', borderRadius: '50%', color: 'white', '&:hover': {backgroundColor: 'black'}}}  onClick={sendMessage}
        ><SendIcon/></Button>
      </Stack>
    </Box>
  );
}