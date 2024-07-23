import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const TYPE_CMS = process.env.NEXT_PUBLIC_TYPE_CMS as TypeCMS;

export type TypeCMS = 'nilto' | 'microcms';

export const formatDate = (date: string) => {
  const utcDate = new Date(date);
  const jstDate = utcToZonedTime(utcDate, 'Asia/Tokyo');
  return format(jstDate, 'd MMMM, yyyy');
};
