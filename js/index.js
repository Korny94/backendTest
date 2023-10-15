const registerModal = document.querySelector("#registerModal");
const loginModal = document.querySelector("#loginModal");
const signUpLink = document.querySelector("#signUpLink");
const signInLink = document.querySelector("#signInLink");
const closeLoginModal = document.querySelector("#closeLoginModal");
const closeRegisterModal = document.querySelector("#closeRegisterModal");

registerModal.style.display = "flex";

/**
 * @function
 * @description Open & close the sign in and sign up modals
 *
 * @param {*} openModal
 * @param {*} closeModal
 */
function openModal(openModal, closeModal) {
  openModal.style.display = "flex";
  closeModal.style.display = "none";
}

/**
 * @event
 * @description Open the sign in modal
 */
signInLink.addEventListener("click", () => {
  openModal(loginModal, registerModal);
});

/**
 * @event
 * @description Open the sign in modal
 */
closeRegisterModal.addEventListener("click", () => {
  openModal(loginModal, registerModal);
});

/**
 * @event
 * @description Open the sign up modal
 */

signUpLink.addEventListener("click", () => {
  openModal(registerModal, loginModal);
});

/**
 * @event
 * @description Open the sign up modal
 */
closeLoginModal.addEventListener("click", () => {
  openModal(registerModal, loginModal);
});
