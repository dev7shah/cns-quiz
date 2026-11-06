"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import {
  useQuizRecordsStore,
  QuizSubmission,
  downloadSubmissionsCSV,
} from "@/lib/quizRecordsStore"
import { SYLLABUS } from "@/lib/syllabus"
import { WP_SYLLABUS } from "@/lib/syllabus/wpSyllabus"
import { TOA_SYLLABUS } from "@/lib/syllabus/toaSyllabus"
import {
  useAcademicStore,
  ACADEMIC_SUBJECTS,
  OTHER_SUBJECTS_DETAILS,
  AcademicMilestone,
} from "@/lib/academicStore"
import { useMounted } from "@/hooks/useMounted"
import { FacultyLoginForm } from "@/components/auth/FacultyLoginForm"
import { StudentMarksView } from "@/components/academic/StudentMarksView"
import {
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  X,
  FileText,
  Presentation,
  GraduationCap,
  Sparkles,
  Download,
} from "lucide-react"

interface SubjectModule {
  id: string
  code: string
  title: string
  hours: number | string
  bloom?: string
  description?: string
  topics: {
    id?: string
    topicNum: number
    title: string
    hours?: number | string
    bloom?: string
    description?: string
  }[]
}

const getSubjectModules = (subjectCode: string): SubjectModule[] => {
  if (subjectCode === "CSC602") {
    return SYLLABUS.map((m) => ({
      id: m.id,
      code: m.code,
      title: m.title,
      hours: m.hours,
      bloom: m.bloomRange,
      description: m.description,
      topics: m.topics.map((t, idx) => ({
        id: t.id,
        topicNum: idx + 1,
        title: t.title,
        hours: t.hours,
        bloom: t.bloom,
        description: t.description,
      })),
    }))
  }

  if (subjectCode === "ITC504") {
    return WP_SYLLABUS.map((m) => ({
      id: m.id,
      code: m.code,
      title: m.title,
      hours: m.hours,
      bloom: m.bloomRange,
      description: m.description,
      topics: m.topics.map((t, idx) => ({
        id: t.id,
        topicNum: idx + 1,
        title: t.title,
        hours: t.hours,
        bloom: t.bloom,
        description: t.description,
      })),
    }))
  }

  if (subjectCode === "TOA") {
    return TOA_SYLLABUS.map((m) => ({
      id: m.id,
      code: m.code,
      title: m.title,
      hours: m.hours,
      bloom: m.bloomRange,
      description: m.description,
      topics: m.topics.map((t, idx) => ({
        id: t.id,
        topicNum: idx + 1,
        title: t.title,
        hours: t.hours,
        bloom: t.bloom,
        description: t.description,
      })),
    }))
  }

  const details = OTHER_SUBJECTS_DETAILS[subjectCode]
  if (details) {
    return details.units.map((u) => ({
      id: `${subjectCode.toLowerCase()}-${u.code.toLowerCase()}`,
      code: u.code,
      title: u.title,
      hours: 7.5,
      bloom: "Bloom L1–L4",
      description: u.desc,
      topics: u.topics.map((title, idx) => ({
        topicNum: idx + 1,
        title,
        hours: 1.5,
        bloom: "L2–L3",
      })),
    }))
  }

  return []
}

