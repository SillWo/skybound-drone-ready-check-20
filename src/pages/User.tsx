
import { DroneHeader } from '@/components/DroneHeader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const User = () => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-2 sm:p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <DroneHeader />
        
        <div className="bg-white rounded-lg p-6 mt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>ПП</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Петр Петров</h2>
              <p className="text-gray-600">ID: 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
