window.Search = (function () {
    let allProducts = [];

    function initSearch(fetchURL) {
      return new Promise((resolve, reject) => {
        const stored = localStorage.getItem("products");
        if (stored) {
          allProducts = JSON.parse(stored);
          return resolve();
        }
  
        fetch(fetchURL)
          .then(response => response.json())
          .then(products => {
            allProducts = products;
            localStorage.setItem("products", JSON.stringify(products));
            resolve();
          })
          .catch(err => reject(err));
      });
    }

    //Filter elements based on query
    function filterProducts(query) {
      const lowerQ = query.trim().toLowerCase();
      if (!lowerQ) {
        return allProducts; 
      }
      return allProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQ) ||
        product.category.toLowerCase().includes(lowerQ) ||
        product.description.toLowerCase().includes(lowerQ)
      );
    }
  
    // Display elements based on the query
    function displayProducts(productArray, containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      container.innerHTML = "";
  
      if (productArray.length === 0) {
        container.textContent = "No products found.";
        return;
      }
  
      productArray.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-card");
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(productElement);
      });
  
      container.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
          if (window.Cart) {
            Cart.addToCart(parseInt(this.dataset.id));
          } else {
            console.warn("Cart object not found. Make sure cart.js is included.");
          }
        });
      });
    }
  
    // Filter elements based on query and display them
    function searchAndDisplay(query, containerId) {
      const results = filterProducts(query);
      displayProducts(results, containerId);
    }
  
    // API
    return {
      initSearch,
      filterProducts,
      displayProducts,
      searchAndDisplay
    };
  })();
  