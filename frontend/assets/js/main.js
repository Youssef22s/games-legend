const API_BASE_URL = "http://127.0.0.1:5000/api";

function updateNavbar() {
  const token = localStorage.getItem("token");
  const navLinks = document.getElementById("nav-links");

  if (!navLinks) return;

  if (token) {
    navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link text-light me-5" href="cart.html">Cart</a></li>
            <li class="nav-item">
              <button class="Btn" onclick="logout()">
                <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                <div class="text">Logout</div>
              </button>
            </li>
        `;
  } else {
    navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link text-light" href="login.html">Sign in</a></li>
            <li class="nav-item">
                <a class="btn btn-primary rounded-pill px-4 ms-2" href="register.html">Create Account</a>
            </li>
        `;
  }
}

function updateHeroSection() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const heroButtons = document.getElementById("hero-buttons");

  if (!heroButtons) return;

  if (token) {
    let actionButton = "";

    if (role === "admin") {
      actionButton = `
              <a href="admin.html" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                  <i class="bi bi-shield-lock me-2"></i> Admin Dashboard
              </a>
          `;
    } else if (role === "vendor") {
      actionButton = `
              <a href="vendor.html" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                  <i class="bi bi-shop me-2"></i> Vendor Dashboard
              </a>
          `;
    } else {
      actionButton = `
              <a href="#products-section" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
                  <i class="bi bi-controller me-2"></i> Explore Products
              </a>
          `;
    }

    heroButtons.innerHTML = `
          <div class="d-flex flex-column align-items-center gap-3">
              <div class="hero-welcome-badge bg-white border rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center">
                  <i class="bi bi-person-circle text-primary fs-5 me-2"></i>
                  <span class="hero-welcome-text fw-semibold text-dark">
                      Welcome back ${username} 👋
                  </span>
              </div>
              ${actionButton}
          </div>
      `;
  } else {
    heroButtons.innerHTML = `
          <a href="register.html" class="btn btn-primary btn-lg px-5 rounded-pill shadow-sm">
              Get Started <i class="bi bi-arrow-right ms-2"></i>
          </a>
          <a href="login.html" class="btn btn-white bg-white border text-dark btn-lg px-5 rounded-pill shadow-sm">
              Sign In
          </a>
      `;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

async function loadPublicProducts() {
  const container = document.getElementById("public-products-list");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products/all`);
    const products = await res.json();

    container.innerHTML = "";

    if (res.ok && products.length > 0) {
      products.forEach((p) => {
        container.innerHTML += `
        <div class="col-md-6 col-lg-4">
          <div class="card product-card h-100 rounded-4 overflow-hidden position-relative">
        
            <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-3 rounded-pill shadow-sm z-3 transition" 
                style="backdrop-filter: blur(5px); background-color: rgba(255, 255, 255, 0.9);" 
                title="Compare this game">
              <i class="bi bi-arrow-left-right me-1 text-dark"></i> <span class="text-dark fw-medium small">Compare</span>
            </button>
            
            <div class="card-img-placeholder">
                <i class="bi bi-joystick" style="font-size: 4rem;"></i>
            </div>
    
            <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill fw-medium">
                        ${p.category_name || "Uncategorized"}
                    </span>
                    <span class="text-muted small fw-medium">
                        <i class="bi bi-shop me-1"></i>${p.vendor_name}
                    </span>
                </div>
    
                <h5 class="card-title fw-bold text-dark mb-2">
                    ${p.title}
                </h5>
                <p class="card-text text-muted small flex-grow-1 line-clamp-2">
                    ${
                      p.description
                        ? p.description
                        : "No description available for this game."
                    }
                </p>
    
                <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <h4 class="text-dark fw-bold mb-0">
                        $${p.price}
                    </h4>
                    
                    <div class="d-flex align-items-center gap-3">
                        <button class="btn btn-primary btn-sm rounded-pill px-4 py-2 shadow-sm transition fw-medium" onclick="addToCart(${
                          p.id
                        })">
                            <i class="bi bi-cart-plus me-1"></i> Add to cart
                        </button>
                    </div>
                </div>
                </div>
          </div>
        </div>
        `;
      });
    } else {
      container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3 fs-5">No games available at the moment. Check back soon!</p>
            </div>
        `;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    container.innerHTML = `
        <div class="col-12 text-center text-danger py-5">
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 3rem;"></i>
            <p class="mt-3 fs-5">Oops! Error loading products. Is the server running?</p>
        </div>
    `;
  }
}

async function addToCart(productId) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "buyer";

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  if (role !== "buyer") {
    Swal.fire({
      text: "Only buyers can add products to the cart!",
      icon: "error"
    });
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        text: "Product added to cart successfully!",
        icon: "success"
      });
    } else {
      Swal.fire({
        text: `${data.error}`,
        icon: "error"
      });
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  updateHeroSection();
  loadPublicProducts();
});
