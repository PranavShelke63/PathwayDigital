import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { productsApi } from '../../services/api';
import { Product } from '../../services/api';
import ProductCard from './ProductCard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'product-comparison' | 'budget-recommendation';
  data?: any;
}

interface AIAssistantProps {
  isVisible?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI shopping assistant. I can help you compare products, find items within your budget, and answer questions about our products. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const quickActions = [
    { text: "Find laptops under $1000", action: () => handleQuickAction("Find laptops under $1000") },
    { text: "Compare gaming mice", action: () => handleQuickAction("Compare gaming mice") },
    { text: "Best monitors for work", action: () => handleQuickAction("Find the best monitors for work") },
    { text: "Budget keyboards", action: () => handleQuickAction("Find budget keyboards under $50") }
  ];
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsApi.getAll();
        setProducts(response.data.data.data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'ai', type: 'text' | 'product-comparison' | 'budget-recommendation' = 'text', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserMessage = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simple keyword-based AI logic (in a real app, you'd integrate with an actual AI service)
    const lowerMessage = userMessage.toLowerCase();
    
    // Product comparison
    if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
      const productNames = extractProductNames(userMessage, products);
      if (productNames.length >= 2) {
        const comparison = compareProducts(productNames, products);
        addMessage(comparison, 'ai', 'product-comparison', { products: productNames });
      } else {
        addMessage("I can help you compare products! Please mention the specific products you'd like to compare, or tell me what type of products you're looking for.", 'ai');
      }
    }
    // Budget recommendations
    else if (lowerMessage.includes('budget') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap') || lowerMessage.includes('expensive')) {
      const budget = extractBudget(userMessage);
      const category = extractCategory(userMessage);
      const recommendations = getBudgetRecommendations(budget, category, products);
      addMessage(recommendations.text, 'ai', 'budget-recommendation', { budget, category, products: recommendations.products });
    }
    // Product questions
    else if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('tell me about')) {
      const productName = extractProductName(userMessage, products);
      if (productName) {
        const productInfo = getProductInfo(productName, products);
        addMessage(productInfo, 'ai');
      } else {
        addMessage("I can help you with product information! Please mention a specific product or ask about our categories.", 'ai');
      }
    }
    // General help
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      addMessage("I can help you with:\n• Product comparisons - 'Compare iPhone 14 vs Samsung Galaxy'\n• Budget recommendations - 'Find laptops under $1000'\n• Product information - 'Tell me about the latest gaming mouse'\n• General questions about our products", 'ai');
    }
    else {
      addMessage("I'm here to help! You can ask me to compare products, find items within your budget, or get information about specific products. Try asking something like 'Compare gaming laptops' or 'Find monitors under $300'.", 'ai');
    }
    
    setIsLoading(false);
  };

  const extractProductNames = (message: string, products: Product[]): string[] => {
    const productNames: string[] = [];
    products.forEach(product => {
      if (message.toLowerCase().includes(product.name.toLowerCase())) {
        productNames.push(product.name);
      }
    });
    return productNames;
  };

  const extractProductName = (message: string, products: Product[]): string | null => {
    for (const product of products) {
      if (message.toLowerCase().includes(product.name.toLowerCase())) {
        return product.name;
      }
    }
    return null;
  };

  const extractBudget = (message: string): number | null => {
    const budgetMatch = message.match(/\$?(\d+)/);
    return budgetMatch ? parseInt(budgetMatch[1]) : null;
  };

  const extractCategory = (message: string): string | null => {
    const categories = ['laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'headphone', 'speaker', 'tablet', 'phone'];
    for (const category of categories) {
      if (message.toLowerCase().includes(category)) {
        return category;
      }
    }
    return null;
  };

  const compareProducts = (productNames: string[], products: Product[]): string => {
    const selectedProducts = products.filter(p => productNames.includes(p.name));
    
    if (selectedProducts.length < 2) {
      return "I couldn't find the products you mentioned. Please check the product names and try again.";
    }

    let comparison = `Here's a comparison of ${selectedProducts.length} products:\n\n`;
    
    selectedProducts.forEach((product, index) => {
      comparison += `${index + 1}. **${product.name}**\n`;
      comparison += `   • Price: $${product.price}\n`;
      comparison += `   • Brand: ${product.brand}\n`;
      comparison += `   • Rating: ${product.ratings}/5 (${product.numReviews} reviews)\n`;
      if (product.specifications) {
        const specs = Object.entries(product.specifications).slice(0, 3);
        specs.forEach(([key, value]) => {
          comparison += `   • ${key}: ${value}\n`;
        });
      }
      comparison += '\n';
    });

    return comparison;
  };

  const getBudgetRecommendations = (budget: number | null, category: string | null, products: Product[]): { text: string; products: Product[] } => {
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = products.filter(p => 
        p.category.toString().toLowerCase().includes(category.toLowerCase()) ||
        p.name.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (budget) {
      filteredProducts = filteredProducts.filter(p => p.price <= budget);
    }
    
    if (filteredProducts.length === 0) {
      return {
        text: `I couldn't find products ${category ? `in the ${category} category` : ''} ${budget ? `under $${budget}` : ''}. Try adjusting your budget or category.`,
        products: []
      };
    }
    
    // Sort by rating and price
    filteredProducts.sort((a, b) => {
      if (a.ratings !== b.ratings) return b.ratings - a.ratings;
      return a.price - b.price;
    });
    
    const topProducts = filteredProducts.slice(0, 5);
    
    let recommendations = `Here are my top recommendations${category ? ` for ${category}s` : ''}${budget ? ` under $${budget}` : ''}:\n\n`;
    
    return {
      text: recommendations,
      products: topProducts
    };
  };

  const getProductInfo = (productName: string, products: Product[]): string => {
    const product = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
    
    if (!product) {
      return `I couldn't find information about ${productName}. Please check the product name and try again.`;
    }
    
    let info = `**${product.name}**\n\n`;
    info += `• **Price:** $${product.price}\n`;
    info += `• **Brand:** ${product.brand}\n`;
    info += `• **Rating:** ${product.ratings}/5 (${product.numReviews} reviews)\n`;
    info += `• **Stock:** ${product.stock} units available\n`;
    info += `• **Warranty:** ${product.warranty}\n\n`;
    
    if (product.description) {
      info += `**Description:**\n${product.description}\n\n`;
    }
    
    if (product.features && product.features.length > 0) {
      info += `**Key Features:**\n`;
      product.features.slice(0, 5).forEach(feature => {
        info += `• ${feature}\n`;
      });
      info += '\n';
    }
    
    if (product.specifications) {
      info += `**Specifications:**\n`;
      Object.entries(product.specifications).slice(0, 5).forEach(([key, value]) => {
        info += `• ${key}: ${value}\n`;
      });
    }
    
    return info;
  };

  const handleQuickAction = async (action: string) => {
    addMessage(action, 'user');
    await processUserMessage(action);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');
    
    await processUserMessage(userMessage);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChatBubbleLeftRightIcon className="w-8 h-8" />
          
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* AI indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <SparklesIcon className="w-2 h-2 text-white" />
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-primary to-accent text-white rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">AI Assistant</h3>
                  <p className="text-xs opacity-90 font-sans">Your shopping companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Quick Actions - Show only when there's just the welcome message */}
              {messages.length === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-contrast font-medium font-sans">Quick Actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium border border-primary/20"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-contrast border border-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm font-sans leading-relaxed">{message.text}</div>
                    
                    {/* Product Cards for AI responses */}
                    {message.sender === 'ai' && message.data?.products && message.data.products.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.data.products.map((product: Product) => (
                          <ProductCard 
                            key={product._id} 
                            product={product}
                            onClick={() => window.open(`/product/${product._id}`, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 font-sans ${
                      message.sender === 'user' ? 'text-primary/80' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-50 text-contrast p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about products..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-sans bg-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant; 