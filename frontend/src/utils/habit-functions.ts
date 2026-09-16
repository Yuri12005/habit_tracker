const dateFormatter = new Intl.DateTimeFormat('en-Us', {
  month: 'short',
  day: 'numeric',
});

const parseBackendDate = (dateStr: string) => {
  return new Date(dateStr);
};

export const formatDateSafely = (
  dateStr?: string | null,
  fallback: string = '-'
) => {
  if (!dateStr) return fallback;

  try {
    return dateFormatter.format(parseBackendDate(dateStr));
  } catch (error) {
    console.error('Error in formatting date:', dateStr, error);
    return fallback;
  }
};

export const isDeadlineWithinFiveDays = (dateStr?: string | null) => {
  if (!dateStr) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(dateStr);
  endDate.setHours(0, 0, 0, 0);

  const timeDifference = endDate.getTime() - today.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  return dayDifference >= 0 && dayDifference <= 5;
};

export const isExpired = (dateStr?: string | null) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(dateStr);
  endDate.setHours(0, 0, 0, 0);
  const timeDifference = endDate.getTime() - today.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  return dayDifference < 0;
};
