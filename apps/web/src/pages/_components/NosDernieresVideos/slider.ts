import Splide from "@splidejs/splide";
import { Video } from "@splidejs/splide-extension-video";
import "@splidejs/splide-extension-video/dist/css/splide-extension-video.min.css";

const ADDITIONAL_INFORMATIONS_SELECTOR = ".video-informations";

function manageDisplayOfAdditionalInformations(index: number = 0): void {
  const videoInformations = document.querySelectorAll(ADDITIONAL_INFORMATIONS_SELECTOR) as unknown as HTMLElement[];
  videoInformations.forEach((element, elementIndex) => {
    if (elementIndex === index) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}

document.addEventListener("astro:page-load", () => {
  const splideVideos = new Splide(".splide-videos", {
    heightRatio: 0.5625,
    width: "1200px",
    cover: true,
    speed: 1000,
    rewind: true,
    rewindSpeed: 1000,
    lazyLoad: "nearby",
    hideControls: false,
    pagination: false,
    video: {
      loop: true,
      playerOptions: {
        youtube: {
          controls: 1,
          color: "white",
        },
      },
    },
  });

  const splideVideosThumbnails = new Splide(".splide-videos-thumbnails", {
    rewind: true,
    width: "1200px",
    fixedWidth: "20%",
    heightRatio: 0.1,
    isNavigation: true,
    arrows: false,
    pagination: false,
    cover: true,
    lazyLoad: "nearby",
    dragMinThreshold: {
      mouse: 4,
      touch: 10,
    },
  });

  splideVideos.sync(splideVideosThumbnails);
  splideVideos.mount({ Video });
  splideVideosThumbnails.mount();

  manageDisplayOfAdditionalInformations();
  splideVideos.on("active", ({ index }) => manageDisplayOfAdditionalInformations(index));
});
