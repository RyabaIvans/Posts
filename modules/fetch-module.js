function HttpClient(baseUrl) {
  this.baseUrl = baseUrl;

  const fetchWrapper = (promise) => {
    return new Promise(async (resolve) => {
      try {
        const response = await promise;
        const json = await response.json();
        if (response.ok) {
          resolve({ response: json, error: null });
          return;
        }

        resolve({ response: null, error: json });
      } catch (error) {
        resolve({ response: null, error });
      }
    });
  };

  return {
    get: (path) => {
      return fetchWrapper(fetch(`${this.baseUrl}/${path}`));
    },

    post: (path, body) => {
      return fetchWrapper(
        fetch(`${this.baseUrl}/${path}`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
      );
    },

    delete: (path) => {
      return fetchWrapper(
        fetch(`${this.baseUrl}/${path}`, {
          method: "DELETE",
        })
      );
    },

    update: (path, body) => {
      return fetchWrapper(
        fetch(`${this.baseUrl}/${path}`, {
          method: "PATCH",
          body: JSON.stringify(body),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
      );
    },
    getPhoto: (path, body) => {
      return fetchWrapper(
        fetch(`${this.baseUrl}/${path}`, {
          body: JSON.stringify(body),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
      );
    },
  };
}

const api = new HttpClient("https://jsonplaceholder.typicode.com");

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
};

const allert = {
  error(error) {
    return Swal.fire({
      icon: "error",
      title: "Ошибка",
      text: "Что то пошло не так",
      footer: `${error}`,
    });
  },
  success() {
    Swal.fire({
      title: "Операция выполнена успешно!",
      icon: "success",
    });
  },
  confirm(title) {
    return Swal.fire({
      title: title,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Да , конечно!",
      cancelButtonText: "Нет!",
    });
  },
};

const spinner = {
  on(element) {
    element.querySelector('[data-spinner="spinner"]').style.display =
      "inline-block";
  },
  off(element) {
    element.querySelector('[data-spinner="spinner"]').style.display = "none";
  },
};

export { HttpClient, post, spinner, allert };
