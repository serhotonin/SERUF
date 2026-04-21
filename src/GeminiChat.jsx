import { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, IconButton, Paper, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function GeminiChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Merhaba! Ben SERUF Gemini Eğitim Asistanıyım. Fen bilimleri konularında sana nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    // Initialize chat session on load
    try {
        const session = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Sen SERUF için bir fen bilimleri eğitim asistanısın. Öğrencilere 5, 6, 7 ve 8. sınıf konularında rehberlik etmelisin. Yanıtların Türkçe, açıklayıcı ve cesaretlendirici olmalı." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Anladım. SERUF fen bilimleri eğitim asistanı olarak öğrencilere yardımcı olmaya hazırım." }],
                },
            ],
        });
        setChatSession(session);
    } catch (e) {
        console.error("Failed to initialize chat session", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
          // Mock response if no key is provided to prevent crashing during demo
          setTimeout(() => {
              setMessages(prev => [...prev, {
                  role: 'model',
                  content: 'VITE_GEMINI_API_KEY bulunamadı. Lütfen `.env` dosyanızı kontrol edin. (Bu bir test yanıtıdır)'
              }]);
              setIsLoading(false);
          }, 1000);
          return;
      }

      if (chatSession) {
          const result = await chatSession.sendMessage(userMessage);
          const responseText = result.response.text();
          setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      } else {
          throw new Error("Chat session not initialized");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Üzgünüm, bir hata oluştu veya API bağlantısı sağlanamadı. Lütfen daha sonra tekrar deneyin.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: 3,
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(90deg, #1f2937 0%, #111827 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SmartToyIcon color="secondary" />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Gemini Eğitim Asistanı</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'gray.400' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                maxWidth: '80%',
                borderRadius: 3,
                borderTopRightRadius: msg.role === 'user' ? 4 : 12,
                borderTopLeftRadius: msg.role === 'model' ? 4 : 12,
                backgroundColor: msg.role === 'user' ? '#3b82f6' : '#374151',
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.7 }}>
                {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  {msg.role === 'user' ? 'Sen' : 'Gemini'}
                </Typography>
              </Box>
              <Box className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </Box>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                borderTopLeftRadius: 4,
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <CircularProgress size={20} color="secondary" />
              <Typography variant="body2" sx={{ color: 'gray.400' }}>Yanıtlıyor...</Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#111827' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Bir soru sor..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#374151',
              borderRadius: 3,
              color: 'white',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            ml: 1,
            backgroundColor: input.trim() && !isLoading ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
          }}
        >
          <SendIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

export default GeminiChat;
