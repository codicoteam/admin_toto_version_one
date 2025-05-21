import SubjectCard from "../SubjectCard";

// Define interfaces for your data types
interface Topic {
  status: string;
  price: number;
  regularPrice: number;
  subscriptionPeriod: string;
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  subjectId?: string;
  subject_id?: string;
  order?: number;
}

export default Topic;
