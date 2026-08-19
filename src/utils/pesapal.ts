/**
 * PesaPal Payment Integration for DigiTech Academy
 * Consumer Key: V3xHiPOv69q7EfnRbua42ssQyQHNf+Mm
 * Consumer Secret: Eiw8gYnsIlaW3s5r9/SuR7ot+0U=
 * 
 * Payment Numbers:
 * - Airtel: 0702524736
 * - MTN: 0770613201
 * 
 * Phone-initiated mobile money payment flow:
 * 1. User selects course and clicks "Enroll with PesaPal"
 * 2. User enters their phone number (MTN or Airtel)
 * 3. PesaPal sends an SMS to user's phone with PIN prompt
 * 4. User enters PIN to authorize payment
 * 5. Transaction completes, money deposited to merchant account
 */

export interface PesaPalPayment {
  amount: number
  currency: 'UGX'
  description: string
  callback_url: string
  notification_id?: string
  billing_address: {
    email_address: string
    phone_number: string
    country_code: string
    first_name: string
    middle_name?: string
    last_name: string
    line_1?: string
    line_2?: string
    city?: string
    state?: string
    postal_code?: string
    zip_code?: string
  }
}

export interface PesaPalConfig {
  consumerKey: string
  consumerSecret: string
  baseUrl: string
  merchantAccount: {
    airtel: string
    mtn: string
  }
}

export interface PesaPalPaymentResponse {
  success: boolean
  reference: string
  message: string
  transactionId?: string
  status?: string
  requiresPin?: boolean
}

// PesaPal Configuration
export const PESAPAL_CONFIG: PesaPalConfig = {
  consumerKey: 'V3xHiPOv69q7EfnRbua42ssQyQHNf+Mm',
  consumerSecret: 'Eiw8gYnsIlaW3s5r9/SuR7ot+0U=',
  baseUrl: 'https://pay.pesapal.com/v3',
  merchantAccount: {
    airtel: '0702524736',
    mtn: '0770613201',
  },
}

/**
 * Generate PesaPal Authentication Token
 * This should be done server-side in production
 */
