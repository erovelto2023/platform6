import axios from "axios";
import * as cheerio from "cheerio";

async function debug() {
    const url = "https://university.graduateshotline.com/ubystate.html";
    const https = require('https');
    const { data: html } = await axios.get(url, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const $ = cheerio.load(html);

    const alAnchors = $("a[name='AL']");
    console.log(`Found ${alAnchors.length} anchors with name='AL'`);

    alAnchors.each((i, el) => {
        console.log(`\nAnchor ${i + 1}:`);
        console.log(` - Tag: <${el.tagName}>`);
        console.log(` - Parent: <${$(el).parent()[0]?.tagName}>`);
        console.log(` - Parent Text Snippet: ${$(el).parent().text().substring(0, 50).replace(/\n/g, ' ')}`);
        
        let sib = $(el).parent().next();
        console.log(` - Parent Next Sibling: <${sib[0]?.tagName}>`);
        if (sib.length) {
            console.log(`   - Sibling Snippet: ${sib.text().substring(0, 100).replace(/\n/g, ' ')}`);
        }
        
        // Let's check the anchor's own next sibling too
        let ownSib = $(el).next();
        console.log(` - Own Next Sibling: <${ownSib[0]?.tagName}>`);
    });
}

debug();
