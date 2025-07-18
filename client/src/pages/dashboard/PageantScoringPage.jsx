// client/src/pages/dashboard/PageantScoringPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faUsers,
  faArrowLeft,
  faClipboardList,
  faCheck,
  faTimes,
  faSave,
  faEdit,
  faEye,
  faChartBar,
  faDownload,
  faExclamationTriangle,
  faCrown,
  faMedal,
  faAward,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  TabNavigation, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  ActionButton 
} from '../../components/dashboard/common';

// Import CSS
// import '../../css/pageantScoring.css';

const PageantScoringPage = () => {
  const { pageantId } = useParams();
  const navigate = useNavigate();
  
  const [pageantData, setPageantData] = useState(null);
  const [participantsByAgeGroup, setParticipantsByAgeGroup] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [tempScores, setTempScores] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch pageant scoring data
  useEffect(() => {
    const fetchPageantScoringData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock API call - replace with actual API endpoint
        // const response = await fetch(`/api/scoring/pageant/${pageantId}/details`, ...)
        
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPageantData = {
          id: pageantId,
          name: 'Spring Beauty Pageant 2025',
          organization: 'Beauty Organization Inc.',
          categories: [
            { name: 'Evening Gown', maxScore: 10 },
            { name: 'Talent', maxScore: 10 },
            { name: 'Interview', maxScore: 10 },
            { name: 'Swimwear', maxScore: 10 }
          ],
          ageGroups: ['13 - 18 Years', '19 - 39 Years'],
          status: 'in-progress'
        };

        const mockParticipants = {
          '13 - 18 Years': [
            {
              participantId: 'p1',
              user: {
                firstName: 'Emma',
                lastName: 'Johnson',
                username: 'emmaj2010'
              },
              categories: [
                { category: 'Evening Gown', score: 8.5, notes: 'Great poise and elegance' },
                { category: 'Talent', score: 9.0, notes: 'Outstanding performance' },
                { category: 'Interview', score: 7.5, notes: 'Good responses, room for improvement' },
                { category: 'Swimwear', score: 0, notes: '' }
              ],
              ageGroup: '13 - 18 Years'
            },
            {
              participantId: 'p2',
              user: {
                firstName: 'Sophia',
                lastName: 'Davis',
                username: 'sophiad15'
              },
              categories: [
                { category: 'Evening Gown', score: 9.0, notes: 'Stunning presentation' },
                { category: 'Talent', score: 8.0, notes: 'Well prepared' },
                { category: 'Interview', score: 8.5, notes: 'Confident and articulate' },
                { category: 'Swimwear', score: 0, notes: '' }
              ],
              ageGroup: '13 - 18 Years'
            },
            {
              participantId: 'p3',
              user: {
                firstName: 'Ava',
                lastName: 'Taylor',
                username: 'ava_t2009'
              },
              categories: [
                { category: 'Evening Gown', score: 0, notes: '' },
                { category: 'Talent', score: 0, notes: '' },
                { category: 'Interview', score: 0, notes: '' },
                { category: 'Swimwear', score: 0, notes: '' }
              ],
              ageGroup: '13 - 18 Years'
            }
          ],
          '19 - 39 Years': [
            {
              participantId: 'p4',
              user: {
                firstName: 'Isabella',
                lastName: 'Martinez',
                username: 'bella_m'
              },
              categories: [
                { category: 'Evening Gown', score: 9.5, notes: 'Exceptional grace' },
                { category: 'Talent', score: 9.5, notes: 'Professional level' },
                { category: 'Interview', score: 9.0, notes: 'Very impressive' },
                { category: 'Swimwear', score: 8.5, notes: 'Strong confidence' }
              ],
              ageGroup: '19 - 39 Years'
            },
            {
              participantId: 'p5',
              user: {
                firstName: 'Mia',
                lastName: 'Anderson',
                username: 'mia_pageant'
              },
              categories: [
                { category: 'Evening Gown', score: 8.0, notes: 'Beautiful gown choice' },
                { category: 'Talent', score: 8.5, notes: 'Great stage presence' },
                { category: 'Interview', score: 0, notes: '' },
                { category: 'Swimwear', score: 0, notes: '' }
              ],
              ageGroup: '19 - 39 Years'
            }
          ]
        };

        setPageantData(mockPageantData);
        setParticipantsByAgeGroup(mockParticipants);
        
        // Set first age group as selected by default
        if (mockPageantData.ageGroups.length > 0) {
          setSelectedAgeGroup(mockPageantData.ageGroups[0]);
        }
        
      } catch (error) {
        console.error('Error fetching pageant scoring data:', error);
        setError('Failed to load pageant scoring data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (pageantId) {
      fetchPageantScoringData();
    }
  }, [pageantId]);

  // Calculate participant totals and rankings
  const calculateParticipantStats = (participant) => {
    const scoredCategories = participant.categories.filter(cat => cat.score > 0);
    const totalScore = scoredCategories.reduce((sum, cat) => sum + cat.score, 0);
    const avgScore = scoredCategories.length > 0 ? totalScore / scoredCategories.length : 0;
    const completedCategories = scoredCategories.length;
    const totalCategories = participant.categories.length;
    const completionPercentage = (completedCategories / totalCategories) * 100;
    
    return {
      totalScore: totalScore.toFixed(1),
      avgScore: avgScore.toFixed(1),
      completedCategories,
      totalCategories,
      completionPercentage: Math.round(completionPercentage)
    };
  };

  // Get participants sorted by average score for rankings
  const getSortedParticipants = (ageGroup) => {
    const participants = participantsByAgeGroup[ageGroup] || [];
    return participants
      .map(p => ({ ...p, stats: calculateParticipantStats(p) }))
      .sort((a, b) => parseFloat(b.stats.avgScore) - parseFloat(a.stats.avgScore));
  };

  // Handle score change
  const handleScoreChange = (participantId, category, field, value) => {
    const key = `${participantId}-${category}-${field}`;
    setTempScores(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get current score value (from temp scores or original data)
  const getCurrentScore = (participantId, category, field) => {
    const key = `${participantId}-${category}-${field}`;
    if (tempScores.hasOwnProperty(key)) {
      return tempScores[key];
    }
    
    // Find original value
    const participants = participantsByAgeGroup[selectedAgeGroup] || [];
    const participant = participants.find(p => p.participantId === participantId);
    const categoryData = participant?.categories.find(c => c.category === category);
    return categoryData?.[field] || (field === 'score' ? 0 : '');
  };

  // Save scores
  const saveScores = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Apply temp scores to actual data
      setParticipantsByAgeGroup(prev => {
        const updated = { ...prev };
        Object.entries(tempScores).forEach(([key, value]) => {
          const [participantId, category, field] = key.split('-');
          const ageGroupParticipants = updated[selectedAgeGroup];
          if (ageGroupParticipants) {
            const participantIndex = ageGroupParticipants.findIndex(p => p.participantId === participantId);
            if (participantIndex !== -1) {
              const categoryIndex = ageGroupParticipants[participantIndex].categories.findIndex(c => c.category === category);
              if (categoryIndex !== -1) {
                ageGroupParticipants[participantIndex].categories[categoryIndex][field] = field === 'score' ? parseFloat(value) || 0 : value;
              }
            }
          }
        });
        return updated;
      });
      
      setTempScores({});
      setEditMode(false);
      setSuccessMessage('Scores saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving scores:', error);
      setError('Failed to save scores. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setTempScores({});
    setEditMode(false);
  };

  // Tab configuration for age groups
  const tabs = pageantData?.ageGroups.map(ageGroup => ({
    id: ageGroup,
    label: ageGroup,
    icon: faUsers,
    badge: participantsByAgeGroup[ageGroup]?.length || 0
  })) || [];

  if (loading) {
    return <LoadingSpinner text="Loading pageant scoring..." />;
  }

  if (error && !pageantData) {
    return <ErrorAlert message={error} />;
  }

  if (!pageantData) {
    return <EmptyState message="Pageant not found" />;
  }

  const currentParticipants = getSortedParticipants(selectedAgeGroup);

  return (
    <div className="pageant-scoring-page">
      <DashboardPageHeader 
        title={`Scoring: ${pageantData.name}`}
        subtitle={`Organization: ${pageantData.organization}`}
      >
        <div className="d-flex gap-2">
          <ActionButton
            variant="outline-secondary"
            icon={faArrowLeft}
            onClick={() => navigate('/organization-dashboard/scoring')}
          >
            Back to Dashboard
          </ActionButton>
          <ActionButton
            variant="outline-primary"
            icon={faChartBar}
            onClick={() => navigate(`/organization-dashboard/scoring/pageant/${pageantId}/results`)}
          >
            View Results
          </ActionButton>
        </div>
      </DashboardPageHeader>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show">
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorAlert message={error} dismissible onDismiss={() => setError(null)} />
      )}

      {/* Categories Overview */}
      <div className="card mb-4 categories-overview">
        <div className="card-header">
          <h5 className="card-title mb-0">Categories ({pageantData.categories.length})</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {pageantData.categories.map((category, index) => (
              <div key={index} className="col-md-3">
                <div className="category-card">
                  <div className="category-name">{category.name}</div>
                  <div className="category-max-score">Max Score: {category.maxScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Group Tabs */}
      <TabNavigation 
        tabs={tabs}
        activeTab={selectedAgeGroup}
        onTabChange={setSelectedAgeGroup}
      />

      {/* Scoring Actions */}
      <div className="card mb-4 scoring-actions">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Scoring Mode</h6>
              <small className="text-muted">
                {editMode ? 'Currently editing scores' : 'View-only mode'}
              </small>
            </div>
            <div className="d-flex gap-2">
              {!editMode ? (
                <ActionButton
                  variant="primary"
                  icon={faEdit}
                  onClick={() => setEditMode(true)}
                >
                  Edit Scores
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    variant="outline-secondary"
                    icon={faTimes}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    variant="success"
                    icon={faSave}
                    onClick={saveScores}
                    loading={saving}
                    disabled={saving || Object.keys(tempScores).length === 0}
                  >
                    Save Changes
                  </ActionButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participants Scoring Table */}
      {currentParticipants.length === 0 ? (
        <EmptyState 
          icon={faUsers}
          message={`No participants found in the ${selectedAgeGroup} age group.`}
          variant="info"
        />
      ) : (
        <div className="card scoring-table">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                {selectedAgeGroup} - {currentParticipants.length} Participants
              </h5>
              <div className="d-flex gap-2">
                <ActionButton
                  variant="outline-primary"
                  size="small"
                  icon={faDownload}
                  onClick={() => console.log('Export scores')}
                >
                  Export
                </ActionButton>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 scoring-table">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: '200px' }}>Participant</th>
                    {pageantData.categories.map((category, index) => (
                      <th key={index} className="text-center" style={{ minWidth: '150px' }}>
                        {category.name}
                        <br />
                        <small className="text-muted">Max: {category.maxScore}</small>
                      </th>
                    ))}
                    <th className="text-center" style={{ minWidth: '120px' }}>
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentParticipants.map((participant, index) => (
                    <tr key={participant.participantId}>
                      <td>
                        <div className="participant-info">
                          <div className="d-flex align-items-center">
                            <div className="ranking-badge me-3">
                              {index === 0 && participant.stats.avgScore > 0 && (
                                <FontAwesomeIcon icon={faCrown} className="text-warning" />
                              )}
                              {index === 1 && participant.stats.avgScore > 0 && (
                                <FontAwesomeIcon icon={faMedal} className="text-secondary" />
                              )}
                              {index === 2 && participant.stats.avgScore > 0 && (
                                <FontAwesomeIcon icon={faAward} className="text-bronze" />
                              )}
                              {(index > 2 || participant.stats.avgScore === 0) && (
                                <span className="ranking-number">{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <div className="fw-bold">
                                {participant.user.firstName} {participant.user.lastName}
                              </div>
                              <small className="text-muted">@{participant.user.username}</small>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {pageantData.categories.map((category, catIndex) => (
                        <td key={catIndex} className="text-center category-score-cell">
                          <div className="score-input-group">
                            {editMode ? (
                              <>
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-center score-input"
                                  min="0"
                                  max={category.maxScore}
                                  step="0.1"
                                  value={getCurrentScore(participant.participantId, category.name, 'score')}
                                  onChange={(e) => handleScoreChange(
                                    participant.participantId, 
                                    category.name, 
                                    'score', 
                                    e.target.value
                                  )}
                                  placeholder="0.0"
                                />
                                <textarea
                                  className="form-control form-control-sm mt-1 notes-input"
                                  rows="2"
                                  placeholder="Notes..."
                                  value={getCurrentScore(participant.participantId, category.name, 'notes')}
                                  onChange={(e) => handleScoreChange(
                                    participant.participantId, 
                                    category.name, 
                                    'notes', 
                                    e.target.value
                                  )}
                                />
                              </>
                            ) : (
                              <>
                                <div className={`score-display ${getCurrentScore(participant.participantId, category.name, 'score') > 0 ? 'scored' : 'unscored'}`}>
                                  {getCurrentScore(participant.participantId, category.name, 'score') || '-'}
                                  {getCurrentScore(participant.participantId, category.name, 'score') > 0 && (
                                    <span className="score-max">/{category.maxScore}</span>
                                  )}
                                </div>
                                {getCurrentScore(participant.participantId, category.name, 'notes') && (
                                  <div className="notes-display">
                                    <small className="text-muted">
                                      {getCurrentScore(participant.participantId, category.name, 'notes')}
                                    </small>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      ))}
                      
                      <td className="text-center">
                        <div className="summary-stats">
                          <div className="avg-score">
                            <strong>{participant.stats.avgScore}</strong>
                            <small className="text-muted d-block">Average</small>
                          </div>
                          <div className="completion-indicator mt-2">
                            <div 
                              className={`progress progress-sm ${
                                participant.stats.completionPercentage === 100 ? 'complete' : 
                                participant.stats.completionPercentage >= 50 ? 'partial' : 'minimal'
                              }`}
                            >
                              <div 
                                className="progress-bar" 
                                style={{ width: `${participant.stats.completionPercentage}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {participant.stats.completedCategories}/{participant.stats.totalCategories} complete
                            </small>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {currentParticipants.length > 0 && (
        <div className="row mt-4 quick-stats">
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-value">{currentParticipants.length}</div>
              <div className="stat-label">Total Participants</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-value">
                {currentParticipants.filter(p => p.stats.completionPercentage === 100).length}
              </div>
              <div className="stat-label">Fully Scored</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-value">
                {currentParticipants.filter(p => p.stats.completionPercentage > 0 && p.stats.completionPercentage < 100).length}
              </div>
              <div className="stat-label">Partially Scored</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <div className="stat-value">
                {currentParticipants.filter(p => p.stats.completionPercentage === 0).length}
              </div>
              <div className="stat-label">Not Started</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageantScoringPage;