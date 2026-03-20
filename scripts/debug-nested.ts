import axios from "axios";
import * as cheerio from "cheerio";

async function debug() {
    const url = "https://university.graduateshotline.com/ubystate.html";
    const https = require('https');
    const { data: html } = await axios.get(url, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const $ = cheerio.load(html);

    const alAnchor = $("a[name='AL']");
    const ol = alAnchor.parent().next('ol');
    
    console.log(`Alabama OL found: ${ol.length}`);
    const anchorsInOl = ol.find('a[name]');
    console.log(`Found ${anchorsInOl.length} named anchors inside Alabama OL.`);
    anchorsInOl.each((i, el) => {
        console.log(` - Anchor name: ${$(el).attr('name')}`);
    });

    const nextSib = ol.next();
    console.log(`Sibling after OL: <${nextSib[0]?.tagName}>`);
    console.log(` - Content: ${nextSib.text().substring(0, 100).replace(/\n/g, ' ')}`);
}

debug();
