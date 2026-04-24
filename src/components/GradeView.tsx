import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Container,
  Chip,
  IconButton,
  Divider,
  Drawer,
  TextField,
  Switch,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Science as ScienceIcon,
  PlayArrow as PlayIcon,
  AssignmentTurnedIn as AssignmentIcon,
  MenuBook as NotebookIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// --- Grade 5-6 Components ---
import SolarSystemSimulation from './Grade5-6/SolarSystemSimulation';

// --- Grade 7-8 Components ---
import AlchemyMixtures from './Grade7-8/AlchemyMixtures';
import AcidBaseSimulation from './Grade7-8/AcidBaseSimulation';
import PressureSimulation from './Grade7-8/PressureSimulation';
import WeatherSimulation from './Grade7-8/WeatherSimulation';

// --- GradeView Component ---

interface LabNote {
  id: number;
  topic: string;
  hypothesis: string;
  observation: string;
  timestamp: string;
}

const GradeView: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const topics = {
    '5': ["Sürtünme Kuvveti (Buzul Gezegeni)", "Elektrik Devreleri (Karanlık Mahalle)"],
    '6': ["Güneş Sistemi (Yörünge İstasyonu)", "Yoğunluk (Kayıp Kıta)"],
    '7': ["Karışımlar (Simyacı İksiri)", "Asitler ve Bazlar (Sızıntı)"],
    '8': ["Sıvı Basıncı (Baraj Çatlağı)", "İklim ve Hava (OpenWeather Canlı Veri)"],
  }[gradeId || '5'] || [];

  const [viewState, setViewState] = useState<'list' | 'briefing' | 'simulation'>('list');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [observation, setObservation] = useState('');
  const [prevNotes, setPrevNotes] = useState<LabNote[]>([]);
  const [missionComplete, setMissionComplete] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchNotes = (topic: string) => {
    fetch(`http://localhost:3001/api/notes/${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => setPrevNotes(data))
      .catch(err => console.error(err));
  };

  const saveNote = () => {
    if (!activeTopic) return;
    setSavingNote(true);
    fetch('http://localhost:3001/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: activeTopic, hypothesis, observation }),
    })
    .then(() => {
      fetchNotes(activeTopic);
      setSavingNote(false);
      setNotebookOpen(false);
    })
    .catch(err => {
      console.error(err);
      setSavingNote(false);
    });
  };

  const handleStartSimulation = (topic: string) => {
    setActiveTopic(topic);
    setViewState('briefing');
    setMissionComplete(false);
    setSandboxMode(false);
    setHypothesis('');
    setObservation('');
    fetchNotes(topic);
  };

  const handleMissionComplete = () => {
    if (!activeTopic) return;
    setMissionComplete(true);
    
    // Save progress to backend
    fetch('http://localhost:3001/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        grade: parseInt(gradeId || '5'), 
        topic: activeTopic, 
        completed: true, 
        score: 100 // Default score for now
      }),
    }).catch(err => console.error('Failed to save progress:', err));
  };

  const renderSimulationContent = () => {
    if (!activeTopic) return null;
    if (activeTopic.includes("Karışımlar")) return <AlchemyMixtures />;
    if (activeTopic.includes("Güneş Sistemi")) return <SolarSystemSimulation />;
    if (activeTopic.includes("Asitler")) return <AcidBaseSimulation sandbox={sandboxMode} />;
    if (activeTopic.includes("Basıncı")) return <PressureSimulation sandbox={sandboxMode} />;
    if (activeTopic.includes("İklim")) return <WeatherSimulation sandbox={sandboxMode} />;
    
    return (
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <ScienceIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h5" color="text.secondary">Geliştirme Aşamasında...</Typography>
       </Box>
    );
  };

  if (viewState === 'briefing' && activeTopic) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Card sx={{ p: 6, border: '2px solid', borderColor: 'primary.main', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, backgroundColor: 'primary.main', color: 'background.paper' }}>
            <Typography variant="overline" sx={{ fontWeight: 900 }}>GÖREV DOSYASI</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeTopic}</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              "Laboratuvar hazır. Bilimsel verileri toplayıp görevi tamamlamak senin elinde!"
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" fullWidth onClick={() => setViewState('simulation')}>Simülasyonu Başlat</Button>
              <Button variant="outlined" size="large" onClick={() => setViewState('list')}>Geri Dön</Button>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

  if (viewState === 'simulation' && activeTopic) {
    return (
      <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{activeTopic}</Typography>
            {missionComplete && <Chip icon={<CheckIcon />} label="GÖREV TAMAMLANDI" color="success" size="small" />}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<NotebookIcon />} onClick={() => setNotebookOpen(true)} variant="outlined" size="small">Defter</Button>
            <Button variant="contained" color="inherit" size="small" onClick={() => setViewState('list')}>Kapat</Button>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: sandboxMode ? '#111' : '#f8fafc' }}>
             {renderSimulationContent()}

          {!missionComplete && (
            <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
               <Button variant="contained" color="success" onClick={handleMissionComplete}>Görevi Tamamla</Button>
            </Box>
          )}

          {missionComplete && (
            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
              <Paper elevation={6} sx={{ p: 1, px: 3, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 2, border: '2px solid', borderColor: sandboxMode ? 'error.main' : 'primary.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>SERBEST MOD (KAOS)</Typography>
                <Switch checked={sandboxMode} onChange={(e) => setSandboxMode(e.target.checked)} color="error" />
              </Paper>
            </Box>
          )}

          <Drawer anchor="right" open={notebookOpen} onClose={() => setNotebookOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 450, p: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Deney Notları</Typography>
              <IconButton onClick={() => setNotebookOpen(false)}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>YENİ NOT</Typography>
                <TextField fullWidth multiline rows={3} placeholder="Hipotezin..." value={hypothesis} onChange={e => setHypothesis(e.target.value)} variant="filled" sx={{mb: 2, mt: 1}} />
                <TextField fullWidth multiline rows={3} placeholder="Gözlemlerin..." value={observation} onChange={e => setObservation(e.target.value)} variant="filled" />
                <Button variant="contained" fullWidth onClick={saveNote} disabled={savingNote} sx={{mt: 2}}>{savingNote ? <CircularProgress size={24} /> : "Kaydet"}</Button>
              </Box>
              <Divider />
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>GEÇMİŞ NOTLAR</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {prevNotes.length === 0 ? <Typography variant="caption">Not bulunamadı.</Typography> : prevNotes.map(n => (
                    <Paper key={n.id} variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.01)' }}>
                       <Typography variant="caption" color="text.secondary">{new Date(n.timestamp).toLocaleString('tr-TR')}</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>H: {n.hypothesis}</Typography>
                       <Typography variant="body2">G: {n.observation}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{gradeId}. Sınıf Laboratuvarı</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>İnteraktif simülasyonları başlatmak için bir ünite seçin.</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {topics.map((topic, index) => (
          <Card key={topic} sx={{ display: 'flex', flexDirection: 'column', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{topic.split('(')[0].trim()}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon fontSize="small" /> {topic.split('(')[1].replace(')', '')}
                </Typography>
              </Box>
              <Chip label={`Modül 0${index + 1}`} size="small" />
            </Box>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'rgba(0,0,0,0.01)', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<PlayIcon />} onClick={() => handleStartSimulation(topic)}>Başlat</Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default GradeView;
