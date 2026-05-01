// Analysis is now merged into ResultsPage.
// This redirect exists for any bookmarked or in-flight links.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AnalysisPage = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/results', { replace: true }); }, [navigate]);
  return null;
};

export default AnalysisPage;
