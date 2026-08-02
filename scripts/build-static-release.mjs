import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "dist-static");
const port = Number(process.env.SNAPSHOT_PORT || 4317);
const baseUrl = `http://127.0.0.1:${port}`;

const pages = [
  ["/", "index.html"],
  ["/independent-site", "independent-site.html"],
  ["/social-media", "social-media.html"],
  ["/geo-ai", "geo-ai.html"],
  ["/tiktok-europe", "tiktok-europe.html"],
  ["/content-production", "content-production.html"],
  ["/amazon-erp", "amazon-erp.html"],
  ["/google-growth", "google-growth.html"],
  ["/insights", "insights.html"],
  ["/insights/geo-ai-cut", "insights/geo-ai-cut.html"],
  ["/insights/independent-site-asset", "insights/independent-site-asset.html"],
  ["/insights/social-media-signal", "insights/social-media-signal.html"],
  ["/insights/tiktok-europe-window", "insights/tiktok-europe-window.html"],
  ["/baidu_verify_codeva-9y5PzctR4b.html", "baidu_verify_codeva-9y5PzctR4b.html"]
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: "inherit",
      shell: false,
      ...options
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function copyIfExists(from, to) {
  try {
    await fs.cp(from, to, { recursive: true });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

async function waitForServer(child) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error("Next server exited before snapshots were generated");
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok) return;
    } catch {
      // Keep polling until next start is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

async function snapshotPage(route, file) {
  const response = await fetch(`${baseUrl}${route}`);
  if (!response.ok) throw new Error(`${route} returned HTTP ${response.status}`);

  const body = await response.text();
  const target = path.join(outDir, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body);
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  await run("npm", ["run", "build"]);

  const server = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: rootDir,
    stdio: ["ignore", "inherit", "inherit"]
  });

  try {
    await waitForServer(server);
    await fs.mkdir(outDir, { recursive: true });
    await Promise.all(pages.map(([route, file]) => snapshotPage(route, file)));
  } finally {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }

  await copyIfExists(path.join(rootDir, "public"), outDir);
  await copyIfExists(path.join(rootDir, ".next", "static"), path.join(outDir, "_next", "static"));
  await copyIfExists(path.join(rootDir, "app", "icon.png"), path.join(outDir, "icon.png"));

  const revision = await new Promise((resolve) => {
    const child = spawn("git", ["rev-parse", "--short", "HEAD"], { cwd: rootDir, stdio: ["ignore", "pipe", "ignore"] });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.on("exit", () => resolve(output.trim()));
  });
  await fs.writeFile(path.join(outDir, "REVISION"), `${revision}\n`);

  const index = await fs.readFile(path.join(outDir, "index.html"), "utf8");
  if (!index.includes("#c65cf4") || !index.includes("#20c8d2")) {
    throw new Error("Snapshot does not contain the latest aurora button gradient");
  }

  console.log(`Static release written to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
