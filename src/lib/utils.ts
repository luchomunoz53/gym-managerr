export function getPaymentStatus(dueDate: Date | string): {
  status: 'UP_TO_DATE' | 'EXPIRING_SOON' | 'OVERDUE';
  label: string;
  badgeClass: string;
} {
  const targetDate = new Date(dueDate);
  const today = new Date();
  
  // Normalizar a inicio del día
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'OVERDUE',
      label: `Vencido (${Math.abs(diffDays)}d)`,
      badgeClass: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
  }

  if (diffDays <= 5) {
    return {
      status: 'EXPIRING_SOON',
      label: `Vence en ${diffDays}d`,
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    };
  }

  return {
    status: 'UP_TO_DATE',
    label: 'Al día',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REC-${timestamp}-${randomSuffix}`;
}