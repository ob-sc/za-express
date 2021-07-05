"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardingAuthResult = exports.parseStringArray = exports.scEmail = exports.spaces = exports.checkArray = exports.checkObject = exports.notEmptyString = exports.toLocalDate = exports.prepend0 = exports.erstellerString = exports.capitalize = exports.isDev = void 0;
exports.isDev = process.env.NODE_ENV === 'development';
const capitalize = (str) => str[0].toUpperCase() + str.substring(1);
exports.capitalize = capitalize;
const erstellerString = (str) => {
    if (str.indexOf('.') === -1)
        return str;
    const creatorArray = str.split('.');
    let [vorname, nachname] = creatorArray;
    if (vorname.indexOf('-') !== -1) {
        const vorArray = vorname.split('-');
        vorname = `${exports.capitalize(vorArray[0])} ${exports.capitalize(vorArray[1])}`;
    }
    else
        vorname = exports.capitalize(vorname);
    if (nachname.indexOf('-') !== -1) {
        const nachArray = nachname.split('-');
        nachname = `${exports.capitalize(nachArray[0])} ${exports.capitalize(nachArray[1])}`;
    }
    else
        nachname = exports.capitalize(nachname);
    return `${vorname} ${nachname}`;
};
exports.erstellerString = erstellerString;
const prepend0 = (num) => num.toString().padStart(2, '0');
exports.prepend0 = prepend0;
const toLocalDate = (str) => {
    const date = new Date(str);
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return `${exports.prepend0(d)}.${exports.prepend0(m + 1)}.${y}`;
};
exports.toLocalDate = toLocalDate;
const notEmptyString = (value) => typeof value === 'string' && value !== '';
exports.notEmptyString = notEmptyString;
const checkObject = (obj) => typeof obj === 'object' && obj !== null;
exports.checkObject = checkObject;
const checkArray = (arr) => Array.isArray(arr);
exports.checkArray = checkArray;
const spaces = (params) => {
    let statement = '';
    const len = params.length;
    let i = 0;
    while (i < len) {
        statement += `${params[i]} `;
        i++;
    }
    return statement.trim();
};
exports.spaces = spaces;
const scEmail = (user) => `${user}@starcar.de`;
exports.scEmail = scEmail;
const parseStringArray = (string) => {
    if (!string)
        return [];
    const array = string.split(',');
    const result = [];
    for (let index = 0; index < array.length; index++) {
        const str = array[index];
        result.push(str !== '*' ? Number(str) : str);
    }
    return result;
};
exports.parseStringArray = parseStringArray;
const onboardingAuthResult = (user, results, authFn) => {
    const authed = [];
    for (const r of results) {
        const isAdmin = user?.admin === true;
        const isReleased = r.anzeigen === true;
        const isOwn = user?.username === r.ersteller;
        const hasStation = authFn(r.station);
        if (isAdmin || (isReleased && (isOwn || hasStation)))
            authed.push(r);
    }
    return authed;
};
exports.onboardingAuthResult = onboardingAuthResult;
