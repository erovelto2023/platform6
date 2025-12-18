

const OLLAMA_HOST = 'http://31.97.146.3:11434';

async function test() {
    console.log(`Testing connection to ${OLLAMA_HOST}...`);
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'deepseek-r1',
                prompt: 'hi',
                stream: false
            })
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
        } else {
            const data = await response.json();
            console.log("Success!");
            console.log(data.response);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

test();
