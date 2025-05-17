import { FaShoppingCart } from 'react-icons/fa';

const Logo = () => {
  return (
    <div className="font-bold text-2xl lg:text-3xl text-green-600 flex items-center gap-2 cursor-pointer hover:opacity-70 transition">
      <FaShoppingCart className="text-emerald-500" />
      <span>Grocify</span>
    </div>
  );
};

export default Logo