// src/components/ExamCard.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export interface ExamCardProps {
  id: string;
  title: string;
  subjectName: string;
  level: string;
  durationInMinutes?: number;
  thumbnailUrl: string;
}

const ExamCard = ({
  id,
  title,
  subjectName,
  level,
  durationInMinutes,
  thumbnailUrl,
}: ExamCardProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
  };


  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow duration-300 w-full">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-white/40 dark:bg-background/40 text-foreground hover:bg-white/90 backdrop-blur-sm border border-input">
          {level}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-1">
            <span className="font-medium">Subject:</span>
            <span className="text-muted-foreground">{subjectName}</span>
          </p>
          {durationInMinutes && (
            <p className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-muted-foreground">
                {formatDuration(durationInMinutes)}
              </span>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/exam/${id}`}>
            Edit Exam
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;