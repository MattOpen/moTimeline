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
npm publish --otp=123456     # code from the authenticator app
git push
```
The OTP is required on every publish — see "npm authentication" below.

GitHub Pages auto-deploys from `/docs` on push — no manual step needed.

Also push the tag and create a release:
```
git tag -a vX.Y.Z -m "vX.Y.Z — <summary>"
git push origin vX.Y.Z
gh release create vX.Y.Z --title "..." --notes "..."
```

---

## npm authentication

The account uses 2FA mode **`auth-and-writes`**, so *every* publish needs a
one-time code — a normal `npm login` token is not enough on its own.

- `npm login` (browser) authenticates the CLI, but publishes still ask for the OTP.
- An **automation token** (npmjs.com → Access Tokens → Generate → *Automation*)
  bypasses the OTP prompt, because automation tokens are exempt from 2FA.
  Store it as `//registry.npmjs.org/:_authToken=<token>` in `~/.npmrc`.

⚠️ An automation token is a standing publish credential in a plain-text file: it
weakens the 2FA guarantee that mode `auth-and-writes` is there to provide. Worth
it for CI, a deliberate trade-off on a workstation. Never commit it.

---

Note: No i18n system — library has no user-facing strings. `/i18n-check` does not apply.
