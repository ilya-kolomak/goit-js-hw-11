export class PixabayApi {
  #page = 1;
  #searchQuery = '';
  #totalPages = 0;
  #perPage = 40;
  getPhotos() {
    const url = `https://pixabay.com/api/?key=30596565-cd6a6f45b4b1cdbc6709ed3e2&q=${
      this.#searchQuery
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
      this.#perPage
    }&page=${this.#page}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  set searchQuery(newSearchQuery) {
    this.#searchQuery = newSearchQuery;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

  resetPage() {
    this.#page = 1;
  }
}
