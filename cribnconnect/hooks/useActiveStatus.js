import api from '@/api/api';
import { useEffect, useState } from 'react';

/**
 * useActiveStatus Hook
 * Fetches and monitors active status for a user or group
 * Can be used for real-time status updates (future socket.io integration)
 * 
 * @param {string} userId - The user ID to check status for
 * @param {boolean} enablePolling - Whether to poll for updates (default: false)
 * @param {number} pollingInterval - Polling interval in ms (default: 30000 - 30 seconds)
 */
export const useActiveStatus = (userId, enablePolling = false, pollingInterval = 30000) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!userId) return;
    
    try {
      const response = await api.get(`/users/${userId}/status`);
      setIsOnline(response.data.isOnline);
      setLastSeen(response.data.lastSeen);
    } catch (error) {
      console.error('Error fetching user status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    let interval;
    if (enablePolling && userId) {
      interval = setInterval(fetchStatus, pollingInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userId, enablePolling, pollingInterval]);

  return { isOnline, lastSeen, loading, refetch: fetchStatus };
};

/**
 * useGroupActiveMembers Hook
 * Fetches active members count for a group/linkup
 * 
 * @param {string} groupId - The group/linkup ID
 * @param {boolean} enablePolling - Whether to poll for updates
 */
export const useGroupActiveMembers = (groupId, enablePolling = false) => {
  const [activeCount, setActiveCount] = useState(0);
  const [activeMembers, setActiveMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveMembers = async () => {
    if (!groupId) return;
    
    try {
      const response = await api.get(`/api/linkups/${groupId}/active-members`);
      setActiveCount(response.data.count);
      setActiveMembers(response.data.members);
    } catch (error) {
      console.error('Error fetching active members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMembers();

    let interval;
    if (enablePolling && groupId) {
      // Poll every 60 seconds for group activity
      interval = setInterval(fetchActiveMembers, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [groupId, enablePolling]);

  return { activeCount, activeMembers, loading, refetch: fetchActiveMembers };
};
