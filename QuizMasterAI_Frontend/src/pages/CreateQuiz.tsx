import { useState, useEffect } from "react";
import PageContainer from "@/components/Layout/PageContainer";
import { useToast } from "@/hooks/use-toast";
import { api, difficultyReverseMap } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    difficulty: "",
    numberOfQuestions: "",
  });

  const placeholderTopics = [
    "Ancient Egyptian Civilization and its Mysteries",
    "Quantum Physics and String Theory",
    "Renaissance Art and Architecture",
    "Modern Technology and AI Development",
    "Environmental Science and Climate Change",
    "World Literature and Classic Novels"
  ];

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => 
        prev === placeholderTopics.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [placeholderTopics.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz topic",
        variant: "destructive",
      });
      return;
    }

    if (!formData.difficulty) {
      toast({
        title: "Error",
        description: "Please select a difficulty level",
        variant: "destructive",
      });
      return;
    }

    const numQuestions = parseInt(formData.numberOfQuestions);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 25) {
      toast({
        title: "Error",
        description: "Please enter a valid number of questions (1-25)",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.createQuiz({
        title: formData.title.trim(),
        topic: formData.topic.trim(),
        difficulty: difficultyReverseMap[formData.difficulty as keyof typeof difficultyReverseMap],
        numberOfQuestions: numQuestions,
      });

      toast({
        title: "Success",
        description: "Quiz created successfully!",
      });

      navigate("/my-quizzes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Quiz</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <input
              type="text"
              id="topic"
              maxLength={150}
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
              placeholder={placeholderTopics[currentPlaceholderIndex]}
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.topic.length}/150 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Difficulty Level
            </label>
            <div className="relative">
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm appearance-none cursor-pointer hover:border-primary text-gray-900"
              >
                <option value="" className="text-gray-500">Select difficulty</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty} className="text-gray-900 py-2">
                    {difficulty}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="numberOfQuestions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Questions
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              min="1"
              max="25"
              value={formData.numberOfQuestions}
              onChange={(e) =>
                setFormData({ ...formData, numberOfQuestions: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white shadow-sm"
              placeholder="Enter number of questions (1-25)"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#E5DEFF] text-[#4F46E5] font-medium rounded-lg hover:bg-[#D3E4FD] transition-colors"
          >
            Generate Quiz
          </button>
        </form>
      </div>
    </PageContainer>
  );
}