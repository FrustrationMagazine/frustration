import Splide from "@splidejs/splide";
import "@splidejs/splide/css";

document.addEventListener("astro:page-load", () => {
  const header = document.querySelector("body > header") as HTMLElement;
  const banner = document.querySelector("body #banner") as HTMLElement;
  const carrousel = document.querySelector(".splide-main-carrousel") as HTMLElement;

  const headerHeight = header?.getBoundingClientRect().height;
  const bannerHeight = banner?.getBoundingClientRect().height;
  const carrouselHeight = window.innerHeight - (headerHeight ?? 0) - (bannerHeight ?? 0);
  carrousel.style.height = `${carrouselHeight}px`;

  var splide = new Splide(".splide-main-carrousel", {
    type: "slide",
    pagination: false,
    width: "100%",
    autoplay: true,
    speed: 1000,
    rewind: true,
    rewindSpeed: 1000,
    perPage: 1,
    height: `${carrouselHeight}px`,
  });

  splide.mount();
});
