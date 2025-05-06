import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useSocket } from '@/providers/SocketProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Laptop, Smartphone, XCircle } from 'lucide-react';

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastActivity: string;
  deviceInfo: {
    browser: string;
    platform: string;
    isMobile: boolean;
  };
}

export function Sessions() {
  const queryClient = useQueryClient();
  const { isConnected } = useSocket();

  // Query for fetching sessions
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api.get('/api/sessions').then(res => res.data)
  });

  // Mutation for terminating a session
  const terminateSession = useMutation({
    mutationFn: (sessionId: string) =>
      api.delete(`/api/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session terminated successfully');
    },
    onError: () => {
      toast.error('Failed to terminate session');
    }
  });

  // Mutation for terminating all other sessions
  const terminateOtherSessions = useMutation({
    mutationFn: () => api.delete('/api/sessions/others'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('All other sessions terminated');
    },
    onError: () => {
      toast.error('Failed to terminate other sessions');
    }
  });

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Active Sessions</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Terminate All Other Sessions
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will terminate all sessions except your current one.
                You will be logged out from all other devices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => terminateOtherSessions.mutate()}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sessions?.map((session) => (
          <Card key={session.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {session.deviceInfo.isMobile ? (
                  <Smartphone className="h-8 w-8" />
                ) : (
                  <Laptop className="h-8 w-8" />
                )}
                <div>
                  <h3 className="font-medium">
                    {session.deviceInfo.browser} on {session.deviceInfo.platform}
                  </h3>
                  <p className="text-sm text-gray-500">
                    IP: {session.ipAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last activity: {format(new Date(session.lastActivity), 'PPpp')}
                  </p>
                  {session.id === 'current' && (
                    <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Current Session {isConnected && '• Connected'}
                    </span>
                  )}
                </div>
              </div>
              {session.id !== 'current' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log out the device using this session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => terminateSession.mutate(session.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}