import { fetchImages } from './pixabay-api';
import { renderImages, showAlert, clearGallery } from './render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more-btn');
const loader = document.querySelector('.loader');

let simpleLightbox;
let query = '';
let page = 1;

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
    const data = await fetchImages(query, page);
    if (data.hits.length === 0) {
      showAlert(
        'Sorry, there are no images matching your search query. Please try again!',
        'error'
      );
    } else {
      renderImages(data.hits);
      simpleLightbox = new SimpleLightbox('.gallery a');
      if (data.totalHits > page * 15) {
        loadMoreBtn.style.display = 'block';
      }
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
    const data = await fetchImages(query, page);
    renderImages(data.hits);
    simpleLightbox.refresh();

    if (page * 15 >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      showAlert(
        "We're sorry, but you've reached the end of search results.",
        'info'
      );
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    showAlert('An error occurred while fetching images!', 'error');
  } finally {
    loader.style.display = 'none';
  }
});
