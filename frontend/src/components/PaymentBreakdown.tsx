import { useState } from 'react';
import type { Vehicle } from '../types/vehicle';
import {
  estimateFinance,
  estimateLease,
  formatCurrency,
  formatMonthly,
  aprToMoneyFactor,
} from '../lib/finance';
import Card from './ui/Card';
import Button from './ui/Button';
import Slider from './ui/Slider';
import Select from './ui/Select';

interface PaymentBreakdownProps {
  vehicle: Vehicle
}

type PaymentType = 'finance' | 'lease'

export default function PaymentBreakdown({ vehicle }: PaymentBreakdownProps) {
  const [paymentType, setPaymentType] = useState<PaymentType>('finance');
  const [downPayment, setDownPayment] = useState(3000);
  const [apr, setApr] = useState(5.5);
  const [term, setTerm] = useState(60);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [residual, setResidual] = useState(60);

  const financeEstimate = estimateFinance(vehicle.price, apr, term, downPayment);
  const leaseEstimate = estimateLease(
    vehicle.price,
    residual,
    aprToMoneyFactor(apr),
    leaseTerm,
    downPayment
  );

  const currentEstimate =
    paymentType === 'finance' ? financeEstimate : leaseEstimate;

  return (
    <Card padding="lg">
      <h3 className="text-xl font-semibold text-toyota-black mb-4">
        Payment Simulator
      </h3>

      {/* Payment Type Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={paymentType === 'finance' ? 'primary' : 'outline'}
          onClick={() => setPaymentType('finance')}
          fullWidth
          size="sm"
        >
          Finance
        </Button>
        <Button
          variant={paymentType === 'lease' ? 'primary' : 'outline'}
          onClick={() => setPaymentType('lease')}
          fullWidth
          size="sm"
        >
          Lease
        </Button>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Down Payment */}
        <Slider
          label="Down Payment"
          min={0}
          max={vehicle.price * 0.3}
          step={500}
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          formatValue={(v) => formatCurrency(v)}
        />

        {/* APR */}
        <Slider
          label="Interest Rate (APR)"
          min={0}
          max={12}
          step={0.1}
          value={apr}
          onChange={(e) => setApr(Number(e.target.value))}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />

        {/* Term */}
        {paymentType === 'finance' ? (
          <Select
            label="Loan Term"
            value={String(term)}
            onChange={(e) => setTerm(Number(e.target.value))}
            options={[
              { value: '36', label: '36 months (3 years)' },
              { value: '48', label: '48 months (4 years)' },
              { value: '60', label: '60 months (5 years)' },
              { value: '72', label: '72 months (6 years)' },
            ]}
          />
        ) : (
          <>
            <Select
              label="Lease Term"
              value={String(leaseTerm)}
              onChange={(e) => setLeaseTerm(Number(e.target.value))}
              options={[
                { value: '24', label: '24 months (2 years)' },
                { value: '36', label: '36 months (3 years)' },
                { value: '48', label: '48 months (4 years)' },
              ]}
            />
            <Slider
              label="Residual Value"
              min={40}
              max={75}
              step={5}
              value={residual}
              onChange={(e) => setResidual(Number(e.target.value))}
              formatValue={(v) => `${v}%`}
            />
          </>
        )}
      </div>

      {/* Results */}
      <div className="bg-toyota-gray-light rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-toyota-gray-dark">
            Estimated Monthly Payment
          </span>
          <span className="text-2xl font-bold text-toyota-red">
            {formatMonthly(currentEstimate.monthly)}
            <span className="text-sm text-toyota-gray-dark font-normal">/mo</span>
          </span>
        </div>

        {/* Visual bar */}
        <div className="space-y-2">
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-toyota-red to-toyota-red-dark transition-all duration-500"
              style={{
                width: `${Math.min((currentEstimate.monthly / 1000) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-toyota-gray-dark">
            <span>$0</span>
            <span>$1,000+</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-300 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-toyota-gray-dark">MSRP</span>
            <span className="font-medium text-toyota-black">
              {formatCurrency(vehicle.price)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-toyota-gray-dark">Down Payment</span>
            <span className="font-medium text-toyota-black">
              {formatCurrency(downPayment)}
            </span>
          </div>
          {paymentType === 'lease' && (
            <div className="flex justify-between text-sm">
              <span className="text-toyota-gray-dark">Due at Signing</span>
              <span className="font-medium text-toyota-black">
                {formatCurrency(leaseEstimate.dueAtSigning)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-toyota-gray-dark">Total Cost</span>
            <span className="font-medium text-toyota-black">
              {formatCurrency(currentEstimate.totalCost)}
            </span>
          </div>
          {paymentType === 'finance' && (
            <div className="flex justify-between text-sm">
              <span className="text-toyota-gray-dark">Total Interest</span>
              <span className="font-medium text-toyota-black">
                {formatCurrency(financeEstimate.totalInterest)}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-toyota-gray-dark mt-4">
        * Estimates for demonstration purposes only. Actual rates, terms, and payments may vary.
      </p>
    </Card>
  )
}
