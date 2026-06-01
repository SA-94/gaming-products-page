const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = (window.GAMING_PRODUCTS || []).find((item) => item.id === productId);
const detailRoot = document.querySelector("[data-product-detail]");

function setMainImage(src, alt) {
  const image = document.querySelector("[data-detail-image]");
  image.src = src;
  image.alt = alt;
}

function buildWhatsAppUrl(product) {
  const phone = "966508572076";
  const imageUrl = new URL(product.images[0], window.location.href).href;
  const productUrl = window.location.href.split("#")[0];
  const details = product.specs.map((spec) => `- ${spec}`).join("\n");
  const message = [
    "السلام عليكم",
    "أبغى أحجز هذا المنتج من متجر خضرون:",
    "",
    `المنتج: ${product.name}`,
    `الفئة: ${product.badge}`,
    `السعر: ${product.price}`,
    `قبل: ${product.oldPrice}`,
    "",
    "الوصف:",
    product.description,
    "",
    "التفاصيل:",
    details,
    "",
    `صورة المنتج: ${imageUrl}`,
    `رابط المنتج: ${productUrl}`,
    "",
    "هل المنتج متوفر؟"
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

if (!product && detailRoot) {
  detailRoot.innerHTML = `
    <div class="not-found">
      <h1>المنتج غير موجود</h1>
      <p>ارجع للمنتجات واختر بطاقة ثانية.</p>
      <a class="primary-btn" href="index.html#products">الرجوع للمنتجات</a>
    </div>
  `;
}

if (product) {
  document.title = `${product.name} | متجر خضرون`;

  setMainImage(product.images[0], product.name);
  document.querySelector("[data-detail-badge]").textContent = product.badge;
  document.querySelector("[data-detail-name]").textContent = product.name;
  document.querySelector("[data-detail-description]").textContent = product.description;
  document.querySelector("[data-detail-price]").textContent = product.price;
  document.querySelector("[data-detail-old-price]").textContent = product.oldPrice;

  const orderButton = document.querySelector("[data-whatsapp-order]");
  orderButton?.setAttribute("href", buildWhatsAppUrl(product));

  const specs = document.querySelector("[data-detail-specs]");
  const specIcons = ["🎮", "🏷️", "✨", "💿", "🧼", "💰"];
  specs.innerHTML = product.specs.map((spec, index) => `
    <li>
      <span class="spec-icon">${specIcons[index % specIcons.length]}</span>
      <strong>${spec}</strong>
    </li>
  `).join("");

  const thumbs = document.querySelector("[data-detail-thumbs]");
  thumbs.innerHTML = product.images.map((src, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" data-image-src="${src}" aria-label="عرض صورة ${index + 1}">
      <img src="${src}" alt="${product.name} صورة ${index + 1}" />
    </button>
  `).join("");

  const thumbButtons = [...thumbs.querySelectorAll("button")];
  let activeImageIndex = 0;
  let galleryTimer;

  function showImage(index) {
    activeImageIndex = index;
    const button = thumbButtons[activeImageIndex];
    setMainImage(button.dataset.imageSrc, product.name);
    thumbButtons.forEach((item) => item.classList.toggle("active", item === button));
  }

  function startGalleryRotation() {
    if (galleryTimer || thumbButtons.length < 2) {
      return;
    }

    galleryTimer = window.setInterval(() => {
      showImage((activeImageIndex + 1) % thumbButtons.length);
    }, 5000);
  }

  function resetGalleryRotation() {
    window.clearInterval(galleryTimer);
    galleryTimer = undefined;
    startGalleryRotation();
  }

  thumbButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showImage(index);
      resetGalleryRotation();
    });
  });

  startGalleryRotation();
}
