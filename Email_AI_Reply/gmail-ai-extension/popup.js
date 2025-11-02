document.getElementById("generate").addEventListener("click", async () => {
  const emailContent = document.getElementById("emailContent").value;
  const tone = document.getElementById("tone").value;
  const replyBox = document.getElementById("replyBox");
  replyBox.innerHTML = "⏳ Generating reply...";

  const query = `
    mutation {
      getAIReply(emailContent: "${emailContent}", tone: ${tone}) {
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
    replyBox.innerHTML = data.data.getAIReply.reply;
  } catch (error) {
    console.error(error);
    replyBox.innerHTML = "❌ Failed to connect to AI service.";
  }
});
