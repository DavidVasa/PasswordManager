import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import credentialService from '../services/credentialService';
import serviceTypeService from '../services/serviceTypeService';

const CredentialsPage = () => {
  const [credentials, setCredentials] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [formData, setFormData] = useState({
    serviceTypeId: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    loadData();
  }, []);
/*
  const loadData = async () => {
    try {
      setLoading(true);
      const [credsData, typesData] = await Promise.all([
        credentialService.getAll(),
        serviceTypeService.getAll(),
      ]);
      setCredentials(credsData);
      setServiceTypes(typesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };
*/

const loadData = async () => {
  try {
    setLoading(true);
    
    // Načti service types
    console.log(' Loading service types...');
    const typesData = await serviceTypeService.getAll();
    console.log(' Service types loaded:', typesData.length);
    setServiceTypes(typesData);
    
    // try na credentials
    try {
      console.log(' Loading credentials...');
      const credsData = await credentialService.getAll();
      console.log(' Credentials loaded:', credsData.length);
      setCredentials(credsData);
    } catch (credError) {
      console.warn(' Could not load credentials:', credError.message);
      console.log('ℹ This is OK if you have no credentials yet');
      setCredentials([]);
    }
    
  } catch (error) {
    console.error(' Error loading main data:', error);
  } finally {
    setLoading(false);
  }
};



  const handleOpenDialog = () => {
    setFormData({ serviceTypeId: '', username: '', password: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ serviceTypeId: '', username: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serviceTypeId || !formData.username || !formData.password) {
      alert('Please fill all fields');
      return;
    }

    try {
      await credentialService.create(formData);
      alert('Credential created successfully');
      handleCloseDialog();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Creation failed');
    }
  };

  const handleView = (cred) => {
    credentialService.getById(cred.id)
      .then(fullCred => {
        setSelectedCredential(fullCred);
        setViewDialog(true);
      })
      .catch(error => {
        alert('Failed to load credential details');
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    try {
      await credentialService.delete(id);
      alert('Credential deleted');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Credentials
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Credential
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Type</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credentials.length > 0 ? (
              credentials.map((cred) => {
                const serviceType = serviceTypes.find(st => st.id === cred.serviceType?.id || st.id === cred.serviceTypeId);
                return (
                  <TableRow key={cred.id}>
                    <TableCell>{serviceType?.name || 'Unknown'}</TableCell>
                    <TableCell>{cred.username}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleView(cred)} title="View">
                        <ViewIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(cred.id)} title="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="textSecondary" sx={{ py: 4 }}>
                    No credentials found. Add your first one!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Credential Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Credential</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Service Type"
              value={formData.serviceTypeId}
              onChange={(e) => setFormData({ ...formData, serviceTypeId: e.target.value })}
              SelectProps={{ native: true }}
              margin="normal"
              required
            >
              <option value="">Select a service type</option>
              {serviceTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Username/Email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Credential Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        {selectedCredential && (
          <>
            <DialogTitle>Credential Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Username:</Typography>
                <Typography variant="body1">{selectedCredential.username}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Password:</Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {selectedCredential.password}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CredentialsPage;