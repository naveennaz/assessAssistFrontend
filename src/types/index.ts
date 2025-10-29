export interface Role {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id?: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  roleId: number;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  licenseNumber?: string;
  specialization?: string;
  credentials?: string;
  clinicName?: string;
  clinicAddress?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  assignedPsychologistId?: number;
  isActive: boolean;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Psychologist {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  specialization?: string;
  credentials?: string;
  clinicName?: string;
  clinicAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  psychologistId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Assessment {
  id?: number;
  title: string;
  assessmentType: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  recommendations?: string;
  scores?: any;
  summary?: string;
  psychologistId: number;
  patientId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentNote {
  id?: number;
  noteType: 'observation' | 'diagnosis' | 'treatment' | 'progress' | 'general';
  noteText: string;
  isConfidential: boolean;
  assessmentId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type QuestionType = 
  | 'multiple_choice' 
  | 'single_select' 
  | 'multi_select' 
  | 'descriptive' 
  | 'rating_scale' 
  | 'yes_no';

export interface Question {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  minRating?: number;
  maxRating?: number;
  category?: string;
  orderIndex: number;
  isRequired: boolean;
  assessmentId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Response {
  id?: number;
  textResponse?: string;
  selectedOption?: string;
  selectedOptions?: string[];
  ratingValue?: number;
  questionId: number;
  assessmentId: number;
  question?: Question;
  createdAt?: string;
  updatedAt?: string;
}
