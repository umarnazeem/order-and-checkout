// Add to Cart functionality
document.getElementById('add-to-cart').addEventListener('click', function () {
    const medicines = document.querySelectorAll('#medicines .category');
    const cartTableBody = document.querySelector('#cart-table tbody');
    let grandTotal = 0;

    let itemsAdded = false; // Track if any items are added

    medicines.forEach(category => {
        const checkbox = category.querySelector('input[type="checkbox"]');
        const quantityInput = category.querySelector('.quantity');

        if (checkbox && checkbox.checked) {
            const itemName = checkbox.value;
            const price = parseFloat(checkbox.dataset.price);
            const quantity = parseInt(quantityInput.value, 10);

            if (!quantity || quantity <= 0) {
                alert(`Invalid quantity for ${itemName}`);
                return;
            }

            // Check if item already exists in the cart
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

            grandTotal += price * quantity;
            itemsAdded = true; // Mark that items were added
        }
    });

    // Update grand total and enable buttons if items were added
    document.getElementById('grand-total').textContent = `Rs${grandTotal.toFixed(2)}`;
    if (itemsAdded) {
        document.getElementById('add-to-favourites').disabled = false;
        document.getElementById('buy-now').disabled = false;
    } else {
        alert('No items selected or valid quantities entered!');
    }
});

// Add to Favourites functionality
document.getElementById('add-to-favourites').addEventListener('click', function () {
    const cartTableBody = document.querySelector('#cart-table tbody');
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
    const cartTableBody = document.querySelector('#cart-table tbody');
    let grandTotal = 0;

    if (!favourites || favourites.length === 0) {
        alert('No favourites found.');
        return;
    }

    cartTableBody.innerHTML = ''; // Clear the cart table

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
    alert('Favourites applied successfully!');
});

// Enable Buy Now functionality
document.getElementById('buy-now').addEventListener('click', function () {
    alert('Proceed to payment!');
    window.location.href = 'order.html'; // Replace with the actual order page
});



