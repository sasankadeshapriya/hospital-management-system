// src/services/InventoryService.ts
export interface InventoryItem {
    InventoryItemID: number;
    MedicineName: string;
    Quantity: number;
    ExpiryDate: string;
    Cost: number;
  }
  
  class InventoryService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/inventory`;
  
    async fetchInventoryItems(): Promise<InventoryItem[]> {
      try {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }
    }
  
    async fetchInventoryItemById(itemId: number): Promise<InventoryItem> {
      try {
        const response = await fetch(`${this.baseUrl}/${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch inventory item details');
        }
        const data = await response.json();
        if (Array.isArray(data) && data[0].length > 0) {
          return data[0][0];
        }
        throw new Error('Inventory item not found');
      } catch (error) {
        console.error('Error fetching inventory item by ID:', error);
        throw error;
      }
    }
  
    async addInventoryItem(itemData: Omit<InventoryItem, 'InventoryItemID'>): Promise<void> {
      const response = await fetch(`${this.baseUrl}/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add inventory item');
      }
    }
  
    async updateInventoryItem(itemId: number, itemData: Omit<InventoryItem, 'InventoryItemID'>): Promise<void> {
      const response = await fetch(`${this.baseUrl}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update inventory item');
      }
    }

    // Delete an inventory item by ID
    async deleteInventoryItem(itemId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${itemId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete inventory item');
        }
    }
  }
  
  export default new InventoryService();
  