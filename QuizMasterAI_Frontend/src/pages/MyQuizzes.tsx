import { useEffect, useState } from "react";
import PageContainer from "@/components/Layout/PageContainer";
import QuizCard from "@/components/Quiz/QuizCard";
import { api, difficultyMap } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuizData {
  id: number;
  title: string;
  topic: string;
  difficulty: number;
  numberOfQuestions: number;
}

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchQuizzes = async (page: number) => {
    try {
      setIsPageChanging(true);
      const response = await api.getQuizzes(page);
      setQuizzes(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.pageNumber);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quizzes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsPageChanging(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(currentPage);
  }, [currentPage, toast]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;

    try {
      await api.deleteQuiz(quizToDelete);
      toast({
        title: "Success",
        description: "Quiz deleted successfully",
      });
      fetchQuizzes(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setQuizToDelete(null);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Quizzes</h1>
          <p className="text-gray-500">View and manage your created quizzes</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900">No quizzes yet</h2>
            <p className="text-gray-500 mt-2">Create your first quiz to get started!</p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isPageChanging ? 'opacity-50' : ''}`}>
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  difficulty={difficultyMap[quiz.difficulty as keyof typeof difficultyMap]}
                  questionsCount={quiz.numberOfQuestions}
                  onEdit={() => handleEdit(quiz.id)}
                  onDelete={() => setQuizToDelete(quiz.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPageChanging}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      disabled={isPageChanging}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPageChanging}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}