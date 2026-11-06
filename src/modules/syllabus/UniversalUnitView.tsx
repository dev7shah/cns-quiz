"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ACADEMIC_SUBJECTS, OTHER_SUBJECTS_DETAILS, useAcademicStore } from "@/lib/academicStore"
import { useAuthStore } from "@/lib/authStore"
import { useMounted } from "@/hooks/useMounted"
import { BookOpen, CheckCircle2, ArrowLeft, ArrowRight, Lightbulb, FileText, Award, GraduationCap } from "lucide-react"

export default function UniversalUnitView({ unitSlug }: { unitSlug: string }) {
  const mounted = useMounted()
  const { role, isAuthenticated } = useAuthStore()
  const isTeacher = mounted && isAuthenticated && role === "teacher"
  const { isTopicCompleted, toggleTopicCovered } = useAcademicStore()

  // Parse subject code and unit code from slug like "itc601-m1"
  const parts = unitSlug.toLowerCase().split("-")
  const subjectKey = parts[0]?.toUpperCase() || ""
  const unitCode = parts[1]?.toUpperCase() || ""

  const subjectInfo = ACADEMIC_SUBJECTS.find(s => s.code === subjectKey)
  const subjectDetails = OTHER_SUBJECTS_DETAILS[subjectKey]
  const unit = subjectDetails?.units.find(u => u.code.toLowerCase() === unitCode.toLowerCase())

  if (!subjectDetails || !unit) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl font-mono text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">University Syllabus Unit</h2>
        <p className="text-xs text-ink-soft">Unit specification for {unitSlug} could not be resolved.</p>
        <Link
          href="/student"
          className="inline-flex items-center gap-1 px-4 py-2 bg-ink text-paper text-xs uppercase font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Return to My Subjects
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl space-y-8 font-sans">
      {/* Top Breadcrumb */}
      <div className="border-b border-rule pb-3 flex items-center justify-between font-mono text-xs">
        <Link
          href={isTeacher ? "/teacher" : "/student"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rule hover:border-ink bg-card text-ink font-bold transition-colors shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {subjectInfo?.name || "Subject Workspace"}</span>
        </Link>
        <span className="text-ink-soft uppercase text-[11px]">
          {subjectInfo?.semester} · {subjectInfo?.department}
        </span>
      </div>

      {/* Header Banner */}
      <Card className="border-2 border-ink shadow-[4px_4px_0_var(--rule)] bg-card">
        <CardHeader className="border-b border-rule pb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-ink text-paper font-bold uppercase">{unit.code} Theory Syllabus</span>
            <span className="text-signal font-bold">{subjectInfo?.name}</span>
          </div>
          <CardTitle className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            {unit.title}
          </CardTitle>
          <p className="font-sans text-xs sm:text-sm text-ink-soft leading-relaxed">
            {unit.desc}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="border-b border-rule pb-2">
            <h4 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-signal" />
              <span>Syllabus Topics &amp; Learning Modules</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {unit.topics.map((t, idx) => {
              const isCovered = isTopicCompleted(unitSlug, idx + 1)

              return (
                <div
                  key={t}
                  className={`p-4 border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                    isCovered ? "bg-ok/5 border-ok/40" : "bg-paper border-rule hover:border-ink"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-1.5 py-0.5 bg-card border border-rule text-ink font-bold">
                        Topic {idx + 1}
                      </span>
                      {isCovered && (
                        <span className="px-2 py-0.5 bg-ok/20 text-ok font-bold text-[10px] uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Covered in Class
                        </span>
                      )}
                    </div>
                    <div className="font-serif text-base font-bold text-ink">
                      {t}
                    </div>
                  </div>

                  {isTeacher && (
                    <button
                      onClick={() => toggleTopicCovered(unitSlug, idx + 1, "Faculty Instructor")}
                      className={`px-3 py-1.5 font-mono text-xs uppercase font-bold shrink-0 transition-colors border cursor-pointer ${
                        isCovered
                          ? "bg-ok text-paper border-ok hover:bg-ok/80"
                          : "bg-paper text-ink border-rule hover:border-signal hover:text-signal"
                      }`}
                    >
                      {isCovered ? "✓ Covered" : "Mark Done"}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* University Exam Guidelines */}
      <Card className="border border-ink bg-paper shadow-[3px_3px_0_var(--rule)]">
        <CardHeader className="border-b border-rule pb-3">
          <CardTitle className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-signal" />
            <span>University Autonomous Scheme Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 font-sans text-xs text-ink leading-relaxed space-y-2">
          <p>
            This unit conforms to the Thakur College of Engineering &amp; Technology CBCGS-HME 2023 Autonomous Syllabus.
            Theory examination questions cover Bloom Taxonomy Levels L1 (Remembering), L2 (Understanding), and L3 (Applying).
          </p>
          <p className="text-ink-soft">
            In-Semester Evaluations (ISE) and End-Semester Examinations (ESE) allocate descriptive and analytical marks to the above topics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
