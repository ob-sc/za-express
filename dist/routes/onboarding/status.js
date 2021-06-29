"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_1 = __importDefault(require("../../sql/"));
const mail_1 = require("./mail");
const statusHelper_1 = require("./statusHelper");
const status = async (query, id) => {
    const qry = await query(sql_1.default.onboarding.selJoinStationID, [id]);
    const [result] = qry.results;
    if (qry.isEmpty === true)
        return null;
    const anforderungen = JSON.parse(result.anforderungen);
    const crent = typeof result.crent === 'string' && result.crent[0] === '{'
        ? JSON.parse(result.crent)
        : { user: false, pn: false, kasse: false };
    const hardware = statusHelper_1.hardwareAnf(anforderungen);
    const network = statusHelper_1.networkAnf(anforderungen);
    const suggestions = statusHelper_1.suggestion(result.vorname, result.nachname);
    const statusArray = [
        {
            name: 'domain',
            value: statusHelper_1.getValue(result.domain),
            done: !!statusHelper_1.getValue(result.domain),
            label: 'Citrix',
            required: true,
            suggestion: suggestions.domain,
        },
        {
            name: 'crentuser',
            value: statusHelper_1.getValue(crent.user),
            done: !!statusHelper_1.getValue(crent.user),
            label: 'C-Rent Benutzer',
            required: true,
            stations: anforderungen.crentstat,
            suggestion: suggestions.crent,
        },
        {
            name: 'crentpn',
            value: statusHelper_1.getValue(crent.pn),
            done: !!statusHelper_1.getValue(crent.pn),
            label: 'C-Rent PN',
            required: true,
        },
        {
            name: 'crentkasse',
            value: statusHelper_1.getValue(crent.kasse),
            done: !!statusHelper_1.getValue(crent.kasse),
            label: 'Kassenkonto',
            required: statusHelper_1.isRequested(anforderungen.kasse),
        },
        {
            name: 'bitrix',
            value: statusHelper_1.getValue(result.bitrix),
            done: !!statusHelper_1.getValue(result.bitrix),
            label: 'Bitrix',
            required: true,
        },
        {
            name: 'docuware',
            value: statusHelper_1.getValue(result.docuware),
            done: !!statusHelper_1.getValue(result.docuware),
            label: 'Docuware',
            required: statusHelper_1.isRequested(anforderungen.docuware),
            workflow: anforderungen.workflow,
        },
        {
            name: 'qlik',
            value: statusHelper_1.getValue(result.qlik),
            done: !!statusHelper_1.getValue(result.qlik),
            label: 'Qlik',
            required: statusHelper_1.isRequested(anforderungen.qlik),
            stations: anforderungen.qlikstat,
            apps: anforderungen.qlikapps,
        },
        {
            name: 'network',
            value: statusHelper_1.getValue(result.network),
            done: !!statusHelper_1.getValue(result.network),
            label: 'Netzwerk',
            required: network.required,
            array: network.array,
        },
    ];
    const statusResult = { ...result, statusArray, hardware };
    if (result.status === false) {
        let isNotDone = false;
        for (const item of statusArray) {
            if (item.required === true && item.done !== true) {
                isNotDone = true;
                break;
            }
        }
        if (isNotDone === false) {
            statusResult.status = true;
            const qry2 = await query(sql_1.default.onboarding.updStatus, [id]);
            if (qry2.isUpdated === true) {
                await mail_1.onbDoneMail(statusResult);
                await mail_1.onbErstellerMail(statusResult);
            }
        }
    }
    return statusResult;
};
exports.default = status;
