export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
};

export const formatISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getYearOptions = (year: number): number[] => {
  const years = [];
  for (let i = year - 10; i <= year + 10; i++) {
    years.push(i);
  }
  return years;
};

export const generateCalendarGrid = (year: number, month: number): (Date | null)[][] => {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const grid: (Date | null)[][] = [];
  let day = 1;

  for (let i = 0; i < 6; i++) {
    const week: (Date | null)[] = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        week.push(null);
      } else if (day > daysInMonth) {
        week.push(null);
      } else {
        week.push(new Date(year, month, day));
        day++;
      }
    }
    grid.push(week);
    if (day > daysInMonth) break;
  }
  return grid;
}; 