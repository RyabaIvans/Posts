const Body = document.getElementById("forSpan");
const tableBody = document.querySelector("tbody");
const createForm = document.getElementById("create-form");
const updateForm = document.getElementById("update-form");
const createModal = new bootstrap.Modal("#createModal");
const updateModal = new bootstrap.Modal("#updateModal");

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
  };
}

function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

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
};

const spinner = {
  on(form) {
    form.getElementsByTagName("span")[0].style.display = "inline-block";
  },
  off(form) {
    form.getElementsByTagName("span")[0].style.display = "none";
  },
};

function createPostRow(userId, id, title, body) {
  const postRow = `<tr data-id="${id}" >
    <td>${userId}</td>  
    <td>${title}</td>  
    <td>${body}</td>
    <td><button data-id="${id}" class="btn btn-outline-primary text-nowrap btn-sm edit-button" data-bs-toggle="modal" data-bs-target="#updateModal" > <i class="bi bi-pencil"></i> Edit</button></td>  
    <td><button data-id="${id}" class="btn btn-outline-danger text-nowrap  btn-sm  delete-button">
    <span 
                 class="spinner-border spinner-border-sm" 
                 role="status"
                 style="display: none" ></span>
    <i class="bi bi-trash"></i>
    Delete</button>
    </td>
    </tr>`;

  return postRow;
}

async function loadPosts() {
  const { response, error } = await post.getAll();
  if (error) {
    allert.error(error);
    return;
  }

  const postTableRows = response.reduce(function (acc, post) {
    return acc + createPostRow(post.userId, post.id, post.title, post.body);
  }, "");

  tableBody.innerHTML = postTableRows;
  spinner.off(Body);
}

loadPosts();

function chekValidation(form) {
  form.classList.add("was-validated");
  return form.checkValidity();
}

async function createPost(e) {
  e.preventDefault();

  if (!chekValidation(e.target)) {
    return;
  }
  spinner.on(e.target);
  let payLoad = getFormData(e.target);

  const { response, error } = await post.create(payLoad);
  if (error) {
    allert.error(error);
    return;
  }

  let newPostRow = createPostRow(
    response.userId,
    response.id,
    response.title,
    response.body
  );

  tableBody.insertAdjacentHTML("beforeEnd", newPostRow);

  e.target.reset();
  allert.success();
  spinner.off(e.target);
  createModal.hide();
}

async function deletePost(e) {
  spinner.on(e.target);
  const result = await allert.confirm("Удалить запись ? ");

  if (result.dismiss) {
    return;
  }

  const postid = e.target.dataset.id;

  const { error } = await post.delete(postid);
  if (error) {
    allert.error(error);
    return;
  }

  tableBody.querySelector(`[data-id="${postid}"]`).remove();
  spinner.off(e.target);
  allert.success();
}

async function setUpdateForm(e) {
  const postId = e.target.dataset.id;
  const { response, error } = await post.getById(postId);
  if (error) {
    allert.error(error);
    return;
  }
  updateForm.userId.value = response.userId;
  updateForm.title.value = response.title;
  updateForm.body.value = response.body;
  updateForm.updateId.value = response.id;
}

async function updatePost(e) {
  e.preventDefault();
  if (!chekValidation(e.target)) {
    return;
  }
  spinner.on(e.target);
  const payLoad = getFormData(e.target);

  const { response, error } = await post.update(payLoad.updateId, payLoad);
  if (error) {
    allert.error(error);
    return;
  }
  let newPostRow = createPostRow(
    response.userId,
    response.updateId,
    response.title,
    response.body
  );
  tableBody.querySelector(`[data-id="${response.updateId}"]`).innerHTML =
    newPostRow;

  e.target.reset();
  allert.success();
  spinner.off(e.target);
  updateModal.hide();
}

createForm.addEventListener("submit", createPost);
updateForm.addEventListener("submit", updatePost);

tableBody.addEventListener("click", function (e) {
  if (e.target.className.includes("delete-button")) {
    deletePost(e);
  }
  if (e.target.className.includes("edit-button")) {
    setUpdateForm(e);
  }
});
