"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("../config");
const database = (req, res, next) => {
    res.database = () => {
        const connection = mysql_1.default.createConnection({
            ...config_1.db,
            typeCast: (field, nxt) => {
                if (field.type === 'TINY' && field.length === 1) {
                    return field.string() === '1';
                }
                return nxt();
            },
        });
        return {
            query(sql, args) {
                return new Promise((resolve, reject) => {
                    connection.query(sql, args, (error, results) => {
                        if (error)
                            reject(error);
                        else {
                            const selectString = sql.substring(0, 5);
                            const isSelect = selectString.toLowerCase() === 'select';
                            const array = Array.isArray(results) ? results : [];
                            const data = {
                                results: array,
                                isEmpty: array.length === 0,
                            };
                            const queryResult = isSelect
                                ? data
                                : {
                                    ...data,
                                    id: results?.insertId,
                                    isUpdated: results?.affectedRows > 0,
                                };
                            resolve(queryResult);
                        }
                    });
                });
            },
            close() {
                return new Promise((resolve, reject) => {
                    connection.end((error) => {
                        if (error)
                            reject(error);
                        else
                            resolve();
                    });
                });
            },
        };
    };
    next();
};
exports.default = database;
