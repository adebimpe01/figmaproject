
const menuBtn = document.getElementById("menu-btn");
const addressMenu = document.getElementById("addressMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    addressMenu.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
});

// click red X
closeMenu.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    addressMenu.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});

// click overlay
overlay.addEventListener("click", () => {
    menuBtn.classList.remove("open");
    addressMenu.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
});


 // Address dropdown
  const addressBtn = document.getElementById("addressBtn")
  const addressDropdown = document.getElementById("addressDropdown");
  const addressChevron = document.getElementById("addressChevron");

  if (addressBtn && addressDropdown) {
    addressBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addressDropdown.classList.toggle("hidden");
    });
  }

(function () {
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectedOptionSpan = document.getElementById("selectedOption");
  const options = Array.from(document.querySelectorAll(".dropdown-option"));

  function setSelectedByValue(value) {
    options.forEach(opt => {
      const icon = opt.querySelector("i");
      if (opt.dataset.value === value) {
        if (icon) icon.classList.remove("hidden");
        opt.classList.add("bg-green-500", "text-white");
      } else {
        if (icon) icon.classList.add("hidden");
        opt.classList.remove("bg-green-500", "text-white");
      }
    });
  }

  if (selectedOptionSpan) {
    setSelectedByValue(selectedOptionSpan.textContent.trim());
  }

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
    });
  }

  if (options.length) {
    options.forEach(opt => {
      opt.addEventListener("click", () => {
        const value = opt.dataset.value;
        if (selectedOptionSpan) selectedOptionSpan.textContent = value;
        setSelectedByValue(value);
        dropdownMenu.classList.add("hidden");
      });
    });
  }
  
  const slider = document.getElementById("slider");
  const slides = slider.children;
  const totalSlides = slides.length;

  let index = 0;

  // --- CREATE DOTS ---
  const dotsContainer = document.getElementById("dots");

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    dot.classList = "w-2 h-2 rounded-full bg-gray-300 cursor-pointer transition";
    dot.dataset.slide = i;
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.children;

  // --- UPDATE SLIDER + DOTS ---
  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("bg-green-500");
      dots[i].classList.add("bg-gray-300");
    }
    dots[index].classList.remove("bg-gray-300");
    dots[index].classList.add("bg-green-500");
  }

  updateDots(); // Set initial active dot

  // --- NEXT BUTTON ---
  document.getElementById("next").addEventListener("click", () => {
    index = (index + 1) % totalSlides;
    updateSlider();
  });

  // --- PREV BUTTON ---
  document.getElementById("prev").addEventListener("click", () => {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  // --- DOT CLICK EVENT ---
  Array.from(dots).forEach(dot => {
    dot.addEventListener("click", () => {
      index = parseInt(dot.dataset.slide);
      updateSlider();
    });
  });

  // --- OPTIONAL AUTO-SLIDE ---
  setInterval(() => {
    index = (index + 1) % totalSlides;
    updateSlider();
  }, 4000);





  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (dropdownMenu && dropdownButton && !dropdownMenu.contains(e.target) && !dropdownButton.contains(e.target)) {
      dropdownMenu.classList.add("hidden");
    }
    if (addressDropdown && addressBtn && !addressDropdown.contains(e.target) && !addressBtn.contains(e.target)) {
      addressDropdown.classList.add("hidden");
      if (addressChevron) addressChevron.classList.remove("rotate-180");
    }
  });

  // Escape key closes both
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (dropdownMenu) dropdownMenu.classList.add("hidden");
      if (addressDropdown) {
        addressDropdown.classList.add("hidden");
      }
    }
  });
})();

 
  // PRICE RANGE FUNCTION
  function initPriceRange() {
    const minRange = document.getElementById("minRange");
    const maxRange = document.getElementById("maxRange");
    const minInput = document.getElementById("minInput");
    const maxInput = document.getElementById("maxInput");
    const progress = document.getElementById("progress");

    const minGap = 4000;
    const maxValue = 10000;

    function updateProgress() {
      const minVal = parseInt(minRange.value);
      const maxVal = parseInt(maxRange.value);

      progress.style.left = (minVal / maxValue) * 100 + "%";
      progress.style.right = (100 - (maxVal / maxValue) * 100) + "%";
    }

    // Handle min range input
    minRange.addEventListener("input", () => {
      let minVal = parseInt(minRange.value);
      let maxVal = parseInt(maxRange.value);

      // Enforce: min cannot exceed max
      if (minVal > maxVal) {
        minVal = maxVal;
        minRange.value = minVal;
      }

      minInput.value = minVal;
      updateProgress();
    });

    // Handle max range input
    maxRange.addEventListener("input", () => {
      let minVal = parseInt(minRange.value);
      let maxVal = parseInt(maxRange.value);

      // Enforce: max cannot go below min
      if (maxVal < minVal) {
        maxVal = minVal;
        maxRange.value = maxVal;
      }

      maxInput.value = maxVal;
      updateProgress();
    });

    // Pointer (touch / pen / mouse) - improved track-based handling
    const sliderContainer = document.getElementById("priceSlider");
    let activeThumb = null;

    function valueFromClientX(clientX) {
      if (!sliderContainer) return 0;
      const rect = sliderContainer.getBoundingClientRect();
      let fraction = (clientX - rect.left) / rect.width;
      fraction = Math.max(0, Math.min(1, fraction));
      return Math.round(fraction * maxValue);
    }

    // Track-based dragging
    sliderContainer.addEventListener("pointerdown", (e) => {
      const clickValue = valueFromClientX(e.clientX);
      const curMin = parseInt(minRange.value);
      const curMax = parseInt(maxRange.value);
      const distToMin = Math.abs(clickValue - curMin);
      const distToMax = Math.abs(clickValue - curMax);

      activeThumb = distToMin <= distToMax ? "min" : "max";
    });

    document.addEventListener("pointermove", (e) => {
      if (!activeThumb || !sliderContainer) return;
      const rect = sliderContainer.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right) return;

      const val = valueFromClientX(e.clientX);
      
      if (activeThumb === "min") {
        const maxVal = parseInt(maxRange.value);
        const newVal = Math.max(0, Math.min(val, maxVal - minGap));
        minRange.value = newVal;
        minInput.value = newVal;
      } else if (activeThumb === "max") {
        const minVal = parseInt(minRange.value);
        const newVal = Math.min(maxValue, Math.max(val, minVal + minGap));
        maxRange.value = newVal;
        maxInput.value = newVal;
      }
      updateProgress();
    });

    document.addEventListener("pointerup", () => {
      activeThumb = null;
    });

    document.addEventListener("pointercancel", () => {
      activeThumb = null;
    });

    // INPUT FIELDS
    minInput.addEventListener("input", () => {
      let val = parseInt(minInput.value) || 0;
      const maxVal = parseInt(maxRange.value);

      if (val > maxVal - minGap) val = maxVal - minGap;
      if (val < 0) val = 0;

      minRange.value = val;
      minInput.value = val;
      updateProgress();
    });

    maxInput.addEventListener("input", () => {
      let val = parseInt(maxInput.value) || 10000;
      const minVal = parseInt(minRange.value);

      if (val < minVal + minGap) val = minVal + minGap;
      if (val > maxValue) val = maxValue;

      maxRange.value = val;
      maxInput.value = val;
      updateProgress();
    });

    // Initialize progress on load
    updateProgress();
  }

  // Initialize price range when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPriceRange);
  } else {
    initPriceRange();
  }

  // Initialize desktop price range
  function initDesktopPriceRange() {
    const minRange = document.getElementById("minRangeDesktop");
    const maxRange = document.getElementById("maxRangeDesktop");
    const minInput = document.getElementById("minInputDesktop");
    const maxInput = document.getElementById("maxInputDesktop");
    const progress = document.getElementById("progressDesktop");

    if (!minRange || !maxRange) return;

    const minGap = 4000;
    const maxValue = 10000;

    function updateProgress() {
      const minVal = parseInt(minRange.value);
      const maxVal = parseInt(maxRange.value);

      progress.style.left = (minVal / maxValue) * 100 + "%";
      progress.style.right = (100 - (maxVal / maxValue) * 100) + "%";
    }

    minRange.addEventListener("input", () => {
      let minVal = parseInt(minRange.value);
      let maxVal = parseInt(maxRange.value);
      if (minVal > maxVal) {
        minVal = maxVal;
        minRange.value = minVal;
      }
      minInput.value = minVal;
      updateProgress();
    });

    maxRange.addEventListener("input", () => {
      let minVal = parseInt(minRange.value);
      let maxVal = parseInt(maxRange.value);
      if (maxVal < minVal) {
        maxVal = minVal;
        maxRange.value = maxVal;
      }
      maxInput.value = maxVal;
      updateProgress();
    });

    const sliderContainer = document.getElementById("priceSliderDesktop");
    let activeThumb = null;

    function valueFromClientX(clientX) {
      if (!sliderContainer) return 0;
      const rect = sliderContainer.getBoundingClientRect();
      let fraction = (clientX - rect.left) / rect.width;
      fraction = Math.max(0, Math.min(1, fraction));
      return Math.round(fraction * maxValue);
    }

    sliderContainer.addEventListener("pointerdown", (e) => {
      const clickValue = valueFromClientX(e.clientX);
      const curMin = parseInt(minRange.value);
      const curMax = parseInt(maxRange.value);
      const distToMin = Math.abs(clickValue - curMin);
      const distToMax = Math.abs(clickValue - curMax);
      activeThumb = distToMin <= distToMax ? "min" : "max";
    });

    document.addEventListener("pointermove", (e) => {
      if (!activeThumb || !sliderContainer) return;
      const rect = sliderContainer.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right) return;

      const val = valueFromClientX(e.clientX);
      
      if (activeThumb === "min") {
        const maxVal = parseInt(maxRange.value);
        const newVal = Math.max(0, Math.min(val, maxVal - minGap));
        minRange.value = newVal;
        minInput.value = newVal;
      } else if (activeThumb === "max") {
        const minVal = parseInt(minRange.value);
        const newVal = Math.min(maxValue, Math.max(val, minVal + minGap));
        maxRange.value = newVal;
        maxInput.value = newVal;
      }
      updateProgress();
    });

    document.addEventListener("pointerup", () => {
      activeThumb = null;
    });

    document.addEventListener("pointercancel", () => {
      activeThumb = null;
    });

    minInput.addEventListener("input", () => {
      let val = parseInt(minInput.value) || 0;
      const maxVal = parseInt(maxRange.value);
      if (val > maxVal - minGap) val = maxVal - minGap;
      if (val < 0) val = 0;
      minRange.value = val;
      minInput.value = val;
      updateProgress();
    });

    maxInput.addEventListener("input", () => {
      let val = parseInt(maxInput.value) || 10000;
      const minVal = parseInt(minRange.value);
      if (val < minVal + minGap) val = minVal + minGap;
      if (val > maxValue) val = maxValue;
      maxRange.value = val;
      maxInput.value = val;
      updateProgress();
    });

    updateProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDesktopPriceRange);
  } else {
    initDesktopPriceRange();
  }




   const button = document.getElementById("sortButton");
  const options = document.getElementById("sortOptions");
  const selectedText = document.getElementById("selectedText");
  const items = options.querySelectorAll("div[data-value]");

  button.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  items.forEach(item => {
    item.addEventListener("click", () => {
      selectedText.textContent = item.textContent.trim();
      items.forEach(i => i.querySelector("i").classList.add("hidden"));
      item.querySelector("i").classList.remove("hidden");
      options.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !options.contains(e.target)) {
      options.classList.add("hidden");
    }
  });