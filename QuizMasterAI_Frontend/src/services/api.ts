import { supabase } from "@/integrations/supabase/client";

interface QuizResponse {
  items: Quiz[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface Quiz {
  id: number;
  title: string;
  topic: string;
  difficulty: number;
  numberOfQuestions: number;
}

interface QuizDetails extends Quiz {
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface CreateQuizRequest {
  title: string;
  topic: string;
  difficulty: number;
  numberOfQuestions: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = async () => {
  const session = await supabase.auth.getSession();
  const token = session?.data?.session?.access_token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const api = {
  async createQuiz(data: CreateQuizRequest) {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    
    return response.json();
  },

  async getQuizzes(pageNumber: number = 1, pageSize: number = 12): Promise<QuizResponse> {
    const headers = await getHeaders();
    const response = await fetch(
      `${API_URL}/quizzes?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers,
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    
    return response.json();
  },

  async getQuizDetails(id: number): Promise<QuizDetails> {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz details');
    }
    
    return response.json();
  },

  async deleteQuiz(quizId: number): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete quiz');
    }
  },

  async updateQuizTitle(quizId: number, title: string): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/quizzes/${quizId}/title`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ title }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update quiz title');
    }
  },

  async deleteQuestion(questionId: number): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/questions/${questionId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete question');
    }
  },

  async updateQuestion(questionId: number, data: {
    id: number;
    text: string;
    answers: { text: string; isCorrect: boolean; }[];
  }): Promise<void> {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update question');
    }
  },
};

export const difficultyMap = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
} as const;

export const difficultyReverseMap = {
  'Easy': 1,
  'Medium': 2,
  'Hard': 3,
} as const;
