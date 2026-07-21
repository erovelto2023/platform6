"use server";

import { revalidatePath } from "next/cache";
import Quiz, { QuizAttempt } from "@/lib/models/quiz.model";
import connectDB from "@/lib/db/connect";

export async function createQuiz(data: {
    title: string;
    slug: string;
    description?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    timeLimit?: number;
    passingScore?: number;
    accessLevel?: string;
    thumbnail?: string;
    createdBy: string;
}) {
    await connectDB();
    
    const quiz = await Quiz.create({
        ...data,
        questions: [],
        isPublished: false,
    });
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/admin/quizzes");
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function getQuizById(id: string) {
    await connectDB();
    
    const quiz = await Quiz.findById(id);
    if (!quiz) return null;
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function getQuizBySlug(slug: string) {
    await connectDB();
    
    const quiz = await Quiz.findOne({ slug });
    if (!quiz) return null;
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function getQuizzes(filters: {
    isPublished?: boolean;
    createdBy?: string;
    category?: string;
    difficulty?: string;
    accessLevel?: string;
} = {}) {
    await connectDB();
    
    const query: any = {};
    if (filters.isPublished !== undefined) query.isPublished = filters.isPublished;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    if (filters.category) query.category = filters.category;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.accessLevel) query.accessLevel = filters.accessLevel;
    
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(quizzes));
}

export async function updateQuiz(id: string, data: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    timeLimit?: number;
    passingScore?: number;
    randomizeQuestions?: boolean;
    randomizeOptions?: boolean;
    showResults?: string;
    allowRetakes?: boolean;
    maxRetakes?: number;
    thumbnail?: string;
    accessLevel?: string;
}) {
    await connectDB();
    
    const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
    if (!quiz) throw new Error("Quiz not found");
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/admin/quizzes");
    revalidatePath(`/dashboard/quizzes/${id}`);
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function deleteQuiz(id: string) {
    await connectDB();
    
    await Quiz.findByIdAndDelete(id);
    await QuizAttempt.deleteMany({ quizId: id });
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/admin/quizzes");
    
    return { success: true };
}

export async function addQuestion(quizId: string, question: {
    type: string;
    question: string;
    options?: string[];
    correctAnswer: any;
    explanation?: string;
    points?: number;
    imageUrl?: string;
}) {
    await connectDB();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    const order = quiz.questions.length;
    quiz.questions.push({ ...question, order });
    await quiz.save();
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function updateQuestion(quizId: string, questionId: string, data: {
    type?: string;
    question?: string;
    options?: string[];
    correctAnswer?: any;
    explanation?: string;
    points?: number;
    imageUrl?: string;
}) {
    await connectDB();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    const question = quiz.questions.id(questionId);
    if (!question) throw new Error("Question not found");
    
    Object.assign(question, data);
    await quiz.save();
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function deleteQuestion(quizId: string, questionId: string) {
    await connectDB();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    quiz.questions.pull(questionId);
    await quiz.save();
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function reorderQuestions(quizId: string, questionIds: string[]) {
    await connectDB();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    questionIds.forEach((id, index) => {
        const question = quiz.questions.id(id);
        if (question) question.order = index;
    });
    
    quiz.questions.sort((a: any, b: any) => a.order - b.order);
    await quiz.save();
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function publishQuiz(id: string) {
    await connectDB();
    
    const quiz = await Quiz.findByIdAndUpdate(
        id,
        { isPublished: true, publishedAt: new Date() },
        { new: true }
    );
    
    if (!quiz) throw new Error("Quiz not found");
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/admin/quizzes");
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function unpublishQuiz(id: string) {
    await connectDB();
    
    const quiz = await Quiz.findByIdAndUpdate(
        id,
        { isPublished: false, publishedAt: null },
        { new: true }
    );
    
    if (!quiz) throw new Error("Quiz not found");
    
    revalidatePath("/dashboard/quizzes");
    revalidatePath("/admin/quizzes");
    
    return JSON.parse(JSON.stringify(quiz));
}

export async function submitQuizAttempt(data: {
    quizId: string;
    userId: string;
    answers: Array<{
        questionId: string;
        answer: any;
    }>;
    startedAt: Date;
}) {
    await connectDB();
    
    const quiz = await Quiz.findById(data.quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    let totalPoints = 0;
    let earnedPoints = 0;
    const processedAnswers = quiz.questions.map((q: any) => {
        const userAnswer = data.answers.find(a => a.questionId === q._id.toString());
        const isCorrect = checkAnswer(q, userAnswer?.answer);
        totalPoints += q.points;
        if (isCorrect) earnedPoints += q.points;
        
        return {
            questionId: q._id,
            answer: userAnswer?.answer,
            isCorrect,
            pointsEarned: isCorrect ? q.points : 0,
        };
    });
    
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = percentage >= quiz.passingScore;
    const timeSpent = Math.floor((new Date().getTime() - new Date(data.startedAt).getTime()) / 1000);
    
    const attempt = await QuizAttempt.create({
        quizId: data.quizId,
        userId: data.userId,
        answers: processedAnswers,
        score: earnedPoints,
        totalPoints,
        percentage,
        passed,
        timeSpent,
        startedAt: data.startedAt,
        completedAt: new Date(),
    });
    
    // Update quiz stats
    quiz.totalAttempts += 1;
    const attempts = await QuizAttempt.find({ quizId: data.quizId });
    quiz.averageScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length;
    await quiz.save();
    
    revalidatePath("/dashboard/quizzes");
    
    return JSON.parse(JSON.stringify(attempt));
}

function checkAnswer(question: any, userAnswer: any): boolean {
    if (question.type === "multiple-choice") {
        return userAnswer === question.correctAnswer;
    } else if (question.type === "true-false") {
        return userAnswer === question.correctAnswer;
    } else if (question.type === "short-answer") {
        return userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
    }
    return false;
}

export async function getQuizAttempts(quizId: string, userId?: string) {
    await connectDB();
    
    const query: any = { quizId };
    if (userId) query.userId = userId;
    
    const attempts = await QuizAttempt.find(query).sort({ completedAt: -1 });
    
    return JSON.parse(JSON.stringify(attempts));
}

export async function getUserQuizAttempts(userId: string) {
    await connectDB();
    
    const attempts = await QuizAttempt.find({ userId })
        .populate("quizId", "title slug")
        .sort({ completedAt: -1 });
    
    return JSON.parse(JSON.stringify(attempts));
}

export async function getQuizStats(quizId: string) {
    await connectDB();
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    const attempts = await QuizAttempt.find({ quizId });
    const passCount = attempts.filter(a => a.passed).length;
    
    return {
        totalAttempts: quiz.totalAttempts,
        averageScore: quiz.averageScore,
        passRate: attempts.length > 0 ? (passCount / attempts.length) * 100 : 0,
        completionRate: 0, // Would need view tracking
    };
}
