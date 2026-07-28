import https from "https";

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DogParkScraper/1.0)",
        "Accept": "text/html",
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location!;
        fetchPage(redirectUrl.startsWith("http") ? redirectUrl : `https://www.animalshelter.org${redirectUrl}`)
          .then(resolve).catch(reject);
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function debug() {
  const url = "https://www.animalshelter.org/dogParks/Alabama/AL.html";
  console.log(`Fetching: ${url}`);
  const html = await fetchPage(url);
  
  // Print lines containing "dogPark" or "rId"
  const lines = html.split("\n");
  console.log(`\nTotal HTML lines: ${lines.length}`);
  console.log("\n--- Lines containing 'rId' (dog park links): ---");
  let count = 0;
  for (const line of lines) {
    if (line.includes("rId") && line.includes("dogParks")) {
      console.log(line.trim());
      count++;
      if (count > 20) { console.log("... (truncated)"); break; }
    }
  }
  
  console.log("\n--- Sample of HTML around line 200-250: ---");
  for (let i = 200; i < Math.min(250, lines.length); i++) {
    console.log(`L${i}: ${lines[i].trim()}`);
  }
  
  process.exit(0);
}

debug().catch(e => { console.error(e); process.exit(1); });
