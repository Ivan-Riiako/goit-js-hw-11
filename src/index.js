import './css/styles.css';

// Notify;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Throttle
var throttle = require('lodash.throttle');

// Axios;
// const axios = require('axios');
// const axios = require('axios/dist/browser/axios.cjs');
const axios = require('axios').default;

//SimpleLightbox
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Block } from 'notiflix';

const Throttle_DELAY = 500;
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33947023-c15fa4d03e325678c88d2d925';
const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 5,
  },
});
const refs = {
  searchForm: document.querySelector('form#search-form'),
  inputForm: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('button.load-more'),
  btnUp: document.querySelector('.link-up'),
};
let currentPage = 1;
let totalPage;
var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onClickSButtonSearchForm);

async function onClickSButtonSearchForm(event) {
  event.preventDefault();
  const data = refs.inputForm.value;

  if (data === '') {
    Notify.failure('Введите слово');
    return;
  }

  cleanGallery();
  currentPage = 1;
  const response = await makeArreyFetchPhoto(data);
  totalPage = response[0].data.totalHits / 40;

  if (response[0].data.totalHits===0) {
Notify.failure(
  'Sorry, there are no images matching your search query. Please try again.'
);
  } else {
   Notify.success(`Hooray! We found ${response[0].data.totalHits} images.`);
  }

  response.map(createGalleryItems);

  toggleShowBtnLoadMore();
}
// очистка разметки галереи
function cleanGallery() {
refs.gallery.textContent=''
}
// Генерация разметки
function createGalleryItems({ data:{hits,} }) {
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
// Создания массива запросов для экономии времени загрузки
async function makeArreyFetchPhoto(name) {
const arreyPhoto = [];
  for (let i = 1; i <= 8;i+=1 ) {
    let currentPageFetch = i + ((currentPage - 1) * 8);
    const fetchOnePhoto = fetchhPhoto(name, currentPageFetch);
    arreyPhoto.push(fetchOnePhoto);
  }
 return await Promise.all(arreyPhoto);
}
// Запрос на сервер
 function fetchhPhoto(name,page=1) {
  return instance({ params: { q: `${name}`, page: `${page}` } })
    .then(function (response) {
      
      if ((page !== 1) & response.data.length===0) {
        throw 'Картинок больше нет!';
      }
      return response;
    })
    .catch(function (error) {
      // handle error
      if (error.response) {
        // Запрос был сделан, и сервер ответил кодом состояния, который
        // выходит за пределы 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      Notify.failure(error);
    });
}


// Бесконечный скролл
// refs.btnLoadMore.addEventListener('click', onClickLoadMore);
window.addEventListener('scroll', throttle(infinityScroll, Throttle_DELAY));
async function infinityScroll() {
  if (currentPage > totalPage  ) {
    return
  }
  
  const documentRectBottom = document.body.getBoundingClientRect().bottom;
  const userHeightWindov = window.innerHeight;

  if (userHeightWindov + 100 > documentRectBottom) {
     await onClickLoadMore();
    smoothScroll();
  }
};
async function onClickLoadMore() {
  const data = refs.inputForm.value;
  currentPage += 1;
  if (currentPage > totalPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  const response = await makeArreyFetchPhoto(data);
  response.map(createGalleryItems);
  toggleShowBtnLoadMore();
}
// скрыть/показать кнопку загрузить еще 
function toggleShowBtnLoadMore() {
  if (currentPage < totalPage) {
    refs.btnLoadMore.classList.remove('visibility-hidden');
    return
  }
refs.btnLoadMore.classList.add('visibility-hidden');

}
// Скрол на одну картинку вниз при дополнитеьной подгрузке 
async function smoothScroll() {
  const { height: cardHeight } = await document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    left: 0,
    behavior: 'smooth',
  });
}

// Кнопка вверх страницы
window.addEventListener('scroll', onCheckShowBtnUp);
refs.btnUp.addEventListener('click', onClickUp);
function onCheckShowBtnUp() {
   const userHeightWindov = window.innerHeight;

  if (window.scrollY > userHeightWindov) {
    refs.btnUp.classList.remove('visibility-hidden');
    return;
  }
  refs.btnUp.classList.add('visibility-hidden');
};
function onClickUp(e){
  e.preventDefault();
window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth',
});
};