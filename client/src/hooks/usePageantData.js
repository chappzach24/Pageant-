import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const usePageantData = () => {
  const { user } = useAuth();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParticipantData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/participants`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your pageant registrations');
      }

      const data = await response.json();
      
      if (data.success && data.participants) {
        setParticipations(data.participants);
      } else {
        throw new Error('Failed to get participation data from server');
      }
    } catch (err) {
      console.error('Error fetching pageant data:', err);
      setError('Failed to load your pageant data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchParticipantData();
    }
  }, [user]);

  const refetch = () => {
    fetchParticipantData();
  };

  return { participations, loading, error, refetch, setParticipations };
};