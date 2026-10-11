
const slider = document.querySelector("[data-slider]");

if (slider) {
    const track = slider.querySelector(".slider__track");
    const originalSlides = [...track.children];
    const total = originalSlides.length;

    if (total > 0) {
        track.prepend(originalSlides[total - 1].cloneNode(true));
        track.append(originalSlides[0].cloneNode(true));

        let index = 1;
        let busy = false;
        let autoplay;

        function makeButton(className, label, text = "") {
            const button = document.createElement("button");
            button.type = "button";
            button.className = className;
            button.setAttribute("aria-label", label);
            button.textContent = text;
            return button;
        }

        const previousButton = makeButton(
            "slider__arrow slider__arrow--prev",
            "Previous slide",
            "❮"
        );

        const nextButton = makeButton(
            "slider__arrow slider__arrow--next",
            "Next slide",
            "❯"
        );

        const dotsContainer = document.createElement("div");
        dotsContainer.className = "slider__dots";
        dotsContainer.setAttribute("aria-label", "Slide navigation");

        const dots = originalSlides.map((_, i) => {
            const dot = makeButton(
                "slider__dot",
                `Go to slide ${i + 1}`
            );

            dot.addEventListener("click", () => goToSlide(i + 1));
            dotsContainer.append(dot);

            return dot;
        });

        slider.append(previousButton, nextButton, dotsContainer);

        function show(animate = true) {
            track.classList.toggle("is-instant", !animate);
            track.style.transform = `translateX(${-index * 100}%)`;

            if (!animate) {
                track.offsetWidth;
            }

            const activeIndex = (index - 1 + total) % total;

            dots.forEach((dot, i) => {
                dot.classList.toggle("is-active", i === activeIndex);
                dot.setAttribute(
                    "aria-current",
                    i === activeIndex ? "true" : "false"
                );
            });
        }

        function goToSlide(newIndex) {
            if (busy || newIndex === index) {
                return;
            }

            busy = true;
            index = newIndex;
            show();
        }

        function nextSlide() {
            if (!busy) {
                goToSlide(index + 1);
            }
        }

        function previousSlide() {
            if (!busy) {
                goToSlide(index - 1);
            }
        }

        track.addEventListener("transitionend", (event) => {
            if (event.propertyName !== "transform") {
                return;
            }

            if (index === total + 1) {
                index = 1;
                show(false);
            } else if (index === 0) {
                index = total;
                show(false);
            }

            busy = false;
        });

        previousButton.addEventListener("click", () => {
            stopAutoplay();
            previousSlide();
            startAutoplay();
        });

        nextButton.addEventListener("click", () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });

        function startAutoplay() {
            stopAutoplay();

            if (total > 1) {
                autoplay = setInterval(() => {
                    nextSlide();
                }, 5000);
            }
        }

        function stopAutoplay() {
            clearInterval(autoplay);
        }

        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", startAutoplay);

        slider.addEventListener("focusin", stopAutoplay);
        slider.addEventListener("focusout", (event) => {
            if (!slider.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        show(false);
        startAutoplay();
    }
}
