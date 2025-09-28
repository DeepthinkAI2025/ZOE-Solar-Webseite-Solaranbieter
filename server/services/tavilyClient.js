import "dotenv/config";
import { tavily as createTavilyClient } from "@tavily/core";

let clientInstance = null;

function getClient() {
  if (!clientInstance) {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      throw new Error("TAVILY_API_KEY ist nicht gesetzt. Bitte Schlüssel in der Umgebung oder .env hinterlegen.");
    }
    const apiBaseURL = process.env.TAVILY_API_BASE_URL;
    clientInstance = createTavilyClient({
      apiKey: apiKey.trim(),
      ...(apiBaseURL ? { apiBaseURL: apiBaseURL.trim() } : {})
    });
  }
  return clientInstance;
}

export function tavilySearch(query, options = {}) {
  const client = getClient();
  return client.search(query, options);
}

export function tavilyExtract(urls, options = {}) {
  const client = getClient();
  return client.extract(urls, options);
}

export function tavilyMap(url, options = {}) {
  const client = getClient();
  return client.map(url, options);
}

export function tavilyCrawl(url, options = {}) {
  const client = getClient();
  return client.crawl(url, options);
}
