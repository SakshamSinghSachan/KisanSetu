import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiFilter, HiStar, HiShoppingCart, HiHeart, HiLocationMarker } from 'react-icons/hi';

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Organic'];
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">Fresh From Farm</h1>
          <p className="text-white/80 mb-6">Direct from farmers to your kitchen - no middlemen, better prices</p>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-white/30" placeholder="Search for tomatoes, rice, mangoes..." />
            </div>
            <button type="submit" className="bg-saffron-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-saffron-600 transition">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-primary-50 border'}`}>
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 rounded-xl border-gray-200 text-sm focus:ring-primary-500">
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost flex items-center space-x-1">
              <HiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="card-premium p-6 mb-6 animate-in">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-3">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="input-field text-sm" placeholder="Min" />
                  <span>-</span>
                  <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="input-field text-sm" placeholder="Max" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select className="input-field text-sm">
                  {units.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Organic Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="card-premium animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="card-premium group">
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🥬</div>
                  )}
                  {product.organic && <span className="absolute top-3 left-3 badge badge-organic">Organic</span>}
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition opacity-0 group-hover:opacity-100">
                    <HiHeart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center text-sm">
                      <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-600">{product.ratings || '4.5'}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <HiLocationMarker className="w-4 h-4" />
                      <span className="ml-1">{product.seller?.address?.city || 'India'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary-600">₹{product.price}</span>
                      <span className="text-sm text-gray-500">/{product.unit}</span>
                    </div>
                    <button className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition">
                      <HiShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
