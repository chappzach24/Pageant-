import { useState, useMemo } from 'react';

export const usePageantFilters = (pageants, type = 'all') => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Filter pageants based on type (upcoming, active, past)
  const typeFilteredPageants = useMemo(() => {
    const now = new Date();
    
    switch (type) {
      case 'upcoming':
        return pageants.filter(p => {
          const startDate = new Date(p.startDate || p.pageant?.startDate);
          return startDate > now;
        });
      case 'active':
        return pageants.filter(p => {
          const startDate = new Date(p.startDate || p.pageant?.startDate);
          const endDate = new Date(p.endDate || p.pageant?.endDate);
          return startDate <= now && endDate >= now;
        });
      case 'past':
        return pageants.filter(p => {
          const endDate = new Date(p.endDate || p.pageant?.endDate);
          return endDate < now;
        });
      default:
        return pageants;
    }
  }, [pageants, type]);

  // Apply search and other filters
  const filteredPageants = useMemo(() => {
    let filtered = [...typeFilteredPageants];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => {
        const pageant = p.pageant || p;
        return (
          pageant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof pageant.organization === 'string' && pageant.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof pageant.organization === 'object' && pageant.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pageant.location?.venue && pageant.location.venue.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
    
    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(p => {
        const pageant = p.pageant || p;
        const year = new Date(pageant.startDate).getFullYear();
        return year === parseInt(filterYear);
      });
    }
    
    // Sort
    if (sortOption === 'newest') {
      filtered.sort((a, b) => {
        const dateA = new Date((a.pageant || a).endDate || (a.pageant || a).startDate);
        const dateB = new Date((b.pageant || b).endDate || (b.pageant || b).startDate);
        return dateB - dateA;
      });
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => {
        const dateA = new Date((a.pageant || a).endDate || (a.pageant || a).startDate);
        const dateB = new Date((b.pageant || b).endDate || (b.pageant || b).startDate);
        return dateA - dateB;
      });
    } else if (sortOption === 'placement') {
      filtered.sort((a, b) => {
        const placementA = (a.pageant || a).overallPlacement || 999;
        const placementB = (b.pageant || b).overallPlacement || 999;
        return placementA - placementB;
      });
    }
    
    return filtered;
  }, [typeFilteredPageants, searchTerm, filterYear, sortOption]);

  // Get unique years for filter dropdown
  const availableYears = useMemo(() => {
    if (typeFilteredPageants.length === 0) return [];
    
    const years = typeFilteredPageants.map(p => {
      const pageant = p.pageant || p;
      return new Date(pageant.startDate).getFullYear();
    });
    return [...new Set(years)].sort((a, b) => b - a);
  }, [typeFilteredPageants]);

  return {
    searchTerm,
    setSearchTerm,
    filterYear,
    setFilterYear,
    sortOption,
    setSortOption,
    filteredPageants,
    availableYears
  };
};