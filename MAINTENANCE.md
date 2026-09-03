# moTimeline Maintenance

## Publishing / Deploy Checklist

### 1 — Version bump
Bump version in all three places (must match):
- `package.json`
- `src/moTimeline.js`
- `src/moTimeline.css`

### 2 — Sync docs
`README.md` and `docs/index.html` must both reflect the current state:
- API methods (refresh, initNewItems, addItems, insertItem, destroy)
- Options table (all current options)
- CSS custom properties reference
- Item schema (all fields incl. fullWidth)

### 3 — Build
```
npm run build
```
Produces `dist/moTimeline.js` (ESM), `dist/moTimeline.cjs`, `dist/moTimeline.umd.js`, `dist/moTimeline.css`.

### 4 — User verifies locally
Wait for explicit go-ahead — no exceptions.

### 5 — Publish and push
```
npm publish
git push
```
GitHub Pages auto-deploys from `/docs` on push — no manual step needed.

---

Note: No i18n system — library has no user-facing strings. `/i18n-check` does not apply.
