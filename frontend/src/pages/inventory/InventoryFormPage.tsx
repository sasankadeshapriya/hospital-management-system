import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput } from '../../components/FormComponents';
import InventoryService from '../../services/InventoryService';
import { ToastContext } from '../../context/ToastContext';

interface InventoryFormProps {
  initialData?: {
    name: string;
    quantity: number;
    expiryDate: string;
    cost: number;
  };
}

export function InventoryFormPage({ initialData }: InventoryFormProps) {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>(); // Get itemId from route
  const { success, error } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    quantity: initialData?.quantity || '',
    expiryDate: initialData?.expiryDate || '',
    cost: initialData?.cost || '',
  });
  const [initialFormData, setInitialFormData] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInventoryData = async () => {
      if (itemId) {
        try {
          const item = await InventoryService.fetchInventoryItemById(Number(itemId));
          if (item) {
            const newFormData = {
              name: item.MedicineName,
              quantity: String(item.Quantity), // Convert to string
              expiryDate: new Date(item.ExpiryDate).toISOString().split('T')[0],
              cost: String(item.Cost), // Convert to string
            };
            setFormData(newFormData);
            setInitialFormData(newFormData); // Set initial data for change detection
          }
        } catch (err) {
          error('Failed to load inventory item details.');
          console.error(err);
        }
      }
    };
    loadInventoryData();
  }, [itemId, error]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if data hasn't changed
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      error('No changes detected');
      return;
    }

    setIsSubmitting(true);

    try {
      if (itemId) {
        // Update existing item
        await InventoryService.updateInventoryItem(Number(itemId), {
          MedicineName: formData.name,
          Quantity: Number(formData.quantity),
          ExpiryDate: formData.expiryDate,
          Cost: parseFloat(formData.cost as string),
        });
        success('Medicine updated successfully!');
      } else {
        // Add new item
        await InventoryService.addInventoryItem({
          MedicineName: formData.name,
          Quantity: Number(formData.quantity),
          ExpiryDate: formData.expiryDate,
          Cost: parseFloat(formData.cost as string),
        });
        success('Medicine added successfully!');
        setFormData({
          name: '',
          quantity: '',
          expiryDate: '',
          cost: '',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('Failed to submit medicine data. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/inventory')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">
          {itemId ? 'Update Medicine' : 'Add New Medicine'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Medicine Name"
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter medicine name"
          />

          <TextInput
            label="Quantity"
            id="quantity"
            type="number"
            required
            value={String(formData.quantity)} // Convert to string for input field
            onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
            placeholder="Enter quantity"
          />

          <TextInput
            label="Expiry Date"
            id="expiryDate"
            type="date"
            required
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
          />

          <TextInput
            label="Cost (LKR)"
            id="cost"
            type="number"
            step="0.01"
            required
            value={String(formData.cost)} // Convert to string for input field
            onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
            placeholder="Enter cost"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
            >
              {isSubmitting ? (itemId ? 'Updating...' : 'Submitting...') : (itemId ? 'Update Medicine' : 'Add Medicine')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryFormPage;
