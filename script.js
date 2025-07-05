const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .skill-slider");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    
    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;
        const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;
        
        // Update thumb position on mouse move
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;

            // Ensure the scrollbar thumb stays within bounds
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;
            
            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        // Remove event listeners on mouse up
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        // Add event listeners for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

     // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
    const threshold = 2; // px, to account for rounding errors
    slideButtons[0].style.display = imageList.scrollLeft <= threshold ? "none" : "flex";
    slideButtons[1].style.display = (imageList.scrollLeft >= maxScrollLeft - threshold) ? "none" : "flex";
    }

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    // Call these two functions when image list scrolls
    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });
}

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu");
  const navMenu = document.querySelector(".navbar");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("nav-active");
      menuBtn.classList.toggle("active");
    });

    // Close navbar when a link is clicked
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("nav-active");
        menuBtn.classList.remove("active");
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Top row
  const topRow = document.querySelector('.top-card2');
  const topCards = Array.from(document.querySelectorAll('.top-card2 > .invol-card'));
  // Bottom row
  const bottomRow = document.querySelector('.bottom-card2');
  const bottomCards = Array.from(document.querySelectorAll('.bottom-card2 > .invol-card'));

  // Set initial state for all cards
  [...topCards, ...bottomCards].forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.8s, transform 0.8s';
  });

  function fadeCardsLeftToRight(cards) {
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
      }, i * 400);
    });
  }

  // Observer for top row
  if (topRow) {
    const topObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeCardsLeftToRight(topCards);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    topObserver.observe(topRow);
  }

  // Observer for bottom row
  if (bottomRow) {
    const bottomObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeCardsLeftToRight(bottomCards);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    bottomObserver.observe(bottomRow);
  }
});
