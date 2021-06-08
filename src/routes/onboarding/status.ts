import { onboardingSql } from '../../sql/';
import {
  Anforderungen,
  CrentStatusValue,
  StatusFunction,
  StatusItem,
  StatusResult,
} from '../../types/onboarding';
import { OnboardingStation } from '../../types/results';
import { onbDoneMail } from './mail';
import {
  getValue,
  isRequested,
  hardwareAnf,
  networkAnf,
  suggestion,
} from './statusHelper';

const { selectwithStationID, updStatus } = onboardingSql;

const status: StatusFunction = async (query, id) => {
  const qry = await query<OnboardingStation>(selectwithStationID, [id]);

  const [result] = qry.results;
  if (qry.isEmpty === true) return null;

  const anforderungen: Anforderungen = JSON.parse(result.anforderungen);

  const crent: {
    user: CrentStatusValue;
    pn: CrentStatusValue;
    kasse: CrentStatusValue;
  } =
    typeof result.crent === 'string' && result.crent[0] === '{'
      ? JSON.parse(result.crent)
      : { user: false, pn: false, kasse: false };

  const hardware = hardwareAnf(anforderungen);
  const network = networkAnf(anforderungen);

  const suggestions = suggestion(result.vorname, result.nachname);

  const statusArray: StatusItem[] = [
    {
      name: 'domain',
      value: getValue(result.domain),
      done: !!getValue(result.domain),
      label: 'Citrix',
      required: true,
      suggestion: suggestions.domain,
    },
    {
      name: 'mail',
      value: getValue(result.domain) ? `${result.domain}@starcar.de` : false,
      done: !!getValue(result.domain),
      label: 'E-Mail',
      required: true,
    },
    {
      name: 'crentuser',
      value: getValue(result.domain),
      done: !!getValue(result.domain),
      label: 'C-Rent Benutzer',
      required: true,
      stations: anforderungen.crentstat,
      suggestion: suggestions.crent,
    },
    {
      name: 'crentpn',
      value: getValue(crent.pn),
      done: !!getValue(crent.pn),
      label: 'C-Rent PN',
      required: true,
    },
    {
      name: 'crentkasse',
      value: getValue(crent.kasse),
      done: !!getValue(crent.kasse),
      label: 'Kassenkonto',
      required: isRequested(anforderungen.kasse),
    },
    {
      name: 'bitrix',
      value: getValue(result.bitrix),
      done: !!getValue(result.bitrix),
      label: 'Bitrix',
      required: true,
    },
    {
      name: 'docuware',
      value: getValue(result.docuware),
      done: !!getValue(result.docuware),
      label: 'Docuware',
      required: isRequested(anforderungen.docuware),
      workflow: anforderungen.workflow,
    },
    {
      name: 'qlik',
      value: getValue(result.qlik),
      done: !!getValue(result.qlik),
      label: 'Qlik',
      required: isRequested(anforderungen.qlik),
      stations: anforderungen.qlikstat,
      apps: anforderungen.qlikapps,
    },
    {
      name: 'hardware',
      value: getValue(result.hardware),
      done: !!getValue(result.hardware),
      label: 'Hardware',
      required: hardware.required,
      array: hardware.array,
    },
    {
      name: 'network',
      value: getValue(result.network),
      done: !!getValue(result.network),
      label: 'Netzwerk',
      required: network.required,
      array: network.array,
    },
  ];

  const statusResult: StatusResult = { ...result, statusArray };

  // wenn der MA in der DB noch status 0 hatte, jetzt also erst fertig ist
  if (result.status === false) {
    let isNotDone = false;
    for (const item of statusArray) {
      if (item.required === true && item.done !== true) {
        isNotDone = true;
        break;
      }
    }

    // wenn alle .done === true
    if (isNotDone === false) {
      statusResult.status = true;
      const qry2 = await query(updStatus, [id]);
      if (qry2.isUpdated === true) await onbDoneMail(statusResult);
    }
  }

  return statusResult;
};

export default status;
