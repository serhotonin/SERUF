import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScienceIcon from '@mui/icons-material/Science';

const grades = [
  { id: '5', label: '5. Sınıf' },
  { id: '6', label: '6. Sınıf' },
  { id: '7', label: '7. Sınıf' },
  { id: '8', label: '8. Sınıf' },
];

function Sidebar({ onGeminiClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }} className="bg-gray-800 text-white">
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ScienceIcon color="primary" fontSize="large" />
        <Typography variant="h5" component="div" sx={{ fontWeight: '800', letterSpacing: '0.05em' }}>
          SERUF
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'gray.700' }} />

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {grades.map((grade) => (
          <ListItem key={grade.id} disablePadding>
            <ListItemButton
              selected={location.pathname.includes(`/grade/${grade.id}`)}
              onClick={() => navigate(`/grade/${grade.id}`)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500/20
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  }
                }
              }}
            >
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontWeight: location.pathname.includes(`/grade/${grade.id}`) ? 'bold' : 'normal' }} primary={grade.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'gray.700' }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<SmartToyIcon />}
          onClick={onGeminiClick}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #8b5cf6 30%, #3b82f6 90%)',
            boxShadow: '0 3px 5px 2px rgba(139, 92, 246, .3)',
          }}
        >
          Gemini Asistanı
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;