export default function TeacherPortalPage() {
  const router = useRouter()
  const { role, teacher, student, isAuthenticated, logout } = useAuthStore()
  const {
    submissions,
    deleteSubmission,
    resetToDefaultSubmissions,
    clearAllSubmissions,
    addMockSubmission,
  } = useQuizRecordsStore()

  const {
    moduleProgress,
    milestones,
    studentMarks,
    setPortionProgress,
    toggleTopicCovered,
    isTopicCompleted,
    updateMilestone,
  } = useAcademicStore()

  const mounted = useMounted()

  // Core Subject-First state
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [subjectTab, setSubjectTab] = useState<"portion" | "marks" | "modules" | "milestones" | "quiz-ledger">("portion")
  const [toastMessage, setToastMessage] = useState("")

  // Search & Filter state for quiz ledger
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMode, setSelectedMode] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "accuracy" | "marks">("date")
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Milestone editing inline state
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editVenue, setEditVenue] = useState("")
  const [editStatus, setEditStatus] = useState<AcademicMilestone["status"]>("upcoming")
  const [editMarks, setEditMarks] = useState<number>(20)
  const [editGuidelines, setEditGuidelines] = useState("")

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const handleStartEditMilestone = (m: AcademicMilestone) => {
    setEditingMilestoneId(m.id)
    setEditDate(m.date)
    setEditTime(m.time || "")
    setEditVenue(m.venue || "")
    setEditStatus(m.status)
    setEditMarks(m.maxMarks)
    setEditGuidelines(m.guidelines)
  }

  const handleSaveMilestone = (id: string) => {
    updateMilestone(id, {
      date: editDate,
      time: editTime,
      venue: editVenue,
      status: editStatus,
      maxMarks: Number(editMarks) || 20,
      guidelines: editGuidelines,
    })
    setEditingMilestoneId(null)
    showToast("Milestone schedule updated successfully!")
  }

  // Filtered quiz submissions
  const filteredSubmissions = useMemo(() => {
    let list = submissions.filter((sub) => {
      const matchQuery =
        sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.batch && sub.batch.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchMode =
        selectedMode === "all" ||
        sub.mode === selectedMode ||
        (sub.modeTitle && sub.modeTitle.toLowerCase().includes(selectedMode.toLowerCase()))

      return matchQuery && matchMode
    })

    if (sortBy === "date") {
      list = [...list].sort((a, b) => b.timestamp - a.timestamp)
    } else if (sortBy === "accuracy") {
      list = [...list].sort((a, b) => b.accuracyRate - a.accuracyRate)
    } else if (sortBy === "marks") {
      list = [...list].sort((a, b) => b.earnedMarks - a.earnedMarks)
    }

    return list
  }, [submissions, searchQuery, selectedMode, sortBy])

  // Class KPI calculations
  const totalSubmissions = submissions.length
  const avgClassAccuracy =
    totalSubmissions > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.accuracyRate, 0) /
            totalSubmissions
        )
      : 0
  const passingCount = submissions.filter((s) => s.accuracyRate >= 60).length
  const passRate =
    totalSubmissions > 0 ? Math.round((passingCount / totalSubmissions) * 100) : 0
  const distinctionCount = submissions.filter((s) => s.accuracyRate >= 85).length
  const distinctionRate =
    totalSubmissions > 0 ? Math.round((distinctionCount / totalSubmissions) * 100) : 0

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-ink-soft animate-pulse">
          Loading Faculty Portal...
        </div>
      </div>
    )
  }

  // If not logged in as teacher, show dedicated faculty login form
  if (!isAuthenticated || role !== "teacher") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 font-sans space-y-6">
        {isAuthenticated && role === "student" && student && (
          <div className="p-4 bg-warn/15 border border-warn text-ink text-xs font-mono">
            ⚠️ Active student session detected ({student.name} · {student.rollNo}). Access to the Faculty Examiner Gradebook requires verified faculty credentials. Enter faculty email and password below.
          </div>
        )}
        <div className="bg-card border-2 border-ink p-8 shadow-[6px_6px_0_var(--rule)]">
          <FacultyLoginForm />
        </div>
      </div>
    )
  }

  // Active subject information
  const activeSubjectInfo = ACADEMIC_SUBJECTS.find((s) => s.code === selectedSubject)
  const currentSubjectModules = selectedSubject ? getSubjectModules(selectedSubject) : []

  // Calculate portion coverage stats for a subject
  const getSubjectPortionStats = (modules: SubjectModule[]) => {
    let totalTopics = 0
    let completedTopics = 0

    modules.forEach((mod) => {
      totalTopics += mod.topics.length
      mod.topics.forEach((t) => {
        if (isTopicCompleted(mod.id, t.topicNum)) {
          completedTopics += 1
        }
      })
    })

    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    return { totalTopics, completedTopics, percentage }
  }

  const activeSubjectStats = getSubjectPortionStats(currentSubjectModules)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-ok/10 border-2 border-ok text-ok font-mono text-xs flex items-center justify-between gap-3 shadow-[2px_2px_0_var(--ok)] animate-in fade-in sticky top-16 z-40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage("")} className="hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Faculty Header */}
      <div className="bg-card border-2 border-ink p-6 sm:p-8 shadow-[6px_6px_0_var(--rule)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rule pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[11px] font-bold uppercase tracking-wider">
                Faculty Instructor Portal
              </span>
              <span className="font-mono text-xs text-ink-soft">
                TCET LMS · Thakur College of Engineering &amp; Technology
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink pt-1.5">
              {teacher?.name || "Faculty Examiner"}
            </h1>
            <p className="font-mono text-xs text-ink-soft">
              {teacher?.designation || "Course In-Charge"} · {teacher?.department || "Computer Engineering (CMPN)"} {teacher?.employeeId ? `· ID: ${teacher.employeeId}` : ""} {teacher?.cabin ? `· Cabin: ${teacher.cabin}` : ""}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {selectedSubject && (
              <button
                type="button"
                onClick={() => setSelectedSubject(null)}
                className="px-3.5 py-2 border border-ink bg-paper hover:bg-signal hover:text-paper font-mono text-xs uppercase font-bold tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_var(--rule)]"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>My Subjects Grid</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => downloadSubmissionsCSV(submissions)}
              className="px-3.5 py-2 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase font-bold tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Download CSV of all student scores"
            >
              <span>📥</span> Export CSV
            </button>

            <button
              type="button"
              onClick={() => {
                logout()
                router.push("/")
              }}
              className="px-3 py-2 border border-rule hover:border-bad bg-paper font-mono text-xs uppercase text-bad transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: FACULTY SUBJECTS GRID (When no subject is selected)                */}
      {/* ========================================================================= */}
      {!selectedSubject && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-ink pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-ok text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                  Course Instruction · {ACADEMIC_SUBJECTS.length} Subjects
                </span>
                <span className="font-mono text-xs text-ink-soft">
                  Thakur College of Engineering &amp; Technology · Autonomous
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-signal" />
                <span>My Assigned Subjects &amp; Courses</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1 max-w-2xl leading-relaxed">
                Select any subject to enter its dedicated instructor workspace. Mark lecture topics as done or pending,
                grade continuous assessment evaluations, and launch classroom presentation slides.
              </p>
            </div>
          </div>

          {/* Grid of 6 Subjects for Faculty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMIC_SUBJECTS.map((sub) => {
              const subModules = getSubjectModules(sub.code)
              const stats = getSubjectPortionStats(subModules)
              const isAssigned = teacher?.name && sub.inCharge.includes(teacher.name.split(" ")[1] || "None")
              const subMarksCount = studentMarks.filter((m) => m.subjectCode === sub.code).length

              return (
                <div
                  key={sub.code}
                  onClick={() => {
                    setSelectedSubject(sub.code)
                    setSubjectTab("portion")
                  }}
                  className="p-6 border-2 border-ink bg-card hover:border-signal hover:shadow-[6px_6px_0_var(--signal)] transition-all flex flex-col justify-between cursor-pointer group shadow-[4px_4px_0_var(--rule)]"
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-paper border border-rule font-mono text-[10px] text-ink-soft font-bold">
                        {sub.semester}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 bg-paper border border-rule text-ink-soft">
                          {sub.credits} Credits
                        </span>
                        {isAssigned && (
                          <span className="px-1.5 py-0.5 bg-ok/10 border border-ok/30 text-ok font-bold uppercase">
                            Your Course
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="font-serif text-xl font-bold text-ink group-hover:text-signal transition-colors leading-snug">
                        {sub.name}
                      </h3>
                      <p className="font-mono text-xs text-ink-soft mt-1">
                        In-Charge: <strong className="text-ink">{sub.inCharge}</strong>
                      </p>
                      <p className="font-mono text-[11px] text-ink-soft/80">
                        {sub.department} · {sub.semester}
                      </p>
                    </div>

                    {/* Live Portion Completion Bar */}
                    <div className="p-3 bg-paper border border-rule space-y-2">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="text-[10px] uppercase text-ink-soft font-bold">Portion Covered</span>
                        <strong className="text-signal">{stats.percentage}%</strong>
                      </div>
                      <div className="h-2 w-full bg-rule/30 rounded-xs overflow-hidden">
                        <div
                          className="bg-ok h-full transition-all duration-300"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center font-mono text-[10px] text-ink-soft">
                        <span>{stats.completedTopics} of {stats.totalTopics} topics taught</span>
                        <span>{subModules.length} Modules</span>
                      </div>
                    </div>

                    {/* Class Ledger Summary */}
                    <div className="flex items-center justify-between font-mono text-xs text-ink-soft border-t border-rule pt-2">
                      <span>{subMarksCount} Students Graded</span>
                      <span className="text-ok font-semibold">Ready for Review</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-rule mt-4 flex justify-end">
                    <button
                      type="button"
                      className="w-full py-2.5 bg-ink text-paper group-hover:bg-signal font-mono text-xs uppercase font-bold transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_var(--rule)]"
                    >
                      <span>Enter Subject Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SELECTED SUBJECT WORKSPACE (Mark Done, Marks, Slides & Dates)      */}
      {/* ========================================================================= */}
      {selectedSubject && activeSubjectInfo && (
        <div className="space-y-6">
          {/* Top Switcher & Return Bar */}
          <div className="p-4 bg-card border border-ink flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <button
              onClick={() => setSelectedSubject(null)}
              className="px-3.5 py-1.5 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>← Back to My Assigned Subjects</span>
            </button>

            {/* Quick Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-ink-soft uppercase text-[10px] font-bold mr-1">Switch:</span>
              {ACADEMIC_SUBJECTS.map((sub) => (
                <button
                  key={sub.code}
                  onClick={() => {
                    setSelectedSubject(sub.code)
                    setSubjectTab("portion")
                  }}
                  className={`px-2.5 py-1 border text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    selectedSubject === sub.code
                      ? "bg-signal text-paper border-signal"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  {sub.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Header Banner */}
          <div className="p-6 sm:p-8 bg-card border-2 border-ink shadow-[6px_6px_0_var(--rule)] space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rule pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-signal text-paper font-mono text-[10px] font-bold uppercase tracking-wider">
                    Course: {activeSubjectInfo.code}
                  </span>
                  <span className="font-mono text-xs text-ink-soft">
                    {activeSubjectInfo.department} · {activeSubjectInfo.semester}
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-ink">
                  {activeSubjectInfo.name}
                </h2>
                <p className="font-mono text-xs text-ink-soft mt-1">
                  Faculty In-Charge: <strong className="text-ink">{activeSubjectInfo.inCharge}</strong> · {activeSubjectInfo.credits} Academic Credits
                </p>
              </div>

              {/* Overall Subject Portion Gauge */}
              <div className="p-4 bg-paper border border-ink text-right font-mono min-w-[200px]">
                <span className="text-[10px] uppercase text-ink-soft block font-bold">
                  Class Portion Covered
                </span>
                <div className="text-3xl font-bold text-signal">
                  {activeSubjectStats.percentage}%
                </div>
                <span className="text-[11px] text-ink-soft block">
                  {activeSubjectStats.completedTopics} of {activeSubjectStats.totalTopics} topics taught
                </span>
              </div>
            </div>

            {/* Subject Workspace Tabs */}
            <div className="overflow-x-auto pb-2 border-b-2 border-ink -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 font-mono text-xs w-max sm:w-full">
                <button
                  onClick={() => setSubjectTab("portion")}
                  className={`px-4 py-2 uppercase font-bold flex items-center gap-2 border shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    subjectTab === "portion"
                      ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>1. Portion Coverage &amp; Mark Topics Done</span>
                </button>

                <button
                  onClick={() => setSubjectTab("marks")}
                  className={`px-4 py-2 uppercase font-bold flex items-center gap-2 border shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    subjectTab === "marks"
                      ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>2. Student Marks &amp; Grading</span>
                </button>

                <button
                  onClick={() => setSubjectTab("modules")}
                  className={`px-4 py-2 uppercase font-bold flex items-center gap-2 border shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    subjectTab === "modules"
                      ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <Presentation className="h-4 w-4" />
                  <span>3. Syllabus Modules &amp; Slides [P]</span>
                </button>

                <button
                  onClick={() => setSubjectTab("milestones")}
                  className={`px-4 py-2 uppercase font-bold flex items-center gap-2 border shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    subjectTab === "milestones"
                      ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>4. Exam Milestones &amp; Dates</span>
                </button>

                <button
                  onClick={() => setSubjectTab("quiz-ledger")}
                  className={`px-4 py-2 uppercase font-bold flex items-center gap-2 border shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                    subjectTab === "quiz-ledger"
                      ? "bg-signal text-paper border-signal shadow-[3px_3px_0_var(--ink)]"
                      : "bg-paper text-ink border-rule hover:border-ink"
                  }`}
                >
                  <span>5. Quiz Ledger ({submissions.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: PORTION PROGRESS & MARK TOPICS DONE (Interactive Checklist)         */}
          {/* ========================================================================= */}
          {subjectTab === "portion" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Lecture Portion Progress &amp; Topic Completion Checklist
                  </h3>
                  <p className="text-xs text-ink-soft font-mono">
                    Mark topics as covered in class or pending. Student dashboard updates automatically in real time.
                  </p>
                </div>
                <span className="font-mono text-xs text-ok font-bold">
                  {activeSubjectStats.completedTopics} of {activeSubjectStats.totalTopics} Topics Taught ({activeSubjectStats.percentage}%)
                </span>
              </div>

              {/* Module-by-Module Breakdown and Interactive Checklist */}
              <div className="space-y-6">
                {currentSubjectModules.map((mod) => {
                  const modProgress = moduleProgress[mod.id]
                  const completedInMod = mod.topics.filter((t) => isTopicCompleted(mod.id, t.topicNum)).length
                  const modPercent = mod.topics.length > 0 ? Math.round((completedInMod / mod.topics.length) * 100) : 0

                  return (
                    <div
                      key={mod.id}
                      className="border-2 border-ink bg-card p-6 shadow-[4px_4px_0_var(--rule)] space-y-4"
                    >
                      {/* Module Title and Status Strip */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rule pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                              {mod.code}
                            </span>
                            <span className="font-mono text-xs text-ink-soft font-semibold">
                              {mod.hours} Hours · {mod.bloom || "Bloom L1–L4"}
                            </span>
                          </div>
                          <h4 className="font-serif text-xl font-bold text-ink mt-1">
                            {mod.title}
                          </h4>
                          {mod.description && (
                            <p className="text-xs text-ink-soft font-sans mt-0.5 max-w-2xl">
                              {mod.description}
                            </p>
                          )}
                        </div>

                        {/* Batch Selector & Progress Count */}
                        <div className="flex flex-col sm:items-end gap-2 shrink-0">
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-ink-soft uppercase text-[10px]">Batch Cover:</span>
                            <select
                              value={modProgress?.completedUpTo ?? 0}
                              onChange={(e) => {
                                const val = Number(e.target.value)
                                setPortionProgress(mod.id, val, mod.topics.length, teacher?.name)
                                showToast(`Set ${mod.code} covered up to Topic ${val}`)
                              }}
                              className="px-2 py-1 bg-paper border border-ink font-mono text-xs text-ink rounded-xs"
                            >
                              {Array.from({ length: mod.topics.length + 1 }, (_, i) => (
                                <option key={i} value={i}>
                                  {i === 0 ? "Not Started (0)" : `Up to Part ${i}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="font-mono text-xs font-bold text-ok">
                            ✓ {completedInMod} of {mod.topics.length} covered ({modPercent}%)
                          </span>
                        </div>
                      </div>

                      {/* Topic-by-Topic Interactive Checklist */}
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] text-ink-soft uppercase tracking-wider block font-bold">
                          Subtopics ({mod.topics.length} Units) · Click to Toggle Done / Pending:
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mod.topics.map((t) => {
                            const isDone = isTopicCompleted(mod.id, t.topicNum)

                            return (
                              <div
                                key={t.topicNum}
                                className={`p-3 border flex items-center justify-between gap-3 text-xs transition-colors ${
                                  isDone
                                    ? "bg-ok/5 border-ok/40"
                                    : "bg-paper border-rule"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-mono text-[10px] font-bold text-ink-soft">
                                      Part {t.topicNum}
                                    </span>
                                    {isDone ? (
                                      <span className="px-1.5 py-0.2 bg-ok/10 text-ok border border-ok/30 font-mono text-[9px] font-bold">
                                        Covered
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 bg-card text-ink-soft border border-rule font-mono text-[9px]">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-sans font-bold text-ink block truncate" title={t.title}>
                                    {t.title}
                                  </span>
                                  {t.description && (
                                    <p className="text-[11px] text-ink-soft line-clamp-1 font-sans mt-0.5">
                                      {t.description}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleTopicCovered(mod.id, t.topicNum, teacher?.name)
                                    showToast(
                                      `Marked ${mod.code} Part ${t.topicNum} as ${
                                        isDone ? "Pending" : "Covered"
                                      }`
                                    )
                                  }}
                                  className={`px-3 py-1.5 font-mono text-xs uppercase font-bold border transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                    isDone
                                      ? "bg-ok text-paper border-ok hover:bg-bad hover:border-bad"
                                      : "bg-card text-ink border-rule hover:border-ok hover:text-ok"
                                  }`}
                                  title={isDone ? "Click to mark as not covered" : "Click to mark as covered in class"}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>{isDone ? "Covered ✓" : "Mark Done"}</span>
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STUDENT MARKS & GRADING (Filtered to Active Subject)               */}
          {/* ========================================================================= */}
          {subjectTab === "marks" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Continuous Evaluation Marks &amp; Student Grading · {activeSubjectInfo.code}
                  </h3>
                  <p className="text-xs text-ink-soft font-mono">
                    Grade ISE 1, FA 1, ISE 2, ISE 3, FA 2, and Term Work for all enrolled students.
                  </p>
                </div>
              </div>

              {/* High-fidelity marks view filtered to this subject */}
              <StudentMarksView isFaculty={true} filterSubjectCode={selectedSubject} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SYLLABUS MODULES & PRESENTATION SLIDES                             */}
          {/* ========================================================================= */}
          {subjectTab === "modules" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Classroom Presentation Slides &amp; Scrollytelling
                  </h3>
                  <p className="text-xs text-ink-soft font-mono">
                    Launch high-contrast classroom slide decks [P] optimized for projector teaching.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSubjectModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-5 border bg-card hover:border-signal transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                          {mod.code}
                        </span>
                        <span className="font-mono text-xs text-ink-soft">{mod.hours} Hours</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-ink">
                        {mod.title}
                      </h4>
                      {mod.description && (
                        <p className="text-xs text-ink-soft font-sans mt-1 leading-relaxed">
                          {mod.description}
                        </p>
                      )}
                      <div className="mt-3 text-[11px] font-mono text-ink-soft">
                        {mod.topics.length} Teaching Units
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rule flex flex-wrap gap-2">
                      <Link
                        href={`/present/${mod.code.toLowerCase()}/${mod.topics[0]?.id || 'topic1'}`}
                        className="px-3.5 py-1.5 bg-signal text-paper hover:bg-signal/90 font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow-[2px_2px_0_var(--ink)]"
                      >
                        <Presentation className="h-3.5 w-3.5" />
                        <span>Launch Slides [P]</span>
                      </Link>
                      <Link
                        href={`/modules/${mod.id}`}
                        className="px-3 py-1.5 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase text-ink flex items-center gap-1"
                      >
                        <span>View Theory</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EXAM MILESTONES & DATES (Editable Schedule)                        */}
          {/* ========================================================================= */}
          {subjectTab === "milestones" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-rule pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    Official Assessment Calendar &amp; Milestones
                  </h3>
                  <p className="text-xs text-ink-soft font-mono">
                    Edit exam dates, venues, time windows, and submission deadlines.
                  </p>
                </div>
              </div>

              {/* Milestone Cards with Faculty Edit Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.map((m) => {
                  const isEditing = editingMilestoneId === m.id

                  return (
                    <div
                      key={m.id}
                      className="p-5 border-2 border-ink bg-card space-y-4 shadow-[3px_3px_0_var(--rule)]"
                    >
                      <div className="flex justify-between items-start gap-2 border-b border-rule pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-ink text-paper font-mono text-xs font-bold">
                              {m.code}
                            </span>
                            <span className="font-mono text-[10px] uppercase text-ink-soft font-bold">
                              {m.position}
                            </span>
                          </div>
                          <h4 className="font-serif text-lg font-bold text-ink mt-1">
                            {m.title}
                          </h4>
                        </div>

                        {!isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleStartEditMilestone(m)}
                            className="px-2.5 py-1 border border-rule hover:border-ink bg-paper font-mono text-xs uppercase flex items-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSaveMilestone(m.id)}
                              className="px-2.5 py-1 bg-ok text-paper font-mono text-xs font-bold uppercase flex items-center gap-1"
                            >
                              <Save className="h-3 w-3" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMilestoneId(null)}
                              className="px-2 py-1 border border-rule font-mono text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {!isEditing ? (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 border border-rule bg-paper">
                              <span className="text-[10px] text-ink-soft block uppercase font-bold">Date</span>
                              <strong className="text-ink">{m.date}</strong>
                            </div>
                            <div className="p-2 border border-rule bg-paper">
                              <span className="text-[10px] text-ink-soft block uppercase font-bold">Time Window</span>
                              <strong className="text-ink">{m.time}</strong>
                            </div>
                            <div className="p-2 border border-rule bg-paper">
                              <span className="text-[10px] text-ink-soft block uppercase font-bold">Venue</span>
                              <span className="text-ink truncate block" title={m.venue}>{m.venue}</span>
                            </div>
                            <div className="p-2 border border-rule bg-paper">
                              <span className="text-[10px] text-ink-soft block uppercase font-bold">Max Marks</span>
                              <strong className="text-signal">{m.maxMarks} Marks</strong>
                            </div>
                          </div>

                          <div className="text-[11px] font-sans text-ink-soft">
                            <strong className="font-mono text-[10px] uppercase text-ink block">Syllabus Scope:</strong>
                            <p>{m.syllabusCoverage}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase text-ink-soft block font-bold">Date</label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="w-full px-2 py-1 bg-paper border border-ink font-mono text-xs mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase text-ink-soft block font-bold">Time</label>
                              <input
                                type="text"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                className="w-full px-2 py-1 bg-paper border border-ink font-mono text-xs mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase text-ink-soft block font-bold">Venue</label>
                              <input
                                type="text"
                                value={editVenue}
                                onChange={(e) => setEditVenue(e.target.value)}
                                className="w-full px-2 py-1 bg-paper border border-ink font-mono text-xs mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase text-ink-soft block font-bold">Max Marks</label>
                              <input
                                type="number"
                                value={editMarks}
                                onChange={(e) => setEditMarks(Number(e.target.value))}
                                className="w-full px-2 py-1 bg-paper border border-ink font-mono text-xs mt-0.5"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-ink-soft block font-bold">Guidelines</label>
                            <textarea
                              value={editGuidelines}
                              onChange={(e) => setEditGuidelines(e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 bg-paper border border-ink font-mono text-xs mt-0.5"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: QUIZ LEDGER & SUBMISSIONS                                          */}
          {/* ========================================================================= */}
          {subjectTab === "quiz-ledger" && (
            <div className="space-y-6">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-paper border border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                    Total Submissions
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
                    {totalSubmissions}
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                    Active ledger entries
                  </span>
                </div>

                <div className="p-4 bg-paper border border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                    Class Avg Accuracy
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl text-signal font-bold mt-1">
                    {avgClassAccuracy}%
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                    Benchmark: 70% target
                  </span>
                </div>

                <div className="p-4 bg-paper border border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                    Passing Rate
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl text-ok font-bold mt-1">
                    {passRate}%
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                    Score ≥ 60% ({passingCount}/{totalSubmissions})
                  </span>
                </div>

                <div className="p-4 bg-paper border border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft block font-bold">
                    Distinction Rate
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl text-ink font-bold mt-1">
                    {distinctionRate}%
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft mt-0.5 block">
                    Score ≥ 85% ({distinctionCount}/{totalSubmissions})
                  </span>
                </div>
              </div>

              {/* Main Ledger Section */}
              <div className="bg-card border border-rule space-y-5 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-ink">
                      Student Assessment Gradebook · {activeSubjectInfo.code}
                    </h2>
                    <p className="text-xs text-ink-soft">
                      Real-time student quiz logs recorded across all terminal stations.
                    </p>
                  </div>

                  {/* Search & Mode Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Name or Roll No..."
                      className="px-3 py-1.5 bg-paper border border-rule focus:border-signal focus:outline-none font-mono text-xs text-ink w-48 sm:w-60"
                    />

                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="px-2.5 py-1.5 bg-paper border border-rule focus:border-signal font-mono text-xs text-ink"
                    >
                      <option value="all">All Quiz Modes</option>
                      <option value="m1">Module M1</option>
                      <option value="m2">Module M2</option>
                      <option value="m3">Module M3</option>
                      <option value="m4">Module M4</option>
                      <option value="m5">Module M5</option>
                      <option value="m6">Module M6</option>
                      <option value="all-syllabus">Full Syllabus</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "accuracy" | "marks")}
                      className="px-2.5 py-1.5 bg-paper border border-rule focus:border-signal font-mono text-xs text-ink"
                    >
                      <option value="date">Sort: Latest First</option>
                      <option value="accuracy">Sort: Highest Accuracy</option>
                      <option value="marks">Sort: Highest Marks</option>
                    </select>
                  </div>
                </div>

                {/* Table of Submissions */}
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <p className="font-mono text-sm text-ink-soft">
                      No submissions match the current filter or search criteria.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedMode("all")
                      }}
                      className="text-xs text-signal underline font-mono"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-rule">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-paper border-b border-rule uppercase text-ink-soft">
                        <tr>
                          <th className="p-3">Student</th>
                          <th className="p-3">Roll No</th>
                          <th className="p-3">Batch</th>
                          <th className="p-3">Assessment Mode</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Accuracy</th>
                          <th className="p-3">Time</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rule">
                        {filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-paper/60 transition-colors">
                            <td className="p-3 font-sans font-bold text-ink">
                              {sub.studentName}
                            </td>
                            <td className="p-3 text-signal">{sub.rollNo}</td>
                            <td className="p-3">{sub.batch || "A1"}</td>
                            <td className="p-3">{sub.modeTitle}</td>
                            <td className="p-3 font-bold text-ink">
                              {sub.earnedMarks} / {sub.totalMarks}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-1.5 py-0.5 rounded-xs font-bold ${
                                  sub.accuracyRate >= 85
                                    ? "bg-ok/20 text-ok"
                                    : sub.accuracyRate >= 60
                                    ? "bg-signal/20 text-signal"
                                    : "bg-bad/20 text-bad"
                                }`}
                              >
                                {sub.accuracyRate}%
                              </span>
                            </td>
                            <td className="p-3 text-ink-soft">
                              {Math.floor(sub.durationSec / 60)}m {sub.durationSec % 60}s
                            </td>
                            <td className="p-3 text-ink-soft">
                              {new Date(sub.timestamp).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => setSelectedSubmission(sub)}
                                className="text-signal hover:underline font-bold"
                              >
                                Inspect
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSubmission(sub.id)}
                                className="text-bad hover:underline"
                                title="Delete record"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal for Selected Submission */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border-2 border-ink max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-rule pb-3">
              <div>
                <span className="font-mono text-xs text-signal font-bold uppercase">
                  Submission Detail
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {selectedSubmission.studentName}
                </h3>
                <p className="font-mono text-xs text-ink-soft">
                  Roll No: {selectedSubmission.rollNo} · {selectedSubmission.batch || "A1"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-ink-soft hover:text-ink text-xl font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Mode</span>
                <span className="font-bold text-ink">{selectedSubmission.modeTitle}</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Accuracy</span>
                <span className="font-bold text-signal text-base">{selectedSubmission.accuracyRate}%</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Marks</span>
                <span className="font-bold text-ink text-base">{selectedSubmission.earnedMarks} / {selectedSubmission.totalMarks}</span>
              </div>
              <div className="p-3 bg-paper border border-rule">
                <span className="text-ink-soft block text-[10px] uppercase">Duration</span>
                <span className="font-bold text-ink">{Math.floor(selectedSubmission.durationSec / 60)}m {selectedSubmission.durationSec % 60}s</span>
              </div>
            </div>

            {selectedSubmission.moduleBreakdown && (
              <div className="space-y-2 border-t border-rule pt-3">
                <h4 className="font-serif font-bold text-sm text-ink">
                  Module Accuracy Breakdown
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {Object.entries(selectedSubmission.moduleBreakdown).map(
                    ([mod, stats]) => (
                      <div
                        key={mod}
                        className="flex justify-between items-center p-2 bg-paper border border-rule text-[11px]"
                      >
                        <span className="font-bold text-ink">{mod}</span>
                        <span>{stats.correct} / {stats.total} ({stats.rate}%)</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-rule">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-1.5 bg-ink text-paper hover:bg-signal font-mono text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border-2 border-bad max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-bad">
              Confirm Purge
            </h3>
            <p className="text-xs text-ink-soft">
              Are you sure you want to delete all student submissions from this local browser session? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 border border-rule text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllSubmissions()
                  setShowClearConfirm(false)
                }}
                className="px-3 py-1.5 bg-bad text-paper text-xs font-mono uppercase font-bold"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
