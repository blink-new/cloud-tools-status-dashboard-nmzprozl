import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { SERVICE_CATEGORIES, ServiceCategory } from '../types/status';
import { Service } from '../types/status';

interface CategoryFilterProps {
  selectedCategory: ServiceCategory;
  onCategoryChange: (category: ServiceCategory) => void;
  services: Service[];
}

export function CategoryFilter({ selectedCategory, onCategoryChange, services }: CategoryFilterProps) {
  const getCategoryCount = (category: ServiceCategory) => {
    if (category === 'All') return services.length;
    return services.filter(service => service.category === category).length;
  };

  const getCategoryStatusCount = (category: ServiceCategory, status: Service['status']) => {
    const categoryServices = category === 'All' 
      ? services 
      : services.filter(service => service.category === category);
    return categoryServices.filter(service => service.status === status).length;
  };

  return (
    <div className="w-full">
      <Tabs value={selectedCategory} onValueChange={(value) => onCategoryChange(value as ServiceCategory)}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 xl:grid-cols-13 gap-1 h-auto p-1">
          {SERVICE_CATEGORIES.map((category) => {
            const count = getCategoryCount(category);
            const outageCount = getCategoryStatusCount(category, 'outage');
            const degradedCount = getCategoryStatusCount(category, 'degraded');
            
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex flex-col items-center gap-1 p-2 h-auto text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="font-medium">{category}</span>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {count}
                  </Badge>
                  {outageCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-1 py-0">
                      {outageCount}
                    </Badge>
                  )}
                  {degradedCount > 0 && outageCount === 0 && (
                    <Badge className="bg-yellow-500 text-white text-xs px-1 py-0">
                      {degradedCount}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}