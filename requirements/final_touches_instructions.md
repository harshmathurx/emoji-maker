# User Data, UI Improvements, and SEO Implementation Guide

## User Data Management

### Profile Table Updates
- Modify the existing profiles table to include:
  - full_name (TEXT)
  - email (TEXT)
  - avatar_url (TEXT)
- These fields should be populated when a user first signs in via Clerk

### User Data Integration
- Fetch user details (name, avatar) along with poster data
- Combine user information with poster API responses
- Display user attribution on poster cards:
  - User avatar
  - User name
  - Like count
  - Follow card-mockup.png for layout reference

## UI Enhancements

### Grid Layout Updates
#### Desktop View
- Modify grid to display 4 posters per row
- Maintain consistent spacing and alignment
- Ensure proper scaling of poster images

#### Mobile View
- Display 2 posters per row
- Implement responsive breakpoints
- Maintain proper spacing on smaller screens

### Visual Improvements
- Update landing page design to match landing-mockup.png
- Modernize card design:
  - Remove unnecessary borders
  - Implement smooth hover effects
  - Improve shadow and elevation
- Enhance switch component:
  - Refine toggle animation
  - Update styling for better visual appeal
  - Ensure proper state indication

## SEO and Sitemap Implementation

### Metadata Configuration
Create a central configuration file (metadata.config.ts) containing:
- Site title
- Site description
- Keywords
- Social media tags
- Open Graph data
- Twitter card data

### Required Images
#### OG Images
- Default social share image (1200x630px)
- Twitter card image (1200x600px)
- LinkedIn share image (1200x627px)

#### Icons
- Favicon (16x16px, 32x32px)
- Apple Touch Icon (180x180px)
- Android Chrome Icon (192x192px, 512x512px)
- Microsoft Tile (270x270px)

### Sitemap Requirements
- Generate dynamic sitemap
- Include all static pages
- Include dynamic poster pages
- Update frequency settings
- Priority settings for different page types

## Implementation Notes
- All UI changes should maintain consistency with existing design system
- Ensure responsive design works across all major breakpoints
- Test user data integration thoroughly
- Validate SEO implementation with testing tools