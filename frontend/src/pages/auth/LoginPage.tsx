import React, { useState } from 'react';
import BackgroundImg from '../../assets/images/AuthBackground.png';
import LogoColored from '../../assets/images/logo.png';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const InputField = ({
    id,
    type,
    label,
    value,
    onChange,
    placeholder,
  }: {
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        placeholder={placeholder}
        required
      />
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      <div className="bg-white/80 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <img src={LogoColored} alt="Serenity Hospitals Logo" className="h-10 w-26 rounded-xl" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-12">Log in to access your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <button className="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
