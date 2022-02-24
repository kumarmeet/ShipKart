const mobileMenuBtnEle = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

const toggleMobileMenu = () => {
  mobileMenu.classList.toggle("open");
};

mobileMenuBtnEle.addEventListener("click", toggleMobileMenu);
