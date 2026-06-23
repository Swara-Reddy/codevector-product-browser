let cursor = null;

async function loadProducts(reset = false) {

  if (reset) {
    cursor = null;
    document.getElementById("products").innerHTML = "";
  }

  const category =
    document.getElementById("category").value;

  let url = "/products?limit=20";

  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }

  try {

    const response = await fetch(url);

    const data = await response.json();

    const container =
      document.getElementById("products");

    data.items.forEach(product => {

      const card = document.createElement("div");

      card.className = "product-card";

      card.innerHTML = `
        <h3>${product.name}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> ₹${product.price}</p>
        <p><strong>Updated:</strong>
           ${new Date(product.updated_at)
             .toLocaleDateString()}
        </p>
      `;

      container.appendChild(card);
    });

    cursor = data.next_cursor;

    if (!cursor) {
      document.getElementById("nextBtn").style.display =
        "none";
    } else {
      document.getElementById("nextBtn").style.display =
        "inline-block";
    }

  } catch (error) {
    console.error(error);
  }
}

window.onload = () => {
  loadProducts(true);
};