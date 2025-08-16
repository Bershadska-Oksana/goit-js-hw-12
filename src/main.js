import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions';
import iziToast from 'izitoast';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  clearGallery();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  hideLoadMoreBtn(); // одразу ховаємо кнопку
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, no images found. Try another query.',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);

    if (data.totalHits > perPage) {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong, please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;

  hideLoadMoreBtn(); // ❗ ховаємо кнопку під час запиту
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    renderGallery(data.hits);

    // якщо досягли кінця
    const totalPages = Math.ceil(data.totalHits / perPage);
    if (page >= totalPages) {
      iziToast.info({
        title: 'End',
        message: "You've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreBtn(); // тільки після відповіді показуємо кнопку
    }

    // плавний скрол
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while loading more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}
