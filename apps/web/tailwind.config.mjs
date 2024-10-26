/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
            "backgroundPosition": "0 0"
          },
          to: {
            "backgroundPosition": "-200% 0"
          }
        }
      },
    },
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
    },
    fontFamily: {
      montserrat: "Montserrat",
      bebas: "Bebas Neue",
      arca: "'Arca Majora 3'",
      "open-sans": "Open Sans",
    },
  },
};