export async function getPesaPalToken(): Promise<string> {
  try {
    const response = await fetch(`${PESAPAL_CONFIG.baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONFIG.consumerKey,
        consumer_secret: PESAPAL_CONFIG.consumerSecret,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get PesaPal token')
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('PesaPal Token Error:', error)
    throw error
  }
}

/**
 * Submit Phone-initiated Mobile Money Payment
 * This simulates the PesaPal API that sends SMS with PIN prompt to user's phone
 */
export async function initiatePhonePayment(
  amount: number,
  phone: string,
  method: 'MTN' | 'AIRTEL',
  email: string,
  firstName: string,
  lastName: string,
  description: string
): Promise<PesaPalPaymentResponse> {
  try {
    // Format phone number for PesaPal
    const formattedPhone = formatPhoneNumber(phone)
    
    // Get PesaPal token
    const token = await getPesaPalToken()
    
    // Create merchant reference
    const merchantReference = `DIGTECH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    
    // Submit payment order to PesaPal
    const paymentData = {
      id: merchantReference,
      currency: 'UGX',
      amount: amount,
      description: description,
      callback_url: 'https://digtechacademy.com/payment/callback',
      billing_address: {
        email_address: email,
        phone_number: formattedPhone,
        country_code: '256',
        first_name: firstName,
        last_name: lastName,
      }
    }
    
    const response = await fetch(`${PESAPAL_CONFIG.baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to initiate payment')
    }

    const data = await response.json()
    
    // In real PesaPal flow:
    // 1. PesaPal sends SMS to user's phone with PIN prompt
    // 2. User enters PIN to authorize payment
    // 3. Money moves from user's mobile wallet to merchant account
    
    // Simulating SMS sent notification
    const merchantAccount = method === 'MTN' ? PESAPAL_CONFIG.merchantAccount.mtn : PESAPAL_CONFIG.merchantAccount.airtel
    const transactionId = `TRX-${Date.now()}-${Math.floor(1000000 + Math.random() * 9000000)}`
    
    return {
      success: true,
      reference: merchantReference,
      message: `SMS with PIN prompt sent to ${phone}. Amount: UGX ${amount.toLocaleString()}. Please check your phone and enter PIN to complete payment to merchant account: ${merchantAccount}`,
      transactionId,
      status: 'pending_pin',
      requiresPin: true,
    }
  } catch (error) {
    console.error('PesaPal Payment Error:', error)
    return {
      success: false,
      reference: '',
      message: error instanceof Error ? error.message : 'Payment failed. Please try again.',
    }
  }
}

/**
 * Complete Payment after PIN Entry
 * Simulates user entering PIN and transaction completing
 */
export async function completePaymentWithPin(
  transactionId: string,
  reference: string
): Promise<PesaPalPaymentResponse> {
  try {
    // In real implementation, this would verify PIN with PesaPal API
    const token = await getPesaPalToken()
    
    const response = await fetch(
      `${PESAPAL_CONFIG.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${reference}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const data = await response.json()
    
    // Simulate successful transaction after PIN entry
    return {
      success: data.payment_status === 'COMPLETED',
      reference: reference,
      message: data.payment_status === 'COMPLETED' 
        ? `Payment completed successfully! UGX ${data.amount} deposited to merchant account. Transaction ID: ${transactionId}`
        : `Payment ${data.payment_status.toLowerCase()}.`,
      transactionId,
      status: data.payment_status.toLowerCase(),
    }
  } catch (error) {
    console.error('Payment Completion Error:', error)
    return {
      success: false,
      reference: reference,
      message: error instanceof Error ? error.message : 'Payment completion failed.',
    }
  }
}

/**
 * Simulate PesaPal payment flow for development/demo purposes
 * Shows the complete phone-initiated payment process
 */
export function simulateCompletePaymentFlow(
  amount: number,
  phone: string,
  method: 'MTN' | 'AIRTEL',
  description: string
): Promise<PesaPalPaymentResponse> {
  return new Promise((resolve) => {
    // Step 1: Simulate SMS sent to phone with PIN prompt
    setTimeout(() => {
      const reference = `PESA-UG-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`
      const merchantAccount = method === 'MTN' ? PESAPAL_CONFIG.merchantAccount.mtn : PESAPAL_CONFIG.merchantAccount.airtel
      
      resolve({
        success: true,
        reference,
        message: `✅ SMS with PIN prompt sent to ${phone}. Amount: UGX ${amount.toLocaleString()}. Please check your phone and enter PIN to authorize payment to merchant account: ${merchantAccount}`,
        transactionId: `SIM-${reference}`,
        status: 'sms_sent',
        requiresPin: true,
      })
    }, 1500)
  })
}

/**
 * Format phone number for PesaPal (ensure it starts with country code)
 */
export function formatPhoneNumber(phone: string): string {
  // Remove spaces and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // Add Uganda country code if not present
  if (!cleaned.startsWith('256') && !cleaned.startsWith('+256')) {
    if (cleaned.startsWith('0')) {
      cleaned = '256' + cleaned.slice(1)
    } else {
      cleaned = '256' + cleaned
    }
  }

  return cleaned.replace('+', '')
}

/**
 * Validate payment details
 */
export function validatePaymentDetails(
  phone: string,
  email: string,
  firstName: string,
  lastName: string,
  method: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Phone validation for Ugandan numbers
  const phoneRegex = /^(\+?256|0)?[7][0-9]{8}$/
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid Ugandan phone number. Must be 10 digits starting with 07.')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push('Invalid email address.')
  }

  // Name validation
  if (firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters.')
  }

  if (lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters.')
  }

  // Method validation
  if (method !== 'MTN' && method !== 'AIRTEL') {
    errors.push('Please select MTN Mobile Money or Airtel Money.')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get merchant account number based on payment method
 */
export function getMerchantAccount(method: 'MTN' | 'AIRTEL'): string {
  return method === 'MTN' 
    ? PESAPAL_CONFIG.merchantAccount.mtn 
    : PESAPAL_CONFIG.merchantAccount.airtel
}

/**
 * Generate payment receipt
 */
export function generateReceipt(
  reference: string,
  amount: number,
  phone: string,
  method: string,
  description: string
): string {
  const now = new Date()
  const merchantAccount = method === 'MTN' 
    ? PESAPAL_CONFIG.merchantAccount.mtn 
    : PESAPAL_CONFIG.merchantAccount.airtel
  
  return `
    ======================================
           DIGI TECH ACADEMY
    ======================================
    Payment Receipt
    --------------------------------------
    Reference: ${reference}
    Date: ${now.toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })}
    --------------------------------------
    Description: ${description}
    Amount: UGX ${amount.toLocaleString()}
    Method: ${method} Mobile Money
    Phone: ${phone}
    Merchant Account: ${merchantAccount}
    --------------------------------------
    Status: ✅ Payment Successful
    Transaction ID: TRX-${reference}
    --------------------------------------
    Thank you for enrolling with Digi Tech Academy!
    Contact: 0702524736 (Airtel) | 0770613201 (MTN)
    ======================================
  `
}