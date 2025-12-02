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

// Initialize magnifier when window loads (after images are available)
window.addEventListener('load', function() {
  var img = document.getElementById('pro-img');
  if (img) {
    magnify('pro-img', 2);
  }
});

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

/* Magnifier Glass Script */

function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);

  /* Create magnifier glass: */
  // Avoid creating multiple glasses for the same image
  glass = img.parentElement.querySelector('.img-magnifier-glass');
  if (!glass) {
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    img.parentElement.appendChild(glass);
  }

  /* Set background properties for the magnifier glass: */
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;

  /* Mouse move handlers */
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);

  /* Touch handlers: show on touchstart, move on touchmove, hide on touchend */
  img.addEventListener('touchstart', function(e) {
    e.preventDefault();
    glass.style.display = 'block';
    moveMagnifier(e);
  }, { passive: false });
  img.addEventListener('touchmove', function(e) {
    e.preventDefault();
    moveMagnifier(e);
  }, { passive: false });
  img.addEventListener('touchend', function(e) {
    e.preventDefault();
    glass.style.display = 'none';
  });
  function moveMagnifier(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
    if (x < w / zoom) {x = w / zoom;}
  if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);} 
  // restrict how far up the magnifier can go: allow movement up to 80% from the bottom
  // i.e. prevent entering the top 20% of the image
  var minAllowedY = Math.max(h / zoom, img.height * 0.2);
  if (y < minAllowedY) { y = minAllowedY; }
    /* Compute an upward offset on touch/pointer so the user's thumb doesn't cover the glass.
       Keep the magnifier's background centered at the touch point (x,y), but render the
       visible glass a bit above the touch. */
    var touchOffset = 0;
    // pointer events: check e.pointerType for touch
    if (e.pointerType && e.pointerType === 'touch') {
      touchOffset = Math.min( Math.max(40, h * 0.6), 140 );
    } else if (e.touches) {
      // fallback when touch event object is used
      touchOffset = Math.min( Math.max(40, h * 0.6), 140 );
    }

    // Position where the glass should be displayed (left/top) while background centers on (x,y)
    var displayLeft = x - w;
    var displayTop = y - h - touchOffset;

    // Clamp display position so the glass stays within the image boundaries
    var maxLeft = img.width - glass.offsetWidth;
    var maxTop = img.height - glass.offsetHeight;
    if (displayLeft < 0) displayLeft = 0;
    if (displayLeft > maxLeft) displayLeft = maxLeft;
    if (displayTop < 0) displayTop = 0;
    if (displayTop > maxTop) displayTop = maxTop;

    /* Set the position of the magnifier glass (visual position may be offset from touch): */
    glass.style.left = displayLeft + "px";
    glass.style.top = displayTop + "px";
    /* Display what the magnifier glass "sees": keep background centered at actual x,y */
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
  }


  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Use clientX/Y for consistent coordinates across touch/mouse */
    var clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    var clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = clientX - a.left;
    y = clientY - a.top;
    return {x : x, y : y};
  }
}
