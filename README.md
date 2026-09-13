# guymellsop.dev

Portfolio site. Built with [Astro](https://docs.astro.build).

## The idea in one line

**Content as data; two renderers.** Every piece of work is one markdown file. The plain site
renders those files as web pages. A future 3D "museum" will render the same files as plaques
and screens. Edit a description once and both change, because there is only one description.

## Commands

```bash
npm run dev       # local dev server, usually http://localhost:4321
npm run build     # build to ./dist
npm run preview   # serve ./dist locally, to check the real output
```

## Where things live

```
src/
  content.config.ts        the schemas — the single definition of what an exhibit is
  content/
    rooms/*.md             the six disciplines (tech art, gameplay systems, ...)
    exhibits/*.md          one file per piece of work. This is the whole site's content.
  layouts/Base.astro       page shell: <head>, header, footer
  components/              small reusable bits
  pages/
    index.astro            the front page - filtered to tier: front, ordered by frontRank
    work/index.astro       everything, grouped by room
    work/[...id].astro     one page per exhibit
  styles/global.css        all the CSS. No framework.
public/                    files served as-is (favicon, images)
```

## Adding a piece of work

Create `src/content/exhibits/some-name.md`. The filename becomes the URL
(`/work/some-name/`).

```markdown
---
title: The magical stairs
hook: One sentence that stands on its own - this is the card and the museum plaque.
room: tech-art                 # must match a file in content/rooms/
order: 1                       # position within the room
tier: front                    # "front" (the short version) or "deep" (everything else)
frontRank: 1                   # position on the front page; only used when tier: front
project: Neon Echo
year: 2025
tech: [Niagara, Blueprint]
defensibility: own             # "own" or "directed" - see below
media: []
---

Markdown body goes here. Headings, lists, links - the usual.
```

**The schema is enforced at build time.** Leave out `hook` and the build fails with a message
naming the file. That is deliberate: a broken page should never reach the site. Same idea as
making an invariant structural instead of remembering to check it.

### `defensibility`

- `own` - written and understood; explainable line by line.
- `directed` - architecture and direction mine, implementation largely AI-generated.

Marking a piece `directed` makes the exhibit page **render a disclosure automatically**. It
cannot be forgotten on an individual page, which is the point.

### `tier`

- `front` - the pamphlet. Curated and ranked, for someone with ninety seconds.
- `deep` - the encyclopedia. Everything worth showing, one click away.

The front page is a *filter* over the same content, not a separately maintained list. Promote
something by changing one word.

## Media

**Do not commit video to this repo.** Videos live in the Cloudflare R2 bucket `guymellsop-media`,
served at `https://media.guymellsop.dev/<file>`. Posters stay local in `public/posters/` - they are
small. Videos use `preload="none"`, so nothing downloads until a visitor presses play.

### Adding a video

1. Edit in Resolve: crop out the taskbar, cut to ~20 s, export MP4.
2. Make a web encode - silent, 1920 wide, playable before fully downloaded:

   ```bash
   ffmpeg -i input.mp4 -map 0:v:0 -an -dn -map_metadata -1 -write_tmcd 0 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart name.mp4
   ```

   Expect roughly 5-8 MB for 20 s. Check small UI text is still readable; drop to `-crf 23` if not.
3. Poster: `ffmpeg -ss <seconds> -i name.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 3 public/posters/name.jpg`
   - pick a frame where nothing is selected and the result is on screen.
4. Upload `name.mp4` to the bucket (dashboard: R2 > guymellsop-media > Objects > Upload).
5. Add to the exhibit's frontmatter:

   ```yaml
   media:
     - type: video
       src: https://media.guymellsop.dev/name.mp4
       poster: /posters/name.jpg
       caption: What the viewer is watching, in one sentence.
   ```

## Deploying

Not wired up yet. The plan:

1. Push this repo to GitHub.
2. Connect it to **Cloudflare Pages** - build command `npm run build`, output directory `dist`.
3. Move DNS for `guymellsop.dev` from Namecheap to Cloudflare, then attach the domain.

`.dev` domains are HTTPS-only at the browser level (HSTS preload), so the automatic
certificate from the host is doing real work - plain HTTP will not load at all.

## What's deliberately not here yet

- The 3D museum. It consumes this same content later; it is an enhancement, not the site.
- Any JavaScript framework. Astro ships zero JS by default and the plain site should stay
  plain. React gets added only when the museum needs it, as an island on one page.
