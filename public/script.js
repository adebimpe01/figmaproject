
const menuBtn = document.getElementById("menu-btn");
const addressMenu = document.getElementById("addressMenu");
const closeMenu = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");
const filtersButton = document.getElementById("filtersButton");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    addressMenu.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
});

// Filters button opens the same menu
filtersButton.addEventListener("click", () => {
    menuBtn.classList.add("open");
    addressMenu.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
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
// (Removed premature updatePriceFilter call — initialization happens after price variables are declared)





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

 
const productGrid = document.getElementById("productGrid");

let allProducts = [];
let selectedCategory = "all";
let minPrice = 0;
let maxPrice = 10000;
let sortBy = "default"; // default, asc, desc

/* FETCH PRODUCTS */
async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  allProducts = data.map(p => ({
    id: p.id,
    title: p.title,
    price: Math.round(p.price * 1600), // USD → ₦
    image: p.image,
    category: normalizeCategory(p.category),
  }));

  // Update slider maximums to match fetched product prices (in ₦)
  const maxProductPrice = Math.max(...allProducts.map(p => p.price), 10000);

  const rangeIds = ['minRange','maxRange','minRangeDesktop','maxRangeDesktop'];
  rangeIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.max = String(maxProductPrice);
      if (id.toLowerCase().includes('maxrange')) el.value = String(maxProductPrice);
    }
  });

  const inputIds = ['minInput','maxInput','minInputDesktop','maxInputDesktop'];
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.max = String(maxProductPrice);
      if (id.toLowerCase().includes('maxinput')) el.value = String(maxProductPrice);
    }
  });

  // Initialize price filter to full range based on fetched products
  updatePriceFilter(0, maxProductPrice);

  applyFilters();

  // Now initialize sliders AFTER products are fetched and max values are set
  initAllRanges();
}

/* CATEGORY MAP */
function normalizeCategory(cat) {
  if (cat.includes("electronics")) return "electronics";
  if (cat.includes("jewelery")) return "jewelery";
  if (cat.includes("men")) return "men";
  if (cat.includes("women")) return "women";
  return "all";
}

