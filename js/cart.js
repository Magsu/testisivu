window.Cart = (function () {

    //Storage
    function getCart() {
        return JSON.parse(sessionStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount(); 
    }

    //Actions
    function addToCart(productId) {
        const cart = getCart();
        const item = cart.find(i => i.id === productId);

        if (item) {
            item.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart(cart);
    }

    function removeItem(productId) {
        let cart = getCart();
        cart = cart.filter(i => i.id !== productId);
        saveCart(cart);
    }

    function updateQuantity(productId, change) {
        const cart = getCart();
        const item = cart.find(i => i.id === productId);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                const newCart = cart.filter(i => i.id !== productId);
                saveCart(newCart);
                return;
            }
            saveCart(cart);
        }
    }

    function updateCartCount() {
        let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById("cart-count");
        cartCountElement.textContent = totalQuantity;
    }

    //Display cart
    function displayCartItems() {
        const container = document.getElementById("cart-modal-items");
        if (!container) return;

        const cart = getCart();
        const products = JSON.parse(localStorage.getItem("products")) || [];

        container.innerHTML = "";

        if (cart.length === 0) {
            container.textContent = "No items in cart.";
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            total += product.price * item.quantity;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
          <div>
            <h4>${product.name}</h4>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="increase-quantity" data-id="${product.id}">+</button>
            <button class="decrease-quantity" data-id="${product.id}">-</button>
            <button class="remove-item" data-id="${product.id}">Remove</button>
          </div>
        `;
            container.appendChild(itemDiv);
        });


        const totalEl = document.createElement("p");
        totalEl.classList.add("cart-total");
        totalEl.textContent = `Cart Total: $${total.toFixed(2)}`;
        container.appendChild(totalEl);


        container.querySelectorAll(".increase-quantity").forEach(btn => {
            btn.addEventListener("click", () => {
                updateQuantity(parseInt(btn.dataset.id), 1);
                displayCartItems();
            });
        });

        container.querySelectorAll(".decrease-quantity").forEach(btn => {
            btn.addEventListener("click", () => {
                updateQuantity(parseInt(btn.dataset.id), -1);
                displayCartItems();
            });
        });

        container.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => {
                removeItem(parseInt(btn.dataset.id));
                displayCartItems();
            });
        });
    }

    //Cart modal
    function initModal(openButtonId) {
        if (!document.getElementById("cart-modal")) {
            const modalHTML = `
          <div class="cart-modal hidden" id="cart-modal">
            <div class="cart-content">
              <button class="close-cart" id="close-cart-btn">×</button>
              <h2>Your Cart</h2>
              <div id="cart-modal-items">No items in cart.</div>
              <a href="cart.html" class="go-to-cart">Go to Cart Page</a>
            </div>
          </div>
        `;
            document.body.insertAdjacentHTML("beforeend", modalHTML);
        }

        const closeBtn = document.getElementById("close-cart-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", hideCartModal);
        }

        if (openButtonId) {
            const openButton = document.getElementById(openButtonId);
            if (openButton) {
                openButton.addEventListener("click", showCartModal);
            }
        }
    }

    function showCartModal() {
        const modal = document.getElementById("cart-modal");
        if (!modal) return;

        modal.classList.remove("hidden");
        displayCartItems();
    }

    function hideCartModal() {
        const modal = document.getElementById("cart-modal");
        if (modal) {
            modal.classList.add("hidden");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        updateCartCount();
    
        window.addEventListener("storage", updateCartCount);
    });

    //API
    return {
        // Storage methods
        addToCart,
        removeItem,
        updateQuantity,

        // Modal methods
        initModal,
        showCartModal,
        hideCartModal
    };
})();
