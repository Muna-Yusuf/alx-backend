import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Initialize Express app
const app = express();
const port = 1245;

// Initialize Redis client
const redisClient = redis.createClient();
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Sample product data
const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

// Function to get product by ID
const getItemById = (id) => {
    return listProducts.find(product => product.id === parseInt(id));
};

// Function to reserve stock
const reserveStockById = async (itemId, stock) => {
    await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock, 10) : 0;
};

// Route to list all products
app.get('/list_products', (req, res) => {
    const response = listProducts.map(product => ({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock
    }));
    res.json(response);
});

// Route to get a product by ID
app.get('/list_products/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(itemId);
    if (!product) {
        return res.json({ status: 'Product not found' });
    }
    const currentQuantity = product.stock - await getCurrentReservedStockById(itemId);
    res.json({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
        currentQuantity
    });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(itemId);
    if (!product) {
        return res.json({ status: 'Product not found' });
    }

    const reservedStock = await getCurrentReservedStockById(itemId);
    const availableStock = product.stock - reservedStock;

    if (availableStock <= 0) {
        return res.json({
            status: 'Not enough stock available',
            itemId: product.id
        });
    }

    await reserveStockById(itemId, reservedStock + 1);
    res.json({
        status: 'Reservation confirmed',
        itemId: product.id
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

