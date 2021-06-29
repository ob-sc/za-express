"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
const helper_1 = require("./util/helper");
const debug_1 = __importDefault(require("./util/debug"));
const testcfg_1 = require("./util/testcfg");
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    switch (error.code) {
        case 'EACCES':
            throw new Error(`Port ${config_1.port} braucht höheren Zugriff`);
        case 'EADDRINUSE':
            throw new Error(`Port ${config_1.port} wird bereits verwendet`);
        default:
            throw error;
    }
}
function onListening() {
    debug_1.default(`port ${config_1.port}`);
}
const cfg = testcfg_1.testConfig(process.env);
debug_1.default('server version', process.env.npm_package_version);
if (cfg.errors !== 0)
    debug_1.default(`keine cfg: ${cfg.string}`);
else
    debug_1.default('config geladen');
debug_1.default('node', process.version);
if (helper_1.isDev)
    debug_1.default('devmode');
app_1.default.set('port', config_1.port);
const server = helper_1.isDev
    ? http_1.default.createServer(app_1.default)
    : https_1.default.createServer({
        key: fs_1.default.readFileSync('/etc/nginx/ssl/key.pem'),
        cert: fs_1.default.readFileSync('/etc/nginx/ssl/certificate.pem'),
    }, app_1.default);
server.listen(config_1.port);
server.on('error', onError);
server.on('listening', onListening);
