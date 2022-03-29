"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
exports.dateToIsoString = (date, trim = false) => {
    return date && date.toISOString().slice(0, -5) + 'Z';
};
exports.generateCredId = () => {
    return `urn:uuid:${uuid_1.v4()}`;
};
//# sourceMappingURL=util.js.map