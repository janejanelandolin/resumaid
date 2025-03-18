
import React from 'react';
import { API_BASE_URL } from '../../services/api/utils';

const ApiEndpointInfo: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
      <h3 className="font-semibold text-amber-800">API URLs</h3>
      <p className="text-sm text-amber-700 mt-1">Base URL: {API_BASE_URL}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="text-xs text-amber-700">
          <p>• POST /job_posting</p>
          <p>• POST /upload</p>
        </div>
        <div className="text-xs text-amber-700">
          <p>• POST /atsfeedback</p>
          <p>• POST /feedback</p>
        </div>
      </div>
    </div>
  );
};

export default ApiEndpointInfo;
