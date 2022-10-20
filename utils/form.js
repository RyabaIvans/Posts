function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function chekValidation(form) {
  form.classList.add("was-validated");
  return form.checkValidity();
}

export { getFormData, chekValidation };
