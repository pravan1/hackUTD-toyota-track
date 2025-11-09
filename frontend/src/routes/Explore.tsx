import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Hero from '../components/layout/Hero';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Slider from '../components/ui/Slider';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  defaultFilters,
  type FilterOptions,
  mapFiltersToQuery
} from '../lib/filters';
import { formatCurrency } from '../lib/finance';
import { fetchVehicles } from '../lib/api';
import type { Vehicle } from '../types/vehicle';

export default function Explore() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchVehicles({
          ...mapFiltersToQuery(filters),
          limit: 18
        });
        setVehicles(result.data);
        setTotalVehicles(result.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [filters]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const fuelTypeOptions = [
    { value: 'any', label: 'Any Fuel Type' },
    { value: 'Gasoline', label: 'Gasoline' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'EV', label: 'Electric' }
  ];

  const bodyStyleOptions = [
    { value: 'any', label: 'Any Body Style' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Truck', label: 'Truck' },
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Coupe', label: 'Coupe' },
    { value: 'Minivan', label: 'Minivan' }
  ];

  return (
    <div>
      <Hero
        title="Explore Our Vehicles"
        subtitle="Browse the complete Toyota lineup and find your perfect match"
        compact
      />

      <section className="py-12 bg-white">
        <div className="container-custom">
          {/* Filter Toggle Button (Mobile) */}
          <div className="mb-6 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-80 flex-shrink-0"
              >
                <Card padding="lg" className="sticky top-20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-toyota-black">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-toyota-red"
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-toyota-gray-dark" />
                      <Input
                        placeholder="Search vehicles..."
                        value={filters.searchQuery}
                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Fuel Type */}
                    <Select
                      label="Fuel Type"
                      value={filters.fuelType}
                      onChange={(e) =>
                        updateFilter('fuelType', e.target.value as FilterOptions['fuelType'])
                      }
                      options={fuelTypeOptions}
                    />

                    {/* Body Style */}
                    <Select
                      label="Body Style"
                      value={filters.bodyStyle}
                      onChange={(e) =>
                        updateFilter(
                          'bodyStyle',
                          e.target.value as FilterOptions['bodyStyle']
                        )
                      }
                      options={bodyStyleOptions}
                    />

                    {/* Price Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-toyota-black">
                        Price Range
                      </label>
                      <div className="space-y-3">
                        <Slider
                          label="Min Price"
                          min={15000}
                          max={70000}
                          step={1000}
                          value={filters.priceMin}
                          onChange={(e) =>
                            updateFilter('priceMin', Number(e.target.value))
                          }
                          formatValue={(v) => formatCurrency(v)}
                        />
                        <Slider
                          label="Max Price"
                          min={20000}
                          max={90000}
                          step={1000}
                          value={filters.priceMax}
                          onChange={(e) =>
                            updateFilter('priceMax', Number(e.target.value))
                          }
                          formatValue={(v) => formatCurrency(v)}
                        />
                      </div>
                    </div>
                    {/* Seats */}
                    <Slider
                      label="Minimum Seats"
                      min={0}
                      max={8}
                      step={1}
                      value={filters.seats}
                      onChange={(e) =>
                        updateFilter('seats', Number(e.target.value))
                      }
                      formatValue={(v) =>
                        v === 0 ? 'Any' : `${v}+ passengers`
                      }
                    />
                  </div>
                </Card>
              </motion.aside>
            )}

            {/* Vehicle Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-toyota-black">
                  {loading ? 'Loading vehicles...' : `${totalVehicles} vehicles found`}
                </h2>
                <span className="text-sm text-toyota-gray-dark">
                  Results update automatically as you adjust filters
                </span>
              </div>

              {error && (
                <Card padding="lg" className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      Could not load vehicles
                    </h3>
                    <p className="text-toyota-gray-dark mb-6">{error}</p>
                    <Button onClick={() => setFilters({ ...filters })}>
                      Retry
                    </Button>
                  </div>
                </Card>
              )}

              {!error && !loading && vehicles.length === 0 && (
                <Card padding="lg" className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-toyota-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-toyota-gray-dark" />
                    </div>
                    <h3 className="text-xl font-semibold text-toyota-black mb-2">
                      No vehicles found
                    </h3>
                    <p className="text-toyota-gray-dark mb-6">
                      Try adjusting your filters to see more results
                    </p>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                </Card>
              )}

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="h-64 animate-pulse bg-toyota-gray-light" />
                  ))}
                </div>
              )}

              {!loading && !error && vehicles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                    >
                      <Link to={`/app/vehicle/${vehicle._id}`}>
                        <Card hover padding="none" className="overflow-hidden h-full">
                          <div className="relative">
                            <img
                              src={vehicle.imageUrl}
                              alt={`${vehicle.year} ${vehicle.model} ${vehicle.trim ?? ''}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge variant={vehicle.fuelType === 'EV' ? 'success' : 'info'}>
                                {vehicle.fuelType}
                              </Badge>
                              <Badge>{vehicle.bodyStyle}</Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-toyota-black mb-2">
                              {vehicle.year} {vehicle.model}{' '}
                              {vehicle.trim ? `• ${vehicle.trim}` : ''}
                            </h3>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-xs text-toyota-gray-dark">Starting at</div>
                                <div className="text-lg font-bold text-toyota-red">
                                  {formatCurrency(vehicle.price)}
                                </div>
                              </div>
                              {vehicle.fuelType !== 'EV' && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Zap className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {vehicle.mpgCity}/{vehicle.mpgHighway} MPG
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {vehicle.features.slice(0, 3).map((feature) => (
                                <Badge key={feature} size="sm">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
