
import { DroneHeader } from '@/components/DroneHeader';
import { PreflightChecklist } from '@/components/PreflightChecklist';

const StandardChecklist = () => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-2 sm:p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <DroneHeader />
        <PreflightChecklist onProgressUpdate={() => {}} />
      </div>
    </div>
  );
};

export default StandardChecklist;
