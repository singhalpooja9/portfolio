# Deploy Guide — singhalpooja.com

Your site is built, committed to git (branch `main`), and ready to push.
Follow these steps when you're ready to go live.

---

## Step 1 — Create the GitHub repo

You have two good options. **Option A is recommended** (a clean, dedicated repo).

### Option A — New repo named `singhalpooja.com` (recommended)
1. Go to https://github.com/new
2. **Repository name:** `portfolio` (or anything — name doesn't matter for a custom domain)
3. Visibility: **Public** (required for free GitHub Pages)
4. Do **NOT** add a README, .gitignore, or license (we already have files)
5. Click **Create repository**
6. Copy the repo URL, e.g. `https://github.com/singhalpooja9/portfolio.git`

### Option B — Reuse your existing `singhalpooja9.github.io` repo
Only if you want to overwrite the old 2019 site. This repo already exists.
Use URL: `https://github.com/singhalpooja9/singhalpooja9.github.io.git`
(You'll force-push over the old content — see note in Step 2.)

---

## Step 2 — Push the code

Open Terminal and run these (replace the URL with yours from Step 1):

```bash
cd "/Users/gargshu/Documents/Personal/Pooja/portfolio"

git remote add origin https://github.com/singhalpooja9/portfolio.git
git push -u origin main
```

> **If using Option B (existing github.io repo)** the remote already has old commits.
> Either merge, or overwrite intentionally with:
> `git push -u origin main --force`
> (Force-push replaces the old 2019 site. Only do this if you're sure.)

If prompted for a password, use a **Personal Access Token**, not your GitHub
password: https://github.com/settings/tokens (create a "classic" token with
`repo` scope). Or install GitHub CLI (`brew install gh && gh auth login`) for
browser login.

---

## Step 3 — Enable GitHub Pages

1. In your repo on github.com, go to **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. **Branch:** `main`, **Folder:** `/ (root)` → click **Save**
4. Wait ~1 minute. A green banner shows your live URL.
   - It will first appear at `https://singhalpooja9.github.io/portfolio/`
   - Once DNS (Step 4) is set, `https://singhalpooja.com` will serve it.

> The `CNAME` file in this repo already contains `singhalpooja.com`, so Pages
> will auto-detect your custom domain. The `.nojekyll` file ensures Pages serves
> all files as-is.

---

## Step 4 — Point singhalpooja.com at GitHub Pages (DNS)

Log in to your **domain registrar** (wherever you bought singhalpooja.com —
e.g. GoDaddy, Namecheap, Google Domains/Squarespace). Find **DNS settings**
and add these records.

### Apex domain (singhalpooja.com) — four A records:
| Type | Host/Name | Value           |
|------|-----------|-----------------|
| A    | @         | 185.199.108.153 |
| A    | @         | 185.199.109.153 |
| A    | @         | 185.199.110.153 |
| A    | @         | 185.199.111.153 |

### www subdomain — one CNAME record:
| Type  | Host/Name | Value                      |
|-------|-----------|----------------------------|
| CNAME | www       | singhalpooja9.github.io.   |

> **Delete any old/conflicting records** first — especially old A records or a
> parked-page/forwarding record. Your old site had a broken SSL cert; clearing
> stale records fixes that. Keep any MX (email) records untouched.

DNS changes take 10 minutes–48 hours to propagate (usually fast).

---

## Step 5 — Turn on HTTPS

1. Back in **Settings → Pages**, in the **Custom domain** box, confirm
   `singhalpooja.com` is shown (it's auto-filled from the CNAME file).
2. Once DNS resolves, check the **"Enforce HTTPS"** box.
   (If it's greyed out, wait — GitHub is still provisioning the free
   Let's Encrypt certificate. This can take up to an hour after DNS resolves.)

That's it — `https://singhalpooja.com` will be live with a valid certificate.

---

## Updating the site later

Any time you change a file:
```bash
cd "/Users/gargshu/Documents/Personal/Pooja/portfolio"
git add -A
git commit -m "Update content"
git push
```
GitHub Pages redeploys automatically within ~1 minute.

---

## Swapping your photo later
Save the new image as `assets/profile.jpg` (overwrite), then commit & push.
Recommended: at least 600×700px, portrait orientation.

## Verifying the contact form
1. Check `singhal.pooja9@gmail.com` for a Formspree confirmation email
   (sent on the form's first-ever submission). Click to confirm.
2. After that, all submissions arrive in your inbox + the Formspree dashboard.

## Quick local preview anytime
```bash
cd "/Users/gargshu/Documents/Personal/Pooja/portfolio"
python3 -m http.server 8765
# then open http://localhost:8765
```
