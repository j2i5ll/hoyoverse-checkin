export const localeTimeText = (locale: string, date: string | Date) =>
  new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));

export const secondToCount = (second: number) => {
  const hour = Math.floor(second / 60 / 60);
  const min = `${Math.floor((second % (60 * 60)) / 60)}`.padStart(2, '0');
  const sec = `${second % 60}`.padStart(2, '0');
  return `${hour === 0 ? '' : `${hour}`.padStart(2, '0') + ':'}${min}:${sec}`;
};

export const diffDays = (date1: Date, date2: Date) => {
  /*
  const now = new Date();
  const futureDate = new Date(now.getTime() + seconds * 1000);
  */

  const startDate = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
  );
  const endDate = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
  );

  // 밀리초 단위 시간 차이 계산
  const diffTime = endDate.getTime() - startDate.getTime();

  // 일수로 변환
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays;
};

export const diffHours = (date1: Date, date2: Date) => {
  // 두 Date 객체의 시간 차이를 밀리초로 계산
  const timeDifference = Math.abs(date2.getTime() - date1.getTime());

  // 밀리초를 시간으로 변환
  const hourDifference = timeDifference / (1000 * 60 * 60);

  return hourDifference; // 시간 차이 반환
};

export const timeAgo = (date: string | Date, lang: string) => {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }); // 'ko'는 한국어 설정
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime(); // 밀리초 차이 계산

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  if (hours < 24) return rtf.format(-hours, 'hour');
  if (days < 30) return rtf.format(-days, 'day');
  if (months < 12) return rtf.format(-months, 'month');
  return rtf.format(-years, 'year');
};
