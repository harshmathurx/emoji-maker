export const siteConfig = {
  name: "Pixar Poster Creator",
  description: "Create beautiful Pixar-style posters with AI",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://pixar-poster-creator.com",
  ogImage: "/og.png",
  keywords: [
    "Pixar",
    "AI",
    "Poster",
    "Generator",
    "Art",
    "Design",
    "Creative",
    "Digital Art",
  ],
  authors: [
    {
      name: "Your Name",
      url: "https://yourwebsite.com",
    },
  ],
  creator: "Your Name",
};

export type SiteConfig = typeof siteConfig; 