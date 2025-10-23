/**
 * Stripe Integration Service
 * Handles all payment processing for Gold and Platinum subscriptions
 */

import { supabase } from '../config/supabase';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface SubscriptionData {
  userId: string;
  email: string;
  plan: 'weekly' | 'monthly' | 'sixMonth';
  tier: 'gold' | 'platinum-tier1' | 'platinum-tier2' | 'platinum-tier3';
  amount: number;
  paymentMethod: 'apple-account' | 'ideal-stripe' | 'credit-card' | 'bitcoin';
  bankCode?: string; // For iDEAL payments
}

export interface IdealPaymentResponse {
  redirect_url: string;
  payment_id: string;
  status: string;
}

/**
 * Initialize payment intent with Stripe
 */
export const initializePaymentIntent = async (
  data: SubscriptionData
): Promise<PaymentIntent> => {
  try {
    const response = await fetch('/api/stripe/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Stripe expects cents
        currency: 'eur',
        metadata: {
          userId: data.userId,
          plan: data.plan,
          tier: data.tier,
          email: data.email,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize payment intent');
    }

    const paymentIntent: PaymentIntent = await response.json();
    return paymentIntent;
  } catch (error: any) {
    console.error('Payment intent error:', error);
    throw error;
  }
};

/**
 * Process iDEAL payment
 */
export const processIdealPayment = async (
  data: SubscriptionData
): Promise<IdealPaymentResponse> => {
  try {
    const response = await fetch('/api/stripe/ideal-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: 'eur',
        bank: data.bankCode,
        description: `YOUR FUTURE SELF ${data.tier === 'gold' ? 'Gold' : 'Platinum'} Subscription`,
        metadata: {
          userId: data.userId,
          plan: data.plan,
          tier: data.tier,
          email: data.email,
          paymentMethod: 'ideal',
        },
        returnUrl: `${window.location.origin}/payment/success`,
        redirectUrl: `${window.location.origin}/payment/ideal-redirect`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate iDEAL payment');
    }

    const idealPayment: IdealPaymentResponse = await response.json();
    return idealPayment;
  } catch (error: any) {
    console.error('iDEAL payment error:', error);
    throw error;
  }
};

/**
 * Process credit card payment
 */
export const processCreditCardPayment = async (
  data: SubscriptionData,
  cardToken: string
): Promise<any> => {
  try {
    const response = await fetch('/api/stripe/credit-card-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: 'eur',
        token: cardToken,
        description: `YOUR FUTURE SELF ${data.tier === 'gold' ? 'Gold' : 'Platinum'} Subscription`,
        metadata: {
          userId: data.userId,
          plan: data.plan,
          tier: data.tier,
          email: data.email,
          paymentMethod: 'credit-card',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Credit card payment failed');
    }

    const payment = await response.json();
    return payment;
  } catch (error: any) {
    console.error('Credit card payment error:', error);
    throw error;
  }
};

/**
 * Process Bitcoin payment
 */
export const processBitcoinPayment = async (
  data: SubscriptionData
): Promise<any> => {
  try {
    const response = await fetch('/api/stripe/bitcoin-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100),
        currency: 'eur',
        description: `YOUR FUTURE SELF ${data.tier === 'gold' ? 'Gold' : 'Platinum'} Subscription`,
        metadata: {
          userId: data.userId,
          plan: data.plan,
          tier: data.tier,
          email: data.email,
          paymentMethod: 'bitcoin',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Bitcoin payment initiation failed');
    }

    const payment = await response.json();
    return payment;
  } catch (error: any) {
    console.error('Bitcoin payment error:', error);
    throw error;
  }
};

/**
 * Create subscription after payment success
 */
export const createSubscriptionRecord = async (
  data: SubscriptionData,
  stripeSubscriptionId: string,
  paymentId: string
): Promise<any> => {
  try {
    // Store subscription in Supabase
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: data.userId,
          email: data.email,
          tier: data.tier,
          plan: data.plan,
          stripe_subscription_id: stripeSubscriptionId,
          payment_id: paymentId,
          payment_method: data.paymentMethod,
          amount: data.amount,
          status: 'active',
          created_at: new Date().toISOString(),
          renews_at: calculateRenewalDate(data.plan),
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return subscription[0];
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    throw error;
  }
};

/**
 * Calculate renewal date based on plan
 */
const calculateRenewalDate = (plan: 'weekly' | 'monthly' | 'sixMonth'): string => {
  const now = new Date();
  let daysToAdd = 0;

  switch (plan) {
    case 'weekly':
      daysToAdd = 7;
      break;
    case 'monthly':
      daysToAdd = 30;
      break;
    case 'sixMonth':
      daysToAdd = 180;
      break;
  }

  const renewalDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return renewalDate.toISOString();
};

/**
 * Get subscription details
 */
export const getSubscriptionDetails = async (userId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    // Update Supabase record
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    throw error;
  }
};

/**
 * Update subscription plan
 */
export const updateSubscriptionPlan = async (
  subscriptionId: string,
  newPlan: 'weekly' | 'monthly' | 'sixMonth',
  newAmount: number
): Promise<any> => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        plan: newPlan,
        amount: Math.round(newAmount * 100),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    const updated = await response.json();
    return updated;
  } catch (error: any) {
    console.error('Subscription update error:', error);
    throw error;
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (event: any): Promise<void> => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Update subscription status to active
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        // Notify user of payment failure
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        // Update subscription in database
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription deleted:', event.data.object);
        // Mark subscription as canceled
        break;

      case 'charge.refunded':
        console.log('Charge refunded:', event.data.object);
        // Handle refund
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (error: any) {
    console.error('Webhook handling error:', error);
    throw error;
  }
};

/**
 * Get payment methods for user
 */
export const getUserPaymentMethods = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Payment methods fetch error:', error);
    throw error;
  }
};

/**
 * Save payment method
 */
export const savePaymentMethod = async (
  userId: string,
  methodType: string,
  stripePaymentMethodId: string,
  lastFour?: string
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([
        {
          user_id: userId,
          type: methodType,
          stripe_payment_method_id: stripePaymentMethodId,
          last_four: lastFour,
          active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error: any) {
    console.error('Payment method save error:', error);
    throw error;
  }
};

export default {
  initializePaymentIntent,
  processIdealPayment,
  processCreditCardPayment,
  processBitcoinPayment,
  createSubscriptionRecord,
  getSubscriptionDetails,
  cancelSubscription,
  updateSubscriptionPlan,
  handleStripeWebhook,
  getUserPaymentMethods,
  savePaymentMethod,
};
