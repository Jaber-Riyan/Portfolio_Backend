export type KnowledgeDocument = {
  id: number;
  content: string;
  embedding?: number[];
};

export const documents: KnowledgeDocument[] = [
  {
    id: 1,
    content:
      "Jaber Ahmed Riyan is a Full Stack Developer specializing in React, Node.js, Express and MongoDB."
  },

  {
    id: 2,
    content:
      "QuizMania is an AI powered quiz platform that generates quizzes dynamically."
  },

  {
    id: 3,
    content:
      "HealthQ is a healthcare project capable of melanoma detection using artificial intelligence."
  },

  {
    id: 4,
    content:
      "Jaber is currently studying Diploma in Computer Science and Technology."
  }
];