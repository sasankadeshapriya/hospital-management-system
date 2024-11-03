import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput, SelectInput } from '../../components/FormComponents';

interface Medicine {
  name: string;
  quantity: number;
  expiryDate: string;
  cost: number;
  status: string;
}

interface InventoryFormProps {
  initialData?: Medicine;
}

export function InventoryFormPage({ initialData }: InventoryFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    quantity: initialData?.quantity || '',
    expiryDate: initialData?.expiryDate || '',
    cost: initialData?.cost || '',
    status: initialData?.status || '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    navigate('/inventory'); // Redirect to inventory page after submission
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
          {initialData ? 'Update Medicine' : 'Add New Medicine'}
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
            value={String(formData.quantity)}
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
            label="Cost ($)"
            id="cost"
            type="number"
            step="0.01"
            required
            value={String(formData.cost)}
            onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
            placeholder="Enter cost"
          />

          <SelectInput
            label="Stock Status"
            id="status"
            required
            value={formData.status}
            options={['In Stock', 'Low Stock', 'Out of Stock']}
            onChange={(e) => handleInputChange('status', e.target.value)}
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {initialData ? 'Update Medicine' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
