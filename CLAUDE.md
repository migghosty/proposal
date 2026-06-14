# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file interactive romantic proposal page (`proposal.html`) — no build system, no dependencies, no package manager. Open the file directly in a browser to run it.

## Architecture

Everything lives in `proposal.html`: CSS custom properties, inline styles, and vanilla JS are all embedded in one file with no external dependencies beyond Google Fonts (loaded via CDN).

**Screen flow:** Five named screens (`screen-intro` → `screen-solar` → `screen-message` → `screen-yes` / `screen-farewell`) managed by toggling the `.active` CSS class via `goTo(id)`. Only one screen is visible at a time.

**Two canvas animation loops run concurrently via `requestAnimationFrame`:**
- `drawFrame(t)` — starfield + shooting stars on `<canvas id="starfield">`
- `animatePlanets(ts)` — orbital planet positions calculated from elapsed time and `angles[]` array

**Key interaction logic:**
- `wrongPlanet(name)` — cycling easter egg messages for Mercury/Venus, standard hints for Earth/Mars
- `handleNo()` — a 4-phase escalation sequence tracked by `noPhase` counter; the "No" button changes label each click, triggering a shake animation on phase 2-3, then redirects to `screen-farewell`
- Confetti burst (`launchHearts`) fires on `transitionend` of `#screen-yes`

**CSS variables** defined in `:root`: `--navy`, `--nebula`, `--rose`, `--starlight`, `--gold`, `--soft-purple`.
