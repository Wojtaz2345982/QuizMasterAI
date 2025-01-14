import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/components/Layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LucideTrash, LucidePlus, LucidePencil, LucideSave } from "lucide-react";
import { api } from "@/services/api";

interface Question {
  id: number;
  text: string;
  answers: {
    id?: number;
    text: string;
    isCorrect: boolean;
  }[];
}

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    answers: Array(4).fill({ text: "", isCorrect: false }),
  });

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!id) return;

      try {
        const quiz = await api.getQuizDetails(parseInt(id));
        setTitle(quiz.title);
        setQuestions(quiz.questions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quiz details. Please try again.",
          variant: "destructive",
        });
        navigate("/my-quizzes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, navigate, toast]);

  const handleSaveTitle = async () => {
    if (!id) return;

    try {
      await api.updateQuizTitle(parseInt(id), title.trim());
      toast({
        title: "Success",
        description: "Quiz title updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quiz title. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await api.deleteQuestion(questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuestion = async (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    try {
      await api.updateQuestion(questionId, {
        id: questionId,
        text: question.text,
        answers: question.answers.map(a => ({
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      });

      toast({
        title: "Success",
        description: "Question updated successfully!",
      });
      setEditingQuestion(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
            />
          </div>
          <Button onClick={handleSaveTitle} className="flex gap-2">
            <LucideSave className="w-4 h-4" />
            Save Title
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questions</h2>
          
          {questions.map((question) => (
            <Card key={question.id} className="animate-fadeIn">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base font-medium">
                  {editingQuestion === question.id ? (
                    <Textarea
                      value={question.text}
                      onChange={(e) =>
                        setQuestions(questions.map(q =>
                          q.id === question.id
                            ? { ...q, text: e.target.value }
                            : q
                        ))
                      }
                      className="mt-2"
                    />
                  ) : (
                    question.text
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {editingQuestion === question.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuestion(question.id)}
                    >
                      <LucideSave className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(question.id)}
                    >
                      <LucidePencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <LucideTrash className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {question.answers.map((answer, index) => (
                    <div
                      key={answer.id || index}
                      className={`p-4 rounded-lg border ${
                        answer.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      {editingQuestion === question.id ? (
                        <div className="flex gap-3">
                          <Input
                            value={answer.text}
                            onChange={(e) =>
                              setQuestions(questions.map(q =>
                                q.id === question.id
                                  ? {
                                      ...q,
                                      answers: q.answers.map((a, i) =>
                                        i === index
                                          ? { ...a, text: e.target.value }
                                          : a
                                      ),
                                    }
                                  : q
                              ))
                            }
                          />
                          <Button
                            variant={answer.isCorrect ? "default" : "outline"}
                            onClick={() =>
                              setQuestions(questions.map(q =>
                                q.id === question.id
                                  ? {
                                      ...q,
                                      answers: q.answers.map((a, i) =>
                                        i === index
                                          ? { ...a, isCorrect: !a.isCorrect }
                                          : a
                                      ),
                                    }
                                  : q
                              ))
                            }
                          >
                            Correct
                          </Button>
                        </div>
                      ) : (
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
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}