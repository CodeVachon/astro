import Bun from "bun";

class Log {
    sleepCount = 25;
    lineLength = 0;

    async clearLine() {
        const sleepDuration = this.sleepCount * Math.ceil(this.lineLength / 1);
        // process.stdout.clearLine(0);
        // await sleep(sleepDuration);
        process.stdout.cursorTo(0);
        await sleep(sleepDuration);
    }

    async msg(msg: string) {
        this.clearLine();
        process.stdout.write(msg);
        this.lineLength = msg.length;
        await sleep(this.sleepCount);
    }

    async next() {
        process.stdout.write("\n");
        await sleep(this.sleepCount);
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const brokenLinks: Record<string, Array<{ url: string; error: Error }>> = {};
const log = new Log();
const glob = new Bun.Glob("**/*.md");
const contentPath = "./src/content";
for await (const filePath of glob.scan(contentPath)) {
    const fullFilePath = [contentPath, filePath].join("/");
    console.log(`📔 Checking ${fullFilePath}`);
    const record = Bun.file(fullFilePath);

    await log.msg(`🔍 Reading File`);
    const contents = await record.text();
    await log.msg(`🔍 Looking for Links`);
    const links = Array.from(
        contents.match(new RegExp(`(https?:)\\/{2}[^\\s\\'")]+`, "gi")) ?? []
    ).filter((link) => !link.includes("localhost") && !link.includes("site-containers"));

    if (links.length > 0) {
        for (const link of links) {
            const url = new URL(link);
            await log.msg(`🔄 ${url.origin}`);

            if (link) {
                try {
                    await fetch(link, { signal: AbortSignal.timeout(5000) });
                    await log.msg(`✅ ${url.origin}`);
                } catch (e) {
                    if (!brokenLinks[fullFilePath]) {
                        brokenLinks[fullFilePath] = [];
                    }

                    if (e instanceof Error) {
                    }

                    brokenLinks[fullFilePath].push({
                        url: link,
                        error: e instanceof Error ? e : new Error(String(e))
                    });
                    await log.msg(`❌ ${url.origin}`);
                }
            }

            log.next();
        }
    } else {
        log.msg(`✅ No Links`);
        log.next();
    }
    log.next();
} // close each file path

if (Object.keys(brokenLinks).length > 0) {
    console.log(``);
    console.log(`Some Broken Links were found in the following files:`);
    console.log(``);
    for (const [filePath, links] of Object.entries(brokenLinks)) {
        console.log(`📔 Broken Links in ${filePath}`);
        for (const link of links) {
            console.log(`❌ ${link.url}`);
            console.error(link.error);
        }
        console.log(``);
    }

    process.exit(1);
}

process.exit(0);
