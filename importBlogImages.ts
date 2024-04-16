import Bun from "bun";
import { mkdir, exists } from "node:fs/promises";
import { resolve } from "node:path";

console.log();
console.log("Hello, World!");
console.log();

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class Log {
    sleepCount = 25;
    lineLength = 0;

    async clearLine() {
        const sleepDuration = this.sleepCount;
        process.stdout.cursorTo(0);
        process.stdout.write(" ".repeat(this.lineLength + 20));
        process.stdout.cursorTo(0);
        await sleep(sleepDuration);
    }

    async msg(msg: string) {
        if (this.lineLength > 0) {
            await this.clearLine();
        }
        process.stdout.write(msg);
        this.lineLength = msg.length;
        await sleep(this.sleepCount);
    }

    async next() {
        process.stdout.write("\n");
        await sleep(this.sleepCount);
        this.lineLength = 0;
    }
}

const downloadPath = "./src/assets/blog";
const downloadLocation = resolve(downloadPath);

console.log({ downloadLocation });

if (!(await exists(downloadLocation))) {
    await mkdir(downloadLocation);
}

const log = new Log();
const glob = new Bun.Glob("**/*.md");
const contentPath = "./src/content";

for await (const filePath of glob.scan(contentPath)) {
    const fullFilePath = [contentPath, filePath].join("/");
    console.log(`📔 Checking ${fullFilePath}`);
    const record = Bun.file(fullFilePath);

    await log.msg(`🔍 Reading File`);
    const contents = await record.text();
    await log.msg(`🔍 Looking for Images`);

    const images = Array.from(contents.matchAll(/!\[[^\]]*\]\((http.*?)\)/g)).map(
        (match) => match[1]
    );

    const coverImage = contents.match(/image:\s{1,}([^\s]+)/)?.[1];
    if (coverImage) {
        images.push(coverImage);
    }

    const urlsToDownload = images.filter((v) => String(v ?? "").length > 0);
    // .filter((v) => v.includes("blog.christophervachon.com"));

    await log.msg(
        `🔍 Found ${urlsToDownload.length} Image${urlsToDownload.length !== 1 ? "s" : ""}`
    );
    await log.next();

    for (const image of urlsToDownload) {
        let fileUlrName = (image.split("/").pop() ?? "").split("?")[0];

        if (String(fileUlrName).length === 0) {
            continue;
        } else if (!new RegExp("\\.\\w{1,}$").test(fileUlrName)) {
            if (image.includes("fm=jpg") || image.includes("fm=jpeg")) {
                fileUlrName += ".jpg";
            } else if (image.includes("fm=png")) {
                fileUlrName += ".png";
            } else if (image.includes("fm=webp")) {
                fileUlrName += ".webp";
            } else {
                fileUlrName += ".jpg";
            }
        }

        await log.msg(`🔍 Checking For ${fileUlrName}`);

        const writePath = resolve(downloadLocation, `./${fileUlrName}`);

        if (!(await Bun.file(writePath).exists())) {
            await log.msg(`🔄 Downloading ${image}`);

            const result = await fetch(image);
            await Bun.write(writePath, result);
            await log.msg(`✅ Downloaded ${fileUlrName}`);
        }

        await log.msg(`✍️ Updating Content File with New Path`);

        let fileContents = await Bun.file(fullFilePath).text();
        fileContents = fileContents.replace(image, `./../../assets/blog/${fileUlrName}`);

        await Bun.write(fullFilePath, fileContents);

        await log.msg(`✅ Migrated ${image}`);
        await log.next();
        console.log();
    }
    // console.log({ images });
    console.log();
}

console.log();
console.log("Work Complete");
console.log();
