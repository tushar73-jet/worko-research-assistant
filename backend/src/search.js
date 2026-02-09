const { tavily } = require("@tavily/core");

async function searchTavily(query) {
  if (!process.env.TAVILY_API_KEY) {
    console.warn("TAVILY_API_KEY is not set. Skipping Tavily search.");
    return [];
  }

  try {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const response = await tvly.search(query, {
      maxResults: 5,
      searchDepth: "advanced"
    });

    return response.results.map(result => ({
      title: result.title,
      snippet: result.content,
      url: result.url
    }));
  } catch (error) {
    console.error("Tavily search failed:", error);
    return [];
  }
}

async function searchWeb(query) {
  return await searchTavily(query);
}

module.exports = {
  searchWeb
};
