
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';

interface SessionLogData {
  date: string;
  time: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ipAddress: string;
  unoptimizedScore: number;
  unoptimizedQualification: string;
  optimizedScore: number;
  optimizedQualification: string;
}

const SessionLogsSection = () => {
  const [sessionLogs, setSessionLogs] = useState<SessionLogData[]>([]);
  
  // Get logs from localStorage on component mount
  useEffect(() => {
    const storedLogs = localStorage.getItem('sessionLogs');
    if (storedLogs) {
      try {
        setSessionLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Failed to parse session logs:', error);
      }
    }
  }, []);

  const downloadLogs = () => {
    if (!sessionLogs.length) return;

    // Create header row
    const headers = [
      'Date', 'Time', 'Job Title', 'Name', 'Email', 
      'Phone', 'Location', 'IP Address', 
      'Unoptimized Score', 'Unoptimized Qualification',
      'Optimized Score', 'Optimized Qualification'
    ];

    // Create content with headers and data rows
    const content = [
      headers.join('\t'),
      ...sessionLogs.map(log => [
        log.date,
        log.time,
        log.jobTitle,
        log.name,
        log.email,
        log.phone,
        log.location,
        log.ipAddress,
        log.unoptimizedScore,
        log.unoptimizedQualification,
        log.optimizedScore,
        log.optimizedQualification
      ].join('\t'))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'SessionsLog.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
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
                  <TableHead>Score Change</TableHead>
                  <TableHead>Qualification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell>{log.jobTitle}</TableCell>
                    <TableCell>{log.name}</TableCell>
                    <TableCell>{`${log.unoptimizedScore} → ${log.optimizedScore}`}</TableCell>
                    <TableCell>{`${log.unoptimizedQualification} → ${log.optimizedQualification}`}</TableCell>
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
