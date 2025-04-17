
export interface ReportItem {
  id: string;
  label: string;
  hasHelp: boolean;
  checked: boolean;
  comment?: string;
  imageUrl?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  location: string;
  items: ReportItem[];
}

export interface Report {
  id: string;
  title: string;
  date: string;
  sections: ReportSection[];
  totalProgress: number;
}

export interface SavedReport extends Report {
  droneData: {
    batteryLevel: number;
    signalStrength: number;
    gpsStatus: 'strong' | 'weak' | 'no-signal';
  };
  weatherData: {
    temperature: number;
    windSpeed: number;
    visibility: string;
    isGoodWeather: boolean;
  };
}
