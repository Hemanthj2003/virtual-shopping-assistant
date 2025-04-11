import React, { useState, useEffect, useRef } from 'react';

// Types for the product and message
type Message = {
  sender: 'user' | 'bot';
  text: string;
};

type Product = {
  id: number;
  name: string;
  color: string;
  size: number;
  price: number; // Price of the product
  store: string; // Store selling the product
  rating: number; // Quality rating of the product (out of 5)
};

const products: Product[] = [
  { id: 1, name: 'Nike Running Shoes', color: 'red', size: 8, price: 2999, store: 'Flipkart', rating: 4.5 },
  { id: 2, name: 'Adidas Gym Sneakers', color: 'blue', size: 9, price: 2499, store: 'Amazon', rating: 4.3 },
  { id: 3, name: 'Puma Formal Shoes', color: 'black', size: 10, price: 1999, store: 'Meesho', rating: 4.1 },
  { id: 4, name: 'Reebok Sports Shoes', color: 'green', size: 9, price: 3299, store: 'Flipkart', rating: 4.7 },
  { id: 5, name: 'Nike Casual Sneakers', color: 'white', size: 7, price: 1799, store: 'Amazon', rating: 4.6 },
  { id: 6, name: 'Under Armour Sports Shoes', color: 'yellow', size: 8, price: 2599, store: 'Meesho', rating: 4.2 },
  { id: 7, name: 'Fila Running Shoes', color: 'brown', size: 9, price: 3499, store: 'Flipkart', rating: 4.4 },
  { id: 8, name: 'Skechers Comfort Shoes', color: 'gray', size: 10, price: 2799, store: 'Amazon', rating: 4.0 },
  { id: 9, name: 'Puma Winter Boots', color: 'blue', size: 7, price: 3999, store: 'Meesho', rating: 4.3 },
  { id: 10, name: 'Adidas Beach Sandals', color: 'white', size: 8, price: 1299, store: 'Flipkart', rating: 4.2 },
  { id: 11, name: 'Nike Classic Sneakers', color: 'black', size: 8, price: 3499, store: 'Amazon', rating: 4.6 },
  { id: 12, name: 'Adidas Casual Slip-Ons', color: 'gray', size: 9, price: 1799, store: 'Meesho', rating: 4.1 },
  { id: 13, name: 'Reebok Running Pro', color: 'red', size: 7, price: 2199, store: 'Flipkart', rating: 4.5 },
  { id: 14, name: 'Nike Snow Boots', color: 'green', size: 10, price: 4599, store: 'Amazon', rating: 4.7 },
  { id: 15, name: 'Under Armour Sports Sandals', color: 'yellow', size: 8, price: 1599, store: 'Meesho', rating: 4.3 },
  // Additional products with new sizes
  { id: 16, name: 'Nike Hiking Boots', color: 'red', size: 5, price: 2999, store: 'Flipkart', rating: 4.4 },
  { id: 17, name: 'Adidas Outdoor Shoes', color: 'blue', size: 6, price: 2499, store: 'Amazon', rating: 4.2 },
  { id: 18, name: 'Puma Running Sneakers', color: 'black', size: 7, price: 2799, store: 'Meesho', rating: 4.3 },
  { id: 19, name: 'Reebok Trail Shoes', color: 'green', size: 10, price: 3199, store: 'Flipkart', rating: 4.5 },
  { id: 20, name: 'Nike Casual Sneakers', color: 'white', size: 11, price: 2199, store: 'Amazon', rating: 4.6 },
  { id: 21, name: 'Under Armour Running Shoes', color: 'yellow', size: 12, price: 2399, store: 'Meesho', rating: 4.1 },
  { id: 22, name: 'Fila Sports Shoes', color: 'brown', size: 13, price: 3499, store: 'Flipkart', rating: 4.2 },
  { id: 23, name: 'Skechers Comfort Sneakers', color: 'gray', size: 14, price: 2799, store: 'Amazon', rating: 4.3 },
  { id: 24, name: 'Puma Sport Boots', color: 'blue', size: 6, price: 3299, store: 'Meesho', rating: 4.4 },
  { id: 25, name: 'Adidas High-Top Sneakers', color: 'white', size: 7, price: 1499, store: 'Flipkart', rating: 4.6 },
  { id: 26, name: 'Nike Training Shoes', color: 'black', size: 9, price: 3499, store: 'Amazon', rating: 4.7 },
  { id: 27, name: 'Reebok Sneakers', color: 'green', size: 8, price: 2699, store: 'Meesho', rating: 4.5 },
  { id: 28, name: 'Under Armour Boots', color: 'yellow', size: 11, price: 3999, store: 'Flipkart', rating: 4.3 },
  { id: 29, name: 'Fila Outdoor Sneakers', color: 'brown', size: 12, price: 3299, store: 'Amazon', rating: 4.6 },
  { id: 30, name: 'Skechers Running Shoes', color: 'gray', size: 13, price: 2499, store: 'Meesho', rating: 4.2 }
];

// Synonyms map for better understanding of user requests
const synonymMap: Record<string, string> = {
  workout: 'athletic',
  running: 'athletic',
  jog: 'athletic',
  gym: 'athletic',
  comfy: 'casual',
  office: 'formal',
  sneakers: 'casual',
  slipon: 'easy-wear',
};

// Product search, filtering by color and size
const searchProducts = (keywords: string[]): Product[] => {
  // Normalize all keywords to lowercase
  const normalizedKeywords = keywords.map(word => word.toLowerCase());

  const requestedColors = ['red', 'blue', 'black', 'green', 'white', 'yellow', 'brown', 'gray']
    .filter(color => normalizedKeywords.includes(color));

  // Match size using case-insensitive comparison
  const requestedSizes = normalizedKeywords
    .map(word => parseInt(word))
    .filter(size => [5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(size));

  return products.filter(product => {
    const matchesColor = requestedColors.length === 0 || requestedColors.includes(product.color);
    const matchesSize = requestedSizes.length === 0 || requestedSizes.includes(product.size);
    return matchesColor && matchesSize;
  });
};

const comparePrices = (product: Product): string => {
  const storePrices = products.filter(p => p.name === product.name && p.color === product.color);
  storePrices.sort((a, b) => a.price - b.price);
  return storePrices.map(p => `${p.store}: ₹${p.price}`).join(', ');
};

// Virtual Shopping Assistant Component
const VirtualShoppingAssistant = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { sender: 'user', text: input };
    const botReply: Message = { sender: 'bot', text: handleBotResponse(input) };
    setMessages(prev => [...prev, userMessage, botReply]);
    setInput('');
  };

  const handleBotResponse = (userMessage: string): string => {
    const messageWords = userMessage.toLowerCase().split(/\s+/);
    const matchedProducts = searchProducts(messageWords);

    if (matchedProducts.length === 0) {
      return "Sorry, I couldn't find any products that match your request. Could you try again with different keywords?";
    }

    // Price comparison and rating for matching products
    const priceComparisons = matchedProducts.map(product => {
      return `${product.name} - ${comparePrices(product)} - Rating: ${product.rating}⭐`;
    });

    return `Here are some product suggestions and price comparisons:\n${priceComparisons.join('\n')}`;
  };

  const startVoiceRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
    setIsListening(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <center><h1>Welcome to Chatbot</h1></center>
        <div className="h-96 overflow-y-auto space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-grow border rounded-l px-3 py-2"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={startVoiceRecognition}
            className={`bg-yellow-500 text-white px-4 py-2 rounded ${isListening ? 'bg-yellow-600' : ''}`}
          >
            {isListening ? 'Listening...' : 'Speak'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualShoppingAssistant;
