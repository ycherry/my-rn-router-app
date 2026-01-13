import { getServerEnv } from "@/lib/server-env";
import { db } from "@/db";
import { userPaymentMethods } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";


const getPayPalConfig = () => {
  const env = getServerEnv();
  const isProduction = env.NODE_ENV === "production";
  
  // Prefer production keys if available and in production, otherwise sandbox
  if (isProduction && env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET) {
    return {
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
      baseUrl: "https://api-m.paypal.com",
    };
  }

  return {
    clientId: env.PAYPAL_SANDBOX_CLIENT_ID,
    clientSecret: env.PAYPAL_SANDBOX_CLIENT_SECRET,
    baseUrl: "https://api-m.sandbox.paypal.com",
  };
};

const getAccessToken = async () => {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
};

export const generateClientToken = async (customerId?: string): Promise<string> => {
  const { baseUrl } = getPayPalConfig();
  const accessToken = await getAccessToken();

  const body: Record<string, unknown> = {};
  if (customerId) {
    body.customer_id = customerId;
  }

  const response = await fetch(`${baseUrl}/v1/identity/generate-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept-Language": "en_US",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate PayPal client token: ${error}`);
  }

  const data = await response.json();
  return data.client_token;
};

export const createOrder = async (amount: string, currency: string = "USD", vaultId?: string, shouldVault: boolean = false, returnUrl?: string, cancelUrl?: string) => {
  const { baseUrl } = getPayPalConfig();
  const accessToken = await getAccessToken();

  const body: {
    intent: string;
    purchase_units: Array<{
      amount: {
        currency_code: string;
        value: string;
      };
    }>;
    application_context: {
      return_url: string;
      cancel_url: string;
      user_action: string;
    };
    payment_source?: {
      paypal: {
        vault_id?: string;
        attributes?: {
          vault: {
            store_in_vault: string;
            usage_type: string;
            customer_type: string;
          };
        };
      };
    };
  } = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
    application_context: {
      return_url: returnUrl || "https://example.com/return",
      cancel_url: cancelUrl || "https://example.com/cancel",
      user_action: "PAY_NOW",
    },
  };

  if (vaultId) {
    body.payment_source = {
      paypal: {
        vault_id: vaultId,
      }
    };
  } else if (shouldVault) {
    body.payment_source = {
      paypal: {
        attributes: {
          vault: {
            store_in_vault: "ON_SUCCESS",
            usage_type: "MERCHANT",
            customer_type: "CONSUMER"
          }
        },
      }
    };
  } else {
    // No payment_source needed for standard checkout
  }

  console.log(">>>>> createOrder body:", JSON.stringify(body, null, 2));

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": randomUUID(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PayPal order: ${error}`);
  }

  return response.json();
};

export const captureOrder = async (orderId: string) => {
  const { baseUrl } = getPayPalConfig();
  const accessToken = await getAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(">>>>> captureOrder error:", error);
    throw new Error(`Failed to capture PayPal order: ${error}`);
  }

  const result = await response.json();
  console.log(">>>>> captureOrder result:", JSON.stringify(result, null, 2));
  return result;
};

export const getUserPaymentMethods = async (userId: string) => {
  return db.select().from(userPaymentMethods).where(eq(userPaymentMethods.userId, userId));
};

export const saveUserPaymentMethod = async (userId: string, vaultId: string, email?: string) => {
  await db.transaction(async (tx) => {
    // 1. Reset other default methods for this user
    await tx.update(userPaymentMethods)
        .set({ isDefault: false })
        .where(eq(userPaymentMethods.userId, userId));

    // 2. Check if this vaultId already exists
    const existing = await tx.select().from(userPaymentMethods).where(
        and(
            eq(userPaymentMethods.vaultId, vaultId),
            eq(userPaymentMethods.userId, userId)
        )
    );

    if (existing.length > 0) {
        // Update existing
        await tx.update(userPaymentMethods)
            .set({ 
                isDefault: true,
                email: email,
                updatedAt: new Date().toISOString()
            })
            .where(eq(userPaymentMethods.id, existing[0]!.id));
    } else {
        // Insert new
        await tx.insert(userPaymentMethods).values({
            id: randomUUID(),
            userId: userId,
            provider: 'paypal',
            vaultId: vaultId,
            email: email,
            isDefault: true
        });
    }
  });
};
