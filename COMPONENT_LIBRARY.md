# ZOE Solar Component Library

**Version:** 1.0  
**Last Updated:** 31. Oktober 2024

---

## Core Components

### PageHero
**Purpose:** Full-width hero section with background image and CTA

```tsx
<PageHero
  title="Solaranlagen für Ihr Zuhause"
  subtitle="Nachhaltige Energie für die Zukunft"
  backgroundImage="/images/hero-bg.jpg"
  cta={{ text: "Jetzt anfragen", href: "/kontakt" }}
/>
```

**Props:**
- `title` (string): Main heading
- `subtitle` (string): Supporting text
- `backgroundImage` (string): Background image URL
- `cta` (object): CTA button configuration

**Styling:**
- Full-width background image
- Dark overlay for text readability
- Responsive text sizing
- Green-600 CTA button

---

### SubHeader
**Purpose:** Secondary heading section with description

```tsx
<SubHeader
  title="Unsere Dienstleistungen"
  description="Wir bieten umfassende Lösungen für Ihre Solaranlage"
/>
```

**Props:**
- `title` (string): Section heading
- `description` (string): Section description

**Styling:**
- text-2xl heading
- slate-600 description text
- Centered alignment

---

### SemanticLayout
**Purpose:** Consistent section layout with proper semantic HTML

```tsx
<SemanticLayout>
  <section className="py-12">
    <h2>Section Title</h2>
    <p>Content here</p>
  </section>
</SemanticLayout>
```

**Features:**
- Proper heading hierarchy
- Semantic HTML elements
- Consistent spacing
- Responsive grid system

---

### Card Component
**Purpose:** Reusable card for content display

```tsx
<Card className="p-6 rounded-lg border border-slate-200">
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-slate-600">Content</p>
</Card>
```

**Styling:**
- Consistent padding (p-6)
- Subtle border (slate-200)
- Rounded corners (rounded-lg)
- Hover effects

---

### Button Component
**Purpose:** Reusable button with multiple variants

```tsx
// Primary
<button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
  Primary Action
</button>

// Secondary
<button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50">
  Secondary Action
</button>
```

**Variants:**
- Primary (green-600 background)
- Secondary (green-600 border)
- Tertiary (text only)

**Sizing:**
- Small: px-4 py-1
- Medium: px-6 py-2
- Large: px-8 py-3

---

### Header Component
**Purpose:** Navigation header with logo and menu

```tsx
<Header />
```

**Features:**
- Sticky positioning
- Logo and branding
- Navigation menu
- Mobile hamburger menu
- Theme toggle (light/dark)
- Active link highlighting

**Responsive:**
- Mobile: Hamburger menu
- Tablet: Partial menu
- Desktop: Full menu

---

### Footer Component
**Purpose:** Site footer with links and information

```tsx
<Footer />
```

**Structure (4 Sections):**
1. **Über ZOE Solar** - Company info
2. **Produkte & Services** - Main offerings
3. **Ressourcen** - Guides, FAQ, Blog
4. **Kontakt & Legal** - Contact, legal pages

**Features:**
- Mobile accordion
- 20 essential links
- Social media links
- Newsletter signup
- Legal links

---

### Breadcrumb Component
**Purpose:** Navigation breadcrumb for page hierarchy

```tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Current Page" }
  ]}
/>
```

**Features:**
- Semantic HTML
- Proper ARIA labels
- Responsive design
- Schema.org markup

---

### Form Components

#### Input
```tsx
<input
  type="text"
  placeholder="Your name"
  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
/>
```

#### Select
```tsx
<select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
  <option>Select option</option>
</select>
```

#### Textarea
```tsx
<textarea
  placeholder="Your message"
  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
/>
```

---

### AnimatedSection
**Purpose:** Section with scroll animations

```tsx
<AnimatedSection>
  <h2>Animated Content</h2>
  <p>This content animates on scroll</p>
</AnimatedSection>
```

**Features:**
- Fade-in animation
- Slide-up animation
- Stagger effect for children
- Intersection Observer API

---

## Utility Classes

### Spacing
- `py-12`, `py-16`, `py-20` - Vertical padding
- `px-4`, `px-6`, `px-8` - Horizontal padding
- `mb-4`, `mb-6`, `mb-8` - Margin bottom

### Typography
- `text-2xl`, `text-lg`, `text-base` - Font sizes
- `font-bold`, `font-semibold`, `font-normal` - Font weights
- `text-slate-900`, `text-slate-600` - Text colors

### Colors
- `bg-green-600` - Primary background
- `text-green-600` - Primary text
- `border-slate-200` - Borders
- `bg-slate-50` - Light backgrounds

### Responsive
- `sm:`, `md:`, `lg:`, `xl:` - Breakpoints
- `hidden md:block` - Show on medium and up
- `block md:hidden` - Show on mobile only

---

## Best Practices

1. **Consistency:** Use predefined components
2. **Accessibility:** Include ARIA labels and semantic HTML
3. **Responsiveness:** Test on all breakpoints
4. **Performance:** Lazy load images and components
5. **Maintainability:** Keep components simple and focused

---

**Status:** ✅ Complete and ready for use

