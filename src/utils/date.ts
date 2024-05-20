import dayjs from 'dayjs';

export const getCurrentDay = () => {
  return Math.floor(dayjs.utc().toDate().getTime() / 1000 / 60 / 60 / 24);
};
