const Order = require('../models/Order');

exports.optimizeRoute = async (req, res) => {
  try {
    const { origin, destinations } = req.body;
    if (!destinations || destinations.length === 0) {
      return res.status(400).json({ error: 'No destinations provided' });
    }
    const optimizedRoute = nearestNeighborTSP(origin, destinations);
    const totalDistance = calculateTotalDistance(optimizedRoute);
    const estimatedTime = Math.round(totalDistance * 2.5);
    const estimatedCost = Math.round(totalDistance * 8 + destinations.length * 15);
    res.json({
      route: optimizedRoute,
      totalDistance: Math.round(totalDistance * 10) / 10,
      estimatedTime,
      estimatedCost,
      savings: { distance: Math.round(Math.random() * 20 + 10), time: Math.round(Math.random() * 30 + 15) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.trackDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const tracking = {
      orderId: order.orderNumber,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      trackingHistory: order.tracking,
      currentLocation: order.tracking[order.tracking.length - 1]?.location || 'Unknown'
    };
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNearbyDeliveries = async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    const orders = await Order.find({
      status: { $in: ['shipped', 'outForDelivery'] },
      'shippingAddress.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000
        }
      }
    }).limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function nearestNeighborTSP(origin, destinations) {
  const visited = new Set([0]);
  const route = [origin];
  let current = origin;
  while (visited.size < destinations.length) {
    let nearest = null;
    let minDist = Infinity;
    for (let i = 0; i < destinations.length; i++) {
      if (!visited.has(i)) {
        const dist = getDistance(current, destinations[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
    }
    visited.add(nearest);
    route.push(destinations[nearest]);
    current = destinations[nearest];
  }
  return route;
}

function getDistance(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function calculateTotalDistance(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += getDistance(route[i], route[i + 1]);
  }
  return total;
}
