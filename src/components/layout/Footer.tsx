import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-4">
              GoBuyly
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">FB</a>
              <a href="#" className="text-gray-400 hover:text-white">TW</a>
              <a href="#" className="text-gray-400 hover:text-white">IG</a>
              <a href="#" className="text-gray-400 hover:text-white">IN</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Kitchenware</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Bar Supplies</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Tableware</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-l-lg text-gray-900" />
              <button className="bg-emerald-500 px-4 py-2 rounded-r-lg hover:bg-emerald-600">
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>© 2025 GoBuyly. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="#" className="hover:text-white">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}