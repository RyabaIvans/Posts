const spinner = {
  on(element) {
    element.querySelector('[data-spinner="spinner"]').style.display =
      "inline-block";
  },
  off(element) {
    element.querySelector('[data-spinner="spinner"]').style.display = "none";
  },
};

export { spinner };
