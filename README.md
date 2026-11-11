# Renee Chin — portfolio

A small, dependency-free portfolio for gameplay programming.

## Stack

- Hand-written HTML, CSS, and vanilla JavaScript
- No build step, no framework, no external font or analytics requests
- Responsive layout and reduced-motion support
- Local project images, a local résumé PDF, and local gameplay videos

## Preview locally

From this folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

```text
portfolio/
├─ index.html              homepage
├─ 404.html                not-found page
├─ work.html               project list with filters
├─ work/
│  ├─ ecoworld.html        project 01
│  ├─ 2d-shooter.html      project 02
│  └─ rush-cavate.html     project 03
├─ css/style.css           the whole design system
├─ js/
│  ├─ main.js              nav, reveal, filters
│  └─ quadtree.js          interactive point quadtree canvas
├─ assets/
│  ├─ img/                 project images
│  ├─ video/               gameplay clips and systems previews
│  ├─ game/                source art used for the 2D-Shooter still
│  ├─ Renee_Chin_Resume.pdf
│  ├─ favicon.svg
│  └─ og.jpg
└─ README.md
```

## Add a project

1. Put a 16:10 or 4:3 image in `assets/img/` (or make a graphic card).
2. Copy a `<a class="project-card archive-card">` block in `work.html`.
3. Set `data-category` to one or more of `games`, `professional`, `tools`.
4. Update the `.filter-count` text. The filter code counts visible cards automatically.
5. If the project gets a page, add it in `work/` and link the card to it.

## Deploy

Any static host works. The full guide is in [DEPLOY.md](DEPLOY.md).

**GitHub Pages:** push this folder to a repository, then Settings → Pages → deploy from the branch
and root folder. For a `username.github.io` site, name the repository `buggycww.github.io` and put
these files at the root.

**Netlify / Vercel:** drag the folder in, or connect the repository with no build command and the
project root as the publish directory.

Before going live, update `og:image` in each page to an absolute URL on the final domain. Social
previews do not reliably resolve relative image paths.

## Content notes

- EcoWorld, 2D-Shooter, The Misled, Everything is Against You, Once Upon a Ball, Omamak, DJ Dash!,
  and Veils of Forgotten Power are shown with project captures.
- The 2D-Shooter page uses a short local gameplay recording and three screenshots.
- Rush-Cavate is under NDA. Its video and images are system diagrams, not game footage. This is
  stated on the page.
- The unannounced multiplayer FPS is described in general terms only.

## Contact

reneecww@icloud.com · [github.com/buggycww](https://github.com/buggycww) ·
[buggycww.itch.io](https://buggycww.itch.io) · [YouTube](https://www.youtube.com/@pixel.buggycww)
