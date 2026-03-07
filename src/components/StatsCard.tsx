import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'warning' | 'info' | 'success' | 'accent' | 'destructive';
  delay?: number;
}

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', glow: 'shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', glow: 'shadow-[0_0_20px_-5px_hsl(var(--warning)/0.4)]' },
  info: { bg: 'bg-info/10', text: 'text-info', glow: 'shadow-[0_0_20px_-5px_hsl(var(--info)/0.4)]' },
  success: { bg: 'bg-success/10', text: 'text-success', glow: 'shadow-[0_0_20px_-5px_hsl(var(--success)/0.4)]' },
  accent: { bg: 'bg-accent/10', text: 'text-accent', glow: 'shadow-[0_0_20px_-5px_hsl(var(--accent)/0.4)]' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive', glow: 'shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.4)]' },
};

const StatsCard = ({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) => {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`card-elevated rounded-xl p-6 border border-border/50 hover:border-border transition-all ${c.glow}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className={`text-3xl font-bold font-display ${c.text}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
