import { DateStr, TimeStr } from './types';

// angemeldet

// todo req.body ? sollte dann nicht string statt number? dann geht es nicht mit usersession

export interface AnmeldenRequest {
  ahid: number;
  date: DateStr;
  start: TimeStr;
  station: number;
}
