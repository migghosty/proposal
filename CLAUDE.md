# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive romantic proposal page — no build system, no dependencies, no package manager. Open `proposal.html` directly in a browser to run it.

## File Structure

- **`proposal.html`** — markup only; links to `style.css` and `proposal.js`
- **`style.css`** — all styles and keyframe animations
- **`proposal.js`** — all runtime logic

No external dependencies beyond Google Fonts (loaded via CDN).

## Architecture

**Screen flow:** Five named screens (`screen-intro` → `screen-solar` → `screen-message` → `screen-yes` / `screen-farewell`) managed by toggling the `.active` CSS class via `goTo(id)`. Only one screen is visible at a time.

**Two canvas animation loops run concurrently via `requestAnimationFrame`:**
- `drawFrame(t)` — starfield + shooting stars on `<canvas id="starfield">`
- `animatePlanets(ts)` — orbital planet positions calculated from elapsed time and `angles[]` array; radii are scaled dynamically to the container size so planets stay within bounds on any screen

**Key interaction logic:**
- `wrongPlanet(name)` — cycling easter egg messages for Mercury/Venus, standard hints for Earth/Mars
- `handleNo()` — a 4-phase escalation sequence tracked by `noPhase` counter; the "No" button changes label each click, triggering a shake animation on phase 2-3, then redirects to `screen-farewell`
- Confetti burst (`launchHearts`) fires on `transitionend` of `#screen-yes`; each emoji gets a random `--float-rot` CSS custom property consumed by the `floatUp` keyframe

**CSS variables** defined in `:root`: `--navy`, `--nebula`, `--rose`, `--starlight`, `--gold`, `--soft-purple`.

## REQUIREMENTS

**IPhone comaptability:** The primary device this will be used on is a smart phone so we must design it to fit a smart phone.
