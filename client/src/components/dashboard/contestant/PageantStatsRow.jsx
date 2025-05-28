import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory, 
  faMedal, 
  faTrophy, 
  faFire 
} from '@fortawesome/free-solid-svg-icons';
import { StatCard } from '../common';
import PropTypes from 'prop-types';

const PageantStatsRow = ({ 
  totalPageants, 
  firstPlaceWins, 
  podiumFinishes, 
  longestStreak 
}) => {
  const stats = [
    {
      icon: faHistory,
      value: totalPageants,
      label: 'Total Pageants'
    },
    {
      icon: faMedal,
      value: firstPlaceWins,
      label: 'First Place Wins'
    },
    {
      icon: faTrophy,
      value: podiumFinishes,
      label: 'Podium Finishes'
    },
    {
      icon: faFire,
      value: longestStreak,
      label: 'Longest Top-3 Streak'
    }
  ];

  return (
    <div className="stats-summary card mb-4">
      <div className="card-body">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div className="col-md-3" key={index}>
              <div className="stat-item">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PageantStatsRow.propTypes = {
  totalPageants: PropTypes.number.isRequired,
  firstPlaceWins: PropTypes.number.isRequired,
  podiumFinishes: PropTypes.number.isRequired,
  longestStreak: PropTypes.number.isRequired
};

export default PageantStatsRow;