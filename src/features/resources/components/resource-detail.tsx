import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from '@/components/ui/dialog';
  
  interface ResourceDialogProps {
    resourceId: string;
    resourceName: string;
    open: boolean;
    onClose: () => void;
    done: boolean;
  }
  
  const ResourceDetail: React.FC<ResourceDialogProps> = ({
    resourceId,
    resourceName,
    open,
    onClose,
    done,
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
            <DialogDescription>
              Details for resource: {resourceName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>ID:</strong> {resourceId}
            </p>
            <p>
              <strong>Name:</strong> {resourceName}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`font-medium ${done ? 'text-green-500' : 'text-red-500'}`}
              >
                {done ? 'Completed' : 'In Progress'}
              </span>
            </p>
            {/* Tambahkan detail sumber daya lainnya di sini */}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ResourceDetail;
  