import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiStar, HiLocationMarker, HiShoppingCart, HiChat, HiClock, HiCheckCircle, HiShieldCheck, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });

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

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    setShowCheckout(true);
  };

  const handleChat = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await API.post('/chat', { participantId: product.seller._id });
      navigate('/chat');
    } catch (error) { toast.error('Could not start chat'); }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      toast.error('Please fill delivery address');
      return;
    }
    setOrderLoading(true);
    try {
      await API.post('/orders', {
        items: [{ productId: product._id, quantity, sellerId: product.seller._id }],
        shippingAddress: { ...address },
        paymentMethod: 'cod'
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    }
    setOrderLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20"><p>Product not found</p></div>;

  const subtotal = product.price * quantity;
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6">
          <HiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-card aspect-square flex items-center justify-center">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">🥬</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.organic && <span className="badge badge-organic">Organic</span>}
                <span className="badge badge-fresh">Fresh</span>
              </div>
              <h1 className="text-3xl font-bold font-heading mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(i => <HiStar key={i} className={`w-5 h-5 ${i <= (product.ratings || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  <span className="ml-2 text-gray-600">({product.totalRatings || 0})</span>
                </div>
                <span className="text-sm text-gray-500">Sold: {product.soldCount || 0}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-saffron-50 rounded-2xl p-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-primary-700">₹{product.price}</span>
                <span className="text-gray-500">/{product.unit}</span>
              </div>
              {product.bulkDiscount?.enabled && (
                <p className="text-sm text-saffron-600 mt-2">Bulk: {product.bulkDiscount.discountPercent}% off on {product.bulkDiscount.minQuantity}+ units</p>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition text-lg font-bold">-</button>
                <span className="px-6 py-2 font-semibold min-w-[80px] text-center border-x">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 transition text-lg font-bold">+</button>
              </div>
              <span className="text-sm text-gray-500">{product.unit}</span>
            </div>

            <div className="text-lg font-semibold">Total: ₹{subtotal.toLocaleString()}</div>

            <div className="flex gap-3">
              <button onClick={handleBuyNow} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg flex items-center justify-center space-x-2">
                <HiShoppingCart className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
              <button onClick={handleChat} className="px-6 py-4 border-2 border-primary-500 text-primary-600 rounded-xl font-bold hover:bg-primary-50 transition flex items-center space-x-2">
                <HiChat className="w-5 h-5" />
                <span>Chat</span>
              </button>
            </div>

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
          </div>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-heading">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl">🥬</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-500">₹{product.price} x {quantity} {product.unit}</p>
                </div>
                <div className="font-bold text-primary-600">₹{subtotal}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Delivery Address</h3>
              <div className="space-y-3">
                <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="input-field" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="input-field" placeholder="City" />
                  <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="input-field" placeholder="State" />
                </div>
                <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="input-field" placeholder="Pincode" />
              </div>
            </div>

            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (5%)</span><span>₹{tax}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-primary-600">₹{total}</span></div>
            </div>

            <div className="space-y-3">
              <button onClick={handlePlaceOrder} disabled={orderLoading} className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition">
                {orderLoading ? 'Placing Order...' : `Place Order - ₹${total}`}
              </button>
              <p className="text-center text-sm text-gray-500">Cash on Delivery</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
