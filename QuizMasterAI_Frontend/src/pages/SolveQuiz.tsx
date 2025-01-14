import { useState, useEffect } from "react";
import PageContainer from "@/components/Layout/PageContainer";
import { useToast } from "@/hooks/use-toast";
import { api, difficultyMap } from "@/services/api";

interface Quiz {
  id: number;
  title: string;
  difficulty: number;
  numberOfQuestions: number;
}

interface Question {
  id: number;
  text: string;
  answers: {
    id: number;
    text: string;
    isCorrect: boolean;
  }[];
}

export default function SolveQuiz() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.getQuizzes(1); // Get first page of quizzes
        setQuizzes(response.items);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch quizzes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [toast]);

  const handleQuizSelect = async (quizId: number) => {
    setIsLoading(true);
    try {
      const quiz = await api.getQuizDetails(quizId);
      setQuestions(quiz.questions);
      setSelectedQuiz(quizId);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      setShowResults(false);
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

  const handleAnswerSelect = (answerId: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerId;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((answerId, index) => {
      const question = questions[index];
      const selectedAnswer = question.answers.find(a => a.id === answerId);
      if (selectedAnswer?.isCorrect) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${questions.length}`,
    });
    setShowResults(true);
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

  if (!selectedQuiz) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Select a Quiz to Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => handleQuizSelect(quiz.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-left hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{difficultyMap[quiz.difficulty]}</span>
                  <span>{quiz.numberOfQuestions} questions</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    
    return (
      <PageContainer>
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Results: {quiz?.title}
            </h2>
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-50">
              <div className="text-2xl font-bold text-primary">
                {score} / {questions.length}
              </div>
              <div className="ml-3 text-gray-500">
                ({Math.round((score / questions.length) * 100)}%)
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-8">
            {questions.map((question, index) => {
              const selectedAnswerId = selectedAnswers[index];
              const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
              const correctAnswer = question.answers.find(a => a.isCorrect);
              const isCorrect = selectedAnswer?.isCorrect;

              return (
                <div 
                  key={question.id} 
                  className={`bg-white rounded-lg shadow-sm border p-6 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium flex-1">
                      {index + 1}. {question.text}
                    </h3>
                    <div className={`ml-4 flex items-center ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Correct
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Incorrect
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question.answers.map((answer) => {
                      const isSelected = answer.id === selectedAnswerId;
                      const isCorrectAnswer = answer.isCorrect;
                      
                      let answerClass = 'border-gray-200 bg-white';
                      if (isSelected && isCorrectAnswer) {
                        answerClass = 'border-green-500 bg-green-100';
                      } else if (isSelected && !isCorrectAnswer) {
                        answerClass = 'border-red-500 bg-red-100';
                      } else if (isCorrectAnswer) {
                        answerClass = 'border-green-500 bg-green-50';
                      }

                      return (
                        <div
                          key={answer.id}
                          className={`p-4 rounded-lg border ${answerClass} flex items-center`}
                        >
                          {isSelected && (
                            <div className="mr-3 text-red-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                          )}
                          {isCorrectAnswer && (
                            <div className="mr-3 text-green-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <span className={`flex-1 ${
                            isSelected && !isCorrectAnswer ? 'line-through text-red-700' : ''
                          }`}>
                            {answer.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {!isCorrect && (
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="font-medium">Explanation:</span> The correct answer was "{correctAnswer?.text}".
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers([]);
                setShowResults(false);
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Choose Another Quiz
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const quiz = quizzes.find(q => q.id === selectedQuiz);
  
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">{quiz?.title}</h2>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            {questions[currentQuestion].text}
          </h3>
          <div className="space-y-4">
            {questions[currentQuestion].answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`w-full p-4 text-left rounded-lg transition-all ${
                  selectedAnswers[currentQuestion] === answer.id
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Choose Another Quiz
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswers[currentQuestion]}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion]}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}