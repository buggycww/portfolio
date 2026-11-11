# Renee Chin — portfolio

A small, dependency-free portfolio for gameplay programming, with room for 2D/3D animation and
modelling work as it is added.

## Stack

- Hand-written HTML, CSS, and vanilla JavaScript
- No build step, no framework, no external font or analytics requests
- Responsive layout and reduced-motion support
- Local project images and a local résumé PDF

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
├─ work.html               filterable archive
├─ work/
│  ├─ ecoworld.html        case study 01
│  ├─ 2d-shooter.html      case study 02
│  └─ miliastra.html       case study 03
├─ css/style.css           the whole design system
├─ js/
│  ├─ main.js              nav, reveal, filters
│  └─ quadtree.js          interactive hero canvas
├─ assets/
│  ├─ img/                 project images
│  ├─ game/                source art used for the 2D-Shooter still
│  ├─ Renee_Chin_Resume.pdf
│  ├─ favicon.svg
│  └─ og.jpg
└─ README.md
```

## Add a project

1. Put a 16:10 or 4:3 image in `assets/img/` (or make a graphic card).
2. Copy an `<a class="project-card archive-card">` block in `work.html`.
3. Set `data-category` to one or more of `games`, `professional`, `tools`.
4. Update the `.filter-count` text. The filter code counts visible cards automatically.
5. If the project earns a deep dive, add a page in `work/` and link the card to it.

The homepage has three featured cards and three compact cards. Swap one in when a project becomes
more relevant than what is there.

## Deploy

Any static host works. The full step-by-step guide — including GitHub Pages, Netlify Drop, custom
domains, and a pre-publish checklist — is in [DEPLOY.md](DEPLOY.md).

**GitHub Pages:** push this folder to a repository, then Settings → Pages → deploy from the branch
and root folder. For a `username.github.io` site, name the repository `buggycww.github.io` and put
these files at the root.

**Netlify / Vercel:** drag the folder in, or connect the repository with no build command and the
project root as the publish directory.

Before going live, update `og:image` in each page to an absolute URL on the final domain. Social
previews do not reliably resolve relative image paths.

## Content notes

- EcoWorld, 2D-Shooter, The Misled, Everything is Against You, DJ Dash!, Veils of Forgotten Power,
  and the C++ systems work are presented with project captures or graphics made from project
  assets.
- The 2D-Shooter still is a promotional composition built from the game's own art, not a raw
  in-game screenshot. This is stated in the case study caption.
- Miliastra Wonderland and the unannounced multiplayer FPS are NDA-safe summaries. No game assets
  from either project are shown.
- Third-party art and audio licenses used inside the games remain with their original authors.
- Animation and 3D modelling are intentionally marked as upcoming. Replace those cards with real
  work as it is ready; do not publish placeholder art as a project.

## Contact

reneecww@icloud.com · [github.com/buggycww](https://github.com/buggycww) ·
[buggycww.itch.io](https://buggycww.itch.io) · [YouTube](https://www.youtube.com/@pixel.buggycww)
