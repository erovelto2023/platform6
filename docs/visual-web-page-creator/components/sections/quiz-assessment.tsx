"use client"

import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface QuizAssessmentProps {
  content: SectionContent
  style: SectionStyle
}

export function QuizAssessment({ content, style }: QuizAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const questions = content.questions ? JSON.parse(content.questions as string) : []

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding || "4rem 1.5rem",
      }}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">{content.title as string}</h2>
          <p className="text-lg opacity-90">{content.subtitle as string}</p>
          <div className="mt-4 text-sm opacity-70">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {questions[currentQuestion] && (
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6 text-left bg-transparent"
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1)
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          >
            Previous
          </Button>
          <Button
            disabled={currentQuestion === questions.length - 1}
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}
