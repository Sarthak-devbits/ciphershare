import { Clock, Download, FileText } from "lucide-react";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Files</p>
            <p className="text-2xl font-semibold">{23}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Files</p>
            <p className="text-2xl font-semibold">{2}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Downloads</p>
            <p className="text-2xl font-semibold">{50}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
