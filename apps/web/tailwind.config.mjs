/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    // 👇 required so components imported from @/ui work with tailwind classes
    "../../packages/ui/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
  theme: {
    extend: {
      screens: {
        xs: "425px",
      },
      backgroundImage: {
        "home-first-section": `
          url('/textures/home-stone-texture.png'),
          linear-gradient(#FFF200, #FFF200)
          `,
        "yellow-with-tiles": `
          url('/textures/footer-spades-texture.png'),
          linear-gradient(#FFF200, #FFF200)
        `,
        spadesSeparation: `
          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 400" x="0px" y="0px" fill="black"><polygon points="400,400 800,33.299 0,33.299 "></polygon></svg>')
        `,
      },
      animation: {
        sliding: "sliding 60s linear infinite",
        slidingReverse: "slidingReverse 60s linear infinite",
        disco: "disco 2s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        slideProgress: "slideProgres 2s linear infinite",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        grid: "grid 15s linear infinite",
        meteor: "meteor 5s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { translate: "0 10%" },
          "100%": { translate: "0 -100%" },
        },
        slidingReverse: {
          "0%": { translate: "0 -105%" },
          "100%": { translate: "0 0%" },
        },
        disco: {
          "0%": { rotate: "0turn" },
          "100%": { rotate: "1turn" },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideProgres: {
          "0%": { left: "0%", translate: "-100% 0" },
          "100%": { left: "100%", translate: "0 0" },
        },
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        },
      },
    },
    // 🎨 Colors
    colors: {
      ...colors,
      yellow: "#fff200",
      paleYellow: "#F2EC80",
      red: "#700002",
      black: "#000",
      white: "#fff",
      purple: "#5c5db7",
      palePurple: "#7C76B0",
      blue: "#1e40af",
      primary: "#fff200",
      "color-rainbow-1": "hsl(var(--color-rainbow-1))",
      "color-rainbow-2": "hsl(var(--color-rainbow-2))",
      "color-rainbow-3": "hsl(var(--color-rainbow-3))",
      "color-rainbow-4": "hsl(var(--color-rainbow-4))",
      "color-rainbow-5": "hsl(var(--color-rainbow-5))",
    },
    fontFamily: {
      montserrat: "Montserrat",
      roboto: "Roboto",
      bebas: "Bebas Neue",
      bakbak: "Bakbak One",
      arca: "'Arca Majora 3'",
      "open-sans": "Open Sans",
    },
  },
};
