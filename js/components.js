/**
 * Components Layer - ฟังก์ชันสร้าง UI Components
 */

/**
 * สร้าง SVG Icon
 */
function createIcon(pathData, className = "w-4 h-4") {
  return `
     <svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       ${pathData}
     </svg>
   `;
}

/**
 * สร้าง SVG Icon แบบ filled
 */
function createFilledIcon(pathData, className = "w-4 h-4") {
  return `
        <svg class="${className}" fill="currentColor" viewBox="0 0 24 24">
            ${pathData}
        </svg>
    `;
}

/**
 * สร้างการ์ดหมวดหมู่
 */
function createCategoryCard(category) {
  return `
        <a href="category.html?id=${category.id}" class="block">
            <div class="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-red-600 hover:shadow-lg transition-all duration-300 cursor-pointer text-center group card-hover">
                <div class="bg-red-50 group-hover:bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    ${createIcon(icons.chef, "w-10 h-10 text-red-600")}
                </div>
                <h3 class="font-bold text-gray-900 mb-2 text-lg">${category.name}</h3>
                <p class="text-sm text-gray-600">${category.count} สูตร</p>
            </div>
        </a>
    `;
}

/**
 * สร้างการ์ดสูตรอาหารยอดนิยม (ตอนนี้ห่อด้วยลิงก์ไปยังหน้า recipe.html?id=)
 * - เมื่อคลิกจะนำผู้ใช้ไปยังหน้า recipe detail (recipe.html) ด้วยพาราม id
 * - ใส่ data-recipe-id เพื่อให้สามารถ bind event ได้ถ้าจำเป็น
 */
