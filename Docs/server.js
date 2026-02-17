/**
 * Bilomba Ltd Change Management Chatbot
 * Loads FAQ knowledge from knowledgebase.pdf using pdf-extraction
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-extraction');   // <-- Reliable, Node-safe PDF parser

const PORT = process.env.PORT || 3000;
const PDF_PATH = path.join(__dirname, "knowledgebase.pdf");

// ---------------------------------------------
// STOPWORDS + pattern helpers
// ---------------------------------------------
const STOPWORDS = new Set([
  "the","and","for","with","that","this","from","your","have","will","into","about",
  "after","before","when","what","how","why","who","are","was","were","is","a","an",
  "to","of","in","on","at","by","as","it","or","be","we","you","our","their","there",
  "any","can","do"
]);

function buildPatternsFromQuestion(q) {
  const w = q.toLowerCase().replace(/[^a-z0-9\s]/g," ")
      .split(/\s+/)
      .filter(x => x.length > 3 && !STOPWORDS.has(x));
  return [q].concat([...new Set(w)].slice(0,8));
}

function parseStructuredQA(text) {
  const result = [];
  const regex = /(?:^|\n)\s*Q:\s*(.+?)\s*\nA:\s*([\s\S]*?)(?=\nQ:|$)/gi;

  let m;
  while ((m = regex.exec(text)) !== null) {
    const q = m[1].trim();
    const a = m[2].trim();
    result.push({
      q,
      a,
      patterns: buildPatternsFromQuestion(q)
    });
  }
  return result;
}

function parseUnstructured(text) {
  return text.split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const first = (p.match(/(.+?[\.\?!])\s/) || [null,p])[1];
      const q = first.length > 120 ? first.slice(0,117)+"…" : first;
      return { q, a:p, patterns:buildPatternsFromQuestion(q) };
    });
}

// ---------------------------------------------
// LOAD PDF → KB
// ---------------------------------------------
let KB = [];

async function loadPdfKnowledge() {
  if (!fs.existsSync(PDF_PATH)) {
    console.log("[KB] No PDF found");
    return [];
  }

  try {
    const data = await pdf(fs.readFileSync(PDF_PATH));
    const text = (data.text || "").trim();
    if (!text) {
      console.log("[KB] PDF contained no extractable text");
      return [];
    }

    const structured = parseStructuredQA(text);
    if (structured.length) {
      console.log("[KB] Loaded structured KB:", structured.length);
      return structured;
    }

    const unstructured = parseUnstructured(text).slice(0,300);
    console.log("[KB] Loaded fallback KB:", unstructured.length);
    return unstructured;

  } catch (err) {
    console.error("[KB] PDF parsing failed:", err);
    return [];
  }
}

// Initial load
(async () => {
  KB = await loadPdfKnowledge();
})();

// Auto-reload on PDF change
fs.watchFile(PDF_PATH, { interval: 2000 }, async () => {
  console.log("[KB] PDF changed → Reloading...");
  KB = await loadPdfKnowledge();
});

// ---------------------------------------------
// YOUR ORIGINAL HTML (UNTOUCHED)
// ---------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tech Change Management Chatbot</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
  :root {
  /* Pan-African Inspired Theme */
  --bg: #0A0A0A;              /* Deep black for strong contrast */
  --panel: #111;              /* Slightly lighter black panel */

  /* Text Colors */
  --text: #F2F2F2;
  --muted: #BDBDBD;

  /* Africa Stripe Colors */
  --africa-green: #00A859;    /* M-Pesa green */
  --africa-red: #E60028;      /* M-Pesa red */
  --africa-yellow: #F4C200;   /* African gold */
  --africa-blue: #0071CE;     /* Optional accent */
  --africa-black: #000000;

  /* Chat Colors */
  --bot: #1B1B1B;
  --bubbleBotBorder: #2E2E2E;

  --user: var(--africa-green);
  --bubbleUser: #006F3C; /* Darker shade of M-Pesa green */
}

/* Global Styling */
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: linear-gradient(180deg, #000000, #0F0F0F 40%, #1A1A1A);
  color: var(--text);
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

/* Header */
header {
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.75);
  border-bottom: 2px solid var(--africa-green);
  backdrop-filter: blur(6px);
  position: sticky;
  top: 0;
  z-index: 10;
}

header h1 { 
  margin: 0; 
  font-size: 1.2rem; 
  font-weight: 700;
  color: var(--africa-green);
}

header p {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

/* Chat Area */
#chat {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: auto;
}

/* Message Row */
.msg {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  max-width: 820px;
}

/* Avatars */
.msg .avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--bot);
  display: grid; place-items: center;
  font-weight: 700; 
  color: var(--text);
  border: 1px solid var(--bubbleBotBorder);
}

.msg.user .avatar { 
  background: var(--africa-green);
}

