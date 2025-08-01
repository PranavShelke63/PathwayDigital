import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-contrast">Terms and Conditions</h1>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <Link
              to="/"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to our e-commerce platform. These Terms and Conditions govern your use of our website and services. 
              By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of these terms, 
              please do not use our service.
            </p>
            <p className="text-gray-700">
              Our platform provides computer hardware and technology solutions, including sales, repairs, and technical support services.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">2. Definitions</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>"Service"</strong> refers to our website and all related services.</p>
              <p><strong>"User," "you," and "your"</strong> refers to you as the user of the Service.</p>
              <p><strong>"Company," "we," "us," and "our"</strong> refers to our company.</p>
              <p><strong>"Content"</strong> refers to text, images, or other information that can be posted, uploaded, linked to, or otherwise made available by users.</p>
            </div>
          </section>

          {/* Account Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">3. Account Registration</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                To access certain features of our Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing accurate, current, and complete information during registration</li>
                <li>Maintaining and updating your account information</li>
                <li>Protecting your account credentials and password</li>
                <li>Accepting responsibility for all activities under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </div>
          </section>

          {/* Products and Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">4. Products and Services</h2>
            <div className="space-y-4 text-gray-700">
              <p>We offer the following products and services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Computer hardware and components</li>
                <li>Technology accessories and peripherals</li>
                <li>Computer repair and maintenance services</li>
                <li>Technical support and consultation</li>
                <li>Custom computer builds and configurations</li>
              </ul>
              <p>
                All products are subject to availability. We reserve the right to discontinue any product at any time without notice.
              </p>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">5. Pricing and Payment</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                All prices are listed in the local currency and are subject to change without notice. Payment is required at the time of order placement.
              </p>
              <p>We accept the following payment methods:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credit and debit cards</li>
                <li>Digital wallets</li>
                <li>Bank transfers (for certain orders)</li>
                <li>Cash on delivery (where available)</li>
              </ul>
              <p>
                All transactions are processed securely. We do not store your payment information on our servers.
              </p>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">6. Shipping and Delivery</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We strive to process and ship orders promptly. Delivery times may vary based on:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product availability</li>
                <li>Shipping destination</li>
                <li>Selected shipping method</li>
                <li>Customs processing (for international orders)</li>
              </ul>
              <p>
                Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
              </p>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">7. Returns and Refunds</h2>
            <div className="space-y-4 text-gray-700">
              <p>Our return policy includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>30-day return window for most products</li>
                <li>Products must be in original condition and packaging</li>
                <li>Return shipping costs may apply</li>
                <li>Refunds processed within 5-10 business days</li>
                <li>Some products may have different return policies</li>
              </ul>
              <p>
                Contact our customer service team to initiate a return. We reserve the right to refuse returns that do not meet our policy requirements.
              </p>
            </div>
          </section>

          {/* Warranty and Support */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">8. Warranty and Support</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Products come with manufacturer warranties as applicable. Our repair services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>90-day warranty on repair work</li>
                <li>Diagnostic services</li>
                <li>Hardware and software troubleshooting</li>
                <li>Data recovery services (where possible)</li>
                <li>Preventive maintenance</li>
              </ul>
              <p>
                Warranty coverage may vary by product and manufacturer. Please review individual product warranty information.
              </p>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">9. Privacy and Data Protection</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We are committed to protecting your privacy. Our data collection and usage practices are outlined in our Privacy Policy.
              </p>
              <p>We collect and process data for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order processing and fulfillment</li>
                <li>Customer service and support</li>
                <li>Website improvement and analytics</li>
                <li>Marketing communications (with consent)</li>
                <li>Legal compliance</li>
              </ul>
              <p>
                You have the right to access, correct, or delete your personal data. Contact us for data-related requests.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">10. Intellectual Property</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Service and its original content, features, and functionality are owned by us and are protected by international copyright, 
                trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, 
                download, store, or transmit any of the material on our website without our prior written consent.
              </p>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">11. Prohibited Uses</h2>
            <div className="space-y-4 text-gray-700">
              <p>You may not use our Service for any unlawful purpose or to solicit others to perform unlawful acts. Prohibited uses include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing on intellectual property rights</li>
                <li>Harassing, abusing, or harming others</li>
                <li>Transmitting viruses or malicious code</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with the Service's functionality</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">12. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or other harmful code that may be transmitted</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">13. Disclaimers</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The information on this website is provided on an "as is" basis. We make no warranties, expressed or implied, 
                and hereby disclaim all warranties, including without limitation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness of information</li>
                <li>Uninterrupted or error-free service</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">14. Governing Law</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is registered, 
                without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration 
                or in the courts of our jurisdiction.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">15. Changes to Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                Your continued use of the Service after any changes constitutes acceptance of the new Terms. 
                If you do not agree to the new terms, please stop using the Service.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-contrast mb-4">16. Contact Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> legal@company.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Tech Street, City, State 12345</p>
                <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-8 mt-12">
            <p className="text-sm text-gray-500 text-center">
              These Terms and Conditions are effective as of {new Date().toLocaleDateString()}. 
              Please review them periodically for any updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 