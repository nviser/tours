import decode from 'jwt-decode';
import axios from 'axios';
import { API_URL, REDIR_URL } from '../../config';
import {
  logInApiPath,
  logInAsApiPath,
  logInGoogleApiPath,
  logInLinkedInApiPath,
  logInFacebookApiPath,
} from '../../utils/paths';
import { LINKEDIN } from '../../utils/const';

export default class AuthService {
  constructor() {
    this.domain = API_URL;
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login(username, password) {
    return axios
      .post(`${this.domain}${logInApiPath}`, {
        email: username,
        password,
      })
      .then(res => {
        this.setToken(res.data.token);
        return res;
      });
    // this.setToken(username + 'Aer5treWQ' + password);
    // return Promise.resolve(this.getToken());
  }

  loginAs(adminToken, loginAsUserEmail) {
    return axios
      .post(
        `${this.domain}${logInAsApiPath}`,
        {
          email: loginAsUserEmail,
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      .then(res => {
        this.setToken(res.data.token);
        return res;
      });
  }

  loginGoogle(token) {
    return axios
      .post(`${this.domain}${logInGoogleApiPath}`, {
        access_token: token,
      })
      .then(res => {
        this.setToken(res.data.token);
        return res;
      });
  }

  loginLinkedIn(token) {
    return axios
      .post(`${this.domain}${logInLinkedInApiPath}`, {
        oauth2_access_token: token,
      })
      .then(res => {
        this.setToken(res.data.token);
        return res;
      });
  }

  loginLinkedIn2(inCode) {
    return axios({
      method: 'post',
      url: LINKEDIN.OAUTH2_API_2,
      params: {
        grant_type: 'authorization_code',
        code: inCode,
        redirect_uri: REDIR_URL,
        client_id: LINKEDIN.CLIENT_ID,
        client_secret: LINKEDIN.SECRET_ID,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res => res);
  }

  loginFacebook(token) {
    return axios
      .post(`${this.domain}${logInFacebookApiPath}`, {
        access_token: token,
      })
      .then(res => {
        this.setToken(res.data.token);
        return res;
      });
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getHeaders() {
    return { Authorization: `Bearer ${this.getToken()}` };
  }

  getUserData() {
    return axios
      .get(`${API_URL}/me`, { headers: this.getHeaders() })
      .then(res => res);
  }

  registration(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    address
  ) {
    return axios
      .post(`${this.domain}/auth/registration`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        re_password: confirmPassword,
        phone_number: phone,
        primary_address: address,
      })
      .then(res => res);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
    // return this.getToken();
  }

  fetch(url, options) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    if (this.loggedIn()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
