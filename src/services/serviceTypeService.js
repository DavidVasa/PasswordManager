import api from './api';

const serviceTypeService = {
  // Získání všech typů služeb
  getAll: async () => {
    const response = await api.get('/service-types');
    return response.data.items || [];
  },

  // Vytvoření nového typu služby
  create: async (name) => {
    const response = await api.post('/service-types', { name });
    return response.data;
  },

  // (Budoucí rozšíření)
  update: async (id, name) => {
    throw new Error('Not implemented');
  },

  // (Budoucí rozšíření)
  delete: async (id) => {
    throw new Error('Not implemented');
  },

  // Získání typu služby podle ID
  getById: async (id) => {
    const allTypes = await serviceTypeService.getAll();
    return allTypes.find(type => type.id === id);
  }
};

export default serviceTypeService;