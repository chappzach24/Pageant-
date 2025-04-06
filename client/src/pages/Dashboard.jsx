import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="dashboard-wrap min-vh-100 py-5">
      <div className="dashboard-contain u-container">
        <div className="dashboard-header mb-4">
          <h2 className="u-text-dark">Welcome, {user.firstName}!</h2>
          <p className="u-text-dark">Manage your pageants from this dashboard</p>
        </div>
        
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
              <h5>My Organizations</h5>
              <p className="u-text-dark">Create or manage your pageant organizations</p>
              <button className="btn btn-outline-dark">Manage Organizations</button>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
              <h5>My Pageants</h5>
              <p className="u-text-dark">Create or manage your pageant events</p>
              <button className="btn btn-outline-dark">Manage Pageants</button>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
              <h5>My Participations</h5>
              <p className="u-text-dark">View your pageant registrations</p>
              <button className="btn btn-outline-dark">View Registrations</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;