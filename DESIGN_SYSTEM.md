# TaskFlow - Design System & Style Guide

## Brand Identity

### Application Name
**TaskFlow** - Organize Your Tasks Effortlessly

### Tagline
"Manage your tasks with modern elegance and professional efficiency"

### Logo
✓ (Checkmark) - Used throughout the application
- Navigation header
- Favicon
- Brand identity

---

## Color System

### Primary Colors

#### Primary Action Color
- **Color Name**: Primary
- **Hex Value**: `#6366F1`
- **RGB**: `99, 102, 241`
- **CSS Variable**: `--color-primary`
- **Usage**: Buttons, links, highlights, active states
- **Accessibility**: WCAG AA compliant

#### Success Color
- **Color Name**: Success / Emerald
- **Hex Value**: `#10B981`
- **RGB**: `16, 185, 129`
- **CSS Variable**: `--color-success`
- **Usage**: Success messages, completed tasks, positive feedback
- **Accessibility**: WCAG AA compliant

#### Danger Color
- **Color Name**: Danger / Rose
- **Hex Value**: `#FB7185`
- **RGB**: `251, 113, 133`
- **CSS Variable**: `--color-danger`
- **Usage**: Errors, delete actions, warnings
- **Accessibility**: WCAG AA compliant

### Neutral Colors

#### Foreground (Text)
- **Color Name**: Foreground
- **Hex Value**: `#FFFFFF`
- **RGB**: `255, 255, 255`
- **CSS Variable**: `--color-foreground`
- **Usage**: Primary text, headings, body content
- **Contrast**: 18:1 on background

#### Background
- **Color Name**: Background / Dark Slate
- **Hex Value**: `#0F172A`
- **RGB**: `15, 23, 42`
- **CSS Variable**: `--color-background`
- **Usage**: Page backgrounds, main container
- **Luminosity**: Very dark, optimal for dark mode

#### Surface
- **Color Name**: Surface / Light Slate
- **Hex Value**: `#1E293B`
- **RGB**: `30, 41, 59`
- **CSS Variable**: `--color-surface`
- **Usage**: Cards, panels, containers, input backgrounds
- **Contrast**: 15:1 on foreground
- **Elevation**: Slightly raised above background

#### Muted Text
- **Color Name**: Muted / Slate Gray
- **Hex Value**: `#94A3B8`
- **RGB**: `148, 163, 184`
- **CSS Variable**: `--color-muted`
- **Usage**: Secondary text, disabled states, hints
- **Contrast**: 7:1 on background

### Color Palette Reference

```
Primary:      #6366F1 ███████████████
Success:      #10B981 ███████████████
Danger:       #FB7185 ███████████████
Foreground:   #FFFFFF ███████████████
Background:   #0F172A ███████████████
Surface:      #1E293B ███████████████
Muted:        #94A3B8 ███████████████
```

---

## Typography

### Font Family
- **Font Name**: Inter
- **Source**: Google Fonts
- **Weights Used**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Type Scale

#### Headings
```
H1: 32px, 700 weight, 1.2 line-height
    Used for: Page titles, main headers

H2: 28px, 700 weight, 1.2 line-height
    Used for: Section headers

H3: 24px, 600 weight, 1.3 line-height
    Used for: Subsection headers, card titles

H4: 20px, 600 weight, 1.4 line-height
    Used for: Component titles
```

#### Body Text
```
Large: 18px, 400 weight, 1.6 line-height
       Used for: Important body text

Regular: 16px, 400 weight, 1.6 line-height
         Used for: Default body text, paragraphs

Small: 14px, 400 weight, 1.5 line-height
       Used for: Secondary text, captions

Tiny: 12px, 400 weight, 1.4 line-height
      Used for: Labels, badges, small text
```

### Text Styles

```css
/* Primary Heading */
color: var(--color-foreground);
font-weight: 700;
font-size: 32px;
line-height: 1.2;

/* Body Text */
color: var(--color-foreground);
font-weight: 400;
font-size: 16px;
line-height: 1.6;

/* Secondary Text */
color: var(--color-muted);
font-weight: 400;
font-size: 14px;
line-height: 1.5;
```

---

## Component Styles

### Buttons

#### Primary Button
```
Background: var(--color-primary)
Text: #FFFFFF
Padding: 12px 24px
Border: None
Border Radius: 6px
Font Weight: 600
Font Size: 16px
Cursor: pointer
Transition: opacity 200ms
Hover State: opacity 0.9
Active State: opacity 0.8
```

#### Secondary Button
```
Background: transparent
Text: var(--color-foreground)
Padding: 12px 24px
Border: 1px solid rgba(255,255,255,0.1)
Border Radius: 6px
Font Weight: 500
Font Size: 16px
Cursor: pointer
Hover State: background rgba(255,255,255,0.05)
```

#### Danger Button
```
Background: var(--color-danger)
Text: #FFFFFF
Padding: 8px 16px
Border: None
Border Radius: 4px
Font Weight: 500
Font Size: 14px
Cursor: pointer
Hover State: opacity 0.9
```

### Input Fields

#### Text Input
```
Background: var(--color-surface)
Text Color: var(--color-foreground)
Border: 1px solid rgba(255,255,255,0.1)
Padding: 12px 16px
Border Radius: 6px
Font Size: 16px
Font Weight: 400
Placeholder Color: rgba(255,255,255,0.6)

Focus State:
  Border Color: var(--color-primary)
  Box Shadow: 0 0 0 3px rgba(99,102,241,0.1)
  Outline: 2px solid var(--color-primary)

Error State:
  Border Color: var(--color-danger)
  Box Shadow: 0 0 0 3px rgba(251,113,133,0.1)
```

#### Textarea
```
Same as text input
Min Height: 120px
Resize: vertical
Font Family: Inter
Line Height: 1.6
```

### Cards

#### Task Card
```
Background: var(--color-background)
Border: 1px solid rgba(255,255,255,0.05)
Border Radius: 8px
Padding: 20px
Margin Bottom: 12px
Transition: all 200ms
Box Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover State:
  Box Shadow: 0 4px 12px rgba(0,0,0,0.15)
  Transform: translateY(-2px)
```

### Forms

#### Form Group
```
Margin Bottom: 20px

Label:
  Display: block
  Font Size: 14px
  Font Weight: 600
  Color: var(--color-foreground)
  Margin Bottom: 8px

Input/Textarea:
  Width: 100%
  (See Input Fields above)

Error Message:
  Font Size: 12px
  Color: var(--color-danger)
  Margin Top: 4px
  Font Weight: 500
```

### Navigation

#### Header
```
Background: var(--color-surface)
Border Bottom: 1px solid rgba(255,255,255,0.05)
Padding: 16px 24px
Height: 64px
Display: flex
Align Items: center
Justify Content: space-between
```

#### Nav Item
```
Color: var(--color-foreground)
Font Size: 16px
Font Weight: 500
Padding: 8px 16px
Border Radius: 4px
Cursor: pointer
Transition: background 200ms

Hover State:
  Background: rgba(255,255,255,0.1)
```

---

## Spacing System

### Base Unit: 4px

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
2xl: 24px
3xl: 32px
4xl: 40px
5xl: 48px
6xl: 56px
```

### Common Spacing

```
Component Padding: 16px (lg)
Section Padding: 24px (2xl)
Gutter (Horizontal): 16px (lg)
Gutter (Vertical): 20px (xl)
Card Spacing: 12px (md)
Form Spacing: 20px (xl)
```

---

## Borders & Shadows

### Border Radius
```
Small: 4px
Medium: 6px
Large: 8px
Full: 9999px (pills, circles)
```

### Box Shadows
```
Subtle: 0 1px 3px rgba(0,0,0,0.1)
Small: 0 4px 12px rgba(0,0,0,0.15)
Medium: 0 8px 24px rgba(0,0,0,0.2)
Large: 0 12px 32px rgba(0,0,0,0.25)
```

### Borders
```
Default: 1px solid rgba(255,255,255,0.05)
Subtle: 1px solid rgba(255,255,255,0.05)
Strong: 1px solid rgba(255,255,255,0.1)
Error: 1px solid var(--color-danger)
Success: 1px solid var(--color-success)
```

---

## Effects & Animations

### Transitions
```
Fast: 150ms
Standard: 200ms
Slow: 300ms
```

### Easing
```
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
ease-out: cubic-bezier(0.0, 0, 0.2, 1)
ease-in: cubic-bezier(0.4, 0, 1, 1)
```

### Common Transitions
```
opacity 200ms ease-in-out
transform 200ms ease-in-out
background-color 200ms ease-in-out
border-color 200ms ease-in-out
box-shadow 200ms ease-in-out
color 200ms ease-in-out
```

### Hover Effects
- Opacity change: 0.9
- Transform: translateY(-2px)
- Box shadow: elevation
- Color: primary highlight

---

## Accessibility

### Contrast Ratios
- Text on Background: 18:1 (AAA)
- Text on Surface: 15:1 (AAA)
- UI Elements: 4.5:1 (AA)
- Large Text: 3:1 (AA)

### Focus States
```
Focus Ring: 3px solid var(--color-primary)
Offset: 2px
Animation: none (instant focus)
Visible: On all interactive elements
```

### Motion
- Respect prefers-reduced-motion
- Animations optional, not required
- Transitions enhance, not distract

### Text
- Minimum font size: 12px
- Line height: minimum 1.4
- Color contrast: minimum 4.5:1
- Clear error messages

---

## Dark Theme Implementation

### CSS Variables
```css
:root {
  --color-foreground: #FFFFFF;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-primary: #6366F1;
  --color-success: #10B981;
  --color-danger: #FB7185;
  --color-muted: #94A3B8;
  --focus-ring: 3px;
}
```

### Forced Dark Mode
- Applied at :root level
- Overrides media queries
- Consistent across all browsers
- No user preference dependency

---

## Component Examples

### Task Item
```
┌─────────────────────────────────────────┐
│ ☐  Buy Groceries          [Edit] [Delete] │
│    Milk, eggs, bread                    │
│                                         │
│    Created: Jan 15, 2024 at 10:30 AM   │
└─────────────────────────────────────────┘

