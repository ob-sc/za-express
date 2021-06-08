import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { StatusResult } from './onboarding';

export type MailTemplate = (
  to: string | string[],
  subject: string,
  html: string
) => Promise<SMTPTransport.SentMessageInfo>;

export type ContentTemplate = (content: string) => string;

export type MailFunction<T> = (data: T) => Promise<void>;

export type WithStatusMail = (data: StatusResult) => Promise<void>;

export interface OnbFreigabeMailData {
  id: number;
  ersteller: string;
  eintritt: string;
  vorname: string;
  nachname: string;
  station_name: string;
  position: string;
}

export interface OnbPosWMailData {
  name: string;
  date: string;
  position: string;
  creator: string;
}

export interface StatWMailData {
  name: string;
  date: string;
  station: string;
  docuware: string;
  creator: string;
}

export interface ConfirmMailData {
  token: string;
  to: string;
}

export interface AccountInfoMail {
  user: string;
}
