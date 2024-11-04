import React from 'react';

// TextInput Component
interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  max?: string;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, max, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      max={max} // Now we can use max because it's destructured from props
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...props} // Spread the rest of the props here
    />
  </div>
);

// SelectInput Component
interface SelectInputProps {
  label: string;
  id: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      id={id}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// TextArea Component
interface TextAreaProps {
  label: string;
  id: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      id={id}
      rows={3}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...props}
    />
  </div>
);

// FileInput Component
interface FileInputProps {
  label: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photo?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ label, id, onChange, photo }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    {photo && <img src={photo} alt="Profile Preview" className="mt-4 w-32 h-32 rounded-full" />}
  </div>
);
