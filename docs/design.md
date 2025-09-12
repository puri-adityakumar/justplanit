## Design guide (LLMs and contributors)

### Typography

- **Lora (`font-lora`)**: Branding/logo only.
  - Used on the “Just Plan It!” brand text.
- **Instrument Serif (`font-instrument`)**: Page titles (`h1`) only.
  - Applied globally to all `h1` elements.
- **Nunito (`font-body`)**: Default body copy and subheadings.
  - Body text: regular weight (default).
  - `h2`, `h3`: bold.
  - `h4`, `h5`, `h6`: semi-bold.

Do not introduce other fonts (e.g., Inter). Avoid using `font-instrument` on anything other than `h1`, and avoid using `font-lora` outside brand/branding elements.

### Where this is configured

- `tailwind.config.ts`
  - `theme.extend.fontFamily` defines the three families: `body` → Nunito, `lora` → Lora, `instrument` → Instrument Serif.
- `index.html`
  - Google Fonts links for Nunito, Lora, Instrument Serif.
- `src/index.css`
  - Global application:
    - `body { @apply font-body; }`
    - `h1 { @apply font-instrument; }`
    - `h2, h3 { @apply font-body font-bold; }`
    - `h4, h5, h6 { @apply font-body font-semibold; }`

### Usage examples

```tsx
// Branding/logo (Lora)
<span className="font-lora italic text-foreground">Just Plan It!</span>
```

```tsx
// Page title (Instrument Serif)
// Note: font is applied globally to h1, no font class needed
<h1 className="text-4xl md:text-5xl">Your Page Title</h1>
```

```tsx
// Body copy (Nunito)
// Note: body uses Nunito by default, no font class needed
<p className="text-foreground/70 leading-relaxed">Paragraph text…</p>
```

```tsx
// Subheadings
// h2/h3 are globally bold; h4-6 are globally semi-bold
<h2 className="text-2xl">Section</h2>
<h3 className="text-xl">Subsection</h3>
```

### Rationale

This hierarchy ensures a clear typographic voice: expressive titles (Instrument Serif), approachable readable body (Nunito), and distinct branding (Lora).

### Last verified

2025-09-12


