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
Pushing a `v*` tag publishes to npm via GitHub Actions — no local `npm publish`.
```
git push                                    # code + docs first
git tag -a vX.Y.Z -m "vX.Y.Z — <summary>"
git push origin vX.Y.Z                      # triggers the publish workflow
gh release create vX.Y.Z --title "..." --notes "..."
```
The workflow verifies that the tag matches `package.json` and that the step-1
version banners are in place, then builds and publishes. Watch it with
`gh run watch`, and confirm afterwards with `npm view motimeline version`.

GitHub Pages auto-deploys from `/docs` on push — no manual step needed.

---

## npm authentication

Publishing uses **Trusted Publishing** (OIDC): npm grants the workflow a
short-lived credential at run time, so no token is stored in the repo, in
`~/.npmrc`, or in GitHub secrets.

One-time setup on npmjs.com → *motimeline* → Settings → Trusted Publisher:

| Field | Value |
|---|---|
| Organization / User | `MattOpen` |
| Repository | `moTimeline` |
| Workflow filename | `publish.yml` |

The account uses 2FA mode `auth-and-writes`, so a **local** `npm publish` still
requires a one-time code — that path is the fallback if CI is unavailable.

⚠️ Automation tokens would also bypass the OTP, but npm itself warns against
them: they are a standing publish credential in a plain-text file. Trusted
Publishing exists to avoid exactly that, so do not create one.

---

Note: No i18n system — library has no user-facing strings. `/i18n-check` does not apply.
