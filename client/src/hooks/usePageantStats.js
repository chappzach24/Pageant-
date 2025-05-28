import { useMemo } from 'react';

export const usePageantStats = (pageants) => {
  const stats = useMemo(() => {
    const totalPageants = pageants.length;
    const firstPlaceWins = pageants.filter(p => p.overallPlacement === 1).length;
    const podiumFinishes = pageants.filter(p => p.overallPlacement <= 3).length;
    
    // Calculate longest streak of top-3 placements
    const calculateLongestStreak = () => {
      if (!pageants.length) return 0;
      
      const sortedPageants = [...pageants].sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
      );
      
      let currentStreak = 0;
      let longestStreak = 0;
      
      for (const pageant of sortedPageants) {
        if (pageant.overallPlacement && pageant.overallPlacement <= 3) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      return longestStreak;
    };

    return {
      totalPageants,
      firstPlaceWins,
      podiumFinishes,
      longestStreak: calculateLongestStreak()
    };
  }, [pageants]);

  return stats;
};