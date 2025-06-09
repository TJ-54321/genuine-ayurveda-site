const firebaseConfig = {
  apiKey: "AIzaSyB7HPZkJrQEoftz-TW6kWUPbF7zmVJ7WdI",
  authDomain: "genuine-ayurveda.firebaseapp.com",
  projectId: "genuine-ayurveda",
  storageBucket: "genuine-ayurveda.appspot.com",
  messagingSenderId: "936858738566",
  appId: "1:936858738566:web:3c0e5812cab0681593e1f",
  measurementId: "G-8J7TKPEZS2"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector('.login-form form');
  const checkoutForm = document.querySelector('.checkout-form form');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      auth.signInWithEmailAndPassword(email, password)
        .then(user => alert("Login successful!"))
        .catch(err => alert(err.message));
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async e => {
      e.preventDefault();
      const stripe = Stripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_XXXXXXXXXXXXXXXX', quantity: 1 }],
        mode: 'payment',
        successUrl: window.location.href,
        cancelUrl: window.location.href
      });
      if (error) {
        console.error(error);
        alert('Payment failed.');
      }
    });
  }
});

const cartItems = document.getElementById('cart-items');
function addToCart(productName) {
  const li = document.createElement('li');
  li.textContent = productName;
  cartItems.appendChild(li);
  const user = auth.currentUser;
  if (user) {
    db.collection('carts').add({
      uid: user.uid,
      product: productName,
      timestamp: new Date()
    });
  }
}
