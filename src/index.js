import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const axios = require('axios');
// const axios = require('axios/dist/browser/axios.cjs');
const axios = require('axios').default;

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionDelay: 250,
});

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33947023-c15fa4d03e325678c88d2d925';
const options = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page:1,
};
let showLoadMore=false;
const refs = {
 searchForm: document.querySelector('form#search-form'),
 inputForm:document.querySelector('input'),
 gallery: document.querySelector('.gallery'),
 btnLoadMore: document.querySelector('button.load-more'),
};


const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
  },
});
// instance({ params: { q: 'cat' } }).then(function (response) {
//   console.log(response.data);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.headers);
//   console.log(response.config);
// });
// axios
//   .get(`https://pixabay.com/api/?key=33947023-c15fa4d03e325678c88d2d925&q=cat`)
//   .then(function (response) {
//     console.log(response.data);
//     console.log(response.status);
//     console.log(response.statusText);
//     console.log(response.headers);
//     console.log(response.config);
//   });



refs.searchForm.addEventListener('submit', onClickSearchForm)
refs.btnLoadMore.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  const data = refs.inputForm.value;
  options.page += 1;
  
const searchParams = new URLSearchParams(options);

  console.log(options.page);
  fetchhPhoto(data).then(createGalleryItems);
}

function onClickSearchForm(event) {
  event.preventDefault();
  
  const data = refs.inputForm.value;

  if (data === '') {
    Notify.failure('Введите слово');
    return
  }

  cleanGallery();
 options.page = 1;
  fetchhPhoto(data)
    .then(createGalleryItems)
    .catch(err => Notify.failure(err));
  if (!showLoadMore) {
  refs.btnLoadMore.classList.remove('visibility-hidden');
  }




}

async function searcPhoto(name) {
return await instance({ params: { q: `${word}` } })
  .then(function (response) {
    return response;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

}



function cleanGallery() {
refs.gallery.textContent=''
}

function fetchhPhoto(value) {
  const searchParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}?${searchParams}&q=${value}`).then(
    response => {
      if (!response.ok) {
        // Notify.failure('Oops, there is no country with that name');
        throw 'Oops, there is no photo with that name';
      }
      return response.json();
    }
  );
}

function createGalleryItems({ hits, totalHits }) {
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (options.page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
    Notify.success(`Hooray! We found ${totalHits} images.`);

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
}





  window.scrollBy({
    top: 1,
    left: 100,
    behavior: 'smooth',
  });