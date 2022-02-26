const addToCartButton = document.querySelector("#product-details button");

const cartBadgeElement = document.querySelector(".nav-items .badge");

const addToCart = async () => {
  const prodId = addToCartButton.dataset.productid;
  const csrfToken = addToCartButton.dataset.csrf;

  let response = null;

  try {
    response = await fetch(`/cart/items`, {
      method: "POST",
      body: JSON.stringify({
        productId: prodId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong");
    return;
  }

  if (!response.ok) {
    return;
  }

  const responseData = await response.json();
  const newTotalQuantity = responseData.newTotalItems;

  console.log(newTotalQuantity);

  cartBadgeElement.textContent = newTotalQuantity;
};

addToCartButton.addEventListener("click", addToCart);
