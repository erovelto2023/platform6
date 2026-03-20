from duckduckgo_search import DDGS
import json

def test_search():
    try:
        results = DDGS().text("RJ Gillingham CPA Fairbanks AK", max_results=3)
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(f"Error: {e}")

test_search()
