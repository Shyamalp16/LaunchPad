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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFinalDist = exports.downloadS3Folder = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: "43d51b9aa6c1c264d43262622ce232c6",
    secretAccessKey: "9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2",
    endpoint: "https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com"
});
function downloadS3Folder(prefix) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const allFiles = yield s3.listObjectsV2({
            Bucket: "launchpad",
            Prefix: prefix
        }).promise();
        const allPromises = ((_a = allFiles.Contents) === null || _a === void 0 ? void 0 : _a.map(({ Key }) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                if (!Key) {
                    resolve("");
                    return;
                }
                let finalOutputPath = path_1.default.join(__dirname, Key);
                finalOutputPath = finalOutputPath.replace(new RegExp('\\' + path_1.default.sep, 'g'), '/');
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                let dirName = path_1.default.dirname(finalOutputPath);
                dirName = dirName.replace(new RegExp('\\' + path_1.default.sep, 'g'), '/');
                console.log(dirName);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                s3.getObject({
                    Bucket: "launchpad",
                    Key
                }).createReadStream().pipe(outputFile)
                    .on("finish", () => {
                    console.log("Downloaded");
                    resolve("");
                });
            }));
        }))) || [];
        console.log("Awaiting");
        yield Promise.all(allPromises === null || allPromises === void 0 ? void 0 : allPromises.filter(x => x !== undefined));
    });
}
exports.downloadS3Folder = downloadS3Folder;
function copyFinalDist(id) {
    const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
}
exports.copyFinalDist = copyFinalDist;
const getAllFiles = (folderPath) => {
    let response = [];
    const allFilesAndFolders = fs_1.default.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path_1.default.join(folderPath, file);
        if (fs_1.default.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
};
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(localFilePath);
    let fN = fileName;
    fN = fN.replace(new RegExp('\\' + path_1.default.sep, 'g'), '/');
    const response = yield s3.upload({
        Body: fileContent,
        Bucket: "launchpad",
        Key: fN,
    }).promise();
    console.log(response);
});
