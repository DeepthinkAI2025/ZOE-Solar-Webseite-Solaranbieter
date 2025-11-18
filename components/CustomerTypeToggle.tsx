import React from 'react';

interface CustomerTypeToggleProps {
  customerType: 'private' | 'business';
  setCustomerType: (type: 'private' | 'business') => void;
}

const CustomerTypeToggle: React.FC<CustomerTypeToggleProps> = ({ customerType, setCustomerType }) => {
  return (
    <div className="fixed right-6 top-20 z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 flex shadow-2xl">
        <button
          onClick={() => setCustomerType('business')}
          className={`px-4 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            customerType === 'business'
              ? 'bg-green-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Gewerbe"
        >
          <span className="whitespace-nowrap">
            Gewerbe
          </span>
        </button>
        <button
          onClick={() => setCustomerType('private')}
          className={`px-4 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            customerType === 'private'
              ? 'bg-green-500 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Privat"
        >
          <span className="whitespace-nowrap">
            Privat
          </span>
        </button>
      </div>
    </div>
  );
};

export default CustomerTypeToggle;