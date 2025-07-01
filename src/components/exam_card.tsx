// src/components/ExamCard.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Trash, Edit, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export interface ExamCardProps {
  id: string;
  title: string;
  subjectName: string;
  level: string;
  durationInMinutes?: number;
  thumbnailUrl: string;
  onDelete: () => void;
}

const ExamCard = ({
  id,
  title,
  subjectName,
  level,
  durationInMinutes,
  thumbnailUrl,
  onDelete
}: ExamCardProps) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 w-full group border-border/50 hover:border-border bg-card/50 backdrop-blur-sm">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm border-0 font-medium">
          {level}
        </Badge>
      </div>
      
      <CardContent className="pt-4 pb-3">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <span className="font-medium text-foreground">Subject:</span>
            <span className="text-muted-foreground">{subjectName}</span>
          </div>
          {durationInMinutes && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary/70" />
              <span className="text-muted-foreground">
                {formatDuration(durationInMinutes)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex-col gap-3">
        {/* Main action buttons */}
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1 group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
            <Link to={`/exam/${id}`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Exam
            </Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1 group/btn hover:bg-primary/10 hover:text-primary transition-all duration-200">
            <Link to={`/exam/view/${id}`} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              View Results
            </Link>
          </Button>
        </div>
        
        {/* Delete button - now at bottom and always visible */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          variant="ghost"
          size="sm"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 border border-transparent hover:border-destructive/20"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Exam
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;