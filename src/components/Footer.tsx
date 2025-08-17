import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 mb-4">&copy; 2025 Mhargick Fashion. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <Link href="/about" className="text-gray-400 hover:text-pink-500 no-underline">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-pink-500 no-underline">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-pink-500 no-underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}