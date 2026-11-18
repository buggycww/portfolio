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

Serve it rather than opening the files directly: YouTube refuses to start an embedded player from
`file://` (error 153), so pages opened by double-click fall back to a poster that links out to
YouTube. Over http(s) the real player is used.

## Structure

```text
portfolio/
├─ index.html                          homepage
├─ 404.html                            not-found page
├─ work.html                           project list with filters
├─ work/
│  ├─ ecoworld.html                    project 01
│  ├─ 2d-shooter.html                  project 02
│  ├─ rush-cavate.html                 project 03
│  ├─ misled.html                      project 04
│  ├─ everything-is-against-you.html   project 05
│  ├─ once-upon-a-ball.html            project 06
│  ├─ omamak.html                      project 07
│  ├─ dj-dash.html                     project 08
│  ├─ veils-of-forgotten-power.html    project 09
│  ├─ quadtree-visualiser.html         project 10
│  ├─ linkedlist-visualiser.html       project 11
│  └─ warrior-rpg.html                 project 12
├─ css/style.css                       the whole design system
├─ js/
│  ├─ main.js                          nav, ticker, reveal, filters, video fallback
│  └─ quadtree.js                      interactive point quadtree canvas
├─ assets/
│  ├─ img/                             project images
│  ├─ img/yt/                          stills pulled from the gameplay videos
│  ├─ video/                           gameplay clips and systems previews
│  ├─ game/                            source art used for the 2D-Shooter still
│  ├─ references/                      layout references
│  ├─ Renee_Chin_Resume.pdf
│  ├─ favicon.svg
│  └─ og.jpg
└─ README.md
```

## Project pages

Every card on the homepage and in the archive links to a page in `work/`, and every page uses the
same layout:

- `case-hero` — project number, title, and the meta strip
- `case-split` — the video spans both columns at the top (YouTube or a local mp4), then two
  columns beneath it: left is the pitch (`lede`), description paragraphs, `case-rule`, the
  Features list, and the links; right is three `case-shot` images.
  Add `case-split--no-video` when there is no video.
- `case-next` — the next project in the chain

Screenshots open in a lightbox (click, Enter, or Space), with arrow-key and arrow-button
navigation. Placeholders stay inert.

Missing screenshots use `<div class="case-shot case-shot--filler">` placeholders, so a page never
ships with a broken image.

## Add a project

1. Put a 16:10 or 4:3 image in `assets/img/` (or make a graphic card).
2. Copy a `<a class="project-card archive-card">` block in `work.html`, and the same card in
   `index.html`.
3. Set `data-category` to one or more of `games`, `professional`, `tools`.
4. Update the `.filter-count` and `.archive-count` text. The filter code counts visible cards.
5. Copy an existing page in `work/`, replace the copy, and link both cards to it.
6. Point the previous project's `case-next` block at the new page.

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

- Stills in `assets/img/yt/` are single frames pulled from each project's own gameplay video, so
  every page shows real footage. Replace them with full-resolution screenshots when available.
- The 2D-Shooter page uses a short local gameplay recording and three screenshots.
- Rush-Cavate is under NDA. Its images are system diagrams, not game footage, and the page says so.
  The page links to the public level on Miliastra (Asia). It has no video: the old clip was a
  generated diagram loop, not gameplay. `assets/video/rush-cavate.mp4` is now unused.
- Warrior RPG has no captures yet, so its three image slots are placeholders. The card and the copy
  come from the real GAS source.
- The unannounced multiplayer FPS is not on the site. It stays on the résumé only.
- The homepage shows six selected projects; `work.html` lists all twelve.

## Contact

reneecww@icloud.com · [github.com/buggycww](https://github.com/buggycww) ·
[buggycww.itch.io](https://buggycww.itch.io) · [YouTube](https://www.youtube.com/@pixel.buggycww)
