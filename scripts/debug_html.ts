async function debug() {
    const url = "https://allyoucanread.com/us/alabama/";
    const res = await fetch(url);
    const html = await res.text();
    const index = html.indexOf("<h3");
    if (index !== -1) {
        console.log("HTML chunk after first H3:");
        console.log(html.substring(index, index + 1000));
    } else {
        console.log("No H3 found");
    }
}
debug();
