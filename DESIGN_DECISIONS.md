# Design Decisions

## Overall Approach: Structured Multi-Step Pipeline
The system follows a **Decompose → Search → Synthesize** pipeline.  
Breaking a user question into focused search queries allows the LLM to work with grounded information instead of a single broad prompt. This significantly reduces hallucinations and improves factual accuracy.

## Architecture Overview
The application is split into two main components:
- **Frontend**: A simple React UI for submitting questions and viewing answers with citations.
- **Backend**: A Node.js + Express service that orchestrates query decomposition, web search, and answer synthesis.

The backend acts as the control layer, ensuring that all LLM outputs are grounded in retrieved sources.

## LLM Usage Decisions
The LLM (LLaMA 3.x family via Groq) is used for three distinct tasks:
1. **Query Decomposition** – Breaking a complex user question into multiple focused search queries.
2. **Question Type Classification** – Determining whether a question requires a short factual answer or a multi-sentence explanation.
3. **Answer Synthesis** – Combining retrieved information into a coherent, user-friendly response.

Groq was chosen for its fast inference speed, low latency, and availability of a free tier suitable for this exercise.

## Data Sources
- **Tavily AI** is used as the primary search engine. It is specifically designed for LLM-based RAG (Retrieval-Augmented Generation) applications, providing pre-cleaned and ranked results from across the web.
- By moving to Tavily, the system handles general knowledge, academic papers, and latest news through a single, optimized interface, replacing the manual Wikipedia and ArXiv scrapers.

## Search Strategy & Parallelism
For each decomposed query, the system queries Tavily via its official SDK.  
This approach:
- Simplifies the backend logic by consolidating multiple scrapers into one.
- Improves result quality through Tavily's AI-powered ranking and snippet extraction.
- Ensures robustness against rate limits and structured data parsing issues inherent in raw API scraping.

## Answer Synthesis & Verbosity Control
The system dynamically adjusts answer length based on question intent:
- **Factual questions** (e.g., numerical values or simple facts) produce concise, single-sentence answers.
- **Conceptual or entity-based questions** (e.g., people, countries, technologies) produce short multi-sentence explanations.

This behavior is controlled through LLM-based question classification rather than keyword heuristics, making the system more robust to varied phrasing.

## Error Handling & Robustness
- External API calls are wrapped in error handling to prevent a single failure from breaking the full request.
- If insufficient information is found, the system returns a clear message instead of hallucinating an answer.
- Timeouts are applied to external requests to avoid hanging responses.

## Implementation Tradeoffs
- **One Search Provider**: We replaced multiple free but limited sources (Wikipedia/ArXiv) with one premium service (Tavily). This improves result quality and maintainability at the cost of an external service dependency and API key requirement.
- No database or caching layer is used to keep the system simple and focused on LLM orchestration rather than persistence.

## Known Limitations & Future Improvements
- The backend is deployed on a free tier and may experience cold-start delays.
- Future improvements could include caching frequent queries, richer source ranking, and streaming responses to improve perceived latency.
