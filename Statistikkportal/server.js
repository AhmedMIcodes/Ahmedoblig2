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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import fetch from "node-fetch";
var fetch = require("cross-fetch");
var app = express();
var PORT = 3000;
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.post("/getStatistics", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, variable_1, areaType, areas, years, dataPromises, data, flatData, median, average, max, min, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, variable_1 = _a.variable, areaType = _a.areaType, areas = _a.areas, years = _a.years;
                // Validate user inputs
                if (!variable_1 || !areaType || !areas || !years) {
                    return [2 /*return*/, res.status(400).json({ error: "Missing required parameters" })];
                }
                dataPromises = areas.map(function (area) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, json, variableData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch("https://data.ssb.no/api/v0/no/table/11342?var=".concat(variable_1, "&Region=").concat(area, "&Contents&BrukereKilder=S&format=json"))];
                            case 1:
                                response = _a.sent();
                                if (!response.ok) {
                                    throw new Error("API request failed with status ".concat(response.status));
                                }
                                return [4 /*yield*/, response.json()];
                            case 2:
                                json = _a.sent();
                                variableData = json.variables.find(function (v) { return v.code === variable_1; });
                                console.log(variableData);
                                return [2 /*return*/, variableData ? variableData.values : []];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(dataPromises)];
            case 1:
                data = _b.sent();
                flatData = data.flat();
                median = calculateMedian(flatData);
                average = calculateAverage(flatData);
                max = Math.max.apply(Math, flatData);
                min = Math.min.apply(Math, flatData);
                res.json({ median: median, average: average, max: max, min: min });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
function calculateMedian(data) {
    var sortedData = data.sort(function (a, b) { return a - b; });
    var mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
        return (sortedData[mid - 1] + sortedData[mid]) / 2;
    }
    else {
        return sortedData[mid];
    }
}
function calculateAverage(data) {
    var sum = data.reduce(function (acc, curr) { return acc + curr; }, 0);
    return sum / data.length;
}
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
