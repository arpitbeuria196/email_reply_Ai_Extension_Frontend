import { useState } from "react";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("FORMAL");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneratedReply = async (emailContent, tone) => {
    setLoading(true);

    const query = `
      mutation {
        getAIReply(emailContent: "${emailContent}", tone: ${tone}) {
          emailContent
          tone
          reply
        }
      }
    `;

    try {
      const res = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.data && data.data.getAIReply) {
        setReply(data.data.getAIReply.reply);
      } else {
        setReply("⚠️ No reply received from AI service.");
      }
    } catch (err) {
      console.error(err);
      setReply("❌ Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGeneratedReply(emailContent, tone);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "600px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1e293b",
          }}
        >
          ✉️ AI Email Reply Generator
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Enter your email content here..."
            rows={5}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              resize: "none",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
              }}
            >
              <option value="FORMAL">Formal</option>
              <option value="CASUAL">Casual</option>
              <option value="FRIENDLY">Friendly</option>
              <option value="CONCISE">Concise</option>
              <option value="PROFESSIONAL">Professional</option>
            </select>

            <button
              type="submit"
              style={{
                padding: "10px 16px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                transition: "background-color 0.2s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Generate Reply
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "8px",
            padding: "1rem",
            minHeight: "80px",
            border: "1px solid #e2e8f0",
            fontSize: "15px",
            color: "#334155",
          }}
        >
          {loading ? (
            <p style={{ color: "#64748b", fontStyle: "italic" }}>⏳ Generating reply...</p>
          ) : reply ? (
            <p>{reply}</p>
          ) : (
            <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
              AI-generated reply will appear here...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
