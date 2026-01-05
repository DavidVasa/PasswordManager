import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';

const SetupPage = () => {
  const navigate = useNavigate();
  const { setupVault, isVaultInitialized, checkAuthStatus } = useAuth();
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Pokud je trezor už inicializovaný, přesměruj na login
  if (isVaultInitialized) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validace
    if (!masterPassword.trim()) {
      setError('Please enter master password');
      setLoading(false);
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (masterPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    const result = await setupVault(masterPassword);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Setup failed');
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Initialize Vault
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            Create a new encrypted vault. Your master password will be used to encrypt all your credentials.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Master Password"
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            disabled={loading}
            margin="normal"
            variant="outlined"
            required
            helperText="Minimum 8 characters"
            autoFocus
          />
          
          <TextField
            fullWidth
            label="Confirm Master Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            margin="normal"
            variant="outlined"
            required
          />
          
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> If you lose your master password, you will lose access to all your stored credentials. There is no recovery option.
            </Typography>
          </Alert>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Vault'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have a vault?{' '}
            <Button 
              variant="text" 
              size="small" 
              onClick={() => navigate('/login')}
            >
              Unlock existing vault
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SetupPage;