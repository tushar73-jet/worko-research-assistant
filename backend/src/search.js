const axios = require("axios");

async function searchDuckDuckGo(query) {
  const response = await axios.get("https://api.duckduckgo.com/", {
    params: {
      q: query,
      format: "json",
      no_html: 1,
      skip_disambig: 1
    }
  });

  const data = response.data;
  const results = [];

  if (data.AbstractText) {
    results.push({
      title: data.Heading || query,
      snippet: data.AbstractText,
      url: data.AbstractURL || ""
    });
  }

  return results;
}

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

async function searchWeb(query) {
  let results = await searchDuckDuckGo(query);

  if (results.length === 0) {
    results = await searchWikipedia(query);
  }

  return results;
}

module.exports = {
  searchWeb
};
