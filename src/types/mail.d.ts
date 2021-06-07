import { StatusResult } from './onboarding';

export type WithStatusMail = (data: StatusResult) => Promise<void>;

export type OnbFreigabeMail = (data: {
  id: number;
  ersteller: string;
  eintritt: string;
  vorname: string;
  nachname: string;
  station_name: string;
  position: string;
}) => Promise<void>;
