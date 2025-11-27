export interface IPageInfo {
  count?: number;
  page?: number;
  limit?: number;
  page_count?: number;
  next_page?: boolean;
  prev_page?: boolean;
}
export interface Ijob {
  id: string;
  position: string;
  company: string;
  salary: string;
  location: string;
  [key: string]: any;
  job_type: string;
};

