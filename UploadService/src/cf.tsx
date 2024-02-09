// 43d51b9aa6c1c264d43262622ce232c6
// 9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2
// https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com

import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "43d51b9aa6c1c264d43262622ce232c6",
    secretAccessKey: "9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2",
    endpoint: "https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com"
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "launchpad",
        Key: fileName,
    }).promise();
    // console.log(response);
}