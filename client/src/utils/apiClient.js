import axios from 'axios';
import environment from '../environments/environment';

const instance = axios.create({
  baseURL: environment.baseUrl
});

export default instance;
