
import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full border-t mt-auto py-2">
      <div className="container flex justify-between items-center">
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} ResumAID
        </div>
        <div>
          <Link 
            to="/admin" 
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
