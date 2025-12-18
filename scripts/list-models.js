const OLLAMA_HOST = 'http://31.97.146.3:11434';

async function listModels() {
    console.log(`Fetching models from ${OLLAMA_HOST}...`);
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/tags`);
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(m => console.log(`- ${m.name}`));
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

listModels();
