const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

// Test cart remove functionality
async function testCartRemove() {
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

    if (cartResponse.data.data.cart.items.length === 0) {
      console.log('Cart is empty, adding an item first...');
      
      // Add an item to cart
      const addResponse = await api.post('/cart/items', {
        productId: '68838d3b88989fe896f15ed0', // Use a real product ID
        quantity: 1
      });
      console.log('Add response:', addResponse.data);
    }

    // Test 2: Get cart again
    console.log('\n2. Getting cart again...');
    const cartResponse2 = await api.get('/cart');
    console.log('Cart response 2:', cartResponse2.data);

    if (cartResponse2.data.data.cart.items.length > 0) {
      const firstItem = cartResponse2.data.data.cart.items[0];
      const productId = firstItem.product._id;
      
      console.log('\n3. Removing item with productId:', productId);
      
      // Remove the item
      const removeResponse = await api.delete(`/cart/items/${productId}`);
      console.log('Remove response:', removeResponse.data);
      
      // Test 4: Get cart after removal
      console.log('\n4. Getting cart after removal...');
      const cartResponse3 = await api.get('/cart');
      console.log('Cart response 3:', cartResponse3.data);
    } else {
      console.log('No items in cart to remove');
    }

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testCartRemove(); 