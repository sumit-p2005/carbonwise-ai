import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      
      <Card hoverEffect={false} className="max-w-md border border-slate-100 dark:border-slate-800 text-center py-12 flex flex-col items-center gap-6">
        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full">
          <ShieldAlert size={36} />
        </div>
        
        <div>
          <h1 className="text-4xl font-extrabold font-outfit text-slate-900 dark:text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            The page you are looking for does not exist or has been moved to a different green resource path.
          </p>
        </div>

        <Link to="/" className="w-full">
          <Button variant="outline" className="w-full" icon={Home}>
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
