# WILL.J

A static English profile for Wilson Jcy Cheung, a Hong Kong DJ.

For inquiries: [wforwilsoncy@gmail.com](mailto:wforwilsoncy@gmail.com), Instagram [@wilson_jcy](https://www.instagram.com/wilson_jcy/), and YouTube [@wilson_jcy](https://www.youtube.com/@wilson_jcy).

## Preview this folder

Opening `index.html` as a `file://` page often blocks the YouTube player, including autoplay. Use a local static server, or upload this folder to [Netlify Drop](https://app.netlify.com/drop) for a temporary preview. Do not expect autoplay to work from a double-clicked file.

From this folder:

```bash
python3 -m http.server 4721
```

Then open [http://127.0.0.1:4721](http://127.0.0.1:4721).

## Deploy on Netlify

This is a static site. There is no build step. `netlify.toml` publishes the folder root. If you zip the site for Netlify Drop, keep `index.html` at the root of the zip.

## Logo

The header, the hero wordmark, and the footer use the official mark:

`assets/will-j-logo.png`

It is a transparent PNG. Replace that file to change every logo. Do not typeset a substitute wordmark.

## Portrait

The hero uses the cut-out:

`assets/will-j-portrait.png`

`assets/will-j-portrait.jpg` is the current studio photograph (white tee, headphones) and the fallback if the PNG is missing. The cut-out has a transparent background. Do not burn a logo or type into the photo.

## Event

Event opens as a cover-flow: the upcoming poster is first and centered, with neighboring posters peeking from the sides. Use the arrows, click a neighbor, swipe or drag, or the left and right keys. The carousel loops.

| File | Event |
| --- | --- |
| `assets/posters/2026-12-05_STRAY-TO-STAY_official-Dorsett-poster.jpg` | STRAY TO STAY: SKY HIGH DJ NIGHT, Jin Bo Law Skybar, 5 Dec 2026, 8:00pm–11:00pm (Upcoming) |
| `assets/posters/big-and-bang-nov-14-jin-bo-law.jpg` | BIG & BANG! SKY HIGH DJ NIGHT, Jin Bo Law Skybar, 14 Nov 2026, 8:00pm–11:00pm |
| — | After Party, SOCIAL WORKOUT, ELEMENTS, 13 Nov 2026, 7:30pm–8:15pm (no poster supplied; shown as a text slide) |
| `assets/posters/tidal-ocean-park-nov-7.jpg` | GUESTLIST TIDAL, Ocean Park Grand Aquarium, 7 Nov 2026, 6:30pm–10:30pm |
| `assets/posters/hysan-launch-nov-2-urban-park.jpg` | Launch Party @Hysan, Urban Park, 2 Nov 2026, 12:00pm–4:00pm |
| `assets/posters/rayban-meta-oct-31-harbour-city.jpg` | Ray-Ban Meta Gen 3 launch, Ocean Terminal, Harbour City, 31 Oct 2026, 2:00pm–6:00pm |
| `assets/posters/traffic-light-party-oct-10-arcadia.jpg` | Traffic Light Party, Arcadia Rooftop, Causeway Bay, Saturday 10 Oct 2026, 10:00pm |
| `assets/posters/crave-and-rave-sept-19-peak.jpg` | CRAVE & RAVE, Peak Pizza & Messina, The Peak, Saturday 19 Sept 2026 (no set time on the poster) |
| `assets/posters/boomerang-19-dec.jpg` | The Illusionist, Boomerang, 19 Dec 2025, 11:00pm–5:00am |
| `assets/posters/hotboy-pizza-sept-26-ellipsis.jpg` | HOTBOY PIZZA, Ellipsis, Sheung Wan, 26 Sept 2025, 10:30pm until late |

Do not add venues, dates, or event names that are not on this list. Do not invent artwork for an event that has no poster.

## Photos

The bottom gallery is a two-row, mixed-size photo wall on a slowly rotating concave curve. Hover pauses the motion; arrows, drag, or a click will also turn it. It uses only the supplied photos in `assets/gallery/`, repeated around the ring:

- `01.jpg` — at the decks, COLD FAVOURS THE BOLD wall
- `02.jpg` — rooftop, orange TOVA neon
- `03.jpg` — beanie, blue neon, Pioneer booth
- `04.jpg` — two DJs from behind, red club lights
- `05.jpg` — arm raised, red club
- `06.jpg` — at the decks, WILL J neon, sunglasses on head

Photos 07–09 are not on disk and are not included. Do not substitute other images.

## Playback

The bottom bar plays the official YouTube video [https://www.youtube.com/watch?v=NPqB5V_KS9s](https://www.youtube.com/watch?v=NPqB5V_KS9s) (Ocean Park opening set) through YouTube’s IFrame API. The player attempts unmuted autoplay as soon as it is ready. Many browsers block unmuted autoplay; if that happens, the set starts on the first click, tap, scroll, or key, and the Play control stays visible. Nothing is downloaded from YouTube. There is no local audio-file fallback.

## Fonts

Fraunces and Outfit are in `assets/fonts/` under the SIL Open Font License.
