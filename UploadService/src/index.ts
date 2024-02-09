import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import { generate } from "./util";
import { getAllFiles } from "./file";
import { uploadFile } from "./cf";
import { createClient } from "redis";

const publisher = createClient()
publisher.connect()

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    files.forEach(async file => {
        file = file.replace(new RegExp('\\' + path.sep, 'g'), '/');
        await uploadFile(file.slice(__dirname.length + 1), file);
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({
        id: id
    })
})

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);