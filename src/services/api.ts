import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  getByRole: (roleId: number) => 
    api.get(`/users?filter=${JSON.stringify({ where: { roleId } })}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Role APIs
export const roleAPI = {
  getAll: () => api.get('/roles'),
  getById: (id: number) => api.get(`/roles/${id}`),
  create: (data: any) => api.post('/roles', data),
  update: (id: number, data: any) => api.patch(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/roles/${id}`),
};

// Permission APIs
export const permissionAPI = {
  getAll: () => api.get('/permissions'),
  getById: (id: number) => api.get(`/permissions/${id}`),
  create: (data: any) => api.post('/permissions', data),
  update: (id: number, data: any) => api.patch(`/permissions/${id}`, data),
  delete: (id: number) => api.delete(`/permissions/${id}`),
};

// Psychologist APIs
export const psychologistAPI = {
  getAll: () => api.get('/psychologists'),
  getById: (id: number) => api.get(`/psychologists/${id}`),
  create: (data: any) => api.post('/psychologists', data),
  update: (id: number, data: any) => api.patch(`/psychologists/${id}`, data),
  delete: (id: number) => api.delete(`/psychologists/${id}`),
};

// Patient APIs
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id: number) => api.get(`/patients/${id}`),
  getByPsychologist: (psychologistId: number) => 
    api.get(`/patients?filter=${JSON.stringify({ where: { psychologistId } })}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: number, data: any) => api.patch(`/patients/${id}`, data),
  delete: (id: number) => api.delete(`/patients/${id}`),
};

// Assessment APIs
export const assessmentAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id: number) => api.get(`/assessments/${id}`),
  getByPatient: (patientId: number) => 
    api.get(`/assessments?filter=${JSON.stringify({ where: { patientId }, order: ['scheduledDate DESC'] })}`),
  getByPsychologist: (psychologistId: number) => 
    api.get(`/assessments?filter=${JSON.stringify({ where: { psychologistId }, order: ['scheduledDate DESC'] })}`),
  create: (data: any) => api.post('/assessments', data),
  update: (id: number, data: any) => api.patch(`/assessments/${id}`, data),
  delete: (id: number) => api.delete(`/assessments/${id}`),
};

// Assessment Notes APIs
export const assessmentNoteAPI = {
  getAll: () => api.get('/assessment-notes'),
  getById: (id: number) => api.get(`/assessment-notes/${id}`),
  getByAssessment: (assessmentId: number) => 
    api.get(`/assessment-notes?filter=${JSON.stringify({ where: { assessmentId } })}`),
  create: (data: any) => api.post('/assessment-notes', data),
  update: (id: number, data: any) => api.patch(`/assessment-notes/${id}`, data),
  delete: (id: number) => api.delete(`/assessment-notes/${id}`),
};

// Question APIs
export const questionAPI = {
  getAll: () => api.get('/questions'),
  getById: (id: number) => api.get(`/questions/${id}`),
  getByAssessment: (assessmentId: number) => 
    api.get(`/questions?filter=${JSON.stringify({ where: { assessmentId }, order: ['orderIndex ASC'] })}`),
  create: (data: any) => api.post('/questions', data),
  update: (id: number, data: any) => api.patch(`/questions/${id}`, data),
  delete: (id: number) => api.delete(`/questions/${id}`),
};

// Response APIs
export const responseAPI = {
  getAll: () => api.get('/responses'),
  getById: (id: number) => api.get(`/responses/${id}`),
  getByAssessment: (assessmentId: number) => 
    api.get(`/responses?filter=${JSON.stringify({ where: { assessmentId }, include: ['question'] })}`),
  create: (data: any) => api.post('/responses', data),
  createBulk: (data: any[]) => api.post('/responses/bulk', data),
  update: (id: number, data: any) => api.patch(`/responses/${id}`, data),
  delete: (id: number) => api.delete(`/responses/${id}`),
};

export default api;
