// pages/results/ResultsDetailPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for the student result detail
const mockResultData = {
  student: {
    id: '1',
    name: 'Jameson Black',
    email: 'jamesonblack@springhill.com',
    student_id: 'STU156',
    class: 'SS1 A',
    section: 'Section A',
    avatar: '/avatar-student.png',
  },
  exam: {
    title: 'Mathematics Finals',
    class: 'SS1 A',
    date: 'Feb 5, 2026',
    students: 62,
    total_marks: 100,
    pass_mark: 50,
  },
  scores: {
    mcq_score: 40,
    mcq_total: 60,
    theory_score: 0,
    theory_total: 40,
    total_score: 40,
    grade: 'D',
    position: '6TH',
  },
  mcq_questions: [
    {
      id: '1',
      type: 'MCQ',
      marks: 1,
      question: 'Which of the following is Newton\'s Second Law of Motion?',
      options: [
        'A. An object at rest stays at rest unless acted upon by an external force',
        'B. F = ma (Force equals mass times acceleration)',
        'C. For every action, there is an equal and opposite reaction',
        'D. Energy cannot be created or destroyed',
      ],
      correct_answer: 'B',
      student_answer: 'B',
      is_correct: true,
    },
    {
      id: '2',
      type: 'MCQ',
      marks: 1,
      question: 'What is the SI unit of electric current?',
      options: ['A. Volt', 'B. Watt', 'C. Ampere', 'D. Ohm'],
      correct_answer: 'C',
      student_answer: 'C',
      is_correct: true,
    },
    {
      id: '3',
      type: 'True/False',
      marks: 1,
      question: 'What is the SI unit of electric current?',
      options: ['True', 'False'],
      correct_answer: 'True',
      student_answer: 'True',
      is_correct: true,
    },
  ],
  theory_questions: [
    {
      id: '1',
      type: 'Essay',
      marks: 15,
      question: 'Explain the theory of relativity',
      student_answer: 'Space and time are relative and interconnected.',
      teacher_feedback: 'This was easy me',
      score: 10,
    },
  ],
};

export default function ResultsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [data] = useState(mockResultData);

  const toggleAnswer = (id: string) => {
    setShowAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success('Result downloaded as PDF');
  };

  const { student, exam, scores, mcq_questions, theory_questions } = data;

  return (
    <div className="space-y-4 max-w-full mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button onClick={() => navigate('/results')} className="hover:text-navy">
          Results
        </button>
        <span>›</span>
        <button onClick={() => navigate('/results')} className="hover:text-navy">
          View Results
        </button>
        <span>›</span>
        <span className="text-navy font-medium">{student.name}</span>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto">
        
      <div className="card p-5 print:p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/results')}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-navy">{exam.title}</h1>
              <p className="text-sm text-gray-400">
                {exam.class} · {exam.date} · {exam.students} students
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="mt-4 bg-primary-light/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-navy text-lg">{student.name}</h3>
              <p className="text-xs text-gray-500">
                {student.student_id} · {student.class} · {student.section}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-navy">
              {scores.total_score}
              <span className="text-sm font-normal text-gray-400">/{exam.total_marks}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400">Grade:</span>
              <span className="text-lg font-black text-primary">{scores.grade}</span>
            </div>
            <p className="text-xs text-gray-400">Position: {scores.position}</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400">MCQ Score</p>
            <p className="text-lg font-bold text-navy">
              {scores.mcq_score}
              <span className="text-sm font-normal text-gray-400">/{scores.mcq_total}</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400">Theory Score</p>
            <p className="text-lg font-bold text-navy">
              {scores.theory_score}
              <span className="text-sm font-normal text-gray-400">/{scores.theory_total}</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400">Total Score</p>
            <p className="text-lg font-bold text-navy">
              {scores.total_score}
              <span className="text-sm font-normal text-gray-400">/{exam.total_marks}</span>
            </p>
          </div>
        </div>
      </div>

      {/* MCQ Section */}
      <div className="card p-5 print:p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-navy">Multi-Choice Questions</h3>
            <p className="text-xs text-gray-400">
              {scores.mcq_score}/{scores.mcq_total} correct
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">
            Score: {scores.mcq_score}/{scores.mcq_total}
          </span>
        </div>

        <div className="space-y-4">
          {mcq_questions.map((q, index) => (
            <div key={q.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-navy text-white rounded text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {q.type}
                </span>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {q.marks}M
                </span>
                {q.is_correct ? (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">
                    ✓ Correct
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">
                    ✗ Incorrect
                  </span>
                )}
              </div>
              <p className="text-sm text-navy font-medium mb-2">{q.question}</p>
              <div className="space-y-1">
                {q.options.map((option, i) => {
                  const letter = option.charAt(0);
                  const isCorrect = letter === q.correct_answer;
                  const isSelected = letter === q.student_answer;
                  return (
                    <div
                      key={i}
                      className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                          : isCorrect
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                      {isSelected && isCorrect && (
                        <span className="ml-auto text-green-600">✓</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600">✗</span>
                      )}
                      {!isSelected && isCorrect && (
                        <span className="ml-auto text-green-500 text-[10px]">Correct Answer</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theory Section */}
      {theory_questions.length > 0 && (
        <div className="card p-5 print:p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy">Theory Section</h3>
              <p className="text-xs text-gray-400">
                {scores.theory_score}/{scores.theory_total} marks
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">
              Score: {scores.theory_score}/{scores.theory_total}
            </span>
          </div>

          <div className="space-y-4">
            {theory_questions.map((q, index) => (
              <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-navy text-white rounded text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {q.type}
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {q.marks} Marks
                  </span>
                  <button
                    onClick={() => toggleAnswer(q.id)}
                    className="ml-auto text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    {showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}
                    {showAnswers[q.id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  </button>
                </div>
                <p className="text-sm font-medium text-navy mb-3">{q.question}</p>

                {showAnswers[q.id] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-[10px] text-gray-500 mb-1">Model Answer:</p>
                    <p className="text-xs text-gray-700">The laws of physics are the same for all observers, regardless of their relative motion.</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-[10px] text-gray-400 mb-1">Student Answer</p>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600">
                    {q.student_answer}
                  </div>
                </div>

                {q.teacher_feedback && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-500 mb-1">Teacher Feedback</p>
                    <p className="text-xs text-gray-700">{q.teacher_feedback}</p>
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  <span className="text-sm font-semibold text-navy">
                    Score: {q.score}/{q.marks}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Overall Feedback</p>
                <p className="text-sm text-navy font-medium">Good effort, keep practicing!</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Theory Score</p>
                <p className="text-lg font-bold text-navy">
                  {scores.theory_score}/{scores.theory_total}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end print:hidden mt-7">
        <button
          onClick={() => navigate('/results')}
          className="btn-outline text-sm px-6"
        >
          Back to Results
        </button>
        <button
          onClick={() => toast.success('Feedback sent to student')}
          className="btn-primary text-sm px-6"
        >
          Send Feedback
        </button>
      </div>
      </div>
    </div>
  );
}