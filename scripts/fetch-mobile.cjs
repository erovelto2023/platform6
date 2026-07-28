const https = require("https");
const fs = require("fs");

function fetchMobileParks() {
  const url = "https://www.cityofmobile.gov/parks-rec/parks/";
  
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
      console.log("Page size:", data.length);
      fs.writeFileSync("mobile_parks_raw.html", data);
      
      // Look for dog park / park markers
      const parkLinks = [];
      const linkRegex = /href="(https:\/\/www\.cityofmobile\.gov\/parks-rec\/[^\"]+)"/gi;
      let m;
      while ((m = linkRegex.exec(data)) !== null) {
        if (!m[1].includes(".css") && !m[1].includes(".js") && !m[1].includes(".jpg") && !m[1].includes(".pdf")) {
          parkLinks.push(m[1]);
        }
      }
      console.log("Found park links:", Array.from(new Set(parkLinks)));

      // Search for any mapbox script or geojson or list items
      const matches = data.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
      console.log("Total <li> elements:", matches.length);
      
      // Let's search for "Dog Park" or "Dog" in raw HTML
      const lines = data.split("\n");
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes("dog") || line.toLowerCase().includes("park")) {
          if (line.includes("href=") || line.includes("title=") || line.includes("class=")) {
            console.log(`Line ${i}:`, line.trim().slice(0, 150));
          }
        }
      });
    });
  });
}

fetchMobileParks();
