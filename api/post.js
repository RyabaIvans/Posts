import { api } from "../api/api.js";

const post = {
  getAll() {
    return api.get(`posts`);
  },
  getById(id) {
    return api.get(`posts/${id}`);
  },
  delete(id) {
    return api.delete(`posts/${id}`);
  },
  create(payLoad) {
    return api.post("posts", payLoad);
  },
  update(id, payLoad) {
    return api.update(`posts/${id}`, payLoad);
  },
  getPhotoCard(id) {
    return api.getPhoto(`albums/${id}/photos`);
  },
  getSearchResult(id) {
    return api.searchUser(`posts?userId=${id}`);
  },
};

export { post };
