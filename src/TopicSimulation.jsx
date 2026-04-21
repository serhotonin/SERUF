import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Container } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function TopicSimulation() {
  const { gradeId, topicId } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/grade/${gradeId}`)}
        sx={{ mb: 4, color: 'gray.400', '&:hover': { color: 'white' } }}
      >
        Görevlere Dön
      </Button>

      <Card
        sx={{
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1f2937',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          p: 4,
          border: '1px dashed rgba(255,255,255,0.1)'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'gray.500', mb: 2, textAlign: 'center' }}>
          Simülasyon Alanı
        </Typography>
        <Typography variant="body1" sx={{ color: 'gray.500', mb: 6, textAlign: 'center', maxWidth: 400 }}>
          {gradeId}. Sınıf - Modül {topicId} için simülasyon ortamı yüklenmeye hazır.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PlayArrowIcon />}
          sx={{
            px: 6,
            py: 2,
            borderRadius: 8,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)'
          }}
        >
          Simülasyonu Başlat
        </Button>
      </Card>
    </Container>
  );
}

export default TopicSimulation;
