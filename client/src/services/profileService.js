// client/src/services/profileService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get contestant profile data
 * @returns {Promise} Profile data
 */
export const getContestantProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contestant-profiles/complete`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting contestant profile:', error);
    throw error;
  }
};

/**
 * Update contestant profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Updated profile
 */
export const updateContestantProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/contestant-profiles`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating contestant profile:', error);
    throw error;
  }
};

/**
 * Get profile completeness percentage
 * @returns {Promise} Completeness percentage
 */
export const getProfileCompleteness = async () => {
  try {
    const response = await fetch(`${API_URL}/api/contestant-profiles/completeness`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile completeness');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting profile completeness:', error);
    throw error;
  }
};