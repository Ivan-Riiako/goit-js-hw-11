// import { currentPage, totalPage } from '../index';

const axios = require('axios').default;
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
// Запрос на сервер
export async function fetchhPhoto(name, page = 1) {
  return await instance({ params: { q: `${name}`, page: `${page}` } })
    .then(function (response) {
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
      console.log(error);
    });
}
