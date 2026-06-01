const menuToggle = document.querySelector(".menu-toggle");
const backdrop = document.querySelector(".backdrop");
const navLinks = document.querySelectorAll(".nav-link, .brand");
const productSectionsContainer = document.querySelector("[data-product-sections]");

function productCard(product) {
  const image = product.images[0];

  return `
    <a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="فتح صفحة ${product.name}">
      <img src="${image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-footer">
          <span class="price-stack">
            <strong>${product.price}</strong>
            <del>${product.oldPrice}</del>
          </span>
          <span class="details-link">افتح المنتج</span>
        </div>
      </div>
    </a>
  `;
}

function renderProductSections() {
  if (!productSectionsContainer || !window.PRODUCT_GROUPS || !window.GAMING_PRODUCTS) {
    return;
  }

  productSectionsContainer.innerHTML = window.PRODUCT_GROUPS.map((group) => {
    const products = window.GAMING_PRODUCTS.filter((product) => product.group === group.id);

    return `
      <section class="product-section" id="${group.id}">
        <header class="group-heading">
          <div>
            <p class="eyebrow">${group.eyebrow}</p>
            <h2>${group.title}</h2>
            <p>${group.description}</p>
          </div>
          <span>${products.length} منتجات</span>
        </header>
        <div class="product-grid">
          ${products.map(productCard).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  if (backdrop) {
    backdrop.hidden = true;
  }
}

function openMenu() {
  document.body.classList.add("menu-open");
  menuToggle?.setAttribute("aria-expanded", "true");
  if (backdrop) {
    backdrop.hidden = false;
  }
}

function setActiveNav(activeLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link === activeLink);
  });
}

renderProductSections();

if (window.lucide) {
  window.lucide.createIcons();
}

menuToggle?.addEventListener("click", () => {
  if (document.body.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

backdrop?.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("nav-link") && link.getAttribute("href")?.startsWith("#")) {
      setActiveNav(link);
    }

    closeMenu();
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
