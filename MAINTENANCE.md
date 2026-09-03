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

### 5 — Release
Pushing a `v*` tag *stages* the release on npm via GitHub Actions.
```
git push                                    # code + docs first
git tag -a vX.Y.Z -m "vX.Y.Z — <summary>"
git push origin vX.Y.Z                      # triggers the publish workflow
gh release create vX.Y.Z --title "..." --notes "..."
```
The workflow verifies that the tag matches `package.json` and that the step-1
version banners are in place, then builds and stages. Watch it with `gh run watch`.

### 6 — Approve the staged version
The staged version is **not public yet**. Approve it on
[npmjs.com/package/motimeline](https://www.npmjs.com/package/motimeline)
(or `npm stage approve`) — this needs 2FA and is the deliberate release step.

Confirm afterwards: `npm view motimeline version`.

GitHub Pages auto-deploys from `/docs` on push — no manual step needed.

---

## npm authentication

Publishing uses Trusted Publishing (OIDC) — no tokens anywhere. CI may only
stage; releasing is a manual approval. Do not create automation tokens.

Setup details: `.github/workflows/publish.yml`.

---

Note: No i18n system — library has no user-facing strings. `/i18n-check` does not apply.
