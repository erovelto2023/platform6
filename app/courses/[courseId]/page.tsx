import { getServerSession } from '@/lib/authOptions';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { Product, User } from '@/models';
import { notFound } from 'next/navigation';
import { Lock, Play, FileText, CheckCircle, Video, BookOpen, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  
  // 1. YouTube watch URL
  const ytWatchRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/i;
  const ytMatch = url.match(ytWatchRegex);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  
  // 2. YouTube embed URL directly
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // 3. Groove / videoplayer.gg watch/embed URL
  const grooveRegex = /videoplayer\.gg\/(?:watch|embed)\/([a-zA-Z0-9-]+)/i;
  const grooveMatch = url.match(grooveRegex);
  if (grooveMatch) {
    return `https://videoplayer.gg/embed/${grooveMatch[1]}`;
  }

  // 4. Default fallback: return the URL directly
  return url;
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  await dbConnect();
  const { courseId } = await params;

  // Retrieve course details
  const course = await Product.findById(courseId);
  if (!course) {
    notFound();
  }

  // Check user access
  const session = await getServerSession(authOptions);
  let hasAccess = false;
  let loggedIn = false;

  if (session && session.user) {
    loggedIn = true;
    const user = await User.findById((session.user as any).id);
    if (user && user.hasAccess.includes(courseId)) {
      hasAccess = true;
    }
  }

  // Mock course content structure
  let modules = [
    {
      title: 'Module 1: The Positive Foundation',
      lessons: [
        { title: '1.1 Principles of Classical Conditioning', duration: '12 mins', status: 'completed', description: 'Explore Pavlovian triggers and positive reinforcement models.' },
        { title: '1.2 Setting up the Perfect Home Environment', duration: '18 mins', status: 'completed', description: 'Design distraction-free zones and crate placements.' },
        { title: '1.3 The Clicker Mechanics & Marker Training', duration: '15 mins', status: 'current', description: 'In this session, Dr. Jane Doe outlines the physics and timing of classical reward marking. You will learn the exact mechanical coordination required to sound the clicker at the millisecond target behaviors are expressed.' },
      ],
    },
    {
      title: 'Module 2: Core Behavioral Control',
      lessons: [
        { title: '2.1 Leash Walking without Pulling', duration: '22 mins', status: 'locked', description: 'Eliminate standard pulling reflexes using spatial feedback.' },
        { title: '2.2 Crate Training Blueprint: Day 1-7', duration: '25 mins', status: 'locked', description: 'The absolute week-one timeline for stress-free crating.' },
        { title: '2.3 Stop Excess Vocalization (Barking)', duration: '14 mins', status: 'locked', description: 'Isolate trigger-based barking and correct vocal signaling.' },
      ],
    },
    {
      title: 'Module 3: Advanced Focus & Proofing',
      lessons: [
        { title: '3.1 Focus & Eye-Contact in High Distraction', duration: '20 mins', status: 'locked', description: 'Engage absolute optical attention when competing with objects.' },
        { title: '3.2 Emergency Recall (The Whistle Blueprint)', duration: '28 mins', status: 'locked', description: 'Establish high-urgency reflex recall using whistles.' },
      ],
    },
  ];

  if (course.curriculum) {
    try {
      const parsed = JSON.parse(course.curriculum);
      if (Array.isArray(parsed)) {
        modules = parsed.map((mod: any, mIdx: number) => ({
          title: mod.title || `Module ${mIdx + 1}`,
          lessons: (mod.lessons || []).map((les: any, lIdx: number) => ({
            title: les.title || `Lesson ${mIdx + 1}.${lIdx + 1}`,
            duration: les.duration || '10 mins',
            status: les.status || (mIdx === 0 && lIdx === 0 ? 'current' : 'locked'),
            description: les.description || `Explore detailed curriculum for ${les.title || 'this lesson'}.`,
            videoUrl: les.videoUrl || '',
            attachments: les.attachments || []
          }))
        }));
      }
    } catch (e) {
      console.error("Failed to parse curriculum:", e);
    }
  }

  // Flatten all lessons with their original module/lesson indices
  const flatLessons: Array<{
    title: string;
    duration: string;
    description: string;
    videoUrl?: string;
    attachments?: any[];
    mIdx: number;
    lIdx: number;
  }> = [];

  modules.forEach((mod: any, mIdx: number) => {
    mod.lessons.forEach((les: any, lIdx: number) => {
      flatLessons.push({
        title: les.title,
        duration: les.duration,
        description: les.description || `Explore detailed curriculum for ${les.title}.`,
        videoUrl: les.videoUrl || '',
        attachments: les.attachments || [],
        mIdx,
        lIdx,
      });
    });
  });

  // Find active lesson index
  const { lesson } = await searchParams;
  let activeIndex = 0; // Default to first lesson

  if (lesson) {
    const parts = lesson.split('-');
    if (parts.length === 2) {
      const mIdx = parseInt(parts[0], 10);
      const lIdx = parseInt(parts[1], 10);
      const foundIdx = flatLessons.findIndex(l => l.mIdx === mIdx && l.lIdx === lIdx);
      if (foundIdx !== -1) {
        activeIndex = foundIdx;
      }
    }
  } else {
    // If no search param is specified, try to find a lesson with status 'current' in modules
    modules.forEach((mod, mIdx) => {
      mod.lessons.forEach((les, lIdx) => {
        if (les.status === 'current') {
          const foundIdx = flatLessons.findIndex(l => l.mIdx === mIdx && l.lIdx === lIdx);
          if (foundIdx !== -1) {
            activeIndex = foundIdx;
          }
        }
      });
    });
  }

  const activeLesson = flatLessons[activeIndex] || {
    title: 'No Lessons',
    duration: '0 mins',
    description: 'No lessons available in this course.',
    videoUrl: '',
    attachments: [] as any[]
  };

  const prevLesson = activeIndex > 0 ? flatLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < flatLessons.length - 1 ? flatLessons[activeIndex + 1] : null;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--course-bg)', color: 'var(--color-text)' }}>
        <div className="max-w-md w-full rounded-3xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}></div>
          
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
              Content Locked
            </span>
            <h1 className="text-2xl font-black mt-3" style={{ color: 'var(--color-text)' }}>{course.title}</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {loggedIn 
                ? 'Your account does not currently possess an active learning license for this course.'
                : 'You must sign in and purchase the course to access the curriculum modules.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={`/checkout?productId=${course._id}`}
              className="block text-center w-full text-white font-bold py-3.5 px-4 rounded-xl transition text-xs shadow-lg"
              style={{ backgroundColor: 'var(--course-play-btn)' }}
            >
              Get Instant Access &mdash; ${course.price.toFixed(2)} USD
            </Link>
            {!loggedIn && (
              <Link
                href={`/login?callbackUrl=/courses/${course._id}`}
                className="text-xs hover:underline transition" style={{ color: 'var(--color-text-muted)' }}
              >
                Already purchased? Sign in here
              </Link>
            )}
            <Link
              href="/hubs"
              className="text-xs hover:underline transition" style={{ color: 'var(--color-text-muted)' }}
            >
              Browse Content Hubs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--course-bg)', color: 'var(--color-text)' }}>
      {/* Course Portal Header */}
      <header className="py-4 px-6 sticky top-0 z-30 shadow-md border-b" style={{ backgroundColor: 'var(--course-header)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md border" style={{ backgroundColor: 'color-mix(in srgb, var(--course-play-btn) 20%, transparent)', color: 'var(--course-play-btn)', borderColor: 'color-mix(in srgb, var(--course-play-btn) 20%, transparent)' }}>
              Student Hub
            </span>
            <h1 className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{course.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            <span>Welcome, {session?.user?.name || session?.user?.email}</span>
            <Link
              href="/hubs"
              className="hover:opacity-80 transition"
              style={{ color: 'var(--course-play-btn)' }}
            >
              Back to Content Hubs
            </Link>
          </div>
        </div>
      </header>

      {/* Course Panel Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {activeLesson.videoUrl && getEmbedUrl(activeLesson.videoUrl) ? (
            <div className="aspect-video rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800 bg-black">
              <iframe
                src={getEmbedUrl(activeLesson.videoUrl)!}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-end p-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--course-play-btn)' }}>Now Streaming</p>
                <h4 className="text-base font-black" style={{ color: 'var(--color-text)' }}>{activeLesson.title}</h4>
              </div>

              {/* Play Button */}
              <div className="w-20 h-20 hover:scale-105 transition duration-200 text-white rounded-full flex items-center justify-center shadow-xl z-10" style={{ backgroundColor: 'var(--course-play-btn)' }}>
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 opacity-40"></div>
              <div className="absolute bottom-6 left-6 text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>00:00 / {activeLesson.duration}</div>
            </div>
          )}

          {/* Lesson Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
            {prevLesson ? (
              <Link
                href={`/courses/${courseId}?lesson=${prevLesson.mIdx}-${prevLesson.lIdx}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-850 hover:border-indigo-500/50 px-4 py-3 rounded-2xl transition duration-200"
              >
                &larr; Previous: {prevLesson.title}
              </Link>
            ) : (
              <div className="w-full sm:w-auto text-center text-xs font-bold text-slate-600 bg-slate-950/40 border border-slate-900 px-4 py-3 rounded-2xl select-none">
                Start of Course
              </div>
            )}

            <span className="text-[10px] font-mono text-slate-500">
              Lesson {activeIndex + 1} of {flatLessons.length}
            </span>

            {nextLesson ? (
              <Link
                href={`/courses/${courseId}?lesson=${nextLesson.mIdx}-${nextLesson.lIdx}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 px-5 py-3 rounded-2xl shadow-lg transition duration-200"
              >
                Next: {nextLesson.title} &rarr;
              </Link>
            ) : (
              <div className="w-full sm:w-auto text-center text-xs font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-5 py-3 rounded-2xl select-none font-extrabold">
                Course Completed! 🎉
              </div>
            )}
          </div>

          {/* Active Lesson details */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">
                Active Lesson: {activeLesson.title}
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {activeLesson.description}
            </p>

            <div className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeLesson.attachments && activeLesson.attachments.length > 0 ? (
                activeLesson.attachments.map((att: any, attIdx: number) => (
                  <a
                    key={attIdx}
                    href={att.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-950 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 transition"
                  >
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{att.name || 'Lesson Resource'}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Attachment File</p>
                    </div>
                  </a>
                ))
              ) : (
                <>
                  <a
                    href="#"
                    className="bg-slate-950 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 transition"
                  >
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Download Lesson Worksheet</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">PDF (1.2 MB)</p>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="bg-slate-950 hover:bg-slate-850 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 transition"
                  >
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Recommended Homework Blueprint</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Interactive Sheets</p>
                    </div>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Index */}
        <div className="rounded-3xl p-6 shadow-xl space-y-6 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h3 className="text-lg font-black" style={{ color: 'var(--color-text)' }}>Course Curriculum</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Navigate through your training program.</p>
          </div>

          <div className="space-y-6">
            {modules.map((mod, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {mod.title}
                </h4>
                <div className="space-y-2">
                  {mod.lessons.map((lesson, lidx) => {
                    const flatIdx = flatLessons.findIndex(fl => fl.mIdx === idx && fl.lIdx === lidx);
                    const isCurrent = flatIdx === activeIndex;
                    const isCompleted = flatIdx < activeIndex;

                    return (
                      <Link
                        key={lidx}
                        href={`/courses/${courseId}?lesson=${idx}-${lidx}`}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition duration-200 hover:bg-slate-800/40 ${
                          isCurrent
                            ? 'bg-indigo-950/40 border-indigo-850/80 text-white font-semibold'
                            : isCompleted
                            ? 'bg-slate-950/60 border-slate-850 text-slate-300'
                            : 'bg-slate-950/20 border-slate-900 text-slate-450 hover:text-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-500 shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-slate-500 shrink-0 opacity-60" />
                          )}
                          <span className="truncate max-w-[170px]">{lesson.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-550 font-mono">{lesson.duration}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
