import api from './api';

const credentialService = {
  // Získání všech přihlašovacích údajů
  getAll: async () => {
    const response = await api.get('/credentials');
    return response.data.items || [];
  },

  // Získání konkrétních přihlašovacích údajů
  getById: async (id) => {
    const response = await api.get(`/credentials/${id}`);
    return response.data;
  },

  // Vytvoření nových přihlašovacích údajů
  create: async (credentialData) => {
    const response = await api.post('/credentials', credentialData);
    return response.data;
  },

  // Smazání přihlašovacích údajů
  delete: async (id) => {
    const response = await api.delete(`/credentials/${id}`);
    return response.data;
  },

  // (Budoucí rozšíření)
  update: async (id, credentialData) => {
    throw new Error('Not implemented');
  },

  // Filtrování podle typu služby
  getByServiceType: async (serviceTypeId) => {
    const allCredentials = await credentialService.getAll();
    return allCredentials.filter(cred => 
      cred.serviceType?.id === serviceTypeId || cred.serviceTypeId === serviceTypeId
    );
  }
};

export default credentialService;