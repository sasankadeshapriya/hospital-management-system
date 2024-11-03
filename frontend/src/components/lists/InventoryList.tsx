import { useState } from 'react';
import { Table } from '../Table';
import { AlertCircle } from 'lucide-react';

interface Medicine {
  id: number;
  name: string;
  quantity: number;
  expiryDate: string;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface InventoryListProps {
  onItemSelect: (itemId: number) => void;
  selectedItems: number[];
  searchQuery: string;
}

const medicines: Medicine[] = [
  {
    id: 1,
    name: 'Aspirin',
    quantity: 150,
    expiryDate: '2025-05-12',
    cost: 10.99,
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'Paracetamol',
    quantity: 50,
    expiryDate: '2023-12-10',
    cost: 5.5,
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Ibuprofen',
    quantity: 0,
    expiryDate: '2024-04-15',
    cost: 7.25,
    status: 'Out of Stock',
  },
];

const InventoryList: React.FC<InventoryListProps> = ({ onItemSelect, selectedItems, searchQuery }) => {
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = medicines.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / recordsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderStatusBadge = (status: Medicine['status']) => {
    const statusClasses = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Out of Stock': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedItems}
        columns={[
          {
            header: '',
            accessor: (medicine) => (
              <input
                type="checkbox"
                checked={selectedItems.includes(medicine.id)}
                onChange={() => onItemSelect(medicine.id)}
                className="rounded border-gray-300"
                title="Select"
              />
            ),
          },
          {
            header: 'Medicine Name',
            accessor: (medicine: Medicine) => (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{medicine.name}</span>
                {new Date(medicine.expiryDate) <= new Date() && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ),
          },
          { header: 'Quantity', accessor: 'quantity' },
          {
            header: 'Expiry Date',
            accessor: (medicine: Medicine) => (
              <span className="text-gray-500">
                {new Date(medicine.expiryDate).toLocaleDateString()}
              </span>
            ),
          },
          {
            header: 'Cost',
            accessor: (medicine: Medicine) => (
              <span className="text-gray-500">${medicine.cost.toFixed(2)}</span>
            ),
          },
          {
            header: 'Status',
            accessor: (medicine: Medicine) => renderStatusBadge(medicine.status),
          },
        ]}
        pageSize={recordsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={setRecordsPerPage}
      />
    </div>
  );
};

export default InventoryList;
