import './css/styles.css';

// Notify;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import {createGalleryItems} from './js/make-gallery';
import { fetchhPhoto } from './js/fetch-photo';

// Throttle
var throttle = require('lodash.throttle');

const Throttle_DELAY = 500;

export const refs = {
  searchForm: document.querySelector('form#search-form'),
  inputForm: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  btnUp: document.querySelector('.link-up'),
};
let currentPage = 1;
let totalPage;

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