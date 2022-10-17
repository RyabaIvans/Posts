const cardPlace = document.getElementById("forCard");

import * as myModule from "./modules/fetch-module.js";

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

function getURLParameter(name) {
  return decodeURIComponent(
    (RegExp(name + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1] ||
      ""
  );
}

async function loadCardPhoto() {
  const id = getURLParameter("id");
  const { response, error } = await myModule.post.getPhotoCard(id);
  if (error) {
    myModule.allert.error(error);
    return;
  }

  const myCardHolder = response.reduce(function (acc, post) {
    return acc + createPhotoCard(post.id, post.title, post.url);
  }, "");
  cardPlace.innerHTML = myCardHolder;
}
loadCardPhoto();
