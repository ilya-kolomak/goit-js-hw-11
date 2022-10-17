import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayApi } from './js/pixabayApi';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayApi();

// const options = {
//   root: null,
//   rootMargin: '100px',
//   threshold: 1.0,
// };
// const callback = function (entries, observer) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting && entry.intersectionRect.bottom > 550) {
//       pixabayApi.incrementPage();
//     }
//   });
// };
// const io = new IntersectionObserver(callback, options);

const handelSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    Notify.failure('enter data to search!');
    return;
  }
  pixabayApi.searchQuery = query;
  clearPage();

  try {
    const { hits, totalHits } = await pixabayApi.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    // const target = document.querySelector('.photo-card:last-child');
    // io.observe(target);

    pixabayApi.calculateTotalPages(totalHits);

    let lightbox = new SimpleLightbox('.photo-card a', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
    });

    if (pixabayApi.isShowLoadMore) {
      refs.loadMore.classList.remove('is-hidden');
    }
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    Notify.failure(error.message, 'something went wrong try more');

    clearPage();
  }
};

const BtnloadMore = async () => {
  pixabayApi.incrementPage();

  if (!pixabayApi.isShowLoadMore) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info('Were sorry, but youve reached the end of search results.');
  }

  try {
    const { hits } = await pixabayApi.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    let lightbox = new SimpleLightbox('.photo-card a', {
      captions: true,
      captionsData: 'alt',
      captionDelay: 250,
    });
  } catch (error) {
    Notify.failure(error.message, 'something went wrong try more');
    clearPage();
  }
};

refs.form.addEventListener('submit', handelSubmit);
refs.loadMore.addEventListener('click', BtnloadMore);

function clearPage() {
  pixabayApi.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
}
