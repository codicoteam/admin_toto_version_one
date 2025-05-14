
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export interface CourseCardProps {
  id: string;
  title: string;
  // instructor: {
  //   name: string;
  //   avatar?: string;
  // };
  thumbnailUrl: string;
  category: string;
  lessonsCount: number;
  duration?: string;
  enrolled?: boolean;
  progress?: number;
}

const CourseCard = ({
  id,
  title,
  thumbnailUrl,
  category,
  lessonsCount,
  enrolled = false,
  progress
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow duration-300 w-full">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-white/40 dark:bg-background/40 text-foreground hover:bg-white/90 backdrop-blur-sm border border-input">
          {category}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        {/* <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={instructor.avatar} />
            <AvatarFallback>{instructor.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{instructor.name}</span>
        </div> */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{lessonsCount} lessons</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div> */}
        </div>

        {enrolled && progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          asChild
          variant={enrolled ? "outline" : "default"}
          className={`w-full ${enrolled ? "" : "bg-primary hover:bg-primary/90"}`}
        >
          <Link to={`/courses/${id}`} className="w-full flex items-center justify-center">
            {enrolled ? "Continue Learning" : "View Course"}
          </Link>
        </Button>

      </CardFooter>
    </Card>
  );
};

export default CourseCard;
