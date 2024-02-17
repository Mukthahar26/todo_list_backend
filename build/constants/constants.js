"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALTCODE = exports.responseCodes = void 0;
exports.responseCodes = {
    ERROR: { code: "-1", message: "Error" },
    PASSWORDNOTMATCHED: {
        code: "-1",
        message: "Password and confirm not matched",
    },
    SUCCESS: { code: "00", message: "Success" },
    UPDATED: { code: "01", message: "Updated Successfully" },
    CREATED: { code: "02", message: "Created Successfully" },
    NORECORDSFOUND: { code: "03", message: "Records not found" },
    ALREADYEXIST: { code: "04", message: "Record already exist" },
    DELETED: { code: "05", message: "Record deleted" },
};
exports.SALTCODE = 13;
