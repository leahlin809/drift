---
name: "Drift — Showcase"
description: "A quiet editorial atlas system scoped to the browser Showcase at /showcase and its standalone Demo page at /demo."
colors:
  paper: "#f4f6f3"
  white: "#fcfdfc"
  ink: "#17201c"
  muted-ink: "#66706b"
  atlas-green: "#3c6b5b"
  mist: "#dde7e1"
  hairline: "#cdd6d1"
  warm-paper: "#ece9e2"
  capture-surface: "#e7eae6"
  on-atlas-green: "#ffffff"
typography:
  display:
    fontFamily: "Georgia, Noto Serif SC, Songti SC, serif"
    fontSize: "clamp(4rem, 8.6vw, 8.2rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Georgia, Noto Serif SC, Songti SC, serif"
    fontSize: "clamp(2.625rem, 3.35vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Aptos Narrow, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.14em"
rounded:
  capture: "16px"
  sheet: "22px 22px 12px 12px"
  phone: "48px"
  phone-screen: "41px"
  pill: "999px"
spacing:
  compact: "9px"
  cluster: "12px"
  component-x: "17px"
  section-x: "clamp(28px, 8vw, 132px)"
  section-y: "clamp(72px, 8vw, 128px)"
components:
  button-primary:
    backgroundColor: "{colors.atlas-green}"
    textColor: "{colors.on-atlas-green}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  chip:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  capture-card:
    backgroundColor: "{colors.capture-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.capture}"
---

# Design System: Drift — Showcase

## Overview

**Creative North Star: "The Quiet Atlas Reader"**

This system turns the browser Showcase into a contemporary cultural-atlas reader: spacious like a small exhibition catalogue, precise like a map legend, and calm enough for the live product to remain the main artifact. Paper-toned fields, ink typography, fine rules, and sparse atlas green create an editorial rather than promotional atmosphere. Large English serif statements carry the narrative while narrow utility labels carry geography, status, and technical facts.

This document governs the Showcase route at `/showcase`, the standalone interactive Demo page at `/demo`, and their implementations under `src/showcase/`. The incumbent React Native application has its own visual authority in `src/theme/tokens.ts`, including adaptive light/dark themes, native typography, radii, and component behavior. Do not import this paper/ink/editorial system into native product routes, and do not rewrite Showcase primitives to match the native theme merely because both worlds share a restrained green sensibility.

**Key Characteristics:**

- Full-height editorial spreads with one dominant idea per section.
- English serif display type paired with clear Windows-oriented sans-serif body copy.
- Paper, ink, hairlines, and reserved atlas green instead of a dashboard surface stack.
- A Point → City → Region → Country example set that pairs concise line icons with real geographic values.
- A live phone demo and product captures as the energetic center of an otherwise restrained composition.
- Keyboard, reduced-motion, and presentation-distance legibility built into the surface.

## Colors

The palette feels like cool archival paper marked with dark ink and a single cartographic green; mist and warm paper create quiet classification without turning sections into cards.

### Primary

- **Atlas Green:** Reserved for primary actions, active wayfinding, selected filters, geographic nodes, and a few display accents.

### Secondary

- **Mist:** A cool green wash for object chips, the phone-stage field, and soft categorical emphasis.
- **Warm Paper:** A sparingly alternating chip fill that keeps classifications from feeling mechanically uniform.

### Neutral

- **Paper:** The dominant Showcase canvas and the background inside geographic nodes.
- **White:** A slightly lifted control and sheet surface, never a blanket card-grid background.
- **Ink:** Primary text, strongest dividers, and the phone-shell family.
- **Muted Ink:** Secondary explanations, captions, and de-emphasized facts.
- **Hairline:** Section boundaries, row rules, quiet control borders, and geographic connectors.
- **Capture Surface:** A cool neutral field behind product screenshots, distinct from the page paper and white controls.
- **On Atlas Green:** Text and selected-state content placed on atlas green.

### Named Rules

**The Atlas Green Rarity Rule.** Atlas green marks action, current position, or spatial meaning; it is not a decorative section background.

## Typography

**Display Font:** Georgia, with Noto Serif SC, Songti SC, and generic serif fallbacks  
**Body Font:** Segoe UI, with PingFang SC, Microsoft YaHei, and generic sans-serif fallbacks  
**Label Font:** Aptos Narrow, with Segoe UI and generic sans-serif fallbacks

**Character:** The serif voice makes product reasoning feel authored and cultural, while the sans-serif voice keeps English explanations crisp. Narrow uppercase labels behave like atlas marginalia rather than interface chrome.

### Hierarchy

- **Display:** Regular, fluid oversized type with a compressed line-height and slight negative tracking. Use only for the cover title and similarly singular statements.
- **Headline:** Regular, fluid serif type with a safe 1.02 line-height. Long section theses use authored semantic line breaks; each authored line stays intact instead of being wrapped again by the browser.
- **Title:** Regular serif titles appear in comparison rows, capture captions, roadmap groups, and implementation facts at smaller, context-specific sizes.
- **Body:** Regular sans-serif copy uses generous leading and controlled measure; lead paragraphs stop at roughly 660px and supporting copy is shorter.
- **Label:** Bold, narrow, tracked uppercase type names spatial levels, technical facts, and live status.

### Named Rules

