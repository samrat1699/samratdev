# Academic Portfolio Website

Static website (HTML, CSS, JavaScript). No build step and no dependencies.

## Structure

```
index.html            page content
404.html              not-found page
assets/css/app.css  styles and the ten themes
assets/js/app.js     theme switcher, search, filters, charts
assets/img/           photo and thumbnail (add your files)
assets/cv/            CV PDF (add samrat_cv.pdf)
```

## Before deploying

1. Add `assets/img/samrattt.jpeg` and `assets/img/thumbnail.jpg`.
2. Add `assets/cv/samrat_cv.pdf`.
3. Replace any link that still starts with `PASTE_` (those links are hidden until you fill them in).

## Run locally

Open `index.html` in a browser, or run a local server:

```
python3 -m http.server 8000
```

then visit http://localhost:8000

## Deploy

**GitHub Pages**: push this folder to a GitHub repository (branch `main`), then go to Settings > Pages > Source and choose "GitHub Actions". The included workflow publishes the site on every push.

**Netlify**: drag the folder onto app.netlify.com/drop, or connect the repository. Publish directory is `.` and `netlify.toml` is already set up.

**Vercel**: run `npx vercel` in this folder, or import the repository. `vercel.json` is already set up.

## Themes

The theme button in the top bar changes the theme each time you click it, cycling through ten themes (light, light yellow, sky blue, soft rose, lavender, sand, forest, slate, dark, midnight). To add a theme, add a `[data-theme=name]` block of colour variables in `app.css` and add it to the `themes` list in `app.js`.

## Adding figures and screenshots

1. Save the image in `assets/img/figures/` (PNG or JPG, about 1600 px wide, under 400 KB).
2. In `index.html`, paste this block inside the project or publication entry, right after its bullet list (`</ul>`):

```html
<div class="figs">
  <figure>
    <img src="assets/img/figures/your-image.png" alt="Short description" loading="lazy">
    <figcaption>Figure 1. What the figure shows.</figcaption>
  </figure>
</div>
```

Add more `<figure>` blocks inside the same `<div class="figs">` for a side-by-side gallery. Visitors can click an image to enlarge it, and a figure whose image file is missing is hidden automatically.