Completed State:
┌─────────────────────────────────────────┐
│ ☑  Buy Groceries          [Edit] [Delete] │
│    (strikethrough) Milk, eggs, bread    │
│                                         │
│    Created: Jan 15, 2024 at 10:30 AM   │
└─────────────────────────────────────────┘
```

### Form Example
```
┌─────────────────────────────────────────┐
│ ✨ Add a New Task                       │
│                                         │
│ Title *                                 │
│ [_________________________________]    │
│ (error: Title is required)              │
│                                         │
│ Description                             │
│ [_________________________________]    │
│ [_________________________________]    │
│                                         │
│ [+ Add Task] [Cancel]                   │
└─────────────────────────────────────────┘
```

### Navigation Header
```
┌─────────────────────────────────────────┐
│ ✓ TaskFlow     [dashboard] user@ex.com  │
│                              [Sign Out] │
└─────────────────────────────────────────┘
```

---

## Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | #6366F1 | Actions, highlights |
| Success Color | #10B981 | Confirmations |
| Danger Color | #FB7185 | Errors, delete |
| Text Color | #FFFFFF | Main text |
| Background | #0F172A | Page bg |
| Surface | #1E293B | Cards, inputs |
| Muted Text | #94A3B8 | Secondary text |
| Border Radius | 4-8px | Elements |
| Spacing Unit | 4px | Consistent spacing |
| Font Family | Inter | All text |
| Font Size Body | 16px | Default text |
| Line Height | 1.6 | Text readability |
| Box Shadow | 0 1px 3px | Subtle depth |
| Transition | 200ms | Smooth animations |
| Focus Ring | 3px | Accessibility |

---

## Visual Guidelines

### Do's ✅
- Use semantic color variables
- Maintain consistent spacing
- Provide clear focus states
- Use high contrast text
- Add hover effects to interactive elements
- Test with accessibility tools
- Use Inter font for consistency
- Follow the design system

### Don'ts ❌
- Don't hardcode colors (use variables)
- Don't use colors without contrast checking
- Don't remove focus rings
- Don't animate unnecessarily
- Don't mix different border styles
- Don't break the spacing grid
- Don't use colors outside the palette
- Don't deviate from component styles

---

## Implementation Notes

All colors are implemented as CSS variables in `globals.css`:
```css
:root {
  --color-foreground: #FFFFFF;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-primary: #6366F1;
  --color-success: #10B981;
  --color-danger: #FB7185;
  --color-muted: #94A3B8;
  --focus-ring: 3px;
}
```

Use variables in components:
```tsx
style={{
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-foreground)',
}}
```

---

**Design System Version**: 1.0.0
**Last Updated**: 2024
**Theme**: Dark (Premium & Modern)
**Brand**: TaskFlow - Organize Your Tasks Effortlessly
