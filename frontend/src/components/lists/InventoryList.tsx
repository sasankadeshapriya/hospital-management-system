import React, { useState, useEffect, useContext } from 'react';
import { Table } from '../Table';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InventoryService, { InventoryItem } from '../../services/InventoryService';
import ConfirmationModal from '../modal/ConfirmationModal';
import { ToastContext } from '../../context/ToastContext';

interface InventoryListProps {
  searchQuery: string;
}

const InventoryList: React.FC<InventoryListProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [inventoryItems, setInventoryItems] = useState<(InventoryItem & { id: number })[]>([]);
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await InventoryService.fetchInventoryItems();
        setInventoryItems(data.map((item) => ({ ...item, id: item.InventoryItemID })));
      } catch (error) {
        console.error('Error loading inventory items:', error);
      }
    };
    loadInventory();
  }, []);

  const visibleItems = inventoryItems.filter(
    (item) => !hiddenItems.includes(item.InventoryItemID)
  );

  const filteredItems = visibleItems.filter(({ MedicineName }) =>
    MedicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / recordsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateItem = (itemId: number) => {
    navigate(`/inventory/edit/${itemId}`);
  };

  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await InventoryService.deleteInventoryItem(itemToDelete);
        setHiddenItems((prevHidden) => [...prevHidden, itemToDelete]);
        success('Item deleted successfully');  // Show success toast
      } catch (err) {
        if (err instanceof Error) {
          error(err.message);  // Use the specific error message
        } else {
          error('Failed to delete item');  // Fallback error message
        }
        console.error('Error deleting item:', err);
      } finally {
        setShowModal(false);
        setItemToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const renderStatusBadge = (quantity: number) => {
    const status = quantity > 100 ? 'In Stock' : quantity > 0 ? 'Low Stock' : 'Out of Stock';
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
            header: 'Medicine Name',
            accessor: (item) => (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{item.MedicineName}</span>
                {new Date(item.ExpiryDate) <= new Date() && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ),
          },
          { header: 'Quantity', accessor: 'Quantity' },
          {
            header: 'Expiry Date',
            accessor: (item: InventoryItem) => (
              <span className="text-gray-500">
                {new Date(item.ExpiryDate).toLocaleDateString()}
              </span>
            ),
          },
          {
            header: 'Cost',
            accessor: (item: InventoryItem) => (
              <span className="text-gray-500">LKR {item.Cost.toFixed(2)}</span>
            ),
          },
          {
            header: 'Status',
            accessor: (item: InventoryItem) => renderStatusBadge(item.Quantity),
          },
          {
            header: 'Actions',
            accessor: (item) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateItem(item.InventoryItemID)}
                  className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(item.InventoryItemID)}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        pageSize={recordsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={setRecordsPerPage}
      />

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default InventoryList;
