import { useMemo } from 'react';

export const usePaymentData = (participations) => {
  const paymentStats = useMemo(() => {
    const totalSpent = participations
      .filter(p => p.paymentStatus === 'completed')
      .reduce((total, p) => total + p.paymentAmount, 0);

    const totalPending = participations
      .filter(p => p.paymentStatus === 'pending')
      .reduce((total, p) => total + p.paymentAmount, 0);

    const pendingCount = participations.filter(p => p.paymentStatus === 'pending').length;

    return {
      totalSpent,
      totalPending,
      pendingCount,
      totalRegistrations: participations.length
    };
  }, [participations]);

  const getPendingPayments = () => {
    return participations.filter(p => p.paymentStatus === 'pending');
  };

  const getCompletedPayments = () => {
    return participations.filter(p => p.paymentStatus === 'completed');
  };

  return {
    ...paymentStats,
    getPendingPayments,
    getCompletedPayments
  };
};