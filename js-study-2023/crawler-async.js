import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const PAGE_URL = "https://en.wikipedia.org/wiki/Bread";

const response = await fetch(PAGE_URL);
const text = await response.text();

const $ = cheerio.load(text);
const images = $("img");

const urls = [];
for (const image of images) {
  let url = image.attribs.src;
  if (url.startsWith("/static")) {
    url = "https://en.wikipedia.org" + url;
  } else if (url.startsWith("//")) {
    url = "https:" + url;
  }
  urls.push(url);
}

const jobs = [];
for (const url of urls) {
  const job = download(url);
  jobs.push(job);
}
await Promise.all(jobs);
console.log("다운로드 완료!");

async function download(url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();

  const fileName = path.basename(url);
  fs.writeFile(fileName, new Uint8Array(data));
}
