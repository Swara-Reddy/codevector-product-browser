const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const { category, cursor, limit = 20 } = req.query;

    let values = [];
    let conditions = [];

    // Category filter
    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    // Cursor condition
    if (cursor) {
      const [updatedAt, id] = cursor.split("|");

      values.push(updatedAt);
      values.push(id);

      conditions.push(
        `(updated_at, id) < ($${values.length - 1}, $${values.length})`
      );
    }

    let query = `
      SELECT *
      FROM products
    `;

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    values.push(parseInt(limit));

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT $${values.length}
    `;

    const result = await pool.query(query, values);

    let nextCursor = null;

    if (result.rows.length > 0) {
      const lastItem = result.rows[result.rows.length - 1];

      nextCursor =
        `${lastItem.updated_at.toISOString()}|${lastItem.id}`;
    }

    res.json({
      items: result.rows,
      next_cursor: nextCursor,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;