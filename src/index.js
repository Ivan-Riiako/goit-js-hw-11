import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const axios = require('axios');
// const axios = require('axios/dist/browser/axios.cjs');
const axios = require('axios').default;

//SimpleLightbox
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionDelay: 250,
});

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33947023-c15fa4d03e325678c88d2d925';
const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});

let currentPage = 1;
let showLoadMore = false;
let totalPage;

const refs = {
  searchForm: document.querySelector('form#search-form'),
  inputForm: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('button.load-more'),
};

refs.searchForm.addEventListener('submit', onClickSButtonSearchForm);
refs.btnLoadMore.addEventListener('click', onClickLoadMore);

async function onClickLoadMore() {
  const data = refs.inputForm.value;
  currentPage += 1;
  const response = await fetchhPhoto(data, currentPage);
  createGalleryItems(response);
  smoothScroll();
}

async function onClickSButtonSearchForm(event) {
  event.preventDefault();
  currentPage = 1;
  const data = refs.inputForm.value;

  if (data === '') {
    Notify.failure('Введите слово');
    return;
  }

  cleanGallery();
const response = await fetchhPhoto(data);
createGalleryItems(response);
}

function cleanGallery() {
refs.gallery.textContent=''
}

function toggleShowBtnLoadMore() {
  if (currentPage < totalPage) {
    refs.btnLoadMore.classList.remove('visibility-hidden');
    return
  }
refs.btnLoadMore.classList.add('visibility-hidden');

}

function createGalleryItems({ data:{hits, totalHits} }) {
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (currentPage === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
totalPage = totalHits/40;
  const items = hits
    .map(
      ({
        webformatURL,
        tags,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"><a class="photo-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" width='300px' loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', items);
  lightbox.refresh();
  toggleShowBtnLoadMore();
}

 function fetchhPhoto(name,page=1) {
  return instance({ params: { q: `${name}`, page: `${page}` } })
    .then(function (response) {
      // if (!response.ok) {
      //   throw 'Oops, there is no photo with that name';
      // }
      console.log(response);
      return response;
    })
    .catch(function (error) {
      // handle error
      Notify.failure(error);
    });
}

 function smoothScroll() {

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();
window.scrollBy(0,{
  top: cardHeight * 2,
  behavior: 'smooth',
});
};