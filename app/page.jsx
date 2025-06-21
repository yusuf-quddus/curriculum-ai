'use client';
import { useState } from 'react';
import { Loader2, Upload, FileText, Link as LinkIcon, BookOpen } from 'lucide-react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded ' + className}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }) {
  return <div className={'bg-white shadow-md rounded-lg overflow-hidden ' + className}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={'p-4 ' + className}>{children}</div>;
}

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState('');
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleProcess = async () => {
    if (!files.length && !links.trim()) return;
    setLoading(true);
    setCurriculum(null);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    links
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l)
      .forEach((link) => formData.append('links', link));
    formData.append('topic', topic);
    formData.append('grade', grade);

    try {
      const res = await fetch('/api/process', { method: 'POST', body: formData });
      const data = await res.json();

      // If the API returns { output: { summary, objectives, lessonPlan, quizQuestions } }
      const out = data.output || {}; 

      setCurriculum({
        summary:    out.summary    || '',
        objectives: out.objectives || [],
        lessonPlan: out.lessonPlan || [],
        quizQuestions: out.quizQuestions || [],
      });
    } catch (err) {
      console.error(err);
      setCurriculum({
        summary: 'An error occurred while generating curriculum.',
        objectives: [],
        lessonPlan: [],
        quizQuestions: [],
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">📚 Curriculum AI</h1>

      <Card>
        <CardContent className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="font-medium flex items-center text-gray-800">
              <BookOpen className="mr-2" /> Topic of Lecture
            </label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full text-gray-900"
              placeholder="Enter your lecture topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label
              htmlFor="file-upload"
              className="font-medium flex items-center cursor-pointer text-blue-600"
            >
              <Upload className="mr-2" /> Select Files
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.mp3,.wav"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            {files.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-gray-800">
                {files.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Link Input */}
          <div className="space-y-2">
            <label className="font-medium flex items-center text-gray-800">
              <LinkIcon className="mr-2" /> Article/Doc Links (comma-separated)
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full text-gray-900"
              placeholder="https://example.com/article1, https://www.youtube.com/watch..."
              rows={2}
              value={links}
              onChange={(e) => setLinks(e.target.value)}
            />
          </div>

          {/* Grade Selector */}
          <div className="space-y-2">
            <label className="font-medium text-gray-800">Select Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="border rounded px-3 py-2 w-full text-gray-900"
            >
              <option value="">Choose grade</option>
              <option value="K">Kindergarten</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={`${i + 1}`}>{`${i + 1}th Grade`}</option>
              ))}
            </select>
          </div>

          {/* Process Button */}
          <Button
            className="w-full flex justify-center"
            onClick={handleProcess}
            disabled={loading || (!files.length && !links.trim())}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
            Process Inputs
          </Button>
        </CardContent>
      </Card>

      {/* Curriculum Output */}
      {curriculum && (
        <Card>
          <CardContent>
            {/* Summary */}
            {curriculum.summary && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">Summary</h3>
                <p className="text-gray-800">{curriculum.summary}</p>
              </div>
            )}

            {/* Objectives */}
            {curriculum.objectives.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">Objectives</h3>
                <ul className="list-disc list-inside text-gray-800">
                  {curriculum.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lesson Plan */}
            {curriculum.lessonPlan.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">Lesson Plan</h3>
                <ol className="list-decimal list-inside text-gray-800">
                  {curriculum.lessonPlan.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Quiz Questions */}
            {curriculum.quizQuestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1 text-gray-800">Quiz Questions</h3>
                <ul className="space-y-4 text-gray-800">
                  {curriculum.quizQuestions.map((item, i) => (
                    <li key={i}>
                      <p className="font-medium">Q{i + 1}. {item.question}</p>
                      <p className="ml-4">Answer: {item.answer}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
