import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let query = '';
let page = 1;
let totalHits = 0;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  query = e.target.searchQuery.value.trim();
  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  
  showLoader();
  
  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.warning({ message: 'No images found!' });
      return;
    }

    createGallery(data.hits);
    if (totalHits > 15) showLoadMoreButton();
  } catch (error) {
    iziToast.error({ message: 'Something went wrong' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const loadedImages = page * 15;
    if (loadedImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({ message: 'You reached the end of results' });
    }

    const { height } = document.querySelector('.gallery a').getBoundingClientRect();
    window.scrollBy({ top: height * 2, behavior: 'smooth' });
  } catch {
    iziToast.error({ message: 'Error loading more images' });
  } finally {
    hideLoader();
  }
});