/* Bubbles */
.bubble {
  padding: 0.7rem 0.9rem;
  border-radius: 0.8rem;
  line-height: 1.35;
  background: var(--bot);
  border: 1px solid var(--bubbleBotBorder);
  white-space: pre-wrap;
  word-break: break-word;
  flex: 1 1 auto;
}

.msg.user .bubble {
  background: var(--bubbleUser);
  border-color: var(--africa-green);
}

/* Africa-Themed Gradient on Bot Messages (Optional) */
.msg.bot .bubble {
  background: linear-gradient(135deg,
    var(--africa-black) 0%,
    var(--africa-red) 25%,
    var(--africa-yellow) 50%,
    var(--africa-green) 75%,
    var(--africa-black) 100%
  );
  color: white;
  border-color: #222;
}

/* Meta text */
.meta {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 0.2rem;
}

/* Typing Indicator */
.typing { display: inline-block; min-width: 30px; }

.dot {
  width: 6px; height: 6px;
  background: var(--africa-green);
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
  animation: blink 1.2s infinite;
}
.dot:nth-child(2){animation-delay:0.2s}
.dot:nth-child(3){animation-delay:0.4s}

@keyframes blink { 
  0%,80%,100%{opacity:.2} 
  40%{opacity:1} 
}

/* Footer Input Form */
form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
  padding: 0.9rem;
  background: rgba(0, 0, 0, 0.85);
  border-top: 2px solid var(--africa-green);
  position: sticky; bottom: 0;
}

input[type="text"] {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.65rem;
  border: 1px solid #333;
  background: #0A0A0A;
  color: var(--text);
}

button {
  padding: 0.9rem 1.1rem;
  background: var(--africa-green);
  color: white;
  border: none;
  border-radius: 0.65rem;
  font-weight: 700;
  cursor: pointer;
}

button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Quick Reply Pills */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; 
  margin-top: 0.5rem;
}

.pill {
  background: var(--africa-black);
  color: var(--africa-yellow);
  border: 1px solid var(--africa-green);
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}
  </style>
</head>
<body>
  <header>
    <h1>Change Management — FAQ Chatbot</h1>
    <p class="note">Ask about RFCs, CAB, lead times, change windows, rollback plans, communication, freeze periods, etc.</p>
  </header>

  <main id="chat" aria-live="polite"></main>

  <form id="form">
    <input id="input" type="text" placeholder="Type your question…" autocomplete="off" />
    <button id="sendBtn" type="submit">Send</button>
  </form>

  <script>
    let FAQ = [];

    fetch("/kb").then(r => r.json()).then(data => {
      FAQ = data;
    });

    function normalize(str) {
      return str.toLowerCase()
        .replace(/[^a-z0-9\\s]/g, " ")
        .replace(/\\s+/g, " ")
        .trim();
    }

    function scoreMatch(user, patterns) {
      var u = " " + normalize(user) + " ";
      var best = 0;
      for (var p of patterns) {
        var words = normalize(p).split(" ").filter(Boolean);
        var hits = words.filter(w => u.includes(" " + w + " ")).length;
        best = Math.max(best, hits / words.length);
      }
      return best;
    }

    function getAnswer(txt) {
      let best = { i:-1, s:0 };
      for (let i=0; i<FAQ.length; i++) {
        const s = scoreMatch(txt, FAQ[i].patterns);
        if (s > best.s) best = { i, s };
      }

      if (best.s > 0.35) {
        const item = FAQ[best.i];
        return { text:item.a, meta: "(Match confidence " + Math.round(best.s*100)+"%)" };
      }

      return {
        text:"I couldn't confidently match that. Please rephrase.",
        meta:"(Low confidence)"
      };
    }

    const chat = document.getElementById('chat');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    function addMessage(msg, who="bot", meta="") {
      const row = document.createElement("div");
      row.className = "msg " + (who==="user" ? "user" : "bot");

      row.innerHTML = \`
        <div class="avatar">\${who==="user"?"You":"CM"}</div>
        <div style="flex:1">
          <div class="bubble">\${msg}</div>
          \${meta ? '<div class="meta">'+meta+'</div>' : ''}
        </div>
      \`;

      chat.appendChild(row);
      chat.scrollTop = chat.scrollHeight;
    }

    addMessage("Hi! I'm your Change Management assistant.");

    form.addEventListener("submit", e => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;

      addMessage(txt, "user");
      input.value = "";

      setTimeout(() => {
        const ans = getAnswer(txt);
        addMessage(ans.text, "bot", ans.meta);
      }, 300);
    });
  </script>
</body>
</html>`;

// ---------------------------------------------
// SERVER
// ---------------------------------------------
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, {"Content-Type":"text/html"});
    return res.end(html);
  }

  if (req.url === "/kb") {
    res.writeHead(200, {"Content-Type":"application/json"});
    return res.end(JSON.stringify(KB));
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () =>
  console.log(`Chatbot running at http://localhost:${PORT}`)
);
