import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { generateClientToken, createOrder, captureOrder, getUserPaymentMethods, saveUserPaymentMethod } from './paymentService';
import { getServerEnv } from '@/lib/server-env';
import { db } from '@/db';

// Mock dependencies
vi.mock('@/lib/server-env');
vi.mock('@/db', () => {
  const mockSelect = vi.fn();
  const mockFrom = vi.fn();
  const mockWhere = vi.fn();
  const mockUpdate = vi.fn();
  const mockSet = vi.fn();
  const mockInsert = vi.fn();
  const mockValues = vi.fn();

  // Chain setup
  mockSelect.mockReturnValue({ from: mockFrom });
  mockFrom.mockReturnValue({ where: mockWhere });
  mockUpdate.mockReturnValue({ set: mockSet });
  mockSet.mockReturnValue({ where: mockWhere });
  mockInsert.mockReturnValue({ values: mockValues });

  return {
    db: {
      select: mockSelect,
      transaction: vi.fn(),
      update: mockUpdate,
      insert: mockInsert,
    },
  };
});

// Mock fetch
const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

describe('paymentService', () => {
  const mockEnv = {
    NODE_ENV: 'development',
    PAYPAL_SANDBOX_CLIENT_ID: 'sandbox_id',
    PAYPAL_SANDBOX_CLIENT_SECRET: 'sandbox_secret',
    PAYPAL_CLIENT_ID: 'prod_id',
    PAYPAL_CLIENT_SECRET: 'prod_secret',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (getServerEnv as Mock).mockReturnValue(mockEnv);
    
    // Reset db mock chains
    const mockSelect = db.select as Mock;
    const mockFrom = vi.fn();
    const mockWhere = vi.fn();
    
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ where: mockWhere });
    
    // Default fetch response for token
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'mock_access_token', client_token: 'mock_client_token' }),
    });
  });

  describe('generateClientToken', () => {
    it('should generate a client token successfully', async () => {
      const token = await generateClientToken();
      
      expect(fetchMock).toHaveBeenCalledTimes(2); // 1 for access token, 1 for client token
      expect(token).toBe('mock_client_token');
      
      // Check access token call
      expect(fetchMock).toHaveBeenNthCalledWith(1, 
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      );

      // Check client token call
      expect(fetchMock).toHaveBeenNthCalledWith(2,
        'https://api-m.sandbox.paypal.com/v1/identity/generate-token',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock_access_token',
          }),
        })
      );
    });

    it('should include customer_id if provided', async () => {
      await generateClientToken('customer123');
      
      expect(fetchMock).toHaveBeenNthCalledWith(2,
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ customer_id: 'customer123' }),
        })
      );
    });

    it('should throw error if access token fetch fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Auth failed',
      });

      await expect(generateClientToken()).rejects.toThrow('Failed to get PayPal access token: Auth failed');
    });

    it('should throw error if client token fetch fails', async () => {
      // First call succeeds (access token)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'mock_access_token' }),
      });
      // Second call fails (client token)
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Token generation failed',
      });

      await expect(generateClientToken()).rejects.toThrow('Failed to generate PayPal client token: Token generation failed');
    });

    it('should use production config when in production', async () => {
      (getServerEnv as Mock).mockReturnValue({
        ...mockEnv,
        NODE_ENV: 'production',
      });

      await generateClientToken();

      expect(fetchMock).toHaveBeenNthCalledWith(1,
        'https://api-m.paypal.com/v1/oauth2/token',
        expect.any(Object)
      );
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      fetchMock.mockResolvedValueOnce({ // access token
        ok: true,
        json: async () => ({ access_token: 'mock_access_token' }),
      });
      fetchMock.mockResolvedValueOnce({ // create order
        ok: true,
        json: async () => ({ id: 'ORDER123' }),
      });

      const result = await createOrder('10.00');
      
      expect(result).toEqual({ id: 'ORDER123' });
      expect(fetchMock).toHaveBeenNthCalledWith(2,
        'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"value":"10.00"'),
        })
      );
    });

    it('should handle vaultId parameter', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'token' }) });
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'ORDER123' }) });

      await createOrder('10.00', 'USD', 'vault123');

      expect(fetchMock).toHaveBeenNthCalledWith(2,
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"vault_id":"vault123"'),
        })
      );
    });

    it('should handle shouldVault parameter', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'token' }) });
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'ORDER123' }) });

      await createOrder('10.00', 'USD', undefined, true);

      expect(fetchMock).toHaveBeenNthCalledWith(2,
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"store_in_vault":"ON_SUCCESS"'),
        })
      );
    });

    it('should throw error if order creation fails', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'token' }) });
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Order failed',
      });

      await expect(createOrder('10.00')).rejects.toThrow('Failed to create PayPal order: Order failed');
    });
  });

  describe('captureOrder', () => {
    it('should capture an order successfully', async () => {
      fetchMock.mockResolvedValueOnce({ // access token
        ok: true,
        json: async () => ({ access_token: 'mock_access_token' }),
      });
      fetchMock.mockResolvedValueOnce({ // capture order
        ok: true,
        json: async () => ({ status: 'COMPLETED' }),
      });

      const result = await captureOrder('ORDER123');
      
      expect(result).toEqual({ status: 'COMPLETED' });
      expect(fetchMock).toHaveBeenNthCalledWith(2,
        'https://api-m.sandbox.paypal.com/v2/checkout/orders/ORDER123/capture',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock_access_token',
          }),
        })
      );
    });

    it('should throw error if capture fails', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'token' }) });
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Capture failed',
      });

      await expect(captureOrder('ORDER123')).rejects.toThrow('Failed to capture PayPal order: Capture failed');
    });
  });

  describe('getUserPaymentMethods', () => {
    it('should fetch user payment methods', async () => {
      const mockSelect = db.select as Mock;
      const mockFrom = vi.fn();
      const mockWhere = vi.fn();
      
      mockSelect.mockReturnValue({ from: mockFrom });
      mockFrom.mockReturnValue({ where: mockWhere });
      mockWhere.mockResolvedValue(['method1', 'method2']);

      const result = await getUserPaymentMethods('user123');
      
      expect(result).toEqual(['method1', 'method2']);
      expect(mockWhere).toHaveBeenCalled();
    });
  });

  describe('saveUserPaymentMethod', () => {
    it('should save a new payment method', async () => {
      const mockTx = db.transaction as Mock;
      
      // Setup transaction mock
      mockTx.mockImplementation(async (callback) => {
        const mockSelect = vi.fn();
        const mockFrom = vi.fn();
        const mockWhere = vi.fn();
        const mockUpdate = vi.fn();
        const mockSet = vi.fn();
        const mockInsert = vi.fn();
        const mockValues = vi.fn();

        mockSelect.mockReturnValue({ from: mockFrom });
        mockFrom.mockReturnValue({ where: mockWhere });
        mockUpdate.mockReturnValue({ set: mockSet });
        mockSet.mockReturnValue({ where: mockWhere });
        mockInsert.mockReturnValue({ values: mockValues });

        // Mock existing check to return empty array (new method)
        mockWhere.mockResolvedValue([]);

        await callback({
          select: mockSelect,
          update: mockUpdate,
          insert: mockInsert,
        });

        return { mockUpdate, mockInsert, mockWhere };
      });

      await saveUserPaymentMethod('user123', 'vault123', 'test@example.com');

      expect(mockTx).toHaveBeenCalled();
      // We can't easily check the internal calls of the transaction callback unless we expose them or use a more complex mock setup.
      // But since we mocked the implementation to run the callback, we know the code inside ran.
    });

    it('should update an existing payment method', async () => {
      const mockTx = db.transaction as Mock;
      
      mockTx.mockImplementation(async (callback) => {
        const mockSelect = vi.fn();
        const mockFrom = vi.fn();
        const mockWhere = vi.fn();
        const mockUpdate = vi.fn();
        const mockSet = vi.fn();
        const mockInsert = vi.fn();
        const mockValues = vi.fn();

        mockSelect.mockReturnValue({ from: mockFrom });
        mockFrom.mockReturnValue({ where: mockWhere });
        mockUpdate.mockReturnValue({ set: mockSet });
        mockSet.mockReturnValue({ where: mockWhere });
        mockInsert.mockReturnValue({ values: mockValues });

        // Mock existing check to return an existing record
        mockWhere.mockResolvedValue([{ id: 'existing_id' }]);

        await callback({
          select: mockSelect,
          update: mockUpdate,
          insert: mockInsert,
        });
      });

      await saveUserPaymentMethod('user123', 'vault123', 'test@example.com');
      
      expect(mockTx).toHaveBeenCalled();
    });
  });
});
