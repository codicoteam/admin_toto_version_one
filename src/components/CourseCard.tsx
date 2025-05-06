import { useState } from "react";
import { CourseTopicsDialog } from "./Course_Topic";

const CourseCard = ({
  id,
  title,
  category,
  lessons,
  duration,
  topics = [],
}) => {
  const [topicsDialogOpen, setTopicsDialogOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setTopicsDialogOpen(true)}
      >
        {/* Course Image Placeholder */}
        <div className="bg-black h-40 w-full flex items-center justify-center text-white">
          (Course Image)
        </div>

        {/* Course Info */}
        <div className="p-4">
          <h3 className="font-medium text-blue-900">{title}</h3>
          <p className="text-gray-600 text-sm">Category: {category}</p>
          <div className="flex justify-between items-center mt-2 text-xs">
            <span>{lessons} Lessons</span>
            <span className="text-red-500">{duration}</span>
          </div>
        </div>

        {/* Empty Space for Additional Content */}
        <div className="bg-white h-20 border-t border-gray-200"></div>
      </div>

      {/* Topics Dialog */}
      <CourseTopicsDialog
        courseId={id}
        courseTitle={title}
        topics={topics}
        open={topicsDialogOpen}
        onOpenChange={setTopicsDialogOpen}
      />
    </>
  );
};

export default CourseCard;
