const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

// Test cart functionality
async function testCart() {
  try {
    // First, login to get a token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('Login successful, token:', token);

    // Set up axios with auth header
    const api = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Test 1: Get cart
    console.log('\n1. Getting cart...');
    const cartResponse = await api.get('/cart');
    console.log('Cart response:', cartResponse.data);

    // Test 2: Add item to cart
    console.log('\n2. Adding item to cart...');
    const addResponse = await api.post('/cart/items', {
      productId: '68838d3b88989fe896f15ed0', // Use a real product ID
      quantity: 1
    });
    console.log('Add response:', addResponse.data);

    // Test 3: Get cart again
    console.log('\n3. Getting cart again...');
    const cartResponse2 = await api.get('/cart');
    console.log('Cart response 2:', cartResponse2.data);

    // Test 4: Update quantity
    console.log('\n4. Updating quantity...');
    const updateResponse = await api.patch('/cart/items', {
      productId: '68838d3b88989fe896f15ed0',
      quantity: 2
    });
    console.log('Update response:', updateResponse.data);

    // Test 5: Remove item
    console.log('\n5. Removing item...');
    const removeResponse = await api.delete('/cart/items/68838d3b88989fe896f15ed0');
    console.log('Remove response:', removeResponse.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testCart(); 