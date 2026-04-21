import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CardActionArea, Grid as Grid2 } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

const topicsData = {
  '5': [
    { id: '5-1', title: 'Sürtünme Kuvveti (Buzul Gezegeni)', description: 'Buzul gezegeninde sürtünme kuvvetinin etkilerini keşfedin.' },
    { id: '5-2', title: 'Elektrik Devreleri (Karanlık Mahalle)', description: 'Karanlık mahalleye ışık getirmek için elektrik devreleri kurun.' },
  ],
  '6': [
    { id: '6-1', title: 'Güneş Sistemi (Yörünge İstasyonu)', description: 'Yörünge istasyonundan güneş sisteminin sırlarını çözün.' },
    { id: '6-2', title: 'Yoğunluk (Kayıp Kıta)', description: 'Kayıp kıtadaki gizemli maddelerin yoğunluklarını hesaplayın.' },
  ],
  '7': [
    { id: '7-1', title: 'Karışımlar (Simyacı İksiri)', description: 'Simyacının gizli laboratuvarında karışımları ayırın.' },
    { id: '7-2', title: 'Asitler ve Bazlar (Sızıntı)', description: 'Tehlikeli sızıntıyı nötralize etmek için asit-baz tepkimelerini kullanın.' },
  ],
  '8': [
    { id: '8-1', title: 'Sıvı Basıncı (Baraj Çatlağı)', description: 'Baraj çatlağını onarmak için sıvı basıncı prensiplerini uygulayın.' },
    { id: '8-2', title: 'İklim ve Hava (OpenWeather Canlı Veri)', description: 'Gerçek zamanlı hava verileri ile iklim değişikliklerini analiz edin.' },
  ]
};

function GradeView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const topics = topicsData[gradeId] || [];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        {gradeId}. Sınıf Görevleri
      </Typography>

      <Grid2 container spacing={4} direction="column">
        {topics.map((topic) => (
          <Grid2 item xs={12} key={topic.id}>
            <Card
              sx={{
                backgroundColor: '#1f2937',
                borderRadius: 4,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', // shadow-2xl
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.3)',
                }
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/grade/${gradeId}/topic/${topic.id}`)}
                sx={{ p: 3 }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    p: 2,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ExploreIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                      {topic.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'gray.400' }}>
                      {topic.description}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

export default GradeView;