function createRecipeCard(recipe) {
  // Determine if we should show image or gradient placeholder
  const hasImage = recipe.image && recipe.image.trim() !== '';
  const imageContent = hasImage
    ? `<img src="${recipe.image}" alt="${recipe.name}" class="w-full h-full object-cover" />`
    : createIcon(icons.chef, "w-16 h-16 text-white opacity-40");

  return `
        <a href="recipe.html?id=${recipe.id}" class="block" aria-label="เปิดสูตร ${recipe.name}" onclick="try{sessionStorage.setItem('selectedRecipeId','${recipe.id}')}catch(e){}">
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group card-hover" data-recipe-id="${recipe.id}">
                <div class="relative h-48 ${hasImage ? '' : 'bg-gradient-to-br ' + recipe.gradient} flex items-center justify-center overflow-hidden">
                    ${imageContent}
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        ${recipe.name}
                    </h3>
                    <p class="text-sm text-gray-600 mb-3">${recipe.category}</p>
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <div class="flex items-center space-x-1">
                            ${createIcon(icons.clock, "w-4 h-4")}
                            <span>${recipe.time}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                            ${createFilledIcon(icons.star, "w-4 h-4 text-yellow-500")}
                            <span class="font-semibold text-gray-900">${recipe.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

/**
 * Render recipe detail into recipe.html if that page is loaded.
 * Expects a `recipe` object (with `name`, `description`, `category`, `rating`, `ingredients`, `instructions`, `time`, `servings`, `difficulty`, `related`)
 */
function renderRecipeDetail(recipe) {
  if (!recipe) return;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // Basic fields
  setText("recipeTitle", recipe.name || "");
  setText("recipeDescription", recipe.description || "");
  setText("recipeCategory", recipe.category || "");
  setText(
    "recipeRating",
    recipe.rating !== undefined ? recipe.rating.toString() : "",
  );

  // Also update breadcrumb recipe name (span#recipeName)
  setText("recipeName", recipe.name || "");

  // Sidebar fields (if present)
  setText("recipeTime", recipe.time || "");
  setText("recipeServings", recipe.servings ? recipe.servings.toString() : "");
  setText("recipeDifficulty", recipe.difficulty || "");

  // Category link and thumbnail in breadcrumb (dynamic)
  try {
    const catLink = document.getElementById("recipeCategoryLink");
    if (catLink) {
      // Resolve category id by matching name against window.categories (if available)
      let catId = null;
      if (window && Array.isArray(window.categories)) {
        const matched = window.categories.find(
          (c) => c.name === recipe.category,
        );
        if (matched && matched.id) catId = matched.id;
      }
      // Set text and href
      catLink.textContent = recipe.category || "หมวดหมู่";
      catLink.href = catId
        ? `category.html?id=${catId}`
        : `category.html?id=${encodeURIComponent(recipe.category || "")}`;
    }

    const thumb = document.getElementById("recipeThumb");
    if (thumb) {
      // prefer recipe.image, fallback to gradient placeholder or existing src
      if (recipe.image) {
        thumb.src = recipe.image;
      } else if (
        recipe.gradient &&
        thumb.dataset &&
        thumb.dataset.placeholder
      ) {
        // no-op - keep placeholder
      }
      thumb.alt = recipe.name || "สูตรอาหาร";
    }

    // Update hero image
    const heroImg = document.getElementById("recipeHero");
    if (heroImg && recipe.image) {
      heroImg.src = recipe.image;
      heroImg.alt = recipe.name || "สูตรอาหาร";
    }
  } catch (e) {
    // ignore DOM errors
    // console.warn("Breadcrumb update failed", e);
  }

  // Ingredients list
  const ingredientsEl = document.getElementById("ingredientsList");
  if (ingredientsEl && Array.isArray(recipe.ingredients)) {
    ingredientsEl.innerHTML = recipe.ingredients
      .map((ing) => {
        // support both string and object {name, amount}
        if (typeof ing === "string") {
          return `
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">${ing}</span>
            </li>
          `;
        } else if (typeof ing === "object") {
          const amount = ing.amount ? ing.amount + " " : "";
          const name = ing.name || "";
          return `
            <li class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">${amount}${name}</span>
            </li>
          `;
        } else {
          return "";
        }
      })
      .join("");
  }

  // Instructions list
  const instructionsEl = document.getElementById("instructionsList");
  if (instructionsEl && Array.isArray(recipe.instructions)) {
    instructionsEl.innerHTML = recipe.instructions
      .map((ins, idx) => {
        return `
          <li class="flex">
            <span class="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-4">${idx + 1}</span>
            <p class="text-gray-700 pt-1">${ins}</p>
          </li>
        `;
      })
      .join("");
  }

  // Tips list
  const tipsSection = document.getElementById("tipsSection");
  const tipsList = document.getElementById("tipsList");
  if (tipsSection && tipsList) {
    if (Array.isArray(recipe.notes) && recipe.notes.length > 0) {
      tipsList.innerHTML = recipe.notes
        .map(note => `<li>${note}</li>`)
        .join("");
      tipsSection.classList.remove("hidden");
    } else {
      tipsSection.classList.add("hidden");
    }
  }
}

/**
 * Render related recipes (accepts either array of IDs or recipe objects)
 * - `related` can be [id, id...] or [{...}, {...}]
 * - `allRecipes` optional to resolve IDs to objects (e.g. global `recipes` from data.js)
 */
function renderRelatedRecipes(related, allRecipes) {
  const container = document.getElementById("relatedRecipes");
  if (!container) return;

  let cardsHtml = "";

  if (!related) {
    container.innerHTML = "";
    return;
  }

  // normalize to recipe objects
  const items = related
    .map((r) => {
      if (typeof r === "number" && Array.isArray(allRecipes)) {
        return allRecipes.find((x) => x.id === r) || null;
      }
      if (typeof r === "object") return r;
      if (typeof r === "number" && typeof window.recipes !== "undefined") {
        // try global fallback
        return (window.recipes || []).find((x) => x.id === r) || null;
      }
      return null;
    })
    .filter(Boolean);

  // small card markup (reuse createRecipeCard but trimmed)
  items.forEach((recipe) => {
    const hasImage = recipe.image && recipe.image.trim() !== '';
    const imageContent = hasImage
      ? `<img src="${recipe.image}" alt="${recipe.name}" class="w-16 h-16 rounded-md object-cover">`
      : `<div class="w-16 h-16 rounded-md flex items-center justify-center bg-gradient-to-br ${recipe.gradient || 'from-gray-200 to-gray-300'}">${createIcon(icons.chef, "w-8 h-8 text-white")}</div>`;

    cardsHtml += `
      <div class="bg-white rounded-lg shadow-sm overflow-hidden group card-hover">
        <a href="recipe.html?id=${recipe.id}" class="block p-4">
          <div class="flex items-center space-x-3">
            ${imageContent}
            <div>
              <h4 class="font-semibold text-gray-900">${recipe.name}</h4>
              <div class="text-sm text-gray-500">${recipe.time} • ${recipe.category}</div>
            </div>
          </div>
        </a>
      </div>
    `;
  });

  container.innerHTML = cardsHtml;
}

/**
 * Render Featured Section
 */
function renderFeaturedSection() {
  const container = document.getElementById("featuredSection");
  if (!container) return;

  // Get featured recipes from data
  const featured = window.featuredRecipes || {};
  const mainRecipe = window.recipes?.find(r => r.id === featured.main?.id) || window.recipes?.[0];
  const sideRecipes = (featured.side || []).map(id => window.recipes?.find(r => r.id === id)).filter(Boolean);

  // If no side recipes from data, use next 2 recipes
  if (sideRecipes.length === 0 && window.recipes) {
    sideRecipes.push(window.recipes[1], window.recipes[2]);
  }

  let html = '';

  // Main featured card
  if (mainRecipe) {
    const hasImage = mainRecipe.image && mainRecipe.image.trim() !== '';
    const imageContent = hasImage
      ? `<img src="${mainRecipe.image}" alt="${mainRecipe.name}" class="w-full h-full object-cover">`
      : `<div class="w-full h-full bg-gradient-to-br ${mainRecipe.gradient || 'from-red-200 to-orange-200'} flex items-center justify-center">${createIcon(icons.chef, "w-32 h-32 text-white opacity-40")}</div>`;

    html += `
      <div class="md:col-span-2">
        <a href="recipe.html?id=${mainRecipe.id}" class="block">
          <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group">
            <div class="relative h-96 overflow-hidden">
              ${imageContent}
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <span class="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-2">FEATURED</span>
                <h2 class="text-3xl font-bold text-white mb-2">${mainRecipe.name}</h2>
                <p class="text-white text-sm mb-3">${mainRecipe.description || ''}</p>
                <div class="flex items-center space-x-4 text-white text-sm">
                  <div class="flex items-center space-x-1">
                    ${createIcon(icons.clock, "w-4 h-4")}
                    <span>${mainRecipe.time}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    ${createFilledIcon(icons.star, "w-4 h-4")}
                    <span>${mainRecipe.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  // Side recipes
  html += '<div class="space-y-6">';
  sideRecipes.slice(0, 2).forEach(recipe => {
    if (!recipe) return;

    const hasImage = recipe.image && recipe.image.trim() !== '';
    const imageContent = hasImage
      ? `<img src="${recipe.image}" alt="${recipe.name}" class="w-full h-full object-cover">`
      : `<div class="w-full h-full bg-gradient-to-br ${recipe.gradient || 'from-gray-200 to-gray-300'} flex items-center justify-center">${createIcon(icons.chef, "w-16 h-16 text-white opacity-40")}</div>`;

    html += `
      <a href="recipe.html?id=${recipe.id}" class="block">
        <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group">
          <div class="relative h-44 overflow-hidden">
            ${imageContent}
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 class="text-lg font-bold text-white mb-1">${recipe.name}</h3>
              <div class="flex items-center space-x-2 text-white text-xs">
                ${createIcon(icons.clock, "w-3 h-3")}
                <span>${recipe.time}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

/**
 * If this script is loaded on recipe.html, auto-render recipe detail based on URL param `id`
 * - expects a global `recipes` array/object defined in data.js
 */
document.addEventListener("DOMContentLoaded", () => {
  // quick check: is this the recipe detail page? (we look for the recipeTitle element)
  if (document.getElementById("recipeTitle")) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    // Prefer URL param, but fall back to sessionStorage (saved when user clicked a recipe card)
    let id = idParam ? Number(idParam) : null;
    if (!id) {
      try {
        const saved = sessionStorage.getItem("selectedRecipeId");
        if (saved) {
          const n = Number(saved);
          if (!Number.isNaN(n)) id = n;
        }
      } catch (e) {
        // sessionStorage not available or access denied — ignore
      }
    }

    // If still no ID, default to recipe 1
    if (!id) {
      id = 1;
    }

    // try window.recipes (array) or window.recipesById (object)
    const all = window.recipes || window.RECIPES || [];
    let recipeObj = null;

    if (Array.isArray(all)) {
      recipeObj = all.find((r) => r.id === id);
    } else if (all && typeof all === "object") {
      recipeObj = all[id] || null;
    }

    if (recipeObj) {
      renderRecipeDetail(recipeObj);
      // render related if available
      if (recipeObj.related) {
        renderRelatedRecipes(recipeObj.related, all);
      }
      // Clear fallback after successful load
      try {
        sessionStorage.removeItem("selectedRecipeId");
      } catch (e) {
        /* ignore */
      }
    } else {
      // If not found, try to show a simple message in relatedRecipes container
      const related = document.getElementById("relatedRecipes");
      if (related) {
        related.innerHTML = `<div class="col-span-full text-center py-8 text-red-600">ไม่พบสูตรที่ร้องขอ</div>`;
      }
    }
  }
});

/**
 * แสดง Loading State
 */
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        `;
  }
}

/**
 * แสดง Error Message
 */
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-600 font-semibold">${message}</p>
            </div>
        `;
  }
}

/**
 * Render หมวดหมู่อาหาร
 */
function renderCategories(categoriesData) {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  try {
    grid.innerHTML = categoriesData
      .map((category) => createCategoryCard(category))
      .join("");

    // เพิ่ม animation
    const cards = grid.querySelectorAll(".card-hover");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("fade-in");
      }, index * 50);
    });
  } catch (error) {
    console.error("Error rendering categories:", error);
    showError("categoriesGrid", "ไม่สามารถโหลดหมวดหมู่ได้");
  }
}

/**
 * Render สูตรอาหารยอดนิยม
 */
function renderPopularRecipes(recipesData) {
  const grid = document.getElementById("popularGrid");
  if (!grid) return;

  try {
    grid.innerHTML = recipesData
      .map((recipe) => createRecipeCard(recipe))
      .join("");

    // เพิ่ม animation
    const cards = grid.querySelectorAll(".card-hover");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("fade-in");
      }, index * 100);
    });
  } catch (error) {
    console.error("Error rendering recipes:", error);
    showError("popularGrid", "ไม่สามารถโหลดสูตรอาหารได้");
  }
}

/**
 * Filter สูตรอาหารตามคำค้นหา
 */
function filterRecipes(searchTerm, recipesData) {
  if (!searchTerm) return recipesData;

  const term = searchTerm.toLowerCase().trim();
  return recipesData.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.category.toLowerCase().includes(term),
  );
}

/**
 * Show Toast Notification
 */
function showToast(message, type = "info") {
  const colors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
  };

  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
