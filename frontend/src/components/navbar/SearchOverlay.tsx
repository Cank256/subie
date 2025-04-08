
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X as XIcon } from 'lucide-react';
import { mockSubscriptions } from '@/utils/mockData';
import { Subscription } from '@/types/subscription';

interface SearchOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isActive, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Subscription[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && searchInputRef.current) {
      // Focus the input when search is activated
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isActive]);

  useEffect(() => {
    // Reset search when closed
    if (!isActive) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isActive]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Search through the mock subscriptions - in a real app, you would call an API
    const results = mockSubscriptions.filter(sub => 
      sub.name.toLowerCase().includes(query.toLowerCase()) ||
      (sub.description && sub.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  if (!isActive) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-4 z-20">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {searchQuery.trim() !== '' && (
          <div className="max-h-[60vh] overflow-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((sub) => (
                  <Link 
                    key={sub.id} 
                    to={`/subscriptions?id=${sub.id}`}
                    className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                    onClick={onClose}
                  >
                    <div 
                      className="h-10 w-10 rounded flex items-center justify-center mr-3"
                      style={{ backgroundColor: sub.color || '#e2e8f0' }}
                    >
                      {sub.logo ? (
                        <img src={sub.logo} alt={sub.name} className="h-6 w-6" />
                      ) : (
                        <span className="text-white font-medium">{sub.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sub.currency}{sub.amount.toFixed(2)}/{sub.billingCycle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No results found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
