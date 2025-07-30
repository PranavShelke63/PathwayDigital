import React from 'react';
import { FaLaptop, FaSyncAlt, FaTools, FaCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const mainServices = [
    {
      label: 'Shop',
      icon: <FaLaptop className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />, // Online Shopping
      title: 'Online Shopping',
      description: 'Shop laptops, mouse, and computer peripherals online with fast delivery and great prices.',
    },
    {
      label: 'Refurbish',
      icon: <FaSyncAlt className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />,
      title: 'Refurbished Devices',
      description: 'Contact us to buy high-quality refurbished laptops and devices.',
    },
    {
      label: 'Repair',
      icon: <FaTools className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />,
      title: 'Device Repair',
      description: 'Contact us for expert repair services for laptops, computers, and accessories.',
    },
  ];

  const specialService = {
    label: 'Develop',
    icon: <FaCode className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: 'App & Website Development',
    description: 'Need a custom app or website? Contact us for professional development services tailored to your needs.',
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-contrast mb-4">Our Services</h1>
          <p className="text-base sm:text-lg text-gray-600">
            We fulfill online shopping for tech products. For refurbished devices, repairs, and development services, please contact us directly.
          </p>
        </div>

        {/* Main Services - 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {mainServices.map((service, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 rounded-lg shadow-sm sm:shadow-md bg-white border border-gray-200 flex flex-col items-center transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary cursor-pointer"
            >
              <span className="uppercase text-xs font-bold text-primary mb-2 tracking-widest">{service.label}</span>
              <div className="mb-3 sm:mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-contrast text-center">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Special Service - Small rectangle box */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="w-full max-w-md sm:max-w-lg">
            <div className="p-4 sm:p-6 rounded-lg shadow-sm sm:shadow-md bg-white border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 flex items-center space-x-3 sm:space-x-4 transition-transform transition-shadow duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary cursor-pointer">
              <div className="flex-shrink-0">
                {specialService.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="uppercase text-xs font-bold text-primary tracking-widest">{specialService.label}</span>
                <h3 className="text-base sm:text-lg font-semibold text-contrast mt-1 line-clamp-1">
                  {specialService.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                  {specialService.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block px-2 sm:px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                  Special
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <span className="text-sm sm:text-base font-medium text-contrast text-center">Need help, want to buy, or have a question?</span>
          <span className="text-xs sm:text-sm text-gray-600 text-center mt-1">Contact us for any service, product inquiry, or support—we're here to assist you!</span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/contact?scroll=message')}
            className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold rounded-lg shadow transition-colors duration-200 hover:bg-accent"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services; 