
import { getCategoryInfo } from '@/utils/mockData';
import { 
  Music, 
  Lightbulb, 
  Cloud, 
  Play, 
  ShoppingBag, 
  Briefcase, 
  Hash 
} from 'lucide-react';
import { SubscriptionCategory } from '@/types/subscription';

interface CategoryBadgeProps {
  category: SubscriptionCategory;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  const categoryInfo = getCategoryInfo(category);
  
  // Map category icons
  const getIcon = () => {
    switch (categoryInfo.icon) {
      case 'Music': return <Music className="w-3 h-3" />;
      case 'Lightbulb': return <Lightbulb className="w-3 h-3" />;
      case 'Cloud': return <Cloud className="w-3 h-3" />;
      case 'Play': return <Play className="w-3 h-3" />;
      case 'ShoppingBag': return <ShoppingBag className="w-3 h-3" />;
      case 'Briefcase': return <Briefcase className="w-3 h-3" />;
      default: return <Hash className="w-3 h-3" />;
    }
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ 
        backgroundColor: `${categoryInfo.color}20`, // 20% opacity
        color: categoryInfo.color 
      }}
    >
      <span className="mr-1">{getIcon()}</span>
      {categoryInfo.label}
    </span>
  );
};

export default CategoryBadge;
