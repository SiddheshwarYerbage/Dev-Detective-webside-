# Dev Detective

 A tiny single-page site that inspects pasted code for common issues (TODO, FIXME, console.log, long lines, trailing whitespace).

 ## Usage

 - Open `index.html` in your browser (double-click or serve with a static server).
 - Paste a code snippet into the left textarea.
 - Click `Detect` (or press Ctrl/Cmd+Enter) to analyze.
 - Use `Insert sample` to load a small example.

 All checks run in the browser; no backend required.

 ## Files

 - `index.html` – site markup
 - `style.css` – site styles
 - `script.js` – client-side inspector logic

 ## Notes

 This is a lightweight developer tool intended as a starting point. If you want additional detectors (security, regex smells, lint-style rules), I can add them and include a small test harness.
