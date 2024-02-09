"use strict";
// 43d51b9aa6c1c264d43262622ce232c6
// 9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2
// https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "43d51b9aa6c1c264d43262622ce232c6",
    secretAccessKey: "9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2",
    endpoint: "https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com"
});
// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "launchpad",
        Key: fileName,
    }).promise();
    // console.log(response);
});
exports.uploadFile = uploadFile;
