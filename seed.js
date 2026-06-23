const { faker } = require("@faker-js/faker");
const pool = require("./db");

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home",
  "Beauty",
];

async function seedProducts() {
  try {
    console.log("Starting seeding...");

    for (let batchStart = 0; batchStart < TOTAL_PRODUCTS; batchStart += BATCH_SIZE) {
      const values = [];
      const placeholders = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const productName = faker.commerce.productName();

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price = faker.number.float({
          min: 100,
          max: 100000,
          fractionDigits: 2,
        });

        const createdAt = faker.date.past();
        const updatedAt = faker.date.between({
          from: createdAt,
          to: new Date(),
        });

        const baseIndex = i * 5;

        placeholders.push(
          `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`
        );

        values.push(
          productName,
          category,
          price,
          createdAt,
          updatedAt
        );
      }

      const query = `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES
        ${placeholders.join(",")}
      `;

      await pool.query(query, values);

      console.log(
        `Inserted ${Math.min(
          batchStart + BATCH_SIZE,
          TOTAL_PRODUCTS
        )} products`
      );
    }

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seedProducts();