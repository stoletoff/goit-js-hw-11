import axios from 'axios';

export class ImageApiService {
  #API_KEY = '35263263-87e16adcb3e852982f83f3522';
  BASE_URL = 'https://pixabay.com/';

  searchQuery = '';
  pageNumber = 1;


  searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 12,
    lang: 'ru',
  });


  async getPictures() {
    const response = await axios.get(
      `${this.#BASE_URL}api/?key=${this.#API_KEY}&q=${this.searchQuery}&${
        this.searchParams
      }&page=${this.pageNumber}`
    );
    return response.data;
  }

  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }

  get pageNumber() {
    return this.pageNumber;
  }

  incrementPage() {
    this.pageNumber += 1;
  }

  resetPage() {
    this.pageNumber = 1;
  }
}
