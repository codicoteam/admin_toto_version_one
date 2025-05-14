import Topic from "./Topic_Interface";

interface Subject {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  subjectName?: string;
  category?: string;
  Level?: string;
  numberOfLessons?: number;
  lessons?: number;
  duration?: string;
  description?: string;
  imageUrl?: string;
  isPopular?: boolean;
  showSubject?: boolean;
  topics?: Topic[];
}
export default Subject;
