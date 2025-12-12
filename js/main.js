/**
 * Main Application Logic
 */

// State Management
const AppState = {
  searchTerm: "",
  currentCategory: "all",
  filteredRecipes: popularRecipes,
};

/**
 * Initialize Application
 */
function initApp() {
  console.log("🍳 Recipe Website Initialized");

  // Render initial data
  renderFeaturedSection();
  renderCategories(categories);
  renderPopularRecipes(popularRecipes);

  // Setup event listeners
  setupEventListeners();

  // Show welcome message
  setTimeout(() => {
    showToast("ยินดีต้อนรับสู่เว็บไซต์สูตรอาหาร! 👋", "success");
  }, 500);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
    searchInput.addEventListener("keypress", handleSearchEnter);
  }

  // Newsletter subscription
  const newsletterBtn = document.querySelector("section.bg-red-600 button");
  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", handleNewsletterSubscribe);
  }

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", handleSmoothScroll);
  });

  // Category cards click event
  document.addEventListener("click", (e) => {
    const categoryCard = e.target.closest("#categoriesGrid > div");
    if (categoryCard) {
      const index = Array.from(categoryCard.parentElement.children).indexOf(
        categoryCard,
      );
      handleCategoryClick(categories[index]);
    }
  });

  // Recipe cards click event
  document.addEventListener("click", (e) => {
    const recipeCard = e.target.closest("#popularGrid > div");
    if (recipeCard) {
      const index = Array.from(recipeCard.parentElement.children).indexOf(
        recipeCard,
      );
      handleRecipeClick(AppState.filteredRecipes[index]);
    }
  });
}

/**
 * Handle Search Input
 */
function handleSearch(e) {
  const searchTerm = e.target.value;
  AppState.searchTerm = searchTerm;

  // Debounce search
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    performSearch(searchTerm);
  }, 300);
}

/**
 * Handle Search Enter Key
 */
function handleSearchEnter(e) {
  if (e.key === "Enter") {
    performSearch(AppState.searchTerm);
  }
}

/**
 * Perform Search
 */
function performSearch(searchTerm) {
  console.log("🔍 Searching for:", searchTerm);

  const filteredRecipes = filterRecipes(searchTerm, popularRecipes);
  AppState.filteredRecipes = filteredRecipes;

  if (filteredRecipes.length === 0) {
    showError("popularGrid", `ไม่พบสูตรอาหารที่ค้นหา "${searchTerm}"`);
    showToast("ไม่พบสูตรอาหารที่ค้นหา", "warning");
  } else {
    renderPopularRecipes(filteredRecipes);
    showToast(`พบ ${filteredRecipes.length} สูตรอาหาร`, "info");
  }
}

/**
 * Handle Category Click
 */
function handleCategoryClick(category) {
  console.log("📂 Category clicked:", category.name);
  AppState.currentCategory = category.id;
  showToast(`คุณเลือกหมวดหมู่: ${category.name}`, "info");

  // TODO: Filter recipes by category
  // const categoryRecipes = popularRecipes.filter(r => r.category === category.name);
  // renderPopularRecipes(categoryRecipes);
}

/**
 * Handle Recipe Click
 */
function handleRecipeClick(recipe) {
  console.log("🍽️ Recipe clicked:", recipe.name);
  showToast(`เปิดสูตร: ${recipe.name}`, "info");

  // TODO: Navigate to recipe detail page
  // window.location.href = `/recipe/${recipe.id}`;
}

/**
 * Handle Newsletter Subscribe
 */
function handleNewsletterSubscribe() {
  const emailInput = document.querySelector(
    'section.bg-red-600 input[type="email"]',
  );
  const email = emailInput ? emailInput.value : "";

  if (!email) {
    showToast("กรุณากรอกอีเมล", "warning");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("รูปแบบอีเมลไม่ถูกต้อง", "error");
    return;
  }

  console.log("📧 Newsletter subscription:", email);

  // TODO: Send to backend API
  // await subscribeNewsletter(email);

  showToast("สมัครรับข่าวสารสำเร็จ! 🎉", "success");
  if (emailInput) emailInput.value = "";
}

/**
 * Handle Smooth Scroll
 */
function handleSmoothScroll(e) {
  const href = e.target.getAttribute("href");
  if (!href || !href.startsWith("#")) return;

  e.preventDefault();
  const targetId = href.substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

/**
 * Validate Email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Handle Window Resize
 */
function handleResize() {
  const width = window.innerWidth;
  console.log("📱 Window resized:", width);

  // TODO: Adjust layout for different screen sizes
}

/**
 * Handle Scroll
 */
function handleScroll() {
  const scrollY = window.scrollY;
  const nav = document.querySelector("nav");

  if (nav) {
    if (scrollY > 100) {
      nav.classList.add("shadow-lg");
    } else {
      nav.classList.remove("shadow-lg");
    }
  }
}

// Add resize and scroll listeners
window.addEventListener("resize", handleResize);
window.addEventListener("scroll", handleScroll);

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("❌ Application error:", e.error);
  showToast("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", "error");
});

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    AppState,
    initApp,
    performSearch,
    isValidEmail,
  };
}
