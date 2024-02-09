import express from "express";
import { S3 } from "aws-sdk";
import path from "path";

const s3 = new S3({
    accessKeyId: "43d51b9aa6c1c264d43262622ce232c6",
    secretAccessKey: "9a47fb852afc14a89441e5f3870753e3ec3a1594db41f81cb84b5bdac849dee2",
    endpoint: "https://31eb04ba4414ee844d3f2b635554e48f.r2.cloudflarestorage.com"
})

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    let key= `dist/${id}${filePath}`
    key = key.replace(new RegExp('\\' + path.sep, 'g'), '/');
    console.log(key)
    const contents = await s3.getObject({
        Bucket: "launchpad",
        Key: key
    }).promise();
    
    console.log("HOST:"+host)
    console.log("ID:"+id)
    console.log("FILEPATH:"+filePath)
    console.log("KEY:"+`dist/${id}${filePath}`)
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    console.log(type)

    res.send(contents.Body);
})


app.listen(3001)