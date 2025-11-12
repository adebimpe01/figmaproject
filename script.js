
 // Address dropdown
  const addressBtn = document.getElementById("addressBtn");
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


  const minRange = document.getElementById("minRange");
  const maxRange = document.getElementById("maxRange");
  const minInput = document.getElementById("minInput");
  const maxInput = document.getElementById("maxInput");
  const progress = document.getElementById("progress");

  const rangeMin = 0;
  const rangeMax = 10000;
  const rangeGap = 4000; // Minimum difference between min & max

  function updateProgress() {
    const minVal = parseInt(minRange.value);
    const maxVal = parseInt(maxRange.value);
    const total = rangeMax - rangeMin;

    // Update progress bar
    const left = ((minVal - rangeMin) / total) * 100;
    const right = ((maxVal - rangeMin) / total) * 100;

    progress.style.left = left + "%";0
    progress.style.right = (100 - right) + "%";

    // Update input values
    minInput.value = minVal;
    maxInput.value = maxVal;
  }

  // Sync ranges and inputs
  minRange.addEventListener("input", () => {
    if (parseInt(maxRange.value) - parseInt(minRange.value) <= rangeGap) {
      minRange.value = parseInt(maxRange.value) - rangeGap;
    }
    updateProgress();
  });

  maxRange.addEventListener("input", () => {
    if (parseInt(maxRange.value) - parseInt(minRange.value) <= rangeGap) {
      maxRange.value = parseInt(minRange.value) + rangeGap;
    }
    updateProgress();
  });

  // When user types in input fields
  minInput.addEventListener("input", () => {
    let val = parseInt(minInput.value);
    if (val < rangeMin) val = rangeMin;
    if (val > parseInt(maxRange.value) - rangeGap) val = parseInt(maxRange.value) - rangeGap;
    minRange.value = val;
    updateProgress();
  });

  maxInput.addEventListener("input", () => {
    let val = parseInt(maxInput.value);
    if (val > rangeMax) val = rangeMax;
    if (val < parseInt(minRange.value) + rangeGap) val = parseInt(minRange.value) + rangeGap;
    maxRange.value = val;
    updateProgress();
  });

  updateProgress(); // initialize

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