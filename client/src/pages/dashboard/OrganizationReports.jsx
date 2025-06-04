// client/src/pages/dashboard/OrganizationReports.jsx
import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faDownload,
  faFileExport,
  faShare,
  faEnvelope,
  faPrint,
  faCalendarAlt,
  faFilter,
  faTrophy,
  faUsers,
  faDollarSign,
  faPercentage,
  faArrowTrendUp,
  faArrowTrendDown,
  faEye,
  faChartLine,
  faChartPie,
  faTable,
  faCalendarCheck,
  faUserPlus,
  faMoneyBillWave,
  faMedal,
  faAward,
  faMapMarkerAlt,
  faClock,
  faExclamationTriangle,
  faFileAlt,
  faSpinner,
  faStar
} from '@fortawesome/free-solid-svg-icons';

// Import reusable components
import { 
  DashboardPageHeader, 
  TabNavigation, 
  LoadingSpinner, 
  EmptyState,
  ErrorAlert,
  StatCard,
  ActionButton
} from '../../components/dashboard/common';

// Import utilities
import { formatCurrency, formatDate } from '../../utils';

// Import CSS
import '../../css/organizationReports.css';

const OrganizationReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedPageant, setSelectedPageant] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportingReport, setExportingReport] = useState(false);
  const [sharingReport, setSharingReport] = useState(false);

  // Mock data - in real app this would come from API
  const mockData = {
    pageants: [
      { _id: 'p1', name: 'Miss Spring Festival 2025', startDate: '2025-04-15', status: 'published' },
      { _id: 'p2', name: 'Teen Miss Summer 2025', startDate: '2025-06-20', status: 'published' },
      { _id: 'p3', name: 'Little Miss Sunshine 2025', startDate: '2025-08-10', status: 'draft' },
      { _id: 'p4', name: 'Miss Holiday Gala 2024', startDate: '2024-12-15', status: 'completed' },
      { _id: 'p5', name: 'Teen Miss Fall 2024', startDate: '2024-10-20', status: 'completed' }
    ],
    overviewStats: {
      totalPageants: 12,
      totalParticipants: 247,
      totalRevenue: 18650,
      averageParticipantsPerPageant: 20.6,
      completionRate: 94.2,
      registrationGrowth: 15.3,
      revenueGrowth: 23.7,
      participantSatisfaction: 4.7
    },
    monthlyData: [
      { month: 'Jan 2024', pageants: 2, participants: 45, revenue: 3375, registrations: 48 },
      { month: 'Feb 2024', pageants: 1, participants: 18, revenue: 1350, registrations: 19 },
      { month: 'Mar 2024', pageants: 2, participants: 38, revenue: 2850, registrations: 42 },
      { month: 'Apr 2024', pageants: 1, participants: 22, revenue: 1650, registrations: 25 },
      { month: 'May 2024', pageants: 2, participants: 41, revenue: 3075, registrations: 44 },
      { month: 'Jun 2024', pageants: 1, participants: 19, revenue: 1425, registrations: 20 },
      { month: 'Jul 2024', pageants: 0, participants: 0, revenue: 0, registrations: 0 },
      { month: 'Aug 2024', pageants: 1, participants: 25, revenue: 1875, registrations: 27 },
      { month: 'Sep 2024', pageants: 1, participants: 17, revenue: 1275, registrations: 18 },
      { month: 'Oct 2024', pageants: 1, participants: 22, revenue: 1650, registrations: 24 }
    ],
    participantDemographics: {
      ageGroups: [
        { ageGroup: '5 - 8 Years', count: 68, percentage: 27.5 },
        { ageGroup: '9 - 12 Years', count: 89, percentage: 36.0 },
        { ageGroup: '13 - 18 Years', count: 72, percentage: 29.1 },
        { ageGroup: '19 - 39 Years', count: 15, percentage: 6.1 },
        { ageGroup: '40+ Years', count: 3, percentage: 1.3 }
      ],
      locations: [
        { state: 'Ohio', count: 142, percentage: 57.5 },
        { state: 'Pennsylvania', count: 34, percentage: 13.8 },
        { state: 'Michigan', count: 28, percentage: 11.3 },
        { state: 'Indiana', count: 22, percentage: 8.9 },
        { state: 'West Virginia', count: 15, percentage: 6.1 },
        { state: 'Other', count: 6, percentage: 2.4 }
      ]
    },
    financialData: {
      totalRevenue: 18650,
      totalExpenses: 11280,
      netProfit: 7370,
      profitMargin: 39.5,
      averageEntryFee: 75.5,
      revenueBySource: [
        { source: 'Entry Fees', amount: 15725, percentage: 84.3 },
        { source: 'Sponsorships', amount: 2250, percentage: 12.1 },
        { source: 'Merchandise', amount: 675, percentage: 3.6 }
      ],
      expenseBreakdown: [
        { category: 'Venue', amount: 4500, percentage: 39.9 },
        { category: 'Judging', amount: 2820, percentage: 25.0 },
        { category: 'Awards/Prizes', amount: 1950, percentage: 17.3 },
        { category: 'Marketing', amount: 1350, percentage: 12.0 },
        { category: 'Administration', amount: 660, percentage: 5.8 }
      ]
    },
    topPageants: [
      {
        name: 'Miss Spring Festival 2025',
        participants: 42,
        revenue: 3150,
        satisfaction: 4.8,
        categories: ['Evening Gown', 'Talent', 'Interview', 'Swimwear'],
        completionRate: 97.6
      },
      {
        name: 'Teen Miss Summer 2025',
        participants: 38,
        revenue: 2850,
        satisfaction: 4.7,
        categories: ['Casual Wear', 'Talent', 'Interview'],
        completionRate: 94.7
      },
      {
        name: 'Little Miss Sunshine 2025',
        participants: 35,
        revenue: 2625,
        satisfaction: 4.9,
        categories: ['Photogenic', 'Talent', 'Personality'],
        completionRate: 100.0
      }
    ],
    registrationTrends: [
      { date: '2024-01-01', registrations: 5 },
      { date: '2024-01-15', registrations: 12 },
      { date: '2024-02-01', registrations: 8 },
      { date: '2024-02-15', registrations: 15 },
      { date: '2024-03-01', registrations: 18 },
      { date: '2024-03-15', registrations: 22 },
      { date: '2024-04-01', registrations: 19 },
      { date: '2024-04-15', registrations: 28 },
      { date: '2024-05-01', registrations: 25 },
      { date: '2024-05-15', registrations: 31 }
    ]
  };

  // Tab configuration
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: faChartBar
    },
    {
      id: 'financial',
      label: 'Financial Reports',
      icon: faDollarSign
    },
    {
      id: 'participants',
      label: 'Participant Analytics',
      icon: faUsers
    },
    {
      id: 'pageants',
      label: 'Pageant Performance',
      icon: faTrophy
    },
    {
      id: 'trends',
      label: 'Trends & Forecasting',
      icon: faArrowTrendUp
    }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Calculate filtered data based on selections
  const filteredData = useMemo(() => {
    // In a real app, this would filter based on dateRange and selectedPageant
    return mockData;
  }, [dateRange, selectedPageant]);

  // Export report function
  const exportReport = async (format, reportType) => {
    setExportingReport(true);
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create report data based on type
      let reportData = '';
      let filename = '';
      
      switch (reportType) {
        case 'overview':
          reportData = generateOverviewReport();
          filename = `pageant-overview-report-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'financial':
          reportData = generateFinancialReport();
          filename = `financial-report-${new Date().toISOString().split('T')[0]}`;
          break;
        case 'participants':
          reportData = generateParticipantReport();
          filename = `participant-analytics-${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          reportData = generateOverviewReport();
          filename = `pageant-report-${new Date().toISOString().split('T')[0]}`;
      }
      
      if (format === 'csv') {
        downloadCSV(reportData, `${filename}.csv`);
      } else if (format === 'pdf') {
        // In a real app, you'd generate a PDF
        alert('PDF export would be implemented with a library like jsPDF');
      } else if (format === 'excel') {
        // In a real app, you'd generate an Excel file
        alert('Excel export would be implemented with a library like xlsx');
      }
      
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export report. Please try again.');
    } finally {
      setExportingReport(false);
    }
  };

  // Generate CSV report data
  const generateOverviewReport = () => {
    const headers = [
      'Metric',
      'Value',
      'Period',
      'Growth Rate'
    ];
    
    const rows = [
      ['Total Pageants', mockData.overviewStats.totalPageants, dateRange, '+12.5%'],
      ['Total Participants', mockData.overviewStats.totalParticipants, dateRange, '+15.3%'],
      ['Total Revenue', formatCurrency(mockData.overviewStats.totalRevenue), dateRange, '+23.7%'],
      ['Avg Participants per Pageant', mockData.overviewStats.averageParticipantsPerPageant, dateRange, '+8.2%'],
      ['Completion Rate', `${mockData.overviewStats.completionRate}%`, dateRange, '+2.1%'],
      ['Participant Satisfaction', `${mockData.overviewStats.participantSatisfaction}/5.0`, dateRange, '+0.3%']
    ];
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const generateFinancialReport = () => {
    const headers = [
      'Category',
      'Amount',
      'Percentage',
      'Type'
    ];
    
    const revenueRows = mockData.financialData.revenueBySource.map(item => [
      item.source,
      formatCurrency(item.amount),
      `${item.percentage}%`,
      'Revenue'
    ]);
    
    const expenseRows = mockData.financialData.expenseBreakdown.map(item => [
      item.category,
      formatCurrency(item.amount),
      `${item.percentage}%`,
      'Expense'
    ]);
    
    const summaryRows = [
      ['Total Revenue', formatCurrency(mockData.financialData.totalRevenue), '100%', 'Summary'],
      ['Total Expenses', formatCurrency(mockData.financialData.totalExpenses), '100%', 'Summary'],
      ['Net Profit', formatCurrency(mockData.financialData.netProfit), `${mockData.financialData.profitMargin}%`, 'Summary']
    ];
    
    const allRows = [...summaryRows, ...revenueRows, ...expenseRows];
    
    return [headers.join(','), ...allRows.map(row => row.join(','))].join('\n');
  };

  const generateParticipantReport = () => {
    const headers = [
      'Category',
      'Segment',
      'Count',
      'Percentage'
    ];
    
    const ageGroupRows = mockData.participantDemographics.ageGroups.map(item => [
      'Age Group',
      item.ageGroup,
      item.count,
      `${item.percentage}%`
    ]);
    
    const locationRows = mockData.participantDemographics.locations.map(item => [
      'Location',
      item.state,
      item.count,
      `${item.percentage}%`
    ]);
    
    const allRows = [...ageGroupRows, ...locationRows];
    
    return [headers.join(','), ...allRows.map(row => row.join(','))].join('\n');
  };

  // Download CSV function
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share report function
  const shareReport = async (method) => {
    setSharingReport(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (method === 'email') {
        // In a real app, this would open email client or send via API
        const subject = `Pageant Analytics Report - ${new Date().toLocaleDateString()}`;
        const body = `Please find attached the pageant analytics report for the period: ${dateRange}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      } else if (method === 'link') {
        // Copy shareable link to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/reports/shared/${Date.now()}`);
        alert('Shareable link copied to clipboard!');
      }
      
    } catch (error) {
      console.error('Share error:', error);
      setError('Failed to share report. Please try again.');
    } finally {
      setSharingReport(false);
    }
  };

  return (
    <div className="organization-reports">
      <DashboardPageHeader 
        title="Reports & Analytics"
        subtitle="Comprehensive insights and performance metrics for your pageants"
      >
        <div className="d-flex gap-2">
          <ActionButton
            variant="outline-primary"
            size="small"
            icon={faDownload}
            onClick={() => exportReport('csv', activeTab)}
            loading={exportingReport}
          >
            Export Report
          </ActionButton>
          <ActionButton
            variant="outline-secondary"
            size="small"
            icon={faShare}
            onClick={() => shareReport('link')}
            loading={sharingReport}
          >
            Share
          </ActionButton>
        </div>
      </DashboardPageHeader>

      {/* Filters Bar */}
      <div className="card mb-4 filters-card">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label mb-1">Date Range</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3">
              <label className="form-label mb-1">Pageant</label>
              <select
                className="form-select"
                value={selectedPageant}
                onChange={(e) => setSelectedPageant(e.target.value)}
              >
                <option value="all">All Pageants</option>
                {mockData.pageants.map(pageant => (
                  <option key={pageant._id} value={pageant._id}>
                    {pageant.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-6 d-flex justify-content-end align-items-end">
              <div className="btn-group export-options">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  disabled={exportingReport}
                >
                  {exportingReport ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                  ) : (
                    <FontAwesomeIcon icon={faFileExport} className="me-2" />
                  )}
                  Export Options
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => exportReport('csv', activeTab)}
                    >
                      <FontAwesomeIcon icon={faTable} className="me-2" />
                      Export as CSV
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => exportReport('pdf', activeTab)}
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => exportReport('excel', activeTab)}
                    >
                      <FontAwesomeIcon icon={faTable} className="me-2" />
                      Export as Excel
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => shareReport('email')}
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      Share via Email
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => shareReport('link')}
                    >
                      <FontAwesomeIcon icon={faShare} className="me-2" />
                      Generate Share Link
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item"
                      onClick={() => window.print()}
                    >
                      <FontAwesomeIcon icon={faPrint} className="me-2" />
                      Print Report
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} dismissible onDismiss={() => setError(null)} />}

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <LoadingSpinner text="Loading analytics..." />
      ) : (
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Key Metrics */}
              <div className="row g-4 mb-5">
                <div className="col-md-3">
                  <StatCard 
                    icon={faTrophy}
                    value={filteredData.overviewStats.totalPageants}
                    label="Total Pageants"
                    className="metric-card"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faUsers}
                    value={filteredData.overviewStats.totalParticipants}
                    label="Total Participants"
                    className="metric-card"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faDollarSign}
                    value={formatCurrency(filteredData.overviewStats.totalRevenue)}
                    label="Total Revenue"
                    className="metric-card"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faPercentage}
                    value={`${filteredData.overviewStats.completionRate}%`}
                    label="Completion Rate"
                    className="metric-card"
                  />
                </div>
              </div>

              {/* Growth Metrics */}
              <div className="card mb-4 growth-metrics">
                <div className="card-header">
                  <h5 className="card-title mb-0">Growth Metrics</h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="growth-item">
                        <div className="growth-label">Registration Growth</div>
                        <div className="growth-value positive">
                          <FontAwesomeIcon icon={faArrowTrendUp} className="me-2" />
                          +{filteredData.overviewStats.registrationGrowth}%
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="growth-item">
                        <div className="growth-label">Revenue Growth</div>
                        <div className="growth-value positive">
                          <FontAwesomeIcon icon={faArrowTrendUp} className="me-2" />
                          +{filteredData.overviewStats.revenueGrowth}%
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="growth-item">
                        <div className="growth-label">Avg. Participants</div>
                        <div className="growth-value">{filteredData.overviewStats.averageParticipantsPerPageant}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Performance Chart */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Monthly Performance Overview</h5>
                </div>
                <div className="card-body">
                  <div className="chart-placeholder">
                    <div className="chart-mock">
                      {/* Mock chart representation */}
                      <div className="chart-bars">
                        {filteredData.monthlyData.slice(-6).map((month, index) => (
                          <div key={index} className="chart-bar-group">
                            <div className="chart-label">{month.month.split(' ')[0]}</div>
                            <div className="chart-bars-container">
                              <div 
                                className="chart-bar revenue" 
                                style={{ height: `${(month.revenue / 4000) * 100}px` }}
                                title={`Revenue: ${formatCurrency(month.revenue)}`}
                              ></div>
                              <div 
                                className="chart-bar participants" 
                                style={{ height: `${(month.participants / 50) * 100}px` }}
                                title={`Participants: ${month.participants}`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <div className="legend-color revenue"></div>
                          <span>Revenue</span>
                        </div>
                        <div className="legend-item">
                          <div className="legend-color participants"></div>
                          <span>Participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Pageants */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Top Performing Pageants</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Pageant Name</th>
                          <th>Participants</th>
                          <th>Revenue</th>
                          <th>Satisfaction</th>
                          <th>Completion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.topPageants.map((pageant, index) => (
                          <tr key={index}>
                            <td>
                              <div className="fw-bold">{pageant.name}</div>
                              <small className="text-muted">
                                {pageant.categories.join(', ')}
                              </small>
                            </td>
                            <td>{pageant.participants}</td>
                            <td>{formatCurrency(pageant.revenue)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{pageant.satisfaction}/5.0</span>
                                <div className="rating-stars">
                                  {[...Array(5)].map((_, i) => (
                                    <FontAwesomeIcon 
                                      key={i}
                                      icon={faStar} 
                                      className={i < Math.floor(pageant.satisfaction) ? 'text-warning' : 'text-muted'}
                                    />
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${pageant.completionRate >= 95 ? 'bg-success' : 'bg-warning'}`}>
                                {pageant.completionRate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports Tab */}
          {activeTab === 'financial' && (
            <div className="financial-tab">
              {/* Financial Summary */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card financial-card revenue">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faDollarSign} size="2x" className="mb-3 text-success" />
                      <h3 className="text-success">{formatCurrency(filteredData.financialData.totalRevenue)}</h3>
                      <p className="mb-0">Total Revenue</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card financial-card expenses">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faMoneyBillWave} size="2x" className="mb-3 text-danger" />
                      <h3 className="text-danger">{formatCurrency(filteredData.financialData.totalExpenses)}</h3>
                      <p className="mb-0">Total Expenses</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card financial-card profit">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faArrowTrendUp} size="2x" className="mb-3 text-primary" />
                      <h3 className="text-primary">{formatCurrency(filteredData.financialData.netProfit)}</h3>
                      <p className="mb-0">Net Profit</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card financial-card margin">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faPercentage} size="2x" className="mb-3 text-info" />
                      <h3 className="text-info">{filteredData.financialData.profitMargin}%</h3>
                      <p className="mb-0">Profit Margin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue vs Expenses Breakdown */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Revenue Sources</h5>
                    </div>
                    <div className="card-body">
                      {filteredData.financialData.revenueBySource.map((source, index) => (
                        <div key={index} className="revenue-item mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{source.source}</span>
                            <span>{formatCurrency(source.amount)}</span>
                          </div>
                          <div className="progress">
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{source.percentage}% of total revenue</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Expense Breakdown</h5>
                    </div>
                    <div className="card-body">
                      {filteredData.financialData.expenseBreakdown.map((expense, index) => (
                        <div key={index} className="expense-item mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{expense.category}</span>
                            <span>{formatCurrency(expense.amount)}</span>
                          </div>
                          <div className="progress">
                            <div 
                              className="progress-bar bg-danger" 
                              style={{ width: `${expense.percentage}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{expense.percentage}% of total expenses</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Trends */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Financial Performance Trends</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Revenue</th>
                          <th>Participants</th>
                          <th>Avg. Fee</th>
                          <th>Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.monthlyData.slice(-6).map((month, index) => {
                          const avgFee = month.participants > 0 ? month.revenue / month.participants : 0;
                          const prevMonth = index > 0 ? filteredData.monthlyData.slice(-6)[index - 1] : null;
                          const growth = prevMonth && prevMonth.revenue > 0 
                            ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1)
                            : 0;
                          
                          return (
                            <tr key={index}>
                              <td>{month.month}</td>
                              <td>{formatCurrency(month.revenue)}</td>
                              <td>{month.participants}</td>
                              <td>{formatCurrency(avgFee)}</td>
                              <td>
                                <span className={`badge ${growth >= 0 ? 'bg-success' : 'bg-danger'}`}>
                                  {growth >= 0 ? '+' : ''}{growth}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Participant Analytics Tab */}
          {activeTab === 'participants' && (
            <div className="participants-tab">
              {/* Participant Overview */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <StatCard 
                    icon={faUsers}
                    value={filteredData.overviewStats.totalParticipants}
                    label="Total Participants"
                  />
                </div>
                <div className="col-md-4">
                  <StatCard 
                    icon={faUserPlus}
                    value={`+${filteredData.overviewStats.registrationGrowth}%`}
                    label="Registration Growth"
                  />
                </div>
                <div className="col-md-4">
                  <StatCard 
                    icon={faMedal}
                    value={`${filteredData.overviewStats.participantSatisfaction}/5.0`}
                    label="Avg. Satisfaction"
                  />
                </div>
              </div>

              {/* Demographics */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Age Group Distribution</h5>
                    </div>
                    <div className="card-body">
                      {filteredData.participantDemographics.ageGroups.map((group, index) => (
                        <div key={index} className="demographic-item mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{group.ageGroup}</span>
                            <span>{group.count} participants</span>
                          </div>
                          <div className="progress">
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${group.percentage}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{group.percentage}% of total participants</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Geographic Distribution</h5>
                    </div>
                    <div className="card-body">
                      {filteredData.participantDemographics.locations.map((location, index) => (
                        <div key={index} className="demographic-item mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted" />
                              {location.state}
                            </span>
                            <span>{location.count} participants</span>
                          </div>
                          <div className="progress">
                            <div 
                              className="progress-bar bg-info" 
                              style={{ width: `${location.percentage}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{location.percentage}% of total participants</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Trends */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Registration Trends</h5>
                </div>
                <div className="card-body">
                  <div className="registration-chart">
                    {/* Mock line chart */}
                    <div className="chart-container">
                      <div className="trend-line">
                        {filteredData.registrationTrends.map((point, index) => (
                          <div 
                            key={index}
                            className="trend-point"
                            style={{
                              left: `${(index / (filteredData.registrationTrends.length - 1)) * 100}%`,
                              bottom: `${(point.registrations / 35) * 100}%`
                            }}
                            title={`${formatDate(point.date)}: ${point.registrations} registrations`}
                          ></div>
                        ))}
                      </div>
                      <div className="chart-grid">
                        {[0, 10, 20, 30].map(value => (
                          <div key={value} className="grid-line" style={{ bottom: `${(value / 35) * 100}%` }}>
                            <span className="grid-label">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="trend-insights mt-3">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="insight-card">
                          <div className="insight-value">28</div>
                          <div className="insight-label">Peak Daily Registrations</div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="insight-card">
                          <div className="insight-value">15.3%</div>
                          <div className="insight-label">Monthly Growth Rate</div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="insight-card">
                          <div className="insight-value">3.2 days</div>
                          <div className="insight-label">Avg. Registration Lead Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pageant Performance Tab */}
          {activeTab === 'pageants' && (
            <div className="pageants-tab">
              {/* Performance Summary */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <StatCard 
                    icon={faTrophy}
                    value={filteredData.overviewStats.totalPageants}
                    label="Total Pageants"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faCalendarCheck}
                    value={`${filteredData.overviewStats.completionRate}%`}
                    label="Completion Rate"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faUsers}
                    value={filteredData.overviewStats.averageParticipantsPerPageant}
                    label="Avg. Participants"
                  />
                </div>
                <div className="col-md-3">
                  <StatCard 
                    icon={faAward}
                    value={`${filteredData.overviewStats.participantSatisfaction}/5.0`}
                    label="Avg. Satisfaction"
                  />
                </div>
              </div>

              {/* Pageant Performance Table */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Individual Pageant Performance</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Pageant Name</th>
                          <th>Status</th>
                          <th>Participants</th>
                          <th>Revenue</th>
                          <th>Completion Rate</th>
                          <th>Satisfaction</th>
                          <th>Categories</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockData.pageants.map((pageant, index) => {
                          const performance = mockData.topPageants.find(p => p.name === pageant.name) || {
                            participants: Math.floor(Math.random() * 30) + 10,
                            revenue: Math.floor(Math.random() * 2000) + 1000,
                            satisfaction: (Math.random() * 1.5 + 3.5).toFixed(1),
                            categories: ['Evening Gown', 'Talent'],
                            completionRate: (Math.random() * 20 + 80).toFixed(1)
                          };
                          
                          return (
                            <tr key={pageant._id}>
                              <td>
                                <div className="fw-bold">{pageant.name}</div>
                                <small className="text-muted">{formatDate(pageant.startDate)}</small>
                              </td>
                              <td>
                                <span className={`badge ${
                                  pageant.status === 'completed' ? 'bg-success' :
                                  pageant.status === 'published' ? 'bg-primary' :
                                  pageant.status === 'draft' ? 'bg-secondary' : 'bg-warning'
                                }`}>
                                  {pageant.status}
                                </span>
                              </td>
                              <td>{performance.participants}</td>
                              <td>{formatCurrency(performance.revenue)}</td>
                              <td>
                                <span className={`badge ${performance.completionRate >= 95 ? 'bg-success' : 'bg-warning'}`}>
                                  {performance.completionRate}%
                                </span>
                              </td>
                              <td>{performance.satisfaction}/5.0</td>
                              <td>
                                <small>{performance.categories.slice(0, 2).join(', ')}</small>
                                {performance.categories.length > 2 && (
                                  <small className="text-muted"> +{performance.categories.length - 2} more</small>
                                )}
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Popular Categories</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {[
                      { name: 'Evening Gown', count: 18, popularity: 85 },
                      { name: 'Talent', count: 16, popularity: 78 },
                      { name: 'Interview', count: 14, popularity: 70 },
                      { name: 'Swimwear', count: 12, popularity: 63 },
                      { name: 'Casual Wear', count: 10, popularity: 55 },
                      { name: 'Photogenic', count: 8, popularity: 45 }
                    ].map((category, index) => (
                      <div key={index} className="col-md-4">
                        <div className="category-performance-card">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{category.name}</span>
                            <span className="text-muted">{category.count} pageants</span>
                          </div>
                          <div className="progress mb-2">
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${category.popularity}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{category.popularity}% popularity</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends & Forecasting Tab */}
          {activeTab === 'trends' && (
            <div className="trends-tab">
              {/* Forecast Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card forecast-card positive">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faArrowTrendUp} size="2x" className="mb-3 text-success" />
                      <h4>+18%</h4>
                      <p className="mb-0">Projected Growth</p>
                      <small className="text-muted">Next Quarter</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card forecast-card">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faUsers} size="2x" className="mb-3 text-primary" />
                      <h4>285</h4>
                      <p className="mb-0">Projected Participants</p>
                      <small className="text-muted">Next Quarter</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card forecast-card">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faDollarSign} size="2x" className="mb-3 text-success" />
                      <h4>{formatCurrency(22800)}</h4>
                      <p className="mb-0">Projected Revenue</p>
                      <small className="text-muted">Next Quarter</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card forecast-card">
                    <div className="card-body text-center">
                      <FontAwesomeIcon icon={faTrophy} size="2x" className="mb-3 text-warning" />
                      <h4>4</h4>
                      <p className="mb-0">Planned Pageants</p>
                      <small className="text-muted">Next Quarter</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seasonal Trends */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Seasonal Performance Trends</h5>
                </div>
                <div className="card-body">
                  <div className="seasonal-chart">
                    {[
                      { season: 'Spring', participants: 89, revenue: 6675, growth: 15.2 },
                      { season: 'Summer', participants: 76, revenue: 5700, growth: 8.1 },
                      { season: 'Fall', participants: 52, revenue: 3900, growth: -2.3 },
                      { season: 'Winter', participants: 30, revenue: 2250, growth: 12.7 }
                    ].map((season, index) => (
                      <div key={index} className="seasonal-item">
                        <div className="season-header">
                          <h6>{season.season}</h6>
                          <span className={`growth-indicator ${season.growth >= 0 ? 'positive' : 'negative'}`}>
                            <FontAwesomeIcon icon={season.growth >= 0 ? faArrowTrendUp : faArrowTrendDown} />
                            {season.growth >= 0 ? '+' : ''}{season.growth}%
                          </span>
                        </div>
                        <div className="season-metrics">
                          <div className="metric">
                            <span className="value">{season.participants}</span>
                            <span className="label">Participants</span>
                          </div>
                          <div className="metric">
                            <span className="value">{formatCurrency(season.revenue)}</span>
                            <span className="label">Revenue</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card recommendations-card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Growth Opportunities</h5>
                    </div>
                    <div className="card-body">
                      <div className="recommendation-list">
                        <div className="recommendation-item">
                          <FontAwesomeIcon icon={faArrowTrendUp} className="recommendation-icon text-success" />
                          <div className="recommendation-content">
                            <div className="recommendation-title">Expand Spring Pageants</div>
                            <div className="recommendation-desc">Spring shows 15.2% growth - consider adding 2 more events</div>
                          </div>
                        </div>
                        <div className="recommendation-item">
                          <FontAwesomeIcon icon={faUsers} className="recommendation-icon text-primary" />
                          <div className="recommendation-content">
                            <div className="recommendation-title">Target Teen Demographics</div>
                            <div className="recommendation-desc">13-18 age group shows highest engagement rates</div>
                          </div>
                        </div>
                        <div className="recommendation-item">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="recommendation-icon text-info" />
                          <div className="recommendation-content">
                            <div className="recommendation-title">Geographic Expansion</div>
                            <div className="recommendation-desc">Consider events in Pennsylvania and Michigan markets</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card alerts-card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Performance Alerts</h5>
                    </div>
                    <div className="card-body">
                      <div className="alert-list">
                        <div className="alert-item warning">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon text-warning" />
                          <div className="alert-content">
                            <div className="alert-title">Fall Performance Decline</div>
                            <div className="alert-desc">2.3% decrease in fall registrations needs attention</div>
                          </div>
                        </div>
                        <div className="alert-item info">
                          <FontAwesomeIcon icon={faClock} className="alert-icon text-info" />
                          <div className="alert-content">
                            <div className="alert-title">Registration Lead Time</div>
                            <div className="alert-desc">Average lead time decreasing - consider early bird incentives</div>
                          </div>
                        </div>
                        <div className="alert-item success">
                          <FontAwesomeIcon icon={faMedal} className="alert-icon text-success" />
                          <div className="alert-content">
                            <div className="alert-title">High Satisfaction Scores</div>
                            <div className="alert-desc">4.7/5.0 average satisfaction - maintain current quality</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationReports;