export const siteConfig = {
  name: "DriveTree",
  description:
    "Google Drive NEEDS a File Tree. Stop digging through folders. See your Drive as a clean tree.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/your-username/drivetree",
  },
} as const;
