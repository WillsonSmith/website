export interface Result {
  markup: string;
  styles?: string;
}

export type RenderResolve = (result: Result) => void;
export type RenderReject = (reason?: any) => void;
