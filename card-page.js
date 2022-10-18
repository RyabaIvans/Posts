const cardPlace = document.getElementById("for-card");
const spinnerTable = document.getElementById("spinner-table");

import { post } from "./modules/fetch-module.js";
import { allert } from "./modules/allert-module.js";
import { spinner } from "./modules/spinner-module.js";

function createPhotoCard(id, title, url) {
  const photoCard = `
    <div class="col">
    <div class="card">
      <img src="${url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${id}</h5>
        <p class="card-text">${title}</p>
      </div>
    </div>
  </div>
      `;

  return photoCard;
}

function getURLParameter() {
  let params = new URLSearchParams(document.location.search);
  return params.get("id");
}

async function loadCardPhoto() {
  spinner.on(spinnerTable);
  const id = getURLParameter();
  const { response, error } = await post.getPhotoCard(id);
  if (error) {
    spinner.off(spinnerTable);
    allert.error(error);
    return;
  }

  const myCardHolder = response.reduce(function (acc, post) {
    return acc + createPhotoCard(post.id, post.title, post.url);
  }, "");
  cardPlace.innerHTML = myCardHolder;
  spinner.off(spinnerTable);
}
loadCardPhoto();
