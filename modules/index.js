import { Modal } from "bootstrap";
import { post } from "../api/post.js";
import { allert } from "../utils/allert.js";
import { spinner } from "../utils/spinner.js";
import { getFormData, chekValidation } from "../utils/form.js";

const spinnerTable = document.getElementById("spinner-table");
const tableBody = document.querySelector("tbody");
const createForm = document.getElementById("create-form");
const updateForm = document.getElementById("update-form");
const searchForm = document.getElementById("search-form");

const createModal = new Modal("#createModal");
const updateModal = new Modal("#updateModal");

function init() {
  const userId = localStorage.getItem("userId");
  if (Number(userId) > 0) {
    searchForm.userId.value = userId;
    loadPosts({ userId });
    return;
  }
  loadPosts();
}

init();

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
    <td class="align-middle"><a href="pages/cards.html?id=${id}" class="btn btn-outline-primary text-nowrap btn-sm user-photo-button"><i class="bi bi-person-bounding-box"></i> User Photo</a></td>
    </tr>`;

  return postRow;
}

async function loadPosts(options) {
  const { response, error } = await post.getAll(options);
  if (error) {
    allert.error(error);
    spinner.off(spinnerTable);
    return;
  }

  const postTableRows = response.reduce(function (acc, post) {
    return acc + createPostRow(post.userId, post.id, post.title, post.body);
  }, "");

  tableBody.innerHTML = postTableRows;
  spinner.off(spinnerTable);
}

async function createPost(e) {
  e.preventDefault();

  if (!chekValidation(e.target)) {
    spinner.off(e.target);
    return;
  }
  spinner.on(e.target);
  let payLoad = getFormData(e.target);

  const { response, error } = await post.create(payLoad);
  if (error) {
    allert.error(error);
    spinner.off(e.target);
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
    spinner.off(e.target);
    return;
  }

  const postid = e.target.dataset.id;

  const { error } = await post.delete(postid);
  if (error) {
    allert.error(error);
    spinner.off(e.target);
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
    spinner.off(e.target);
    return;
  }
  spinner.on(e.target);
  const payLoad = getFormData(e.target);

  const { response, error } = await post.update(payLoad.updateId, payLoad);
  if (error) {
    spinner.off(e.target);
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

function seacrhByUserId(e) {
  e.preventDefault();
  if (!chekValidation(e.target)) {
    return;
  }
  const { userId } = getFormData(e.target);
  const filter = Number(userId) > 0 ? { userId } : {};

  localStorage.setItem("userId", userId);
  loadPosts(filter);
}

createForm.addEventListener("submit", createPost);
updateForm.addEventListener("submit", updatePost);
searchForm.addEventListener("submit", seacrhByUserId);

tableBody.addEventListener("click", function (e) {
  if (e.target.className.includes("delete-button")) {
    deletePost(e);
  }
  if (e.target.className.includes("edit-button")) {
    setUpdateForm(e);
  }
});
