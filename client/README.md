# Clinical Psychology Test Battery Web App

Open `index.html` in a browser, or in VS Code use the Live Server extension (right-click index.html, Open with Live Server).

Files
- index.html : page structure
- style.css  : design (light and dark mode)
- data.js    : all data (109 tests, 45 batteries, 50 conditions, questions, symptoms, quiz)
- app.js     : tabs, forms, survey, personality quiz, symptom checker

To add a test or condition, edit data.js and refresh the browser.
Screening pointers only, not a diagnosis. Verify details with the publisher manual.

Added: run.js (Administer Test tab + Report Card tab). Clients and scores are saved in this browser (localStorage).
index_single.html is the same app in one file.

History & Progress tab: results saved with "Save to history" are stored in this browser, and in MongoDB when the backend (server/) is running. See AGENT_PROMPT.md.
