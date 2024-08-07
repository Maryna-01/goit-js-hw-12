import { fetchImages } from './pixabay-api.js';
import {
  renderGallery,
  appendGallery,
  clearGallery,
} from './render-functions.js';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more-btn');
let query = '';
let page = 1;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.searchQuery.value.trim();
  if (!query) return;
  page = 1;
  clearGallery();
  try {
    const data = await fetchImages(query, page);
    renderGallery(data.hits);
    loadMoreBtn.style.display = data.hits.length < 15 ? 'none' : 'block';
  } catch (error) {
    console.error(error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  try {
    const data = await fetchImages(query, page);
    appendGallery(data.hits);
    if (data.hits.length < 15) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error(error);
  }
});
