"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestion = exports.networkAnf = exports.hardwareAnf = exports.isRequested = exports.getValue = void 0;
const helper_1 = require("../../util/helper");
const getValue = (value) => {
    if (typeof value === 'string')
        return value !== '' ? value : false;
    return value === true;
};
exports.getValue = getValue;
const isRequested = (value) => exports.getValue(value) === true || helper_1.notEmptyString(value);
exports.isRequested = isRequested;
const hardwareAnf = (anf) => {
    let required = false;
    const array = [];
    const pushHardware = (label, value) => {
        array.push({ label, value });
        required = true;
    };
    if (anf.handy === true)
        pushHardware('Handy', anf.handy);
    if (anf.laptop === true)
        pushHardware('Laptop', anf.laptop);
    if (anf.pc === true)
        pushHardware('Computer', anf.pc);
    if (helper_1.notEmptyString(anf.monitore))
        pushHardware('Monitore', anf.monitore);
    if (anf.ipad === true)
        pushHardware('iPad', anf.ipad);
    if (helper_1.notEmptyString(anf.ipadspez))
        pushHardware('iPad spez.', anf.ipadspez);
    if (anf.drucker === true)
        pushHardware('Drucker', anf.drucker);
    if (anf.tanken === true)
        pushHardware('Tankkarte', anf.tanken);
    if (helper_1.notEmptyString(anf.freigabe))
        pushHardware('Freigabe', anf.freigabe);
    if (helper_1.notEmptyString(anf.sonstiges))
        pushHardware('Sonstiges', anf.sonstiges);
    return {
        required,
        array,
    };
};
exports.hardwareAnf = hardwareAnf;
const networkAnf = (anf) => {
    let required = false;
    const array = [];
    const pushNetwork = (label, value) => {
        array.push({ label, value });
        required = true;
    };
    if (anf.vpn === true)
        pushNetwork('VPN', anf.vpn);
    if (helper_1.notEmptyString(anf.verteiler))
        pushNetwork('Verteiler', anf.verteiler);
    if (helper_1.notEmptyString(anf.netzdrucker))
        pushNetwork('Drucker', anf.netzdrucker);
    if (helper_1.notEmptyString(anf.stddrucker))
        pushNetwork('Standard Drucker', anf.stddrucker);
    return {
        required,
        array,
    };
};
exports.networkAnf = networkAnf;
const suggestion = (vorname, nachname) => {
    const vor = vorname.trim();
    const nach = nachname.trim();
    const name = { vorname: '', nachname: '' };
    name.vorname = vor.replace(' ', '-');
    name.nachname = nach.replace(' ', '-');
    const domain = `${name.vorname}.${name.nachname}`;
    const crent = `${name.vorname[0]}${name.nachname}`;
    return { domain: domain.toLowerCase(), crent: crent.toUpperCase() };
};
exports.suggestion = suggestion;
