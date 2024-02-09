import { S3 } from "aws-sdk";
import { dir } from "console";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "43d51b9aa6c1c264d43262622ce232c6",
    secretAccessKey: "9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2",
    endpoint: "https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com"
})

export async function downloadS3Folder(prefix: string){
    const allFiles = await s3.listObjectsV2({
        Bucket: "launchpad",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if(!Key){
                resolve("");
                return;
            }

            let finalOutputPath = path.join(__dirname, Key)
            finalOutputPath = finalOutputPath.replace(new RegExp('\\' + path.sep, 'g'), '/');
            const outputFile = fs.createWriteStream(finalOutputPath)
            let dirName = path.dirname(finalOutputPath)
            dirName = dirName.replace(new RegExp('\\' + path.sep, 'g'), '/');
            console.log(dirName)
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, {recursive: true});
            }

            s3.getObject({
                Bucket: "launchpad",
                Key
            }).createReadStream().pipe(outputFile)
            .on("finish", () => {
                console.log("Downloaded")
                resolve("")
            })
        })
    }) || []
    console.log("Awaiting")
    await Promise.all(allPromises?.filter(x => x !== undefined))
}


export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}


const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}


const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    let fN = fileName
    fN = fN.replace(new RegExp('\\' + path.sep, 'g'), '/');
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "launchpad",
        Key: fN,
    }).promise();
    console.log(response);
}