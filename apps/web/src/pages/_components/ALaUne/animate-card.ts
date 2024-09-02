class PostCard extends HTMLElement {
  constructor() {
    super();

    const postCardWrapper: HTMLElement | null =
      this.querySelector("[data-card]");
    const overlay: HTMLElement | null = this.querySelector("[data-overlay]");
    const image: HTMLElement | null = this.querySelector("[data-thumbnail]");

    function handleMouseMove({
      clientX,
      clientY,
    }: {
      clientX: number;
      clientY: number;
    }) {
      const rotationIntensity = 3;
      const overlayFactor = 2;
      if (postCardWrapper) {
        const { left, top, width, height } =
          postCardWrapper.getBoundingClientRect();
        const [x, y] = [clientX - left, clientY - top];
        postCardWrapper.style.transitionDuration = "0ms";
        postCardWrapper.style.transform = `rotateX(${-(y / (height / 2) - 1) * rotationIntensity}deg)
          rotateY(${(x / (width / 2) - 1) * rotationIntensity}deg)`;
        postCardWrapper.style.transitionDuration = "0ms";

        if (image) {
          image.style.transitionDuration = "0ms";
          image.style.transform = `scale(1.1)
            translateX(${((width - x) / width - 0.5) * 25}px)
            translateY(${((height - y) / height - 0.5) * 25}px)`;
        }

        if (overlay) {
          overlay.style.transitionDuration = "0ms";
          overlay.style.transform = `translate3d(${-((x * (100 / overlayFactor)) / width - 50 / overlayFactor)}%,
            ${-((y * (100 / overlayFactor)) / height - 50 / overlayFactor)}%,
            0)`;
          overlay.style.opacity = String(
            Math.abs(width / 2 - x) / width + Math.abs(height / 2 - y) / height,
          );
        }
      }
    }

    function handleMouseOut() {
      if (postCardWrapper) {
        postCardWrapper.style.transitionDuration = "500ms";
        postCardWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
      }

      if (image) {
        image.style.transitionDuration = "500ms";
        image.style.transform = `scale(1)
          translateX(0px)
          translateY(0px)`;
      }

      if (overlay) {
        overlay.style.transitionDuration = "500ms";
        overlay.style.opacity = "0";
        overlay.style.transform = `translate3d(0%, 0%, 0);`;
      }
    }

    if (document.body.clientWidth > 768) {
      postCardWrapper?.addEventListener("mousemove", handleMouseMove);
      postCardWrapper?.addEventListener("mouseout", handleMouseOut);
    }
  }
}

customElements.define("post-card", PostCard);
