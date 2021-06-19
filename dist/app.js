"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
const cors_1 = __importDefault(require("cors"));
const helper_1 = require("./util/helper");
const config_1 = require("./config");
const middleware_1 = require("./middleware/");
const routes_1 = require("./routes");
const testcfg_1 = require("./util/testcfg");
const debug_1 = __importDefault(require("./util/debug"));
const MySQLStore = express_mysql_session_1.default(express_session_1.default);
const sessionStore = new MySQLStore({ ...config_1.db, expiration: config_1.sess.cookie.maxAge });
const cfg = testcfg_1.testConfig(process.env);
if (cfg.errors !== 0)
    debug_1.default(`Keine cfg: ${cfg.string}`);
else
    debug_1.default('Config geladen');
const app = express_1.default();
app.set('trust proxy', 1);
app.use(cors_1.default({ origin: /starcar\.local$/, credentials: true }));
app.use(cookie_parser_1.default());
app.use(express_session_1.default({
    ...config_1.sess,
    store: sessionStore,
}));
app.use(morgan_1.default(helper_1.isDev ? 'dev' : 'short'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(middleware_1.response);
app.use(middleware_1.database);
app.use(middleware_1.catchError);
const apiRouter = express_1.default.Router();
app.use('/api', apiRouter);
apiRouter.use('/user', routes_1.user);
apiRouter.use('/auth', routes_1.auth);
apiRouter.use('/aushilfen', routes_1.aushilfen);
apiRouter.use('/angemeldet', routes_1.angemeldet);
apiRouter.use('/zeiten', routes_1.zeiten);
apiRouter.use('/onboarding', routes_1.onboarding);
apiRouter.use('/stationen', routes_1.stationen);
app.use(middleware_1.errorHandler);
app.use(middleware_1.notFound);
exports.default = app;
