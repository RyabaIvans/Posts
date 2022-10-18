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

export { HttpClient, api };
