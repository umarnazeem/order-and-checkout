// Retrieve cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('favourites')) || [];

// Populate the order table
const orderTableBody = document.querySelector('#order-table tbody');
const grandTotalElement = document.getElementById('grand-total');
let grandTotal = 0;

if (cartItems.length === 0) {
    alert('Your cart is empty. Redirecting to the shop page.');
    window.location.href = 'index.html'; // Redirect to order page
} else {
    cartItems.forEach(item => {
        const total = item.quantity * item.price;
        grandTotal += total;

        const row = `
            <tr>
                <td>${item.item}</td>
                <td>${item.quantity}</td>
                <td>Rs${item.price.toFixed(2)}</td>
                <td>Rs${total.toFixed(2)}</td>
            </tr>
        `;
        orderTableBody.insertAdjacentHTML('beforeend', row);
    });

    grandTotalElement.textContent = `Grand Total: Rs${grandTotal.toFixed(2)}`;
}

// Payment processing
document.getElementById('pay-button').addEventListener('click', function () {
    const form = document.getElementById('order-form');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const deliveryDate = document.getElementById('delivery-date').value;
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Ensure the delivery date is valid
    const today = new Date();
    const selectedDate = new Date(deliveryDate);
    if (selectedDate < today) {
        alert('Delivery date cannot be in the past. Please choose a valid date.');
        return;
    }
    

    if (form.checkValidity()) {
        document.getElementById('confirmation-message').style.display = 'block';
        document.getElementById('delivery-info').textContent = 
            `Your order will be delivered to ${address} on ${selectedDate.toLocaleDateString()}.`;

        form.style.display = 'none';
        localStorage.removeItem('favourites'); // Clear the cart after payment
    } else {
        alert('Please fill in all the required fields correctly.');
    }
});
