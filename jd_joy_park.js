"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var TS_USER_AGENTS_1 = __importDefault(require("./TS_USER_AGENTS"));
var $ = {};
var cookie = '', cookiesArr = [], res = '';
var joyId = [], workJoyInfoList = [];
var joyId1;
!(function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, taskVos, tasks, _i, tasks_1, t, arr, _a, arr_1, name_1, times, apTaskDetail, taskResult, awardRes, i_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, requireConfig()];
            case 1:
                _b.sent();
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < cookiesArr.length)) return [3 /*break*/, 21];
                cookie = cookiesArr[i];
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)[1]);
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = $.UserName;
                console.log("\n\u5F00\u59CB\u3010\u4EAC\u4E1C\u8D26\u53F7" + $.index + "\u3011" + ($.nickName || $.UserName) + "\n");
                return [4 /*yield*/, api('apTaskList', { "linkId": "LsQNxL7iWDlXUs6cFl-AAg" })];
            case 3:
                taskVos = _b.sent();
                tasks = taskVos.data;
                _i = 0, tasks_1 = tasks;
                _b.label = 4;
            case 4:
                if (!(_i < tasks_1.length)) return [3 /*break*/, 20];
                t = tasks_1[_i];
                if (!(t.taskTitle === '汪汪乐园签到')) return [3 /*break*/, 9];
                if (!(t.taskDoTimes === 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, api('apDoTask', { "taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg" })];
            case 5:
                res = _b.sent();
                console.log('签到:', res);
                return [4 /*yield*/, wait(1000)];
            case 6:
                _b.sent();
                return [4 /*yield*/, api('apTaskDrawAward', { "taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg" })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3 /*break*/, 19];
            case 9:
                if (!(t.taskTitle === '汪汪乐园浏览会场' || t.taskTitle === '汪汪乐园浏览商品')) return [3 /*break*/, 19];
                arr = ['汪汪乐园浏览会场', '汪汪乐园浏览商品'];
                _a = 0, arr_1 = arr;
                _b.label = 10;
            case 10:
                if (!(_a < arr_1.length)) return [3 /*break*/, 19];
                name_1 = arr_1[_a];
                if (t.taskDoTimes + 1 === t.taskLimitTimes || t.taskDoTimes === t.taskLimitTimes)
                    return [3 /*break*/, 18];
                times = name_1 === '汪汪乐园浏览会场' ? 5 : 10;
                return [4 /*yield*/, api('apTaskDetail', { "taskType": t.taskType, "taskId": t.id, "channel": 4, "linkId": "LsQNxL7iWDlXUs6cFl-AAg" })];
            case 11:
                res = _b.sent();
                apTaskDetail = void 0, taskResult = void 0, awardRes = void 0;
                console.log(res.data);
                i_1 = 0;
                _b.label = 12;
            case 12:
                if (!(i_1 < times)) return [3 /*break*/, 18];
                try {
                    apTaskDetail = res.data.taskItemList[i_1];
                }
                catch (e) {
                    return [3 /*break*/, 18];
                }
                console.log('apTaskDetail:', apTaskDetail);
                return [4 /*yield*/, api('apDoTask', { "taskType": t.taskType, "taskId": t.id, "channel": 4, "linkId": "LsQNxL7iWDlXUs6cFl-AAg", "itemId": encodeURIComponent(apTaskDetail.itemId) })];
            case 13:
                taskResult = _b.sent();
                console.log('doTask: ', JSON.stringify(taskResult));
                if (taskResult.errMsg === '任务已完成')
                    return [3 /*break*/, 18];
                console.log('等待中...');
                return [4 /*yield*/, wait(10000)];
            case 14:
                _b.sent();
                return [4 /*yield*/, api('apTaskDrawAward', { "taskType": t.taskType, "taskId": t.id, "linkId": "LsQNxL7iWDlXUs6cFl-AAg" })];
            case 15:
                awardRes = _b.sent();
                if (awardRes.success && awardRes.code === 0)
                    console.log(awardRes.data[0].awardGivenNumber);
                else
                    console.log('领取奖励出错:', JSON.stringify(awardRes));
                return [4 /*yield*/, wait(1000)];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17:
                i_1++;
                return [3 /*break*/, 12];
            case 18:
                _a++;
                return [3 /*break*/, 10];
            case 19:
                _i++;
                return [3 /*break*/, 4];
            case 20:
                i++;
                return [3 /*break*/, 2];
            case 21: return [2 /*return*/];
        }
    });
}); })();
function api(fn, body) {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post("https://api.m.jd.com/", "functionId=" + fn + "&body=" + JSON.stringify(body) + "&_t=" + Date.now() + "&appid=activities_platform", {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'User-Agent': TS_USER_AGENTS_1.default,
                            'Host': 'api.m.jd.com',
                            'Referer': 'https://joypark.jd.com/',
                            'Origin': 'https://joypark.jd.com',
                            'Cookie': cookie
                        }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
}
function joyList() {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("https://api.m.jd.com/?functionId=joyList&body={%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&_t=" + Date.now() + "&appid=activities_platform", {
                        headers: {
                            'host': 'api.m.jd.com',
                            'User-agent': TS_USER_AGENTS_1.default,
                            'cookie': cookie,
                            'origin': 'https://joypark.jd.com',
                            'referer': 'https://joypark.jd.com'
                        }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    resolve(data);
                    return [2 /*return*/];
            }
        });
    }); });
}
function wait(t) {
    return new Promise(function (e) { return setTimeout(e, t); });
}
function requireConfig() {
    return new Promise(function (resolve) {
        console.log('\n====================Hello World====================\n');
        console.log('开始获取配置文件\n');
        var jdCookieNode = require('./jdCookie.js');
        Object.keys(jdCookieNode).forEach(function (item) {
            if (jdCookieNode[item]) {
                cookiesArr.push(jdCookieNode[item]);
            }
        });
        console.log("\u5171" + cookiesArr.length + "\u4E2A\u4EAC\u4E1C\u8D26\u53F7\n");
        resolve(0);
    });
}
