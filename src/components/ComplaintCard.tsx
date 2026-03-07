import { Complaint } from '@/data/mockData';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { MapPin, Calendar, Building2, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplaintCardProps {
  complaint: Complaint;
  index?: number;
  showActions?: boolean;
  onAction?: (action: string, id: string) => void;
}

const ComplaintCard = ({ complaint, index = 0, showActions, onAction }: ComplaintCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-elevated rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{complaint.issueType}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-4">
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{complaint.location}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{complaint.date}</span>
        {complaint.assignedDept && (
          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{complaint.assignedDept}</span>
        )}
        <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{complaint.upvotes}</span>
      </div>

      {showActions && onAction && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
          {complaint.status === 'assigned' && (
            <button onClick={() => onAction('start', complaint.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Start Work
            </button>
          )}
          {complaint.status === 'inProgress' && (
            <button onClick={() => onAction('resolve', complaint.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ComplaintCard;
