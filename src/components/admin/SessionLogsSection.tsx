import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { SessionLogData } from '@/services/logs/sessionLogTypes';
import { downloadAllSessionLogs } from '@/services/logs/sessionLogDownloader';
import { getLogsFromStorage } from '@/services/logs/sessionLogStorage';

const SessionLogsSection = () => {
  const [sessionLogs, setSessionLogs] = useState<SessionLogData[]>([]);
  
  // Get logs from localStorage on component mount
  useEffect(() => {
    setSessionLogs(getLogsFromStorage());
  }, []);

  const downloadLogs = () => {
    downloadAllSessionLogs();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sessions Log</CardTitle>
        <CardDescription>
          View and download session data collected during resume optimizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessionLogs.length > 0 ? (
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
                {sessionLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>{log.jobTitle}</TableCell>
                    <TableCell>{log.name}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={log.location || ''}>
                      {log.location || 'N/A'}
                    </TableCell>
                    <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                    <TableCell>{log.unoptimizedScore}</TableCell>
                    <TableCell>{log.optimizedScore}</TableCell>
                    <TableCell>{log.unoptimizedQualification}</TableCell>
                    <TableCell>{log.optimizedQualification}</TableCell>
                    <TableCell>{log.recommendation !== undefined ? `${log.recommendation}/10` : 'No data'}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={log.feedback || ''}>
                      {log.feedback || 'No feedback'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          Download SessionsLog.txt
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionLogsSection;
