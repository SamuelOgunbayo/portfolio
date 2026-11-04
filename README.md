# Samuel Ogunbayo: Portfolio (plain HTML, CSS and JavaScript)

No npm, no build step, no frameworks. Open `index.html` and it works.

```
index.html          the page (all copy lives here)
css/styles.css      all styling
js/main.js          menu, active nav link, project filters
data/projects.js    ALL project content: edit this file to change projects
images/             portrait (unaltered) and Open Graph image
fonts/              Poppins, self-hosted
favicon.svg  robots.txt  sitemap.xml
docs/project-audit.md   notes from the URL audit
```

## Run locally
Double-click `index.html`, or serve the folder (recommended):
```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Before you publish
1. **Replace `YOUR-DOMAIN.com`** with your real address in `index.html` (canonical, Open Graph, Twitter, JSON-LD), `robots.txt` and `sitemap.xml`. If you don't have a domain yet, deploy first, then use the URL your host gives you.
2. **Email / GitHub (optional):** in `index.html`, find the comment `To add email` in the Contact section and add the button. Add a GitHub link in the "Find me online" list and the footer the same way.
3. **Projects:** in `data/projects.js`, add a one-line `description` for TEDCO, Dotun Tejuoso MDF, Xplicit Xtetic Heritage and RUSISD, and check the name-only descriptions.

## Editing projects
Each line in `data/projects.js` is one project: `title`, `url`, `type` (`"personal"` shows "Personal Project", `"team"` shows "Team Project | Don Dada Technologies"), `category`, `description`, `thumbnail`. Technologies used to build each project are deliberately not shown. Leave `description` or `category` out to hide them. Cards load a live screenshot from a free screenshot service and fall back to a branded tile if it fails. For a permanent image, save a screenshot in `images/projects/` and set `thumbnail: "images/projects/tedco.jpg"`.

## Push to GitHub
Create an **empty** repository on github.com, then:
```bash
git init
git add .
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy on Vercel (static)
1. vercel.com → **Add New → Project** → import the repository.
2. **Framework Preset:** `Other`. Leave **Build Command** and **Output Directory** empty (the site is served from the repository root).
3. Click **Deploy**. Every push to `main` redeploys.
4. **Custom domain (later):** Project → Settings → Domains → add your domain and create the DNS records Vercel shows. Then update `YOUR-DOMAIN.com` as in step 1 above and push.

Any static host works too: Netlify (drag the folder in), GitHub Pages (Settings → Pages → deploy from `main`), or a normal web host (upload the files).
