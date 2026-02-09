const axios = require("axios");

async function searchWikipedia(query) {
  const response = await axios.get(
    "https://en.wikipedia.org/w/api.php",
    {
      params: {
        action: "query",
        list: "search",
        srsearch: query,
        format: "json"
      },
      headers: {
        "User-Agent": "WorkoResearchAssistant/1.0 (contact: tushar@example.com)"
      }
    }
  );

  const results = [];
  const searchResults = response.data.query.search.slice(0, 3);

  for (const item of searchResults) {
    results.push({
      title: item.title,
      snippet: item.snippet.replace(/<[^>]+>/g, ""),
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`
    });
  }

  return results;
}

async function searchArXiv(query) {
  try {
    const response = await axios.get(
      "http://export.arxiv.org/api/query",
      {
        params: {
          search_query: `all:${query}`,
          max_results: 3
        }
      }
    );

    const xml = response.data;
    const results = [];

    const entries = xml.split("<entry>");
    entries.shift();

    for (const entry of entries) {
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
      const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
      const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);

      if (titleMatch && summaryMatch) {
        results.push({
          title: titleMatch[1].trim(),
          snippet: summaryMatch[1].trim().substring(0, 300) + "...",
          url: idMatch ? idMatch[1].trim() : ""
        });
      }
    }

    return results;
  } catch (error) {
    console.error("ArXiv search failed:", error);
    return [];
  }
}

async function searchWeb(query) {
  // Parallelize sources for speed and diversity.
  // Using allSettled to ensure one source failing doesn't kill the whole request.
  const results = await Promise.allSettled([
    searchWikipedia(query),
    searchArXiv(query)
  ]);

  return results
    .filter(res => res.status === 'fulfilled')
    .flatMap(res => res.value);
}

module.exports = {
  searchWeb
};
