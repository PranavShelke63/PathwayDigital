import React from 'react';
import { FaCode, FaMobile, FaDesktop, FaCloud, FaLock, FaChartLine } from 'react-icons/fa';

const Services: React.FC = () => {
  const services = [
    {
      icon: <FaCode className="w-8 h-8" />,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and frameworks.',
    },
    {
      icon: <FaMobile className="w-8 h-8" />,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
    },
    {
      icon: <FaDesktop className="w-8 h-8" />,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces with exceptional user experience.',
    },
    {
      icon: <FaCloud className="w-8 h-8" />,
      title: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure and deployment solutions.',
    },
    {
      icon: <FaLock className="w-8 h-8" />,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your digital assets.',
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: 'Digital Marketing',
      description: 'Strategic digital marketing services to grow your online presence.',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-contrast mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 mb-12">
            We offer a comprehensive range of digital solutions to help your business grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-primary mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-contrast mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-contrast mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today to discuss how we can help with your next project
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="btn-primary"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services; 