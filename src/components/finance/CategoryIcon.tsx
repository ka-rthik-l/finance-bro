import {
  Wallet,
  Laptop,
  TrendingUp,
  Gift,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Circle,
  Home,
  Plane,
  Phone,
  Wifi,
  Zap,
  Droplet,
  CreditCard,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Wallet,
  Laptop,
  TrendingUp,
  Gift,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Circle,
  Home,
  Plane,
  Phone,
  Wifi,
  Zap,
  Droplet,
  CreditCard,
};

interface CategoryIconProps {
  name: string;
  color: string;
  size?: number;
}

export const CategoryIcon = ({ name, color, size = 20 }: CategoryIconProps) => {
  const Icon = iconMap[name] || Circle;
  return <Icon className="flex-shrink-0" style={{ color, width: size, height: size }} />;
};
