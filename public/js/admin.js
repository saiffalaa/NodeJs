const deleteProduct = (btn) => {
  const id = btn.parentNode.querySelector("[name=deletedId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const element = btn.closest("article");
  // console.log(element);
  fetch("/admin/product/" + id, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      element.parentNode.removeChild(element);
    })
    .catch();
};
// exports.deleteProduct = deleteProduct;
