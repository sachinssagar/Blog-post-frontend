import { config } from '@/app/config';
import {
  reqPost,
  reqGet,
  reqPut,
  reqPatch,
  reqAnonPost,
  reqAnonGet,
  reqDelete,
} from '@/utils/requests';

const apiBaseUrl = config.apiBaseUrl;

const apiCalls = {
  fetchAllPosts: (params) => reqAnonGet(`${apiBaseUrl}/posts`, params),
  fetchPostBySlug: (slug) => reqAnonGet(`${apiBaseUrl}/posts/get-by-slug/?slug=${slug}`),
  myPosts: (params) => reqGet(`${apiBaseUrl}/posts/my-posts/`, params),
  createPost: (data) => reqPost(`${apiBaseUrl}/posts/`, data),
  updatePostBySlug: (slug, data) =>
    reqPatch(`${apiBaseUrl}/posts/update-by-slug/?slug=${slug}`, data),
  deletePostBySlug: (slug) => reqDelete(`${apiBaseUrl}/posts/delete-by-slug/?slug=${slug}`),

  // Authentication-related API calls
  login: (data) => reqAnonPost(`${apiBaseUrl}/login/`, data),
  register: (data) => reqAnonPost(`${apiBaseUrl}/register/`, data),
  updateUserProfile: (data) => reqPatch(`${apiBaseUrl}/register/update-user/`, data),
  forgotPassword: (data) => reqAnonPost(`${apiBaseUrl}/auth/forgot-password`, data),
  resetPassword: (token, data) => reqPost(`${apiBaseUrl}/auth/reset-password/${token}`, data),
};

export default apiCalls;
