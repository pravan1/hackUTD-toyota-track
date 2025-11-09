import Vehicle from '../models/Vehicle.js';

const parseNumber = (value) => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getVehicles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
      fuelType,
      bodyStyle,
      seats,
      drivetrain,
      search
    } = req.query;

    const query = {};

    const minPriceNum = parseNumber(minPrice);
    const maxPriceNum = parseNumber(maxPrice);
    const seatNum = parseNumber(seats);

    if (minPriceNum !== undefined || maxPriceNum !== undefined) {
      query.price = {};
      if (minPriceNum !== undefined) query.price.$gte = minPriceNum;
      if (maxPriceNum !== undefined) query.price.$lte = maxPriceNum;
    }

    if (fuelType) query.fuelType = fuelType;
    if (bodyStyle) query.bodyStyle = bodyStyle;
    if (drivetrain) query.drivetrain = drivetrain;
    if (seatNum !== undefined) query.seats = { $gte: seatNum };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ model: regex }, { trim: regex }, { features: regex }];
    }

    const safeLimit = Math.min(parseNumber(limit) || 12, 50);
    const safePage = Math.max(parseNumber(page) || 1, 1);

    const [total, vehicles] = await Promise.all([
      Vehicle.countDocuments(query),
      Vehicle.find(query)
        .sort({ price: 1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
    ]);

    res.json({
      data: vehicles,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

