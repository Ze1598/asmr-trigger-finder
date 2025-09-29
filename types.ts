
export interface Trigger {
  trigger: string;
  timestamp: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
