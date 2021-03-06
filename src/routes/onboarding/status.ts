import sqlStrings from '../../sql/';
import {
  Anforderungen,
  CrentStatusValue,
  StatusFunction,
  StatusItem,
  StatusResult,
} from '../../../za-types/server/onboarding';
import { OnboardingStation } from '../../../za-types/server/results';
import { onbDoneMail, onbErstellerMail } from './mail';
import { getValue, hardwareAnf, isRequested, networkAnf, suggestion } from './statusHelper';

const status: StatusFunction = async (query, id) => {
  const qry = await query<OnboardingStation>(sqlStrings.onboarding.selJoinStationID, [id]);

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
      name: 'crentuser',
      value: getValue(crent.user),
      done: !!getValue(crent.user),
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
      name: 'network',
      value: getValue(result.network),
      done: !!getValue(result.network),
      label: 'Netzwerk',
      required: network.required,
      array: network.array,
    },
  ];

  const statusResult: StatusResult = { ...result, statusArray, hardware };

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
      const qry2 = await query(sqlStrings.onboarding.updStatus, [id]);
      if (qry2.isUpdated === true) {
        await onbDoneMail(statusResult);
        await onbErstellerMail(statusResult);
      }
    }
  }

  return statusResult;
};

export default status;
