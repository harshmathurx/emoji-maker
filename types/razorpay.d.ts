interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare class RazorpayInstance {
  constructor(options: RazorpayOptions);
  open(): void;
}

interface Window {
  Razorpay: typeof RazorpayInstance;
} 