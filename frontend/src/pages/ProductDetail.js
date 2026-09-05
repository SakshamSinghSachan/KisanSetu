import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiStar, HiLocationMarker, HiShoppingCart, HiChat, HiClock, HiCheckCircle, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/orders', { state: { productId: product._id, quantity } });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20"><p>Product not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-card">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl">🥬</span>
                )}
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary-500 cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.organic && <span className="badge badge-organic">🌱 Organic</span>}
                <span className="badge badge-fresh">Freshly Harvested</span>
              </div>
              <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => <HiStar key={i} className={`w-5 h-5 ${i <= product.ratings ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  <span className="ml-2 text-gray-600">({product.totalRatings || 0} reviews)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-saffron-50 rounded-2xl p-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-primary-700">₹{product.price}</span>
                <span className="text-gray-500">/{product.unit}</span>
              </div>
              {product.bulkDiscount?.enabled && (
                <p className="text-sm text-saffron-600 mt-2">Bulk discount: {product.bulkDiscount.discountPercent}% off on {product.bulkDiscount.minQuantity}+ {product.unit}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition text-lg">-</button>
                <span className="px-4 py-2 font-semibold min-w-[60px] text-center">{quantity} {product.unit}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 transition text-lg">+</button>
              </div>
              <span className="text-sm text-gray-500">Available: {quantity} {product.unit}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddToCart} className="flex-1 btn-outline flex items-center justify-center space-x-2">
                <HiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button onClick={handleBuyNow} className="flex-1 btn-primary flex items-center justify-center space-x-2">
                <span>Buy Now</span>
              </button>
            </div>

            {user && user.role !== 'farmer' && (
              <button onClick={() => navigate('/chat')} className="w-full btn-ghost flex items-center justify-center space-x-2 border">
                <HiChat className="w-5 h-5" />
                <span>Chat with Farmer</span>
              </button>
            )}

            <div className="card-premium p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{product.seller?.name?.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{product.seller?.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <HiLocationMarker className="w-4 h-4" />
                    <span>{product.seller?.address?.city || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <HiCheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-green-700">Quality Checked</span>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <HiClock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-blue-700">Same Day Dispatch</span>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <HiShieldCheck className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="text-xs font-medium text-purple-700">Secure Payment</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex gap-4 mb-4">
                {['details', 'nutrition', 'reviews'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize pb-2 border-b-2 transition ${activeTab === tab ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === 'details' && <p className="text-gray-600">{product.description}</p>}
              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 gap-3">
                  {['Calories: 25 kcal', 'Protein: 2g', 'Carbs: 5g', 'Fiber: 3g'].map((item, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg text-sm">{item}</div>
                  ))}
                </div>
              )}
              {activeTab === 'reviews' && <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
