import axios from 'axios';

const API_KEY = '45110069-9beca970d71a92a84c606c316';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
const response = await axios.get(`${BASE_URL}`, {
  params: {
    key: API_KEY,
    q: query,
    page: page,
    per_page: 15
  }
});
return response.data;
}


