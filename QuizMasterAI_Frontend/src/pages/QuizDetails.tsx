import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/components/Layout/PageContainer";
import { api, difficultyMap } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface QuizDetails {
  title: string;
  topic: string;
  difficulty: number;
  numberOfQuestions: number;
  questions: Question[];
}

export default function QuizDetails() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!id) return;

      try {
        const data = await api.getQuizDetails(parseInt(id));
        setQuiz(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quiz details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, toast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (!quiz) {
    return (
      <PageContainer>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Quiz not found</h1>
          <p className="text-gray-500">The quiz you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="flex items-center gap-4">
            <Badge>{quiz.topic}</Badge>
            <Badge variant="outline">
              {difficultyMap[quiz.difficulty as keyof typeof difficultyMap]}
            </Badge>
            <span className="text-sm text-gray-500">
              {quiz.numberOfQuestions} questions
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold">
                {index + 1}. {question.text}
              </h3>
              <div className="grid gap-3">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-lg border ${
                      answer.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {answer.isCorrect && (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      <span>{answer.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}