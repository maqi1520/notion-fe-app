export interface Opts {
  isMulti: string;
  options: string[];
  answer: string[];
}

export interface Question {
  _id: string;
  category: "QA" | "Choice";
  title: string;
  desc: string;
  options?: string;
  explanation: string;
  level: number;
  tag: number;
}

export interface Tag {
  _id: string;
  id: number;
  tagName: string;
  image: string;
}
