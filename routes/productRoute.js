app.use(express.json());

// Rota GET para obter todos os produtos
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota POST para adicionar um novo produto
app.post('/products', async (req, res) => {
  const { name, description, discount, price, quantity, launchDate, type, category, developersId, suppliersId, image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, discount, price, quantity, launchDate, type, category, developersId, suppliersId, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [name, description, discount, price, quantity, launchDate, type, category, developersId, suppliersId, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});