import Swal from 'sweetalert2'

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

export { allert };
