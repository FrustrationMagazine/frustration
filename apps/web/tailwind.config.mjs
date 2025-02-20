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
        "gradient-conic":
          "conic-gradient(var(--conic-position, from 45deg), var(--tw-gradient-stops))",
        "card-author": `
          url('/textures/wall-4-light.png'),
          linear-gradient(#8955E0, #8955E0)
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
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "background-gradient":
          "background-gradient var(--background-gradient-speed, 15s) cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: 0,
          },
        },
        "background-gradient": {
          "0%, 100%": {
            transform: "translate(0, 0)",
            animationDelay: "var(--background-gradient-delay, 0s)",
          },
          "20%": {
            transform:
              "translate(calc(100% * var(--tx-1, 1)), calc(100% * var(--ty-1, 1)))",
          },
          "40%": {
            transform:
              "translate(calc(100% * var(--tx-2, -1)), calc(100% * var(--ty-2, 1)))",
          },
          "60%": {
            transform:
              "translate(calc(100% * var(--tx-3, 1)), calc(100% * var(--ty-3, -1)))",
          },
          "80%": {
            transform:
              "translate(calc(100% * var(--tx-4, -1)), calc(100% * var(--ty-4, -1)))",
          },
        },
      },
    },
    // 🎨 Colors
    colors: {
      ...colors,
      yellow: "#FFF200",
      paleYellow: "#F2EC80",
      red: "#700002",
      black: "#000",
      white: "#fff",
      purple: "#8955E0",
      palePurple: "#7C76B0",
      blue: "#1e40af",
      primary: "#FFF200",
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
