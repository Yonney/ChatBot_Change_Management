# Change Management FAQ Chatbot

A browser-based chatbot that answers Change Management questions using data extracted from a PDF knowledgebase.

## Features
- Loads FAQs dynamically from a PDF
- Pattern-based question matching
- Stopwords filtering for better accuracy
- MPESA Africa chat UI
- Zero external backend dependencies

## Setup
```
npm install
node server.js
```
Open browser → http://localhost:3000

## Files
- server.js — main chatbot logic
- knowledgebase.pdf — your FAQ data
- toolkit.md — full project documentation
- README.md — setup instructions
- chatbot.yml — swagger file
