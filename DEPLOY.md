# Deploying the portfolio

The site is fully static: HTML, CSS, JavaScript, images, and a PDF. There is no build step and no
server-side code. Any static host will work.

The files that must sit at the **root** of the deployed site are:

```text
index.html
work.html
404.html
robots.txt
.nojekyll
css/
js/
work/
assets/
```

Do not upload the parent `portfolio/` folder as a nested folder. `index.html` must be the first
thing visitors reach.

---

## Option A — Netlify Drop (fastest, about 2 minutes)

1. Zip this folder (or download it from the repository) and unzip it.
2. Go to <https://app.netlify.com/drop>.
3. Drag the **contents** of the unzipped folder onto the page — or drag the ZIP itself.
4. Netlify gives you a live URL immediately, for example `https://calm-panda-123.netlify.app`.
5. Create a free Netlify account to keep the site, rename it, and connect a domain.

This is the quickest route if you want a public link today. The trade-off is that future edits
need to be redeployed (drag a new ZIP, or connect the site to a Git repository).

---

## Option B — GitHub Pages (recommended for a long-lived portfolio)

You already have GitHub. GitHub Pages is free for public repositories and gives you HTTPS and a
stable URL.

### 1. Create the repository

**For a project URL** such as `https://buggycww.github.io/portfolio/`:

- Create a public repository named `portfolio`.
- Leave it empty (no README, no `.gitignore`).

**For a root URL** such as `https://buggycww.github.io/`:

- Create a public repository named exactly `buggycww.github.io`.

### 2. Upload the site

**Web upload (no Git required):**

1. Open the new repository.
2. Choose **Add file → Upload files**.
3. Upload the **contents** of the unzipped portfolio folder — `index.html`, `work.html`,
   `assets/`, `css/`, `js/`, `work/`, `404.html`, `robots.txt`, `.nojekyll`.
4. Commit the files to `main`.

**Or with Git:**

```powershell
cd path\to\portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/buggycww/portfolio.git
git push -u origin main
```

If the repository is named `buggycww.github.io`, use that URL in the `git remote` command
instead.

### 3. Turn on Pages

1. Repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Branch: `main`; folder: `/ (root)`.
4. Save.
5. Wait 1–3 minutes. The Pages panel shows the live URL.

For a project repository, that URL is:

```text
https://buggycww.github.io/portfolio/
```

For `buggycww.github.io`, it is:

```text
https://buggycww.github.io/
```

All links in the site are relative, so the project subpath works without changes.

### 4. If something looks broken

- Confirm `index.html` is at the repository root, not inside another folder.
- Confirm the file names match exactly. GitHub Pages is case-sensitive.
- Wait a minute and hard-refresh (`Ctrl+F5`).
- Open `https://buggycww.github.io/portfolio/assets/og.jpg` directly. If that 404s, the upload
  path is wrong.
- Check **Settings → Pages** for the deployment status and error message.

---

## Option C — Cloudflare Pages or Vercel

Both work the same way: connect the repository, leave the build command empty, and set the output
directory to `/` (or the folder containing `index.html`). Use one of these if you already use the
platform; otherwise GitHub Pages is simpler.

---

## Custom domain (optional, recommended for job applications)

A domain like `reneechin.dev` looks more professional than a GitHub subdomain and is easier to put
on a CV.

1. Buy a domain from Cloudflare Registrar, Namecheap, Porkbun, or similar.
2. In GitHub: **Settings → Pages → Custom domain**, enter the domain.
3. At your DNS provider, add the records GitHub asks for:
   - `www` → CNAME to `buggycww.github.io`
   - apex/root → the A records GitHub documents for Pages
4. Wait for DNS, then enable **Enforce HTTPS** in GitHub Pages.
5. Add a file named `CNAME` at the repository root containing only the domain, for example:

```text
reneechin.dev
```

For Netlify, add the domain in **Site configuration → Domain management** and follow its DNS
instructions instead.

---

## Before you publish — checklist

- [ ] **Update the social preview image.** The HTML currently uses relative `og:image` paths.
      Replace them with the final absolute URL, e.g.
      `https://buggycww.github.io/portfolio/assets/og.jpg`. This matters for LinkedIn, Discord,
      X, and WhatsApp previews.
- [ ] **Decide about the résumé PDF.** `assets/Renee_Chin_Resume.pdf` is public and includes your
      phone number. If you do not want that public, replace it with a web version that has email
      only.
- [ ] **Review the NDA-safe copy.** The Rush-Cavate page and the FPS card describe systems, not
      assets. Confirm with Virtuos what is comfortable to publish before sharing the link widely.
- [ ] **Check the site on a phone.** The layout is responsive, but test the menu, filters, and
      project pages and video playback on a real device.
- [ ] **Test the links.** Open the archive, each project page, GitHub, itch.io, YouTube, and the
      résumé download.
- [ ] **Add analytics only if you want it.** There is none by default. If you add any, update the
      privacy note and keep it lightweight.

---

## Updating the site later

Edit the HTML/CSS/JS locally, then either:

- re-upload the changed files to GitHub (commit to `main`; Pages redeploys automatically), or
- drag a new ZIP to Netlify.

To preview locally before deploying:

```powershell
cd path\to\portfolio
python -m http.server 8000
```

Then open <http://localhost:8000>.

---

## What “publicly accessible” means here

Once deployed, anyone with the URL can view the site. There is no login, database, or private
area. The contact email is visible, and the résumé PDF is downloadable unless you remove or
replace it. Treat everything in the folder as public.
