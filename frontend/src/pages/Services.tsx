import React from 'react';
import { FaLaptop, FaSyncAlt, FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    {
      label: 'Shop',
      icon: <FaLaptop className="w-10 h-10 text-primary" />, // Online Shopping
      title: 'Online Shopping',
      description: 'Shop laptops, mouse, and computer peripherals online with fast delivery and great prices.',
    },
    {
      label: 'Refurbish',
      icon: <FaSyncAlt className="w-10 h-10 text-primary" />,
      title: 'Refurbished Devices',
      description: 'Contact us to buy high-quality refurbished laptops and devices.',
    },
    {
      label: 'Repair',
      icon: <FaTools className="w-10 h-10 text-primary" />,
      title: 'Device Repair',
      description: 'Contact us for expert repair services for laptops, computers, and accessories.',
    },
  ];

  return (
    <div className="bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-contrast mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 mb-12">
            We fulfill online shopping for tech products. For refurbished devices and repairs, please contact us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-md bg-white border border-gray-200 flex flex-col items-center transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary cursor-pointer"
            >
              <span className="uppercase text-xs font-bold text-primary mb-2 tracking-widest">{service.label}</span>
              <div className="mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-contrast text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center mb-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center mb-4">
          <span className="text-base font-medium text-contrast">Need help, want to buy, or have a question?</span>
          <span className="text-sm text-gray-600">Contact us for any service, product inquiry, or support—we're here to assist you!</span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/contact?scroll=message')}
            className="btn-primary px-8 py-3 text-lg font-semibold rounded shadow transition-colors duration-200 hover:bg-accent"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services; 