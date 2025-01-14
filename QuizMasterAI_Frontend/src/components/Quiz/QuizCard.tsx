import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  id: number;
  title: string;
  difficulty: string;
  questionsCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuizCard = ({
  id,
  title,
  difficulty,
  questionsCount,
  onEdit,
  onDelete,
}: QuizCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClick = (e: React.MouseEvent, callback?: () => void) => {
    if (callback) {
      e.preventDefault();
      e.stopPropagation();
      callback();
    }
  };

  return (
    <Link to={`/quiz/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md animate-fadeIn">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="mt-2 space-x-2">
              <Badge className={getDifficultyColor(difficulty)}>
                {difficulty}
              </Badge>
              <Badge variant="secondary">
                {questionsCount} {questionsCount === 1 ? "Question" : "Questions"}
              </Badge>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleClick(e, onEdit)}
                  className="h-8 w-8 text-gray-500 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleClick(e, onDelete)}
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;