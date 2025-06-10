import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Tech enthusiast with 15+ years of experience in hardware retail.'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Former software engineer turned hardware specialist.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Expert in supply chain management and customer service.'
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary-dark">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in">
            About Us
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl animate-fade-in-delay">
            PATHWAY DIGITAL is your trusted partner in tech hardware. We're committed to providing high-quality products
            and exceptional service to our customers.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center p-8 rounded-2xl shadow-lg bg-gradient-to-b from-white to-gray-50">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-contrast sm:text-4xl">
              Empowering Your Digital Journey
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe in providing our customers with the best tech hardware solutions that enhance their digital
              experience. Our commitment to quality and service sets us apart.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-contrast">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 text-center">
              The passionate individuals behind PATHWAY DIGITAL.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-lg p-8 text-center transform transition-transform duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <img
                    className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56 border-4 border-primary/10"
                    src={member.image}
                    alt={member.name}
                  />
                  <div className="space-y-2">
                    <div className="text-lg leading-6 font-medium space-y-1">
                      <h3 className="text-contrast">{member.name}</h3>
                      <p className="text-primary font-semibold">{member.role}</p>
                    </div>
                    <div className="text-gray-600">{member.bio}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Browse our products today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-accent">
            Discover our wide range of tech hardware and accessories.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 