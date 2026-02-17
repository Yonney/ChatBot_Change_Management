# Beginner’s Toolkit with GenAI – Technology Change Management FAQ Chatbot

## 1. Title & Objective
**Title:** Prompt‑Powered FAQ Chatbot for Technology Change Management

**Objective:**
Build a fully functional Change Management FAQ chatbot that:
- Loads answers dynamically from a **knowledgebase PDF** using `pdf-extraction`.
- Matches user questions using pattern scoring + stopwords filtering.
- Provides a clean Africa‑themed UI.
- Demonstrates how GenAI can be used to learn, debug, and build the solution.

---

## 2. Quick Summary of the Technology
### What is Node.js?
Node.js is a JavaScript runtime that allows you to run JavaScript server‑side.
It is ideal for lightweight web servers and prototypes like this chatbot.

### What is pdf-extraction?
`pdf-extraction` is an NPM package that extracts readable text from PDFs.
This allows the chatbot to load FAQs from a change‑management playbook or SOP.

### Real‑world Example
ITSM and Change Management teams use similar bots to:
- Answer RFC (Request for Change) questions
- Guide engineers through CAB requirements
- Provide lead-time rules and freeze-period details

---

## 3. System Requirements
- Windows/macOS/Linux
- Node.js v16 or later
- NPM (bundled with Node)
- Text editor like VS Code
- pdf-extraction package
- Browser (Chrome / Firefox / Edge)

---

## 4. Installation & Setup Instructions
### Step 1 — Install Node.js
Download from https://nodejs.org

### Step 2 — Create project folder
```
mkdir change-mgmt-chatbot
cd change-mgmt-chatbot
```

### Step 3 — Initialize project
```
npm init -y
```

### Step 4 — Install dependencies
```
npm install pdf-extraction
```

### Step 5 — Add required files
- `server.js` (your chatbot server)
- `knowledgebase.pdf` (your FAQ)

### Step 6 — Run the chatbot
```
node server.js
```
Visit: http://localhost:3000

---

## 5. Minimal Working Example
This confirms your Node server works:

```js
const http = require('http');
http.createServer((req, res) => {
  res.end('Node is running');
}).listen(3000);
```

**Expected Output:**
Open browser → shows: `Node is running`

---

## 6. AI Prompt Journal
### Prompt 1
*“Help me build a Node JS chatbot that reads FAQs from a PDF.”*
- **AI Response:** Proposed server structure, recommended pdf-extraction.
- **Reflection:** Enabled me to quickly set up PDF loading and text parsing.

### Prompt 2
*“Improve question matching accuracy.”*
- **AI Response:** Added stopwords, pattern scoring, normalization.
- **Reflection:** Increased accuracy significantly.

### Prompt 3
*“Make the UI African-themed and visually professional.”*
- **AI Response:** Generated CSS gradients and theme colors.
- **Reflection:** UI became more attractive and unique.

### Prompt 4
*“Fix error: PDF text not loading.”*
- **AI Response:** Suggested verifying file path and checking for scanned PDFs.
- **Reflection:** Helped troubleshoot and resolve quickly.

---

## 7. Common Issues & Fixes
### Issue 1 — pdf-extraction error
**Cause:** Package not installed.
**Fix:** Run
```
npm install pdf-extraction
```

### Issue 2 — PDF text empty
**Cause:** PDF might be a scanned image.
**Fix:** Convert PDF to searchable OCR or export from Word.

### Issue 3 — Chatbot matches wrong answers
**Cause:** Weak pattern matching.
**Fix:** Add more keywords to FAQ questions in your PDF.

### Issue 4 — Port already in use
```
Error: EADDRINUSE: port 3000
```
**Fix:** Close previous server or change port.

---

## 8. References
- Node.js Official Docs – https://nodejs.org/docs
- MDN Web Docs – https://developer.mozilla.org
- pdf-extraction – https://www.npmjs.com/package/pdf-extraction
- ITIL Change Management overview – https://itsm-docs

---

