import axios from 'axios';

export default axios.create({
  baseURL: 'https://quiet-dusk-91360.herokuapp.com',
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJjdXN0b21lcl9pZCI6NjJ9.8OgbwbJQsWvE8rN9H7uEv02NmGJh_OlXZDH-j69kj60',
  },
});
