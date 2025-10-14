const loadSwiper = () => {
  if (!document.querySelector('link[href*="swiper"]')) {
    const swiperCSS = document.createElement('link');
    swiperCSS.rel = 'stylesheet';
    swiperCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css';
    document.head.appendChild(swiperCSS);
  }

  if (typeof Swiper === 'undefined') {
    const swiperJS = document.createElement('script');
    swiperJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js';
    document.head.appendChild(swiperJS);
  }
};

loadSwiper();

let swiperInstance = null;

const createModal = () => {
  const modalHTML = `
        <div class="qv-modal-overlay">
            <div class="qv-modal">
                <div class="qv-close"></div>
                <div class="qv-loading"></div>
                <div class="swiper qv-swiper">
                    <div class="swiper-wrapper"></div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
        </div>
    `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
};

const showQuickView = async (pageUrl) => {
  const overlay = document.querySelector('.qv-modal-overlay');
  const modal = document.querySelector('.qv-modal');
  const loading = document.querySelector('.qv-loading');
  const closeBtn = document.querySelector('.qv-close');
  const swiperWrapper = document.querySelector('.qv-swiper .swiper-wrapper');

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  overlay.classList.add('show');
  modal.classList.add('show');
  loading.style.display = 'block';
  closeBtn.style.display = 'none';
  swiperWrapper.innerHTML = '';

  const images = await getGalleryImages(pageUrl);

  if (images.length > 0) {
    images.forEach(imgSrc => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `<img src="${imgSrc}" alt="Product image">`;
      swiperWrapper.appendChild(slide);
    });

    setTimeout(() => {
      if (typeof Swiper !== 'undefined') {
        swiperInstance = new Swiper('.qv-swiper', {
          slidesPerView: 1,
          spaceBetween: 0,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          loop: images.length > 1,
        });
      }
      loading.style.display = 'none';
      closeBtn.style.display = 'flex';
    }, 100);
  } else {
    swiperWrapper.innerHTML = '<div class="swiper-slide"><p>No images available</p></div>';
    loading.style.display = 'none';
    closeBtn.style.display = 'flex';
  }
};

const closeModal = () => {
  const overlay = document.querySelector('.qv-modal-overlay');
  const modal = document.querySelector('.qv-modal');

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  overlay.classList.remove('show');
  modal.classList.remove('show');
};

const initQuickView = () => {
  if (!document.querySelector('.qv-modal-overlay')) {
    createModal();
  }

  const productCards = Array.from(document.querySelectorAll('article.product-card'));

  productCards.forEach(card => {
    const cardRef = Array.from(card.getElementsByClassName('link-wrapper'))[0];
    const productItem = cardRef.getElementsByClassName('contents')[0];
    if (!productItem || productItem.querySelector('.quick-view-btn')) return;

    productItem.style.position = 'relative';

    const pageUrl = cardRef.getAttribute('href');

    const quickViewBtn = document.createElement('button');
    quickViewBtn.className = 'quick-view-btn';
    quickViewBtn.textContent = 'Quick View';
    productItem.prepend(quickViewBtn);

    cardRef.addEventListener('mouseenter', () => {
      quickViewBtn.classList.add('visible');
    });

    cardRef.addEventListener('mouseleave', () => {
      quickViewBtn.classList.remove('visible');
    });

    quickViewBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await showQuickView(pageUrl);
    });
  });
};

async function getGalleryImages(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const urls = new Set();

    const items = doc.querySelectorAll('li.item[data-gallery]');

    items.forEach(item => {
      const url = item.getAttribute('data-gallery');
      if (url) urls.add(url);
    });

    return Array.from(urls);
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('qv-modal-overlay')) {
    closeModal();
  }
  if (e.target.closest('.qv-close')) {
    closeModal();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuickView);
} else {
  setTimeout(initQuickView, 500);
}

const observer = new MutationObserver(() => {
  initQuickView();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});