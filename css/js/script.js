// ==========================================
// ⚙️ STORE & OFFER SETTINGS (EASY TO EDIT)
// ==========================================
const STORE_SETTINGS = {
    whatsappNumber: "919251295787",
    email: "jim225997@gmail.com",
    offerText: "FLAT 80% OFF",
    originalPrice: 1499,
    discountPercentage: 80,
    salePrice: 299.80,
    currency: "₹"
};

// ==========================================
// 🛍️ PRODUCT DATA (ADD YOUR 15 PRODUCTS HERE)
// ==========================================
const PRODUCTS = [
    {
        id: "p1",
        name: "Floral Summer Dress",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { 
                colorName: "Pink", 
                imagePath: "images/product-01/pink/1.jpg" 
            },
            { 
                colorName: "Blue", 
                imagePath: "images/product-01/blue/1.jpg" 
            },
            { 
                colorName: "Black", 
                imagePath: "images/product-01/black/1.jpg" 
            }
        ]
    },
    {
        id: "p2",
        name: "Elegant Evening Gown",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { colorName: "Red", imagePath: "images/product-02/red/1.jpg" },
            { colorName: "White", imagePath: "images/product-02/white/1.jpg" }
        ]
    }
    // Copy the block above to add more products!
];

// ==========================================
// 💻 CORE LOGIC (DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW CODING)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set global offer texts
    document.getElementById('hero-offer-text').innerText = STORE_SETTINGS.offerText;
    document.getElementById('checkout-amount').innerText = `${STORE_SETTINGS.currency}${STORE_SETTINGS.salePrice}`;

    // 2. Render Products
    const productsGrid = document.getElementById('products-grid');
    
    PRODUCTS.forEach((product, index) => {
        // Default to first color
        let activeColor = product.colors[0];

        // Create Card HTML
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${activeColor.imagePath}" alt="${product.name}" class="product-image" id="img-${product.id}" onerror="this.src='https://via.placeholder.com/400x500?text=Upload+Image'">
            <h3 class="product-title">${product.name}</h3>
            <div class="price-container">
                <span class="original-price">${STORE_SETTINGS.currency}${STORE_SETTINGS.originalPrice}</span>
                <span class="sale-price">${STORE_SETTINGS.currency}${STORE_SETTINGS.salePrice}</span>
                <span class="discount-badge">${STORE_SETTINGS.discountPercentage}% OFF</span>
            </div>
            
            <div class="selector-group">
                <label>Select Color:</label>
                <div class="color-swatches" id="swatches-${product.id}">
                    ${product.colors.map((c, i) => `
                        <div class="swatch ${i === 0 ? 'active' : ''}" data-color="${c.colorName}" data-img="${c.imagePath}">${c.colorName}</div>
                    `).join('')}
                </div>
            </div>

            <div class="selector-group">
                <label>Select Size:</label>
                <select class="size-select" id="size-${product.id}">
                    ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>

            <button class="btn buy-now-btn" data-pid="${product.id}" data-pname="${product.name}">Buy Now</button>
        `;
        productsGrid.appendChild(card);

        // 3. Handle Color Clicking Logic
        const swatches = card.querySelectorAll('.swatch');
        const imgElement = card.querySelector(`#img-${product.id}`);

        swatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                // Remove active class from all
                swatches.forEach(s => s.classList.remove('active'));
                // Add to clicked
                this.classList.add('active');
                // Change Image
                imgElement.src = this.getAttribute('data-img');
            });
        });
    });

    // 4. Handle "Buy Now" clicking to populate form
    document.querySelectorAll('.buy-now-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pid = this.getAttribute('data-pid');
            const pname = this.getAttribute('data-pname');
            
            // Get selected color and size
            const activeSwatch = document.querySelector(`#swatches-${pid} .swatch.active`);
            const selectedColor = activeSwatch ? activeSwatch.getAttribute('data-color') : '';
            const selectedSize = document.getElementById(`size-${pid}`).value;

            // Fill Checkout Form
            document.getElementById('orderProduct').value = pname;
            document.getElementById('orderColor').value = selectedColor;
            document.getElementById('orderSize').value = selectedSize;

            // Scroll to checkout
            document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 5. Handle WhatsApp Form Submission
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Get Form Values
        const details = {
            name: document.getElementById('custName').value,
            mobile: document.getElementById('custMobile').value,
            email: document.getElementById('custEmail').value,
            address: document.getElementById('custAddress').value,
            city: document.getElementById('custCity').value,
            state: document.getElementById('custState').value,
            pin: document.getElementById('custPin').value,
            product: document.getElementById('orderProduct').value,
            color: document.getElementById('orderColor').value,
            size: document.getElementById('orderSize').value,
            qty: document.getElementById('orderQty').value,
            utr: document.getElementById('utrNumber').value
        };

        if(!details.product) {
            alert("Please select a product by clicking 'Buy Now' first!");
            return;
        }

        const finalPriceTotal = (STORE_SETTINGS.salePrice * parseInt(details.qty)).toFixed(2);

        // Format WhatsApp Message exactly as requested
        const waMessage = `New Order – Aravali Fashion

Customer Name: ${details.name}
Mobile: ${details.mobile}
Email: ${details.email}

Product: ${details.product}
Color: ${details.color}
Size: ${details.size}
Quantity: ${details.qty}

Original Price: ${STORE_SETTINGS.currency}${STORE_SETTINGS.originalPrice}
Discount: ${STORE_SETTINGS.discountPercentage}%
Final Price: ${STORE_SETTINGS.currency}${finalPriceTotal}

Delivery Address: ${details.address}
City: ${details.city}
State: ${details.state}
PIN Code: ${details.pin}

Payment: UPI
Transaction/UTR ID: ${details.utr}`;

        // Create WhatsApp API Link
        const encodedMessage = encodeURIComponent(waMessage);
        const waURL = `https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(waURL, '_blank');
    });
});
