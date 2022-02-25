const deleteProductButtonElements = document.querySelectorAll(
  ".product-item-content button"
);

const deleteProduct = async (event) => {
  const buttonElement = event.target;
  const prodId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    `/admin/products/${prodId}/?_csrf=${csrfToken}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    console.log("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
};

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener("click", deleteProduct);
}
