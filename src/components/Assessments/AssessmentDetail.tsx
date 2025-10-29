import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  assessmentAPI,
  patientAPI,
  psychologistAPI,
  questionAPI,
  responseAPI,
} from '../../services/api';
import { Assessment, Patient, Psychologist, Question, Response } from '../../types';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAssessmentDetails(parseInt(id));
    }
  }, [id]);

  const loadAssessmentDetails = async (assessmentId: number) => {
    try {
      setLoading(true);
      const assessmentRes = await assessmentAPI.getById(assessmentId);
      const assessmentData = assessmentRes.data;
      setAssessment(assessmentData);

      const [patientRes, psychologistRes, questionsRes, responsesRes] = await Promise.all([
        patientAPI.getById(assessmentData.patientId),
        psychologistAPI.getById(assessmentData.psychologistId),
        questionAPI.getByAssessment(assessmentId),
        responseAPI.getByAssessment(assessmentId),
      ]);

      setPatient(patientRes.data);
      setPsychologist(psychologistRes.data);
      setQuestions(questionsRes.data);
      setResponses(responsesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assessment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResponseForQuestion = (questionId: number) => {
    return responses.find((r) => r.questionId === questionId);
  };

  const renderResponse = (question: Question, response?: Response) => {
    if (!response) return <span style={{ color: '#718096' }}>No response</span>;

    switch (question.questionType) {
      case 'rating_scale':
        return <strong>{response.ratingValue}</strong>;
      case 'multi_select':
        return <strong>{response.selectedOptions?.join(', ')}</strong>;
      case 'descriptive':
        return <p style={{ marginTop: '0.5rem' }}>{response.textResponse}</p>;
      default:
        return <strong>{response.selectedOption}</strong>;
    }
  };

  if (loading) return <div className="loading">Loading assessment details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assessment) return <div className="error">Assessment not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{assessment.title}</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/assessments/${id}/take`} className="btn btn-success">
            Take Assessment
          </Link>
          <button onClick={() => navigate('/assessments')} className="btn btn-secondary">
            Back to List
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Assessment Information</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <strong>Type:</strong> {assessment.assessmentType}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className={`status-badge status-${assessment.status}`}>
                {assessment.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <strong>Scheduled Date:</strong>{' '}
              {new Date(assessment.scheduledDate).toLocaleString()}
            </div>
            {assessment.completedDate && (
              <div>
                <strong>Completed Date:</strong>{' '}
                {new Date(assessment.completedDate).toLocaleString()}
              </div>
            )}
            {assessment.description && (
              <div>
                <strong>Description:</strong>
                <p style={{ marginTop: '0.25rem', color: '#718096' }}>
                  {assessment.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Patient & Psychologist</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {patient && (
              <>
                <div>
                  <strong>Patient:</strong> {`${patient.firstName} ${patient.lastName}`}
                </div>
                <div>
                  <strong>Email:</strong> {patient.email || '-'}
                </div>
                <div>
                  <strong>Phone:</strong> {patient.phone || '-'}
                </div>
              </>
            )}
            {psychologist && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Psychologist:</strong>{' '}
                {`${psychologist.firstName} ${psychologist.lastName}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {assessment.chiefComplaint && (
        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Chief Complaint</h3>
          <p style={{ color: '#718096' }}>{assessment.chiefComplaint}</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>
            Questions & Responses ({questions.length})
          </h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {questions.map((question, index) => {
              const response = getResponseForQuestion(question.id!);
              return (
                <div
                  key={question.id}
                  style={{
                    padding: '1rem',
                    borderLeft: '4px solid #667eea',
                    backgroundColor: '#f7fafc',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Q{index + 1}:</strong> {question.questionText}
                    {question.isRequired && (
                      <span style={{ color: '#e53e3e', marginLeft: '0.5rem' }}>*</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
                    Type: {question.questionType.replace('_', ' ')}
                    {question.category && ` | Category: ${question.category}`}
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Response:</strong> {renderResponse(question, response)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <h3>No questions added yet</h3>
            <p>Questions can be added to this assessment</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;
