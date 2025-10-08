import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SessionLogData {
  id: string;
  user_id?: string;
  date: string;
  time: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ip_address: string;
  unoptimized_score: number;
  unoptimized_qualification: string;
  optimized_score: number;
  optimized_qualification: string;
  recommendation?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

const SessionLogsSection = () => {
  const [sessionLogs, setSessionLogs] = useState<SessionLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  
  // Fetch logs from database (join with encrypted PII table)
  const fetchLogs = async (pageNumber: number = 0, append: boolean = false) => {
    try {
      if (pageNumber === 0) setLoading(true);
      else setLoadingMore(true);

      const { data, error } = await supabase
        .from('session_logs')
        .select(`
          *,
          session_user_data:user_data_id (
            name,
            email,
            phone,
            location,
            ip_address
          )
        `)
        .order('created_at', { ascending: false })
        .range(pageNumber * PAGE_SIZE, (pageNumber + 1) * PAGE_SIZE - 1);

      if (error) {
        console.error('Failed to fetch session logs:', error);
        return;
      }

      if (data) {
        // Flatten the joined data for easier consumption
        const flattenedData = data.map(log => ({
          ...log,
          name: log.session_user_data?.name || 'N/A',
          email: log.session_user_data?.email || 'N/A',
          phone: log.session_user_data?.phone || 'N/A',
          location: log.session_user_data?.location || 'N/A',
          ip_address: log.session_user_data?.ip_address || 'N/A',
        }));
        
        if (append) {
          setSessionLogs(prev => [...prev, ...flattenedData]);
        } else {
          setSessionLogs(flattenedData);
        }
        
        // Check if there are more logs
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error('Failed to fetch session logs:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial logs
  useEffect(() => {
    fetchLogs(0);
  }, []);

  // Load more logs
  const loadMoreLogs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage, true);
  };

  // Download all logs (join with encrypted PII table)
  const downloadLogs = async () => {
    try {
      // Fetch all logs for download with encrypted PII
      const { data: allLogs, error } = await supabase
        .from('session_logs')
        .select(`
          *,
          session_user_data:user_data_id (
            name,
            email,
            phone,
            location,
            ip_address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch all logs for download:', error);
        return;
      }

      if (!allLogs || allLogs.length === 0) return;

      // Create header row
      const headers = [
        'Date', 'Time', 'Job Title', 'Name', 'Email', 
        'Phone', 'Address', 'IP Address', 
        'Original Score', 'Original Qualification',
        'Optimized Score', 'Optimized Qualification',
        'Promoter Score', 'Feedback Text'
      ];

      // Create content with headers and data rows
      const content = [
        headers.join('\t'),
        ...allLogs.map(log => [
          log.date,
          log.time,
          log.job_title,
          log.session_user_data?.name || 'N/A',
          log.session_user_data?.email || 'N/A',
          log.session_user_data?.phone || '',
          log.session_user_data?.location || '',
          log.session_user_data?.ip_address || '',
          log.unoptimized_score,
          log.unoptimized_qualification || '',
          log.optimized_score,
          log.optimized_qualification || '',
          log.recommendation !== undefined ? log.recommendation : '',
          log.feedback || ''
        ].join('\t'))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'AllSessionsLog.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to download logs:', error);
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-12">
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading session logs...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sessions Log</CardTitle>
        <CardDescription>
          View and download session data collected during resume optimizations (showing {sessionLogs.length} entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessionLogs.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Original Score</TableHead>
                    <TableHead>Optimized Score</TableHead>
                    <TableHead>Original Qualification</TableHead>
                    <TableHead>Optimized Qualification</TableHead>
                    <TableHead>Promoter Score</TableHead>
                    <TableHead>Feedback Text</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>{log.job_title}</TableCell>
                      <TableCell>{log.name}</TableCell>
                      <TableCell>{log.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.location || ''}>
                        {log.location || 'N/A'}
                      </TableCell>
                      <TableCell>{log.ip_address || 'N/A'}</TableCell>
                      <TableCell>{log.unoptimized_score}</TableCell>
                      <TableCell>{log.optimized_score}</TableCell>
                      <TableCell>{log.unoptimized_qualification}</TableCell>
                      <TableCell>{log.optimized_qualification}</TableCell>
                      <TableCell>{log.recommendation !== undefined ? `${log.recommendation}/10` : 'No data'}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.feedback || ''}>
                        {log.feedback || 'No feedback'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {hasMore && (
              <div className="flex justify-center">
                <Button 
                  onClick={loadMoreLogs}
                  disabled={loadingMore}
                  variant="outline"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Load More
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            No session logs found
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={downloadLogs}
          disabled={sessionLogs.length === 0}
          className="ml-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Download All Sessions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionLogsSection;