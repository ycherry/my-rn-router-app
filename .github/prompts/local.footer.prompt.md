# Footer Development Guide

This document provides guidance for developing custom footers in the Nidavellir project, based on the existing footer implementations and configurations.

## Overview

The footer system in this project uses Payload CMS for configuration and React components for rendering. It supports multiple styles and can be overridden per page.

## Footer Configuration in Payload CMS

Footers are configured as a global in Payload CMS. The configuration includes:

- **Style**: Select between "default" and "cursor" styles
- **Navigation Items**: Array of links (max 6 items)

### Global Config Structure

```typescript
export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "style",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Cursor Style", value: "cursor" },
      ],
    },
    {
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/Footer/RowLabel#RowLabel",
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
};
```

## Footer Component Usage

The main Footer component is located at `src/Footer/Component.tsx`. It accepts an optional `styleOverride` prop.

### Basic Usage

```tsx
import { Footer } from "@/Footer/Component";

export default function Layout() {
  return (
    <div>
      {/* Page content */}
      <Footer />
    </div>
  );
}
```

### With Style Override

```tsx
<Footer styleOverride="cursor" />
```

## Existing Footer Styles

### Default Footer

- Black background with white text
- Logo on the left, theme selector and navigation on the right
- Uses standard styling

### Cursor Footer

- Uses `CursorStyleFooterComponent` from `@nidavellir/components-react/footers`
- Transforms navigation items into links with proper href generation
- Includes copyright text

```tsx
export const CursorFooter: React.FC<Props> = ({ navItems }) => {
  const links = (navItems || []).map(({ link }) => {
    const href =
      link.type === "reference" &&
      typeof link.reference?.value === "object" &&
      link.reference.value.slug
        ? `${link.reference?.relationTo !== "pages" ? `/${link.reference?.relationTo}` : ""}/${
            link.reference.value.slug
          }`
        : link.url || "#";

    return {
      label: link.label || "",
      href,
    };
  });

  return (
    <CursorStyleFooterComponent
      links={links}
      copyrightText="© 2024 Code Forge. All rights reserved."
    />
  );
};
```

## Page-Level Footer Overrides

Pages can override the global footer style using the "Layout Settings" tab:

- **headerStyle**: default, cursor, or none
- **footerStyle**: default, cursor, or none

This is configured in the Pages collection (`src/collections/Pages/index.ts`).

## Creating Custom Footer Styles

### 1. Add New Style Option

Update the Footer global config to include new style options:

```typescript
{
  name: "style",
  type: "select",
  defaultValue: "default",
  options: [
    { label: "Default", value: "default" },
    { label: "Cursor Style", value: "cursor" },
    { label: "New Style", value: "new-style" },
  ],
}
```

### 2. Create Footer Component

Create a new component in `src/Footer/` directory, following the pattern of `CursorFooter.tsx`.

### 3. Update Main Component

Modify `src/Footer/Component.tsx` to handle the new style:

```tsx
if (style === "new-style") {
  return <NewStyleFooter navItems={navItems} />;
}
```

### 4. Add to Components Library (Optional)

If the footer is reusable, add it to `@nidavellir/components-react`:

- Create component in `packages/components-react/src/components/footers/`
- Export from `packages/components-react/src/components/footers/index.ts`
- Update package.json exports if needed

## Example: Style2Footer Component

The `Style2Footer` component demonstrates a more complex footer with:

- Brand section with name, description, and social links
- Multiple link sections
- Newsletter signup
- Bottom bar with copyright and links

### Props Interface

```typescript
export interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  onNewsletterSubmit?: (email: string) => void;
  copyrightText?: string;
  bottomLinks?: Style2FooterLink[];
  className?: string;
}
```

### Usage Example

```tsx
<Style2Footer
  brandName="Code Forge"
  brandDescription="Building the future of code generation"
  sections={[
    {
      title: "Product",
      links: [
        { text: "Features", href: "/features" },
        { text: "Pricing", href: "/pricing" },
      ],
    },
  ]}
  socialLinks={[
    {
      name: "GitHub",
      icon: <GitHubIcon />,
      href: "https://github.com",
    },
  ]}
  newsletterTitle="Stay Updated"
  newsletterDescription="Get the latest updates and news"
  newsletterPlaceholder="Enter your email"
  newsletterButtonText="Subscribe"
  onNewsletterSubmit={(email) => console.log(email)}
  copyrightText="© 2024 Code Forge. All rights reserved."
  bottomLinks={[
    { text: "Privacy", href: "/privacy" },
    { text: "Terms", href: "/terms" },
  ]}
/>
```

## Dependencies

Footer components use the following dependencies:

- `@nidavellir/components-react` (for shared footer components)
- `@nidavellir/lib` (for utility functions like `cn`)
- `next/link` and `next-themes` (for Next.js integration)
- Radix UI components (for interactive elements)

## Best Practices

1. **Consistent Styling**: Use Tailwind CSS classes and follow the project's design system
2. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
3. **Responsive Design**: Test on mobile, tablet, and desktop
4. **Performance**: Lazy load heavy components if needed
5. **Type Safety**: Use TypeScript interfaces for all props
6. **CMS Integration**: Ensure footer data is properly typed with Payload CMS types

## Revalidation

Footer changes trigger revalidation via the `revalidateFooter` hook to ensure the site reflects updates immediately.

## Testing

- Test footer rendering in different styles
- Verify navigation links work correctly
- Check responsive behavior
- Validate CMS configuration updates