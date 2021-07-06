"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionsWechsel = exports.stationsWechsel = exports.updateMitarbeiter = exports.getMa = exports.freigabe = exports.neuerMa = exports.alleMa = void 0;
const sql_1 = __importDefault(require("../../sql"));
const helper_1 = require("../../util/helper");
const mail_1 = require("./mail");
const status_1 = __importDefault(require("./status"));
const alleMa = async (req, res) => {
    const { query, close } = res.database();
    const { user } = req.session;
    await res.catchError(async () => {
        const qry = await query(sql_1.default.onboarding.selJoinStation);
        await close();
        const authedMa = helper_1.onboardingAuthResult(user, qry.results, res.authStation);
        res.okmsg(authedMa);
    }, close);
};
exports.alleMa = alleMa;
const neuerMa = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const ersteller = req.session.user?.username ?? '';
        const values = req.body;
        const data = { ersteller, ...values };
        const qry = await query(sql_1.default.onboarding.ins, data);
        const qry2 = await query(sql_1.default.stationen.selName, [data.station]);
        await close();
        const [statname] = qry2.results;
        const mailData = {
            ...data,
            id: qry.id ?? 0,
            station_name: statname.name,
        };
        await mail_1.onbFreigabeMail(mailData);
        res.okmsg();
    }, close);
};
exports.neuerMa = neuerMa;
const freigabe = async (req, res) => {
    const { query, close } = res.database();
    const { id } = req.body;
    await res.catchError(async () => {
        const qry2 = await query(sql_1.default.onboarding.selJoinStationID, [id]);
        const [onboardingStation] = qry2.results;
        if (onboardingStation.anzeigen === true)
            return res.errmsg('Mitarbeiter ist schon freigegeben', 400);
        await query(sql_1.default.onboarding.updAnzeigen, [id]);
        await close();
        await mail_1.onbNeuMail(onboardingStation);
        res.okmsg();
    }, close);
};
exports.freigabe = freigabe;
const getMa = async (req, res) => {
    const { query, close } = res.database();
    const id = Number(req.params.id);
    await res.catchError(async () => {
        const maStatus = await status_1.default(query, id);
        await close();
        if (maStatus !== null)
            res.okmsg(maStatus);
        else
            res.errmsg('Status Query ist leer');
    }, close);
};
exports.getMa = getMa;
const updateDomain = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, domain } = req.body;
        if (domain === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updDomain, [domain, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
const updateBitrix = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, bitrix } = req.body;
        if (bitrix === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updBitrix, [bitrix, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
const updateCrent = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, crent } = req.body;
        if (crent === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updCrent, [crent, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
const updateDocuware = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, docuware } = req.body;
        if (docuware === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updDocuware, [docuware, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
const updateQlik = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, qlik } = req.body;
        if (qlik === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updQlik, [qlik, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
const updateNetwork = async (req, res, next) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, network } = req.body;
        if (network === undefined)
            return next();
        const qry = await query(sql_1.default.onboarding.updNetwork, [network, id]);
        await status_1.default(query, id);
        await close();
        if (qry.isUpdated === true)
            res.okmsg();
        else
            res.errmsg();
    }, close);
};
exports.updateMitarbeiter = [
    updateDomain,
    updateBitrix,
    updateCrent,
    updateDocuware,
    updateQlik,
    updateNetwork,
];
const stationsWechsel = async (req, res) => {
    await res.catchError(async () => {
        const { name, date, station, docuware } = req.body;
        const dw = helper_1.notEmptyString(docuware) ? docuware : undefined;
        const mailData = {
            name,
            date,
            station,
            docuware: dw,
            creator: req.session.user?.username ?? '',
        };
        await mail_1.statwMail(mailData);
        res.okmsg();
    });
};
exports.stationsWechsel = stationsWechsel;
const positionsWechsel = async (req, res) => {
    await res.catchError(async () => {
        const { name, date, position } = req.body;
        const mailData = {
            name,
            date,
            position,
            creator: req.session.user?.username ?? '',
        };
        await mail_1.poswMail(mailData);
        res.okmsg();
    });
};
exports.positionsWechsel = positionsWechsel;
