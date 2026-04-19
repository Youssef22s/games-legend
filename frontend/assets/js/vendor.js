const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

function loadVendorProfile() {
  const vendorNameElement = document.getElementById("vendor-name");
  
  if (!vendorNameElement) return;

  const vendorName = localStorage.getItem("username"); 
  
  if (vendorName) {
      vendorNameElement.innerText = vendorName;
  } else {
      vendorNameElement.innerText = "Partner";
  }
}

async function loadMyProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products/`, {
      headers: authHeaders,
    });
    const products = await res.json();

    const tbody = document.getElementById("my-products-list");
    tbody.innerHTML = "";

    if (res.ok) {
      if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No products listed yet. Add your first game!</td></tr>`;
        return;
      }

      products.forEach((p) => {
        const productData = JSON.stringify(p).replace(/"/g, "&quot;");

        tbody.innerHTML += `
            <tr>
                <td class="fw-medium text-dark">${p.title}</td>
                <td>
                    <span class="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill fw-medium">
                        ${p.category_name || "Uncategorized"}
                    </span>
                </td>
                <td class="fw-bold text-dark">$${p.price}</td>
                <td class="text-end">
                    <button class="btn btn-outline-warning btn-sm rounded-pill px-3 me-2 mb-1 mb-md-0" onclick="editProduct(${productData})">
                        <i class="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteProduct(${p.id})">
                        <i class="bi bi-trash3 me-1"></i> Delete
                    </button>
                </td>
            </tr>
        `;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const productId = document.getElementById("p-id").value;

    const data = {
      title: document.getElementById("p-title").value,
      description: document.getElementById("p-desc").value,
      price: document.getElementById("p-price").value,
      category_id: document.getElementById("p-category").value,
    };

    const url = productId
      ? `${API_BASE_URL}/products/${productId}`
      : `${API_BASE_URL}/products/`;

    const method = productId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showAlert(
          productId
            ? "Product updated successfully"
            : "Product added successfully",
          "success"
        );
        resetForm();
        loadMyProducts();
      } else {
        const result = await res.json();
        showAlert(result.error || "Something went wrong", "danger");
      }
    } catch (err) {
      showAlert("Connection error", "danger");
    }
});

function editProduct(product) {
  document.getElementById("form-title").innerHTML = `<i class="bi bi-pencil-square text-warning me-2"></i>Edit Product`;

  document.getElementById("p-id").value = product.id;
  document.getElementById("p-title").value = product.title;
  document.getElementById("p-desc").value = product.description;
  document.getElementById("p-price").value = product.price;
  document.getElementById("p-category").value = product.category_id;

  document.getElementById("save-btn").innerHTML = "Save Changes";
  document.getElementById("save-btn").classList.replace("btn-primary", "btn-warning");
  document.getElementById("save-btn").classList.add("text-dark");

  document.getElementById("cancel-btn").classList.remove("d-none");
}

async function deleteProduct(id) {
  if (confirm("Are you sure you want to remove this product from your storefront?")) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (res.ok) {
        showAlert("Deleted successfully", "success");
        loadMyProducts();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function resetForm() {
  document.getElementById("productForm").reset();
  document.getElementById("p-id").value = "";

  document.getElementById("form-title").innerHTML = `<i class="bi bi-plus-circle-fill text-primary me-2"></i>Add New Product`;
  document.getElementById("save-btn").innerHTML = "Save Product";

  document.getElementById("save-btn").classList.replace("btn-warning", "btn-primary");
  document.getElementById("save-btn").classList.remove("text-dark");
  
  document.getElementById("cancel-btn").classList.add("d-none");
}

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`);
    const categories = await res.json();

    const categorySelect = document.getElementById("p-category");
    categorySelect.innerHTML =
      '<option value="" disabled selected>Select category...</option>';

    if (res.ok) {
      categories.forEach((cat) => {
        categorySelect.innerHTML += `
                    <option value="${cat.id}">${cat.name}</option>
                `;
      });
    } else {
      categorySelect.innerHTML =
        '<option value="" disabled>Failed to load categories</option>';
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadVendorProfile();
  loadCategories();
  loadMyProducts();
});