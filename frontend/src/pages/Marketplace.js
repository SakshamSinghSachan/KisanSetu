import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiFilter, HiStar, HiShoppingCart, HiHeart, HiLocationMarker, HiViewGrid, HiViewList, HiX } from 'react-icons/hi';

const categories = [
  { name: 'All', emoji: '🌾' },
  { name: 'Vegetables', emoji: '🥬' },
  { name: 'Fruits', emoji: '🍎' },
  { name: 'Grains', emoji: '🌾' },
  { name: 'Dairy', emoji: '🥛' },
  { name: 'Spices', emoji: '🌶️' },
  { name: 'Organic', emoji: '🌱' }
];

const units = ['kg', 'dozen', 'piece', 'bundle', 'litre'];

const Marketplace = () => {
  const { API } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => { fetchProducts(); }, [category, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      params.append('sort', sortBy === 'newest' ? '' : sortBy);
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products || []);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const ShimmerCard = () => (
    <div className="bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50 animate-pulse">
      <div className="h-56 bg-gray-700/50"></div>
      <div className="p-6 space-y-4">
        <div className="h-5 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-700/50 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700/50 rounded-xl w-10"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-4 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-saffron-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
              Fresh From <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-saffron-400">Farm</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Direct from farmers to your kitchen - no middlemen, better prices
            </p>
          </motion.div>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch} 
            className="max-w-3xl mx-auto"
          >
            <div className="flex gap-3 bg-gray-800/50 backdrop-blur-lg p-2 rounded-2xl border border-gray-700/50">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-primary-500/30 bg-gray-900 text-white placeholder-gray-500" 
                  placeholder="Search for tomatoes, rice, mangoes..." 
                />
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          {categories.map((cat) => (
            <motion.button 
              key={cat.name} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.name)} 
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                category === cat.name 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
          
          <div className="ml-auto flex items-center gap-3">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            
            <div className="flex items-center bg-gray-800/50 rounded-xl border border-gray-700/50">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2.5 rounded-l-xl transition-all ${viewMode === 'grid' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-500 hover:text-white'}`}
              >
                <HiViewGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2.5 rounded-r-xl transition-all ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-500 hover:text-white'}`}
              >
                <HiViewList className="w-5 h-5" />
              </button>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                showFilters 
                  ? 'bg-primary-500 text-white shadow-lg' 
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
              }`}
            >
              <HiFilter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-white">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-700/50 rounded-xl transition">
                    <HiX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Price Range</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number" 
                        value={priceRange[0]} 
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all" 
                        placeholder="Min" 
                      />
                      <span className="text-gray-500">-</span>
                      <input 
                        type="number" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} 
                        className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all" 
                        placeholder="Max" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Unit</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all">
                      {units.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Location</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all">
                      <option>All India</option>
                      <option>Uttar Pradesh</option>
                      <option>Punjab</option>
                      <option>Haryana</option>
                      <option>Maharashtra</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow-sm"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-primary-400 transition-colors">Organic Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            <span className="font-semibold text-white">{products.length}</span> products found
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[1,2,3,4,5,6,7,8].map(i => <ShimmerCard key={i} />)}
          </div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
          >
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={`/product/${product._id}`} 
                    className={`group bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 flex ${
                      viewMode === 'list' ? 'flex-row' : 'flex-col'
                    }`}
                  >
                    {/* Image Section */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-56'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 group-hover:from-gray-600/50 group-hover:to-gray-700/50 transition-all duration-500"></div>
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-7xl">🥬</div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.organic && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            🌱 Organic
                          </span>
                        )}
                        {product.fresh && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            ✨ Fresh
                          </span>
                        )}
                      </div>
                      
                      {/* Wishlist Button */}
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                          wishlist.includes(product._id)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-900/80 text-gray-400 hover:bg-gray-900 hover:text-red-400'
                        }`}
                      >
                        <HiHeart className={`w-5 h-5 ${wishlist.includes(product._id) ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-1 mt-1">{product.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="flex items-center bg-yellow-500/10 px-2 py-1 rounded-lg">
                            <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold text-yellow-400">{product.ratings || '4.5'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <HiLocationMarker className="w-4 h-4 text-primary-400" />
                            <span className="ml-1">{product.seller?.address?.city || 'India'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div>
                          <span className="text-2xl font-bold text-primary-400">₹{product.price}</span>
                          <span className="text-sm text-gray-500">/{product.unit}</span>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30"
                        >
                          <HiShoppingCart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3">No products found</h3>
            <p className="text-gray-400 text-lg mb-8">Try adjusting your search or filters</p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }} 
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
