import React, { useState } from 'react';
import { Box, Typography, Slider, keyframes } from '@mui/material';

const bubble = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.5; }
  100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
`;

const shake = keyframes`
  0%, 100% { transform: translate(0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-5px, -5px); }
  20%, 40%, 60%, 80% { transform: translate(5px, 5px); }
`;

const WeatherSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const [temp, setTemp] = useState(25);
  const [hum, setHum] = useState(50);
  const isSnowing = temp < 5 && hum > 60;
  const isStorming = sandbox && temp > 40 && hum > 80;

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box 
        sx={{ 
          width: '90%', 
          height: 250, 
          borderRadius: 4, 
          border: '4px solid #333', 
          position: 'relative', 
          overflow: 'hidden',
          background: temp > 30 ? 'linear-gradient(#fde68a, #f59e0b)' : temp < 10 ? 'linear-gradient(#e0f2fe, #7dd3fc)' : 'linear-gradient(#7dd3fc, #38bdf8)',
          transition: 'all 1s'
        }}
      >
        <Box sx={{ position: 'absolute', top: 30, right: 50, width: temp > 30 ? 80 : 40, height: temp > 30 ? 80 : 40, bgcolor: '#fbbf24', borderRadius: '50%', boxShadow: `0 0 ${temp}px #fbbf24`, transition: 'all 0.5s' }} />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: 60, bgcolor: temp > 35 ? '#b45309' : '#22c55e', transition: 'all 1s' }} />
        {isSnowing && [...Array(20)].map((_, i) => (
          <Box key={i} sx={{ position: 'absolute', top: -10, left: `${Math.random()*100}%`, width: 8, height: 8, bgcolor: 'white', borderRadius: '50%', animation: `${bubble} ${2 + Math.random()*2}s infinite linear reverse`, opacity: 0.8 }} />
        ))}
        {isStorming && (
          <Box sx={{ position: 'absolute', bottom: 40, left: '40%', width: 100, height: 200, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderTop: '200px solid rgba(0,0,0,0.5)', borderRadius: '50%', animation: `${shake} 0.1s infinite` }} />
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 6, mt: 4, width: '80%' }}>
         <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>SICAKLIK ({temp}°C)</Typography>
            <Slider value={temp} min={-20} max={sandbox ? 60 : 40} onChange={(_, v) => setTemp(v as number)} />
         </Box>
         <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>NEM (%{hum})</Typography>
            <Slider value={hum} min={0} max={100} onChange={(_, v) => setHum(v as number)} />
         </Box>
      </Box>
      {isStorming && (
        <Typography variant="h6" sx={{ mt: 2, color: 'error.main', fontWeight: 900, animation: `${shake} 0.2s infinite` }}>KASIRGA UYARISI!</Typography>
      )}
    </Box>
  );
};

export default WeatherSimulation;
