import axios from 'axios';
import { API_URL } from '../../config';
import AuthService from '../../services/AuthService/AuthService';

export default class ApiService {
  Auth = new AuthService();

  getHeaders = () => ({ Authorization: `Bearer ${this.Auth.getToken()}` });

  sendComponent = (data, url) =>
    axios
      .post(
        `${API_URL}${url}`,
        {
          ...data,
        },
        { headers: this.getHeaders() }
      )
      .then(res => res);

  putComponent = (data, url) =>
    axios
      .put(
        `${API_URL}${url}`,
        {
          ...data,
        },
        { headers: this.getHeaders() }
      )
      .then(res => res);

  deleteComponent = url =>
    axios
      .delete(`${API_URL}${url}`, { headers: this.getHeaders() })
      .then(res => res);

  patchComponent = (data, url) =>
    axios
      .patch(
        `${API_URL}${url}`,
        {
          ...data,
        },
        { headers: this.getHeaders() }
      )
      .then(res => res);

  uploadFiles = (formData, url) =>
    axios
      .post(`${API_URL}${url}`, formData, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res)
      .catch(err => {
        console.log(err);
      });

  getComponent = url =>
    axios
      .get(`${API_URL}${url}`, { headers: this.getHeaders() })
      .then(res => res)
      .catch(err => {
        console.log(err);
      });

  getComponentByToken = (url, token) =>
    axios
      .get(`${API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => res)
      .catch(err => {
        console.log(err);
      });

  getComponentPosts = url =>
    axios
      .get(`${API_URL}${url}`, { headers: this.getHeaders() })
      .then(res => res);

  registerTourOperator = (url, data) =>
    axios.post(`${API_URL}${url}`, data, { headers: this.getHeaders() });

  forgotPassword = email =>
    axios.post(`${API_URL}/password/forgot`, { email }).then(res => res);

  resetPassword = (password, re_password, token) =>
    axios
      .post(
        `${API_URL}/password/reset`,
        { password, re_password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => res);

  getJournal = url =>
    axios.get(`${API_URL}${url}`, { headers: this.getHeaders() });

  getPaymentMethods = url =>
    axios.get(`${API_URL}${url}`, { headers: this.getHeaders() });

  get = url => axios.get(`${API_URL}${url}`, { headers: this.getHeaders() });
}
