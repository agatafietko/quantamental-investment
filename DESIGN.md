# Design System: Sovereign Fund (The Editorial Command)

## 1. Overview & Creative North Star
**Theme**: "The Living Ledger"
This design system is modeled after the gravitas of a private sovereign wealth memorandum—delivering a bespoke, heavy-stock annual report feel. By rejecting rounded corners and standard grid containers, it embraces a sharp, architectural rigor that signals precision, tradition, and absolute permanence.

## 2. Color Palette
The palette is a dialogue between the tactile warmth of a physical surface and the authoritative weight of fresh ink.

*   **Primary (Ink):** `#000613` / `#001F3F`. Used for the most critical data points and heavy headlines. This provides the system's authoritative weight.
*   **Background (Ivory):** `#FAF9F5`. A warm, off-white that mimics high-grade cotton paper.
*   **Secondary/Tertiary (Gold):** `#D4AF37` / `#735C00`. Used as *instruments* rather than mere colors (e.g., rule lines, accents, and high-level success indicators).
*   **Ambient Shadows:** `rgba(0, 31, 63, 0.06)` with a 32px blur and 0px offset.

### Signature Textures & Execution
*   **The "No-Line" Rule:** Standard 1px grey borders are strictly prohibited. Boundaries should be defined by tonal shifts (e.g., `#FAF9F5` to `#F4F4F0`), 0.5pt gold rule lines (`#D4AF37`), or negative space.
*   **Gradients:** Apply a subtle linear gradient to main interactive surfaces (like a primary CTA). Transition from `primary_container` (`#001F3F`) to `primary` (`#000613`) at a 15-degree angle to mimic the slight sheen of wet ink on a page.

## 3. Typography
The typography uses **Newsreader** (Serif) for narrative and data, and **Work Sans** (Sans-Serif) strictly for utilitarian labels to create a "Modern Traditionalist" tension.

*   **Display (Large):** `Newsreader`, 3.5rem. Used for top-level AUM or Portfolio names.
*   **Headline (Medium):** `Newsreader`, 1.75rem. For section titles, which should always sit above a gold rule line.
*   **Body (Large):** `Newsreader`, 1rem. Used for research notes and commentary.
*   **Labels:** `Work Sans`, 0.75rem. All-caps with 0.05em letter spacing for metadata (e.g., "MARKET CAP", "TIMESTAMP").

## 4. Layout Metadata & Architecture
### Elevation & Depth
*   **Tonal Layering:** No material Z-axis shadows for importance. Instead, rely on surface density (e.g., `#E3E2DF` cards on a `#FAF9F5` background).
*   **Zero-Radius Mandate:** All elements (buttons, cards, inputs) must have a `0px` border radius. Sharp corners reflect institutional rigor.

### Components
*   **Buttons:** 
    *   **Primary:** Sharp `#001F3F` block with `#FFFFFF` Newsreader text. Transition background to `#000613` on hover (no glow).
    *   **Tertiary:** Gold text (`#D4AF37`) in Work Sans Bold, all-caps, with a 1px gold rule line below it that expands on hover.
*   **Input Fields:** Bottom-line-only approach using `outline-variant`, turning gold (`#D4AF37`) on focus. Input text must be Serif (`Newsreader`).
*   **Cards & Lists:** No horizontal lines to separate list items. Use vertical white space or a subtle alternating background shift. Allow asymmetric cards.
*   **Data Visualizations:** Gold (`#D4AF37`) for the primary data line and Ink (`#001F3F`) for the fill. Background grids should use `outline-variant` at 10% opacity.

## 5. Do's and Don'ts
*   **Do:** Embrace asymmetry, use high contrast (Ink on Ivory), and trust the Serif font for numeric values.
*   **Don't:** Never use rounded corners, avoid informal app terminology (e.g., "hamburger menu"), and do not use pure greys (every off-white must have a hint of warmth).
