import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { SubscriptionMetrics } from '../../types/subscriptions.types.ts';

export function calculateSummaryRatios(metrics: SubscriptionMetrics) {
  const totalSubscribers = metrics.activeCount + metrics.cancelledCount + metrics.expiredCount;
  const churnPercentage = totalSubscribers > 0
    ? ((metrics.cancelledCount + metrics.expiredCount) / totalSubscribers) * 100
    : 0;
  const arr = metrics.mrr * 12;
  return {
    totalSubscribers,
    churnPercentage: Math.round(churnPercentage * 10) / 10,
    annualRunRate: arr,
  };
}

describe('subscription metrics computations', () => {
  const sampleMetrics: SubscriptionMetrics = {
    activeCount: 150,
    monthlyCount: 100,
    yearlyCount: 40,
    lifetimeCount: 10,
    cancelledCount: 15,
    expiredCount: 5,
    mrr: 2500,
    arr: 30000,
    totalRevenue: 45000,
    churnRate: 0.1,
    conversionRate: 0.05,
  };

  it('computes total subscribers and annual run rate correctly', () => {
    const summary = calculateSummaryRatios(sampleMetrics);
    assert.equal(summary.totalSubscribers, 170);
    assert.equal(summary.annualRunRate, 30000);
  });

  it('computes churn percentage accurately', () => {
    const summary = calculateSummaryRatios(sampleMetrics);
    // (20 / 170) * 100 = 11.76... -> 11.8
    assert.equal(summary.churnPercentage, 11.8);
  });

  it('handles zero subscribers gracefully without division by zero', () => {
    const emptyMetrics: SubscriptionMetrics = {
      ...sampleMetrics,
      activeCount: 0,
      cancelledCount: 0,
      expiredCount: 0,
      mrr: 0,
    };
    const summary = calculateSummaryRatios(emptyMetrics);
    assert.equal(summary.totalSubscribers, 0);
    assert.equal(summary.churnPercentage, 0);
    assert.equal(summary.annualRunRate, 0);
  });
});
