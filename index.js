const spinnerTable = document.getElementById("spinner-table");
const tableBody = document.querySelector("tbody");
const createForm = document.getElementById("create-form");
const updateForm = document.getElementById("update-form");
const createModal = new bootstrap.Modal("#createModal");
const updateModal = new bootstrap.Modal("#updateModal");

import * as myModule from "./modules/fetch-module.js";
function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function createPostRow(userId, id, title, body) {
  const postRow = `<tr data-id="${id}" >
    <td>${userId}</td>  
    <td>${title}</td>  
    <td>${body}</td>
    <td class="align-middle"><button data-id="${id}" class="btn btn-outline-primary text-nowrap btn-sm edit-button " data-bs-toggle="modal" data-bs-target="#updateModal" > <i class="bi bi-pencil"></i> Edit</button></td>  
    <td class="align-middle"><button data-id="${id}" class="btn btn-outline-danger text-nowrap  btn-sm  delete-button">
    <span 
                 class="spinner-border spinner-border-sm" 
                 data-spinner="spinner"
                 role="status"
                 style="display: none" >
                 </span>
    <i class="bi bi-trash"></i>
    Delete</button>
    </td>
    <td class="align-middle"><button  data-id="${id}" class="btn btn-outline-primary text-nowrap btn-sm user-photo-button "' ><i class="bi bi-person-bounding-box"></i> User Photo</a></button></td>
    </tr>`;

  return postRow;
}

async function loadPosts() {
  const { response, error } = await myModule.post.getAll();
  if (error) {
    myModule.allert.error(error);
    myModule.spinner.off(spinnerTable);
    return;
  }

  const postTableRows = response.reduce(function (acc, post) {
    return acc + createPostRow(post.userId, post.id, post.title, post.body);
  }, "");

  tableBody.innerHTML = postTableRows;
  myModule.spinner.off(spinnerTable);
}

loadPosts();

function chekValidation(form) {
  form.classList.add("was-validated");
  return form.checkValidity();
}

async function createPost(e) {
  e.preventDefault();

  if (!chekValidation(e.target)) {
    myModule.spinner.off(e.target);
    return;
  }
  myModule.spinner.on(e.target);
  let payLoad = getFormData(e.target);

  const { response, error } = await myModule.post.create(payLoad);
  if (error) {
    myModule.allert.error(error);
    myModule.spinner.off(e.target);
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
  myModule.allert.success();
  myModule.spinner.off(e.target);
  createModal.hide();
}

async function deletePost(e) {
  myModule.spinner.on(e.target);
  const result = await myModule.allert.confirm("Удалить запись ? ");

  if (result.dismiss) {
    myModule.spinner.off(e.target);
    return;
  }

  const postid = e.target.dataset.id;

  const { error } = await myModule.post.delete(postid);
  if (error) {
    myModule.allert.error(error);
    myModule.spinner.off(e.target);
    return;
  }

  tableBody.querySelector(`[data-id="${postid}"]`).remove();
  myModule.spinner.off(e.target);
  myModule.allert.success();
}

async function setUpdateForm(e) {
  const postId = e.target.dataset.id;
  const { response, error } = await myModule.post.getById(postId);
  if (error) {
    myModule.allert.error(error);
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
    myModule.spinner.off(e.target);
    return;
  }
  myModule.spinner.on(e.target);
  const payLoad = getFormData(e.target);

  const { response, error } = await myModule.post.update(
    payLoad.updateId,
    payLoad
  );
  if (error) {
    myModule.spinner.off(e.target);
    myModule.allert.error(error);
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
  myModule.allert.success();
  myModule.spinner.off(e.target);
  updateModal.hide();
}

function sendToNextPage(e) {
  const idButton = e.target.dataset.id;
  window.location.href = "card-page.html" + "?" + "id" + "=" + idButton;
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
  if (e.target.className.includes("user-photo-button")) {
    sendToNextPage(e);
  }
});
