import zooData from '@/data/zoo-info.json';

export interface ZooInfo {
  name: string;
  location: string;
  openingHours: string;
  ticketPrices: {
    adult: number;
    child: number;
    senior: number;
  };
  animals: Array<{
    name: string;
    description: string;
  }>;
  attractions: string[];
}

export function getZooInfo(): ZooInfo {
  return zooData as ZooInfo;
}