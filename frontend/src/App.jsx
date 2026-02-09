import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setCitations([]);

    try {
      const response = await fetch("https://worko-research-assistant.onrender.com/research",
 {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
      setCitations(data.citations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (


    
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Arial" }}>

      <p style={{ background:"#fff3cd", padding:"10px", borderRadius:"6px" }}>
      ⚠️ Note: Backend runs on Render (free tier). The first request may take up to 1 minute due to cold start.
      </p>
      <h2>Research Assistant</h2>

      

      <textarea
        rows="4"
        style={{ width: "100%", padding: "10px" }}
        placeholder="Ask a research question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        {loading ? "Researching..." : "Submit"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {answer && (
        <div style={{ marginTop: "30px" }}>
          <h3>Answer</h3>
          <p>{answer}</p>
        </div>
      )}

      {citations.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Sources</h4>
          <ul>
            {citations.map((c, i) => (
              <li key={i}>
                <a href={c.url} target="_blank" rel="noreferrer">
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
