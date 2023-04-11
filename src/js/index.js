import { PixabayApi } from './fetchData';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { GaleryMarkUp } from './GaleryMarkUp';
import { pageHelper } from './pageHelper';

const pixabayApi = new PixabayApi();
const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let lightbox = null;

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  pixabayApi.query = event.target.elements.searchQuery.value.trim();
  pixabayApi.resetPage();

  if (pixabayApi.query === '') {
    Notiflix.Notify.failure('Sorry, enter something in search line.');
    pageHelper.clearMarkup();
    pageHelper.hideLoadMoreBtn();
    return;
  }

  try {
    const { data } = await pixabayApi.fetchPhoto();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      pageHelper.clearMarkup();
      pageHelper.hideLoadMoreBtn();
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryEl.innerHTML = GaleryMarkUp(data.hits);
    pageHelper.showLoadMoreBtn();

    lightbox = new SimpleLightbox('.gallery  a', {
      captionDelay: 250,
      scrollZoom: false,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

    if (data.totalHits <= pixabayApi.perPage) {
      pageHelper.hideLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  pixabayApi.incrementPage();

  try {
    const { data } = await pixabayApi.fetchPhoto();

    if (Math.ceil(data.totalHits / pixabayApi.perPage) === pixabayApi.page) {
      pageHelper.hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    galleryEl.insertAdjacentHTML('beforeend', GaleryMarkUp(data.hits));
    lightbox.refresh();
    pageHelper.smoothScroll();
  } catch (error) {
    console.log(error);
  }
}
