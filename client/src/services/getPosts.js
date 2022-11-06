import apiClient from '../utils/apiClient';
import { POSTS_BASE_URL } from '../utils/constants';
import { error, info } from '../utils/logger';

export const getPosts = async (limit) => {
  try {
    info(`POSTS: API call to get all posts list triggered ======>`);
    const postData = await apiClient({
      url: `${POSTS_BASE_URL}?_page=1&_limit=${limit}`,
      method: 'GET'
    });
    return postData?.data;
  } catch (err) {
    error(err);
    return null;
  }
};

export const getPostById = async (id) => {
  try {
    info(`POSTS: API call by id triggered ${id} ======>`);
    const postsData = await apiClient.get(`${POSTS_BASE_URL}/${id}`);
    return postsData?.data;
  } catch (err) {
    error(err);
    return null;
  }
};
