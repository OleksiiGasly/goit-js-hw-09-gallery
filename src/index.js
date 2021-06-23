import './sass/main.scss';

import galleryItems from './js/gallery.js';

const imagesGallery = document.querySelector('.js-gallery');
const selectedImage = document.querySelector('.js-lightbox');
const modalImage = document.querySelector('.lightbox__image');

const galleryMarkup = createGalleryMarkup(galleryItems);

let currentImage;

// Формирование разметки галлереи
imagesGallery.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(galleryItems) {
  return galleryItems.map(({ preview, original, description }) => {
    return `
    <li class="gallery__item">
      <a
        class="gallery__link"
        href="${original}"
      >
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>
    `
  })
  .join('');
}

// Клик на элемент галлереи
const onImageClick = evt => {
  evt.preventDefault();
  const isImageEl = evt.target.classList.contains('gallery__image');

  if (!isImageEl) {
    return
  }

  openModal(evt)
}

// Клик на элемент закрытия модалки
const onModalClosingElClick = evt => {
  const closingButton = evt.target.dataset.action === 'close-lightbox';
  const closingArea = evt.target.classList.contains('lightbox__overlay');

  if (!closingButton && !closingArea) {
    return
  }

  closeModal()  
}

// Нажатия кнопок - esc и стрелки
const onKeyPress = evt => {
  if (evt.code === 'Escape') {
    closeModal();
    return;
  }

  if (evt.code === 'ArrowLeft') {
    const preceedingEl = currentImage.closest('li').previousElementSibling;
    const lastEl = currentImage.closest('li').parentNode.lastElementChild;

    if (preceedingEl) {
      const preceedingImage = preceedingEl.querySelector('.gallery__image');
      changeImage(preceedingImage);
    }
    else if (preceedingEl === null) {
      const lastImage = lastEl.querySelector('.gallery__image');
      changeImage(lastImage);
    }
    return
  }

  if (evt.code === 'ArrowRight') {
    const succeedingEl = currentImage.closest('li').nextElementSibling;
    const firstEl = currentImage.closest('li').parentNode.firstElementChild;

    if (succeedingEl) {
      const succeedingImage = succeedingEl.querySelector('.gallery__image');
      changeImage(succeedingImage);
    } 
    else if (succeedingEl === null) {
      const firstImage = firstEl.querySelector('.gallery__image');
      changeImage(firstImage);
    }
    return
  }
}

// Открытие модалки
const openModal = evt => {
  selectedImage.classList.add('is-open');
  modalImage.src = evt.target.dataset.source;
  modalImage.alt = evt.target.getAttribute('alt');
  currentImage = evt.target;

  window.addEventListener('keydown', onKeyPress);
}

// Закрытие модалки
const closeModal = () => {
  selectedImage.classList.remove('is-open');
  modalImage.src = '';
  modalImage.alt = '';

  window.removeEventListener('keydown', onKeyPress);
}

// Переключение картинок
const changeImage = target => {
  modalImage.src = target.dataset.source;
  modalImage.alt = target.getAttribute('alt');
  currentImage = target;
}

imagesGallery.addEventListener('click', onImageClick);
selectedImage.addEventListener('click', onModalClosingElClick);