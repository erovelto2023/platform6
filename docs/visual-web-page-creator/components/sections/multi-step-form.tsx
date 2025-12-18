"use client"

import { useState } from "react"
import type { SectionContent, SectionStyle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MultiStepFormProps {
  content: SectionContent
  style: SectionStyle
}

export function MultiStepForm({ content, style }: MultiStepFormProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  return (
    <section
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        padding: style.padding,
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold text-center mb-8">{content.title as string}</h2>

        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                i + 1 === step ? "bg-blue-500 text-white" : i + 1 < step ? "bg-green-500 text-white" : "bg-white/10"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
              <Input placeholder="Full Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Phone Number" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Company Details</h3>
              <Input placeholder="Company Name" />
              <Input placeholder="Role" />
              <Input placeholder="Company Size" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-4">Your Needs</h3>
              <textarea
                className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-4"
                placeholder="Tell us about your project..."
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              Previous
            </Button>
            <Button onClick={() => setStep(Math.min(totalSteps, step + 1))}>
              {step === totalSteps ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
