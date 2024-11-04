import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  onPageSizeChange?: (size: number) => void;
  selectedItems?: T[];
  onSelectItem?: (item: T) => void;
  onSelectAll?: (items: T[]) => void;
}

export function Table<T extends { id: number | string }>({
  data,
  columns,
  pageSize = 10,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  onPageSizeChange,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
}: TableProps<T>) {
  // Check if all items are selected
  const allItemsSelected = selectedItems && data.length > 0 && data.every(item => selectedItems.includes(item));

  // Handler for toggling selection of all items
  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(allItemsSelected ? [] : data);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-[65vh]">
      <div className="overflow-y-auto flex-grow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {onSelectItem && (
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={allItemsSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                      title="Select all items"
                    />
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-center text-sm font-semibold text-gray-700 ${column.className || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-violet-50'}`}
                >
                  {onSelectItem && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => onSelectItem(item)}
                        className="rounded border-gray-300"
                        title="Select item"
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t sticky bottom-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            title="Page Size"
          >
            <option value={10}>10 records</option>
            <option value={25}>25 records</option>
            <option value={50}>50 records</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
