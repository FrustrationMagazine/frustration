import "@splidejs/splide/css";
import Splide from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";

document.addEventListener("astro:page-load", () => {
  new Splide(".splide-interviews", {
    type: "loop",
    drag: "free",
    focus: "center",
    autoWidth: true,
    pagination: false,
    arrows: false,
    perPage: 3,
    autoScroll: {
      speed: 1,
    },
    breakpoints: {
      425: {
        perPage: 1,
        pagination: true,
        arrows: true,
        autoScroll: false,
      },
      1024: {
        perPage: 2,
      },
    },
  }).mount({ AutoScroll });
});
