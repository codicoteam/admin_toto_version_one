import { useState, useEffect } from "react";
import { ChevronLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopicCard = ({ topicNumber, name, price, status }) => {
  return (
    <div className="bg-white border border-gray-200 aspect-square flex flex-col">
      <div className="h-3/4 flex items-center justify-center">
        {/* Topic content placeholder */}
      </div>
      <div className="bg-blue-900 text-white p-2">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            Topic {topicNumber} {name ? `(${name})` : ""}
          </div>
          <div className="text-xs">${price}</div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs bg-white text-blue-900 hover:bg-gray-100 px-2 py-1 h-auto"
          >
            View Topic
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs px-2 py-1 h-auto ${
              status === "Purchased"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {status}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CourseDetailPage = () => {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 10;

  // Simulate fetching topics data
  useEffect(() => {
    // Mock data for topics
    const mockTopics = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `Topic Name (if any)`,
      price: ((index % 3) + 1) * 9.99,
      status: index % 2 === 0 ? "Pending" : "Purchased",
    }));

    setTopics(mockTopics);
  }, []);

  // Get current topics
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = topics.slice(indexOfFirstTopic, indexOfLastTopic);

  // Load more topics
  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Course Info Sidebar */}
          <div className="w-full md:w-64 bg-blue-900 text-white p-4">
            <Button
              variant="ghost"
              className="flex items-center text-white mb-4 hover:bg-blue-800 px-2"
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Go Back
            </Button>

            <div className="bg-white rounded-md p-4 mb-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 overflow-hidden">
                  <img
                    src="/api/placeholder/100/100"
                    alt="Biology"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Course Name</h1>

            <div className="mt-4">
              <h2 className="text-lg mb-2">Details</h2>
              <p className="text-sm text-gray-300">(Course Name)</p>
              <div className="border-t border-blue-800 my-2"></div>
              <p className="text-sm text-gray-300">
                ............................................
              </p>
              <p className="text-sm text-gray-300">
                ............................................
              </p>
              <p className="text-sm text-gray-300">
                ............................................
              </p>
              <p className="text-sm text-gray-300">
                ............................................
              </p>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {currentTopics.map((topic, index) => (
                <TopicCard
                  key={topic.id}
                  topicNumber={topic.id}
                  name={topic.name}
                  price={topic.price.toFixed(2)}
                  status={topic.status}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              {topics.length > currentTopics.length && (
                <Button
                  variant="outline"
                  className="border-blue-900 text-blue-900 hover:bg-blue-50"
                  onClick={handleLoadMore}
                >
                  Load more topics
                </Button>
              )}
              <Button
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-50"
              >
                Multi-Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
