const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const authHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function loadDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: authHeaders,
    });
    const data = await response.json();

    if (response.ok) {
      document.getElementById("users-count").innerText = data.users_count;
      document.getElementById("products-count").innerText = data.products_count;
    } else {
      Swal.fire({
        title: "Access denied",
        text: "You do not have permission to access this page",
        icon: "error",
      }).then(() => {
        window.location.replace("index.html");
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadVendors() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: authHeaders,
    });
    const vendors = await response.json();

    const tbody = document.getElementById("vendors-list");
    tbody.innerHTML = "";

    if (response.ok) {
      vendors.forEach((vendor) => {
        tbody.innerHTML += `
                    <tr>
                        <td>
                            <span class="badge bg-light text-dark border px-2 py-1">#${vendor.id}</span>
                        </td>
                        <td class="fw-medium text-dark">${vendor.username}</td>
                        <td class="text-muted small">${vendor.email}</td>
                        <td class="text-end">
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="deleteVendor(${vendor.id})">
                                <i class="bi bi-trash3 me-1"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
      });
    }
  } catch (error) {
    console.error(error);
  }
}

document
  .getElementById("addVendorForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const vendorData = {
      username: document.getElementById("v-username").value,
      email: document.getElementById("v-email").value,
      password: document.getElementById("v-password").value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Vendor added successfully",
          icon: "success",
        });
        document.getElementById("addVendorForm").reset();
        loadVendors();
        loadDashboardStats();
      } else {
        Swal.fire({
          title: "Error",
          text: `${(result.error || "Failed to add vendor", "danger")}`,
          icon: "Error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `Server connection error`,
        icon: "Error",
      });
    }
  });

async function deleteVendor(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to remove this vendor from the platform?",
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Yes, remove it",
    denyButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/vendors/${id}`, {
          method: "DELETE",
          headers: authHeaders,
        });

        if (response.ok) {
          Swal.fire({
            title: "Success",
            text: "Vendor deleted successfully",
            icon: "success",
          });
          loadVendors();
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to delete vendor",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error while deleting",
          icon: "error",
        });
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardStats();
  loadVendors();
});
