import { User } from "./User";

export interface ResultProps {
  msg: string;
  data: any;
  status: number;
  pageNum?: number;
  totalNum?: number;
  total?: number;
}
export interface Domain {
  _key: string;
  regionCode: string;
  logo: string;
  name: string;
  banner: string[];
}

export interface Tag {
  _key: string;
  icon?: string;
  name: string;
  type: string;
  unit?: string;
}
export interface Region {
  _key: string;
  name: string;
  areaCode: string;
  level: number;
}

export interface Comment {
  content: string;
  createTime: number;
  creatorInfo: User;
  targetUserInfo?: User;
  targetContent?:string;
  _key: string;
}