**The Serif Leads Rule.** Serif type introduces ideas and artifacts; sans-serif type explains, labels, and enables action.

## Layout

Desktop presentation is a vertical sequence of seven full-viewport spreads. Each section centers a content frame capped at 1240px and uses fluid outer padding. Two-column compositions are deliberately asymmetric, with ratios changing to suit the story rather than conforming to a reusable dashboard grid. The fixed 64px top bar and compact right-hand section rail stay outside the editorial canvas.

At 900px and below, snap scrolling, fixed-height sections, and the section rail are removed. Every major grid becomes one column, the page becomes a continuous reading document, the phone stage moves below the cover copy, and the capture flow becomes a horizontal snap strip. At 560px and below, headings step down, comparison and roadmap structures stack, rules become left-aligned vertical pairs, and section side padding tightens to 22px.

Whitespace is structural. Large gaps separate thesis from evidence; fine rules align comparisons, build facts, and roadmap items without enclosing them in cards. The live phone, product captures, and inheritance diagram provide the principal shapes within the open field.

## Elevation & Depth

The Showcase is flat by default. Paper tone, white controls, mist fields, one-pixel rules, overlap, and scale create hierarchy. The only meaningful ambient elevation belongs to the live phone shell, whose broad soft shadow separates the interactive product artifact from the editorial page; fixed navigation uses translucency and a divider rather than a floating shadow.

### Shadow Vocabulary

- **Phone Ambient:** A broad, low-opacity ink shadow used only beneath the live phone demo.

### Named Rules

**The Exhibit Floor Rule.** Content rests on the paper plane; only the live product artifact earns physical lift.

## Shapes

The base form language pairs severe editorial lines with fully rounded controls and labels. Buttons, chips, status labels, and rail markers use pill geometry. Product captures use restrained 16px clipping, while the phone uses an intentionally large 48px outer radius and 41px screen radius. The simulated filter sheet introduces one asymmetric silhouette—more rounded at the top than the bottom—to echo a native bottom sheet without turning the Showcase itself into native UI.

Hairlines define rows and section boundaries. The signature geographic diagram terminates these lines with small outlined circular nodes, connecting editorial rules to the product's spatial model.

## Components

### Buttons

- **Shape:** Fully rounded, presentation-distance controls with a 44px minimum height.
- **Primary:** Atlas-green fill, white content, and compact horizontal padding; used for the persistent and in-section routes to the interactive demo.
- **Secondary:** White fill, ink content, and a hairline border; used for fullscreen and narrative navigation.
- **Hover / Focus:** Hover either deepens atlas green or darkens the neutral border. Keyboard focus uses a three-pixel translucent green outline with a three-pixel offset.

### Chips

- **Style:** Small pill labels use mist or occasional warm paper, compact padding, and ink text.
- **State:** The embedded filter specimen uses atlas green with white text for selection; ordinary object chips remain non-interactive classification labels.

### Cards / Containers

- **Corner Style:** Product captures are clipped to the capture radius; they are not wrapped in generic elevated cards.
- **Background:** Captures sit on quiet cool-neutral fields, with captions placed directly on the page below.
- **Shadow Strategy:** No card shadow. Only the live phone uses elevation.
- **Border:** Editorial groups rely on top and bottom hairlines rather than perimeter boxes.
- **Internal Padding:** The simulated filter capture uses compact, uneven sheet padding that follows its content.

### Navigation

The fixed top bar is a thin translucent paper band with serif branding, minimal actions, and a hairline lower edge. The desktop section rail presents seven 44px hit targets whose tiny vertical markers expand and turn atlas green for the current section. On narrow layouts, the rail disappears and only the primary demo action remains in the top bar.

### Geographic Inheritance Examples

The signature Point → City → Region → Country component uses narrow uppercase labels, restrained atlas-green line icons, and one concrete example at each level. A coordinate, Beijing, the North China Plain, and China make spatial precision understandable without relying on abstract line lengths. It should recur only when spatial hierarchy or wayfinding is genuinely being communicated.

### Live Phone Stage

The real browser demo sits inside a dark, rounded phone shell over an irregular mist oval. A small bordered Live demo label establishes immediacy. This is the Showcase's primary depth event and the first viewport's proof that the product is usable, not a decorative mockup.

## Do's and Don'ts

### Do:

- **Do** keep the editorial paper/ink/atlas-green system confined to `/showcase`, `/demo`, and their Showcase-owned components.
- **Do** preserve one dominant idea, asymmetric whitespace, and a single strong artifact or diagram per spread.
- **Do** use atlas green for action, current state, selection, or spatial meaning.
- **Do** retain visible keyboard focus, 44px interaction targets, and the reduced-motion override.
- **Do** collapse desktop spreads into a continuous reading page at the established narrow-layout breakpoints.
- **Do** let real product captures and the live demo provide visual energy.

### Don't:

- **Don't** apply Showcase tokens, serif hierarchy, scroll-snap behavior, or editorial layout rules to the incumbent React Native application.
- **Don't** replace open compositions with a dashboard card grid or repeated floating containers.
- **Don't** use atlas green as ambient decoration or a full-section wash.
- **Don't** add promotional gradients, marketing animation, speculative claims, or decorative map imagery.
- **Don't** add shadows to ordinary controls, rows, chips, or capture cards.
- **Don't** preserve full-height snap sections on mobile where they impede continuous reading.
