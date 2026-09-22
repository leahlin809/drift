# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Users

Drift is primarily for a person building a private, long-lived cultural memory of the world. The immediate secondary audience is an interviewer viewing a short product case-study presentation and browser demo.

## Product Purpose

Drift / 所见 is an iPhone-first private cultural atlas. It lets a person capture books, films, music, people, historical events, places, articles, podcasts, and personal notes; connect them to countries, regions, cities, or points; and rediscover them through spatial relationships.

Success means a user can quickly record an interest, attach an appropriately precise location, and later understand how their cultural interests are distributed across the world.

## Positioning

Drift combines cultural collection with a map-first spatial model. It is neither a POI bookmark list nor a media database: entries may have exact or deliberately fuzzy spatial relationships, and the user's own tags and topics emerge over time.

## Operating Context

- The native product is designed iPhone-first with React Native and Expo.
- The existing Windows browser build is a stable product demonstration and does not require iOS signing.
- The interview showcase is a separate browser presentation surface that must explain the product in three to five minutes and open the interactive demo directly.
- The primary product loop is capture → spatialize → rediscover.

## Capabilities and Constraints

- Core objects: Entry, Location, Tag, and Topic.
- Location levels: Country, Region, City, and Point.
- Locations inherit upward, never infer downward; aggregation deduplicates by Entry ID.
- Core demo flows include Map, Interest Layer, country selection, spatial bottom sheet, entry detail, filters, Library, Add Entry, and Location Picker.
- The showcase must remain isolated from the core data model, native architecture, and Mapbox Studio style.
- Demo data is synthetic and stable. No customer, performance, or commercial claims are established.

## Brand Commitments

- English name: Drift
- English subtitle: Your Own Cultural Atlas
- Chinese name: 所见
- Chinese subtitle: 你的私人文化地图
- Voice: concise, calm, personal, and editorial rather than promotional.
- The product remains map-first, private, restrained, spatial, and fluid.

## Evidence on Hand

- Product, design, map, architecture, and feature specifications under `docs/`.
- Stable in-memory demo data in `src/demo/seed.ts`.
- Current UI captures in `promo-video/public/assets/`.
- Existing React Native Web demo and iPhone-like preview shell.

## Product Principles

- Map first.
- Browse before search.
- Capture first, organize later.
- Preserve fuzzy as well as precise spatial relationships.
- Keep business data independent from the map provider.

## Accessibility & Inclusion

The showcase and browser demo must remain keyboard navigable, respect reduced-motion preferences, retain visible focus, and keep readable contrast at presentation distance.
