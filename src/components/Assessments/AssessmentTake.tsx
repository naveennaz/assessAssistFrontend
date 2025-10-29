import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assessmentAPI, questionAPI, responseAPI } from '../../services/api';
import { Assessment, Question } from '../../types';

interface QuestionResponse {
  questionId: number;
  textResponse?: string;
  selectedOption?: string;
  selectedOptions?: string[];
  ratingValue?: number;
}

const AssessmentTake: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, QuestionResponse>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAssessment(parseInt(id));
    }
  }, [id]);

  const loadAssessment = async (assessmentId: number) => {
    try {
      setLoading(true);
      const [assessmentRes, questionsRes] = await Promise.all([
        assessmentAPI.getById(assessmentId),
        questionAPI.getByAssessment(assessmentId),
      ]);

      setAssessment(assessmentRes.data);
      setQuestions(questionsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assessment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextResponse = (questionId: number, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, textResponse: value });
    setAnswers(newAnswers);
  };

  const handleSingleSelect = (questionId: number, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, selectedOption: value });
    setAnswers(newAnswers);
  };

  const handleMultiSelect = (questionId: number, option: string, checked: boolean) => {
    const newAnswers = new Map(answers);
    const current = newAnswers.get(questionId);
    let selectedOptions = current?.selectedOptions || [];

    if (checked) {
      selectedOptions = [...selectedOptions, option];
    } else {
      selectedOptions = selectedOptions.filter((o) => o !== option);
    }

    newAnswers.set(questionId, { questionId, selectedOptions });
    setAnswers(newAnswers);
  };

  const handleRating = (questionId: number, value: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, { questionId, ratingValue: value });
    setAnswers(newAnswers);
  };

  const validateAnswers = (): boolean => {
    for (const question of questions) {
      if (question.isRequired && !answers.has(question.id!)) {
        alert(`Please answer: ${question.questionText}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAnswers()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Convert answers to response format
      const responses = Array.from(answers.values()).map((answer) => ({
        ...answer,
        assessmentId: parseInt(id!),
      }));

      // Submit all responses in bulk
      await responseAPI.createBulk(responses);

      // Update assessment status to completed
      await assessmentAPI.update(parseInt(id!), {
        status: 'completed',
        completedDate: new Date().toISOString(),
      });

      alert('Assessment submitted successfully!');
      navigate(`/assessments/${id}`);
    } catch (err) {
      setError('Failed to submit assessment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers.get(question.id!);

    switch (question.questionType) {
      case 'descriptive':
        return (
          <textarea
            className="form-textarea"
            value={answer?.textResponse || ''}
            onChange={(e) => handleTextResponse(question.id!, e.target.value)}
            placeholder="Type your answer here..."
            required={question.isRequired}
          />
        );

      case 'single_select':
      case 'multiple_choice':
      case 'yes_no':
        return (
          <div className="question-options">
            {question.options?.map((option) => (
              <label key={option} className="question-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer?.selectedOption === option}
                  onChange={(e) => handleSingleSelect(question.id!, e.target.value)}
                  required={question.isRequired}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'multi_select':
        return (
          <div className="question-options">
            {question.options?.map((option) => (
              <label key={option} className="question-option">
                <input
                  type="checkbox"
                  checked={answer?.selectedOptions?.includes(option) || false}
                  onChange={(e) =>
                    handleMultiSelect(question.id!, option, e.target.checked)
                  }
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'rating_scale':
        const min = question.minRating || 1;
        const max = question.maxRating || 10;
        const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        return (
          <div>
            <div className="rating-scale">
              {ratings.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`rating-button ${
                    answer?.ratingValue === rating ? 'selected' : ''
                  }`}
                  onClick={() => handleRating(question.id!, rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
              {min} = Lowest, {max} = Highest
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) return <div className="loading">Loading assessment...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assessment) return <div className="error">Assessment not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Take Assessment: {assessment.title}</h1>
        <button onClick={() => navigate(`/assessments/${id}`)} className="btn btn-secondary">
          Cancel
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No questions available</h3>
            <p>This assessment doesn't have any questions yet.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div style={{ marginBottom: '1rem', color: '#718096' }}>
              Answer all required questions marked with *
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#667eea', fontWeight: 600 }}>
                      Question {index + 1}
                      {question.category && ` - ${question.category}`}
                    </div>
                    <div className="question-text">
                      {question.questionText}
                      {question.isRequired && (
                        <span className="question-required"> *</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>{renderQuestion(question)}</div>
              </div>
            ))}

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/assessments/${id}`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssessmentTake;
