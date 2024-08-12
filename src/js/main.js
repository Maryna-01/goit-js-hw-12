import { fetchImages } from './js/pixabay-api.js';
import { renderImages, showAlert, clearGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('load-more-btn');
document.body.appendChild(loadMoreBtn);
loadMoreBtn.style.display = 'none';

let page = 1;
let query = '';
let simpleLightbox;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.elements.query.value.trim();
  if (!query) {
    showAlert('Please enter a search query!', 'error');
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.style.display = 'none';
  loader.style.display = 'block';

  try {
    const images = await fetchImages(query, page);
    if (images.length === 0) {
      showAlert(
        'Sorry, there are no images matching your search query. Please try again!',
        'error'
      );
    } else {
      renderImages(images);
      simpleLightbox = new SimpleLightbox('.gallery a');
      simpleLightbox.refresh();
      loadMoreBtn.style.display = images.length === 15 ? 'block' : 'none';
    }
  } catch (error) {
    showAlert('An error occurred while fetching images!', 'error');
  } finally {
    loader.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    const images = await fetchImages(query, page);
    renderImages(images);
    simpleLightbox.refresh();
    if (images.length < 15) {
      loadMoreBtn.style.display = 'none';
      showAlert(
        "We're sorry, but you've reached the end of search results.",
        'info'
      );
    }
  } catch (error) {
    showAlert('An error occurred while fetching images!', 'error');
  } finally {
    loader.style.display = 'none';
  }
  
});
