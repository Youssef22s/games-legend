const API_BASE_URL = "http://127.0.0.1:5000/api";

function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("alert-box");
  if (alertBox) {
    alertBox.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show shadow-sm border-0 rounded-4" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    setTimeout(() => {
      const alertNode = alertBox.querySelector(".alert");
      if (alertNode) {
        const bsAlert = new bootstrap.Alert(alertNode);
        bsAlert.close();
      }
    }, 4000);
  }
}

function updateNavbar() {
  const token = localStorage.getItem("token");
  const navLinks = document.getElementById("nav-links");

  if (!navLinks) return;

  if (token) {
    navLinks.innerHTML = `
            <li class="nav-item">
                <button class="btn btn-outline-light btn-sm rounded-pill px-4 ms-2" onclick="logout()">
                   <i class="bi bi-box-arrow-right me-1"></i> Sign out
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
                <div class="card product-card h-100 rounded-4 overflow-hidden">
                    
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
                            <button class="btn btn-dark btn-sm px-4 py-2 rounded-pill shadow-sm">
                                View Details
                            </button>
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

document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  updateHeroSection();
  loadPublicProducts();
});
