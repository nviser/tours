import axios from 'axios';
import { API_URL } from '../../config';
import AuthService from '../../services/AuthService/AuthService';

export default class SearchService {
  Auth = new AuthService();

  getHeaders = () => ({ Authorization: `Bearer ${this.Auth.getToken()}` });

  search = (url, query) =>
    axios
      .get(`${API_URL}${url}`, {
        headers: this.getHeaders(),
        params: {
          query,
        },
      })
      .then(res => res);

  searchProperty = (url, query) =>
    axios
      .get(`${API_URL}${url}`, {
        headers: this.getHeaders(),
        params: {
          query,
        },
      })
      .then(res => res);

  getLocation = url => axios.get(url, {}).then(res => res);
}
