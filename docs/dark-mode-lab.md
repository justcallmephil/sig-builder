# Dark Mode Lab

This document defines the experimental framework for recipient-side dark-mode support.

## Production baseline

The `main` branch uses one glow logo for copied/downloaded signatures. This is the stable fallback because Outlook commonly strips or ignores CSS-based image swapping.

## Experimental branch

Create and use a separate branch named `dark-mode-lab`. Do not merge experiments into `main` until they pass the compatibility matrix.

## Experiments

1. Direct HTML installation in Classic Outlook for Windows.
2. `prefers-color-scheme` image swapping.
3. Outlook `[data-ogsc]` selectors.
4. `<picture>` and `srcset` behavior.
5. Conditional MSO markup.
6. Apple Mail and iOS Mail dark-mode handling.
7. Gmail web and mobile behavior.

## Test matrix

Record compose view, received view, light mode, dark mode, logo behavior, text color, message background, and any clipping or spacing changes for each client.

## Acceptance criteria

An experiment may replace the production baseline only if it does not regress Outlook copy/paste, Apple Mail rendering, spacing, accessibility, or the glow-logo fallback.
