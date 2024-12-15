// Automatically handle Add to Cart functionality
const medicines = document.querySelectorAll('#medicines .category');
const cartTableBody = document.querySelector('#cart-table tbody');
let grandTotal = 0;

// Function to update the cart table and grand total
function updateCart(itemName, price, quantity) {
    const existingRow = Array.from(cartTableBody.rows).find(
        row => row.cells[0].textContent === itemName
    );

    if (existingRow) {
        // Update quantity and total for the existing item
        const existingQuantity = parseInt(existingRow.cells[1].textContent, 10);
        const newQuantity = existingQuantity + quantity;
        existingRow.cells[1].textContent = newQuantity;
        existingRow.cells[3].textContent = `Rs${(price * newQuantity).toFixed(2)}`;
    } else {
        // Add new item to the table
        const total = price * quantity;
        const row = `
            <tr>
                <td>${itemName}</td>
                <td>${quantity}</td>
                <td>Rs${price.toFixed(2)}</td>
                <td>Rs${total.toFixed(2)}</td>
            </tr>
        `;
        cartTableBody.insertAdjacentHTML('beforeend', row);
    }
}

// Function to calculate and update the grand total
function updateGrandTotal() {
    grandTotal = Array.from(cartTableBody.rows).reduce((sum, row) => {
        return sum + parseFloat(row.cells[3].textContent.slice(2)); // Remove "Rs" and sum up
    }, 0);
    document.getElementById('grand-total').textContent = `Rs${grandTotal.toFixed(2)}`;
}

// Event listeners for each medicine checkbox and quantity input
medicines.forEach(category => {
    const checkbox = category.querySelector('input[type="checkbox"]');
    const quantityInput = category.querySelector('.quantity');

    if (checkbox && quantityInput) {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                const itemName = checkbox.value;
                const price = parseFloat(checkbox.dataset.price);
                let quantity = parseInt(quantityInput.value, 10);

                if (!quantity || quantity <= 0) {
                    alert(`Please enter a valid quantity for ${itemName}`);
                    checkbox.checked = false;
                    return;
                }

                updateCart(itemName, price, quantity);
                updateGrandTotal();

                document.getElementById('add-to-favourites').disabled = false;
                document.getElementById('buy-now').disabled = false;
            } else {
                // If unchecked, remove the item from the cart
                const itemName = checkbox.value;
                const row = Array.from(cartTableBody.rows).find(
                    row => row.cells[0].textContent === itemName
                );
                if (row) {
                    row.remove();
                    updateGrandTotal();
                }
            }
        });

        quantityInput.addEventListener('input', function () {
            if (checkbox.checked) {
                const itemName = checkbox.value;
                const price = parseFloat(checkbox.dataset.price);
                let quantity = parseInt(quantityInput.value, 10);

                if (!quantity || quantity <= 0) {
                    alert(`Please enter a valid quantity for ${itemName}`);
                    return;
                }

                // Remove and re-add the item with the new quantity
                const row = Array.from(cartTableBody.rows).find(
                    row => row.cells[0].textContent === itemName
                );
                if (row) {
                    row.remove();
                }
                updateCart(itemName, price, quantity);
                updateGrandTotal();
            }
        });
    }
});

// Add to Favourites functionality
document.getElementById('add-to-favourites').addEventListener('click', function () {
    const rows = cartTableBody.querySelectorAll('tr');

    if (rows.length === 0) {
        alert('No items in the cart to save as favourites.');
        return;
    }

    const favourites = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            item: cells[0].textContent,
            quantity: parseInt(cells[1].textContent, 10),
            price: parseFloat(cells[2].textContent.slice(2)), // Remove "Rs" and convert to number
        };
    });

    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert('Favourites saved successfully!');
});

// Apply Favourites functionality
document.getElementById('apply-favourites').addEventListener('click', function () {
    const favourites = JSON.parse(localStorage.getItem('favourites'));

    if (!favourites || favourites.length === 0) {
        alert('No favourites found.');
        return;
    }

    cartTableBody.innerHTML = ''; // Clear the cart table
    grandTotal = 0;

    favourites.forEach(item => {
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
        cartTableBody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('grand-total').textContent = `Rs${grandTotal.toFixed(2)}`;
    document.getElementById('add-to-favourites').disabled = false;
    document.getElementById('buy-now').disabled = false;
    alert('Would you like to add Favourites?');
});

// Enable Buy Now functionality
document.getElementById('buy-now').addEventListener('click', function () {
    alert('Proceed to payment!');
    window.location.href = 'order.html'; // Replace with the actual order page
});
