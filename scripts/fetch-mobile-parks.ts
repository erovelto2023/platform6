import https from "https";
import fs from "fs";

function fetchMobileParks() {
  const url = "https://www.cityofmobile.gov/parks-rec/parks/";
  
  // Try GET request first to see mapbox dataset in raw page source
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      console.log("Page size:", data.length);
      fs.writeFileSync("mobile_parks_raw.html", data);
      
      // Look for dog park / park markers
      const parkLinks: string[] = [];
      const linkRegex = /href="(https:\/\/www\.cityofmobile\.gov\/parks-rec\/[^\"]+)"/gi;
      let m;
      while ((m = linkRegex.exec(data)) !== null) {
        if (!m[1].includes(".css") && !m[1].includes(".js") && !m[1].includes(".jpg")) {
          parkLinks.push(m[1]);
        }
      }
      console.log("Found park links:", Array.from(new Set(parkLinks)));

      // Search for any mapbox script or JSON containing park names/addresses
      const featuresMatch = data.match(/features\s*:\s*(\[[\s\S]*?\])\s*,\s*["']?type/i);
      if (featuresMatch) {
        console.log("Features JSON found!");
        fs.writeFileSync("mobile_features.json", featuresMatch[1]);
      } else {
        console.log("No direct features regex match, searching for park names...");
        const parkNameMatches = data.match(/class="[^"]*park[^"]*"[^>]*>([^<]+)</gi);
        console.log("Park name snippets:", parkNameMatches?.slice(0, 20));
      }
    });
  });
}

fetchMobileParks();
