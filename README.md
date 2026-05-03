# AHUMUN1399 Colloquium build

This folder is a **separate entry page** for the quiz with the opening screen, Columbia course branding, and navigation.

## Open locally

From this folder path in the browser (or use a local server from repo root):

- File URL: open `colloquium/index.html` (paths expect `../index/` and `../questions/` as on disk).
- Or from repo root: `python3 -m http.server 8080` then visit  
  `http://localhost:8080/colloquium/index.html`

## GitHub Pages

Upload the whole **`colloquium/`** folder into your repo (same structure next to `index/`, `questions/`, etc.), then open:

`https://eyesiltepe.github.io/AHUMUN1399/colloquium/index.html`

## Hero image

By default the page uses a Wikimedia Commons photo of Low Library. To use **your own** photo:

1. Save the image as `colloquium/assets/campus.jpg` (create `assets` if needed).
2. In `index.html`, change the `<img src="...">` to `assets/campus.jpg`.

## Question sources

Edit **`questions/questions.js`** (or your deployed **`questions.js`** at repo root).

Each question object may include an optional **`source`** string, for example:

```js
{ question: "...", answers: ["...", "...", "...", "..."], correct: 0, source: "Seale & Horta, The Annotated Arabian Nights, p. 12" }
```

This build includes `#question-source` in the layout; `game.js` shows the line when `source` is set.
