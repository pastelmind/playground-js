import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const PAGE_URL = "https://en.wikipedia.org/wiki/Bread";

const fetchedUrls = fetch(PAGE_URL)
  .then((response) => {
    return response.text();
  })
  .then((text) => {
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

    return urls;
  });

fetchedUrls.then((urls) => {
  for (const url of urls) {
    fetch(url)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((data) => {
        const fileName = path.basename(url);
        fs.writeFile(fileName, new Uint8Array(data));
      });
  }
});