/* APPLY FILTERS */
function applyFilters() {
  let filtered = allProducts.filter(p => {
    return (
      (selectedCategory === "all" || p.category === selectedCategory) &&
      p.price >= minPrice &&
      p.price <= maxPrice
    );
  });

  // Apply sorting
  if (sortBy === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
  
  // Update product count
  const countEl = document.getElementById("productCount");
  if (countEl) countEl.textContent = filtered.length;
  
  // Update active filter text
  const activeFilterEl = document.getElementById("activeFilter");
  if (activeFilterEl) {
    let filterText = "Active Filter: ";
    const filters = [];
    
    if (selectedCategory !== "all") {
      filters.push(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
    }
    
    if (minPrice > 0 || maxPrice < 999999999) {
      filters.push(`₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}`);
    }
    
    filterText += filters.length > 0 ? filters.join(", ") : "None";
    activeFilterEl.textContent = filterText;
  }
}

/* RENDER */
function renderProducts(products) {
  productGrid.innerHTML = "";

  if (!products.length) {
    productGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No products found</p>`;
    return;
  }

  products.forEach(p => {
    productGrid.innerHTML += `
        <div class="bg-white w-90 item-center justify-center rounded-md p-2 flex flex-col border-2 hover:border-red-300 transition-all">
          <div class="flex-1 mb-3 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
            <img src="${p.image}" class="w-full object-cover p-2">
          </div>
          <h3 class="text-sm mt-1 line-clamp-2">${p.title}</h3>
          <p class="text-green-600 font-semibold mt-1">₦${p.price.toLocaleString()}</p>
          <button class="mt-2 w-full bg-green-600 text-white py-1 rounded-md text-sm">
            Add to Cart
          </button>
        </div>
    `;
  });
}

/* CATEGORY LISTENERS */
document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener("change", () => {
    selectedCategory = radio.dataset.category;
    applyFilters();
  });
});

/* PRICE RANGE LISTENERS */
const priceFilters = {
  "All Price": { min: 0, max: 999999 },
  "Under $20": { min: 0, max: 32000 },
  "$25 to $100": { min: 40000, max: 160000 },
  "$100 to $300": { min: 160000, max: 480000 },
  "$300 to $500": { min: 480000, max: 800000 },
  "$500 to $1000": { min: 800000, max: 1600000 },
  "$1000 to $10000": { min: 1600000, max: 999999999 }
};

document.querySelectorAll('input[name="price"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    const label = e.target.parentElement.querySelector("span").textContent.trim();
    const filter = priceFilters[label];
    if (filter) {
      updatePriceFilter(filter.min, filter.max);
    }
  });
});

fetchProducts();


const activePriceTag = document.getElementById("activePriceTag");
const priceTagText = document.getElementById("priceTagText");
const clearPriceTag = document.getElementById("clearPriceTag");

function updatePriceFilter(min, max) {
  minPrice = min;
  maxPrice = max;

  priceTagText.textContent = `₦${min.toLocaleString()} – ₦${max.toLocaleString()}`;
  activePriceTag.classList.remove("hidden");
  activePriceTag.classList.add("flex");

  applyFilters();
}

clearPriceTag.addEventListener("click", () => {
  minPrice = 0;
  maxPrice = 10000;
  activePriceTag.classList.add("hidden");
  applyFilters();
});

  // Initialize both mobile and desktop range sliders using a shared initializer
  function initRange(ids) {
    const slider = document.getElementById(ids.sliderId);
    if (!slider) return;
    const minRange = document.getElementById(ids.minRangeId);
    const maxRange = document.getElementById(ids.maxRangeId);
    const progress = document.getElementById(ids.progressId);
    const minInput = document.getElementById(ids.minInputId);
    const maxInput = document.getElementById(ids.maxInputId);

    // Get maxValue dynamically from maxRange (will be updated by fetchProducts)
    const getMaxValue = () => (maxRange && parseInt(maxRange.max)) || 10000;
    const minGap = 4000;

    function updateProgress() {
      const maxValue = getMaxValue();
      const minV = parseInt(minRange.value);
      const maxV = parseInt(maxRange.value);
      const left = (minV / maxValue) * 100;
      const right = (maxV / maxValue) * 100;
      progress.style.left = left + "%";
      progress.style.width = (right - left) + "%";
    }

    function setMin(v) {
      const maxValue = getMaxValue();
      v = Math.max(0, Math.min(v, maxValue - minGap));
      minRange.value = Math.round(v);
      if (minInput) minInput.value = Math.round(v);
    }

    function setMax(v) {
      const maxValue = getMaxValue();
      v = Math.min(maxValue, Math.max(v, parseInt(minRange.value) + minGap));
      maxRange.value = Math.round(v);
      if (maxInput) maxInput.value = Math.round(v);
    }

    function valueFromClientX(clientX) {
      const maxValue = getMaxValue();
      const rect = slider.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(pct * maxValue);
    }

    let active = null;

    function onPointerDown(e) {
      e.preventDefault();
      const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      const val = valueFromClientX(clientX);
      const dMin = Math.abs(val - parseInt(minRange.value));
      const dMax = Math.abs(val - parseInt(maxRange.value));
      active = dMin < dMax ? 'min' : 'max';
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      onPointerMove(e);
    }

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      const val = valueFromClientX(clientX);
      if (active === 'min') {
        const newMin = Math.min(val, parseInt(maxRange.value) - minGap);
        setMin(newMin);
      } else if (active === 'max') {
        const newMax = Math.max(val, parseInt(minRange.value) + minGap);
        setMax(newMax);
      }
      updateProgress();
      updatePriceFilter(parseInt(minRange.value), parseInt(maxRange.value));
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      active = null;
    }

    slider.addEventListener('pointerdown', onPointerDown);

    if (minInput) {
      minInput.addEventListener('input', () => {
        let v = parseInt(minInput.value) || 0;
        v = Math.max(0, Math.min(v, parseInt(maxRange.value) - minGap));
        setMin(v);
        updateProgress();
        updatePriceFilter(parseInt(minRange.value), parseInt(maxRange.value));
      });
    }

    if (maxInput) {
      maxInput.addEventListener('input', () => {
        let v = parseInt(maxInput.value) || maxValue;
        v = Math.min(maxValue, Math.max(v, parseInt(minRange.value) + minGap));
        setMax(v);
        updateProgress();
        updatePriceFilter(parseInt(minRange.value), parseInt(maxRange.value));
      });
    }

    // initialize
    updateProgress();
  }

  function initAllRanges() {
    initRange({
      sliderId: 'priceSlider',
      minRangeId: 'minRange',
      maxRangeId: 'maxRange',
      progressId: 'progress',
      minInputId: 'minInput',
      maxInputId: 'maxInput'
    });

    initRange({
      sliderId: 'priceSliderDesktop',
      minRangeId: 'minRangeDesktop',
      maxRangeId: 'maxRangeDesktop',
      progressId: 'progressDesktop',
      minInputId: 'minInputDesktop',
      maxInputId: 'maxInputDesktop'
    });
  }

  // Note: initAllRanges() is now called from fetchProducts() after max values are set
  // This ensures sliders use the correct maxValue




   const button = document.getElementById("sortButton");
  const options = document.getElementById("sortOptions");
  const selectedText = document.getElementById("selectedText");
  const items = options.querySelectorAll("div[data-value]");

  button.addEventListener("click", () => {
    options.classList.toggle("hidden");
  });

  items.forEach(item => {
    item.addEventListener("click", () => {
      const value = item.dataset.value;
      sortBy = value;
      selectedText.textContent = item.textContent.trim();
      
      // Move checkmark and background to selected item only
      items.forEach(i => {
        let icon = i.querySelector("i");
        if (!icon) {
          // Create icon if it doesn't exist
          icon = document.createElement("i");
          icon.className = "fa fa-check text-sm text-green-600";
          i.appendChild(icon);
        }
        
        if (i.dataset.value === value) {
          icon.style.display = "block";
          i.classList.add("bg-gray-100");
        } else {
          icon.style.display = "none";
          i.classList.remove("bg-gray-100");
        }
      });
      
      options.classList.add("hidden");
      applyFilters();
    });
  });

  document.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !options.contains(e.target)) {
      options.classList.add("hidden");
    }
  });