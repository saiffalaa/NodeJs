const deleteProduct = (btn) => {
  const id = btn.parentNode.querySelector("[name=deletedId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  fetch("/admin/product/" + id, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch();
};
