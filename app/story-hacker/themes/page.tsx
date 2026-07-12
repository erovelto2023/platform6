'use client';

import { useState, useEffect } from 'react';
import GlobalSidebar from '@/components/story-hacker/GlobalSidebar';
import ThemeEditor, { Theme } from '@/components/story-hacker/ThemeEditor';
import { Palette, Loader2, Plus, Download } from 'lucide-react';

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editingThemeDraft, setEditingThemeDraft] = useState<Theme | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/story/themes')
      .then(res => res.json())
      .then(data => {
        if (data.themes) {
          setThemes(data.themes);
          if (data.themes.length > 0) setSelectedThemeId(data.themes[0]._id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveTheme = async (updatedTheme: Partial<Theme>, isNew: boolean) => {
    try {
      let savedTheme: Theme | undefined;
      if (isNew) {
        const res = await fetch('/api/story/themes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTheme)
        });
        const data = await res.json();
        savedTheme = data.theme;
        if (savedTheme) {
          setThemes(prev => [savedTheme!, ...prev]);
        }
      } else {
        const res = await fetch(`/api/story/themes/${updatedTheme._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTheme)
        });
        const data = await res.json();
        savedTheme = data.theme;
        if (savedTheme) {
          setThemes(prev => prev.map(t => t._id === savedTheme!._id ? savedTheme! : t));
        }
      }
      
      if (savedTheme) {
        setSelectedThemeId(savedTheme._id);
        setIsEditingTheme(false);
        setEditingThemeDraft(null);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save theme');
    }
  };

  const handleCreateNew = () => {
    setEditingThemeDraft({
      _id: 'new',
      name: 'My Custom Theme',
      isSystem: false,
      trimSize: '5 x 8',
      trimUnit: 'inches',
      bodyFont: 'Palatino',
      fontSize: 11,
      lineSpacing: 1.25,
      largePrint: false,
      marginInside: 0.875,
      marginOutside: 0.5,
      indentSize: 0.15,
      alignment: 'justified',
      hyphens: true,
      layoutPriority: 'widows',
      chapterNumberEnabled: true,
      chapterTitleEnabled: true,
      chapterHeadingFont: 'CinzelDecorative',
      chapterHeadingAlign: 'center',
      chapterHeadingStyle: 'Regular',
      chapterHeadingSize: 28,
      chapterHeadingWidth: 100,
      chapterSubtitleEnabled: false,
      chapterImageEnabled: true,
      chapterIndividualImages: false,
      chapterImageGlobalUrl: 'https://images.unsplash.com/photo-1596541223130-5d5644a49edc?auto=format&fit=crop&q=80&w=300&h=100',
      chapterImagePlacement: 'Below Chapter Title',
      chapterImageWidth: 100,
      chapterImageAlign: 'center',
      chapterHeadingDropCap: false,
      subheadingFont: 'Palatino',
      subheadingSize: 14,
      subheadingAlign: 'left',
      sceneBreakType: 'text',
      sceneBreakText: '***',
      sceneBreakImage: '',
      headerLayout: 'Author - Title',
      headerFont: 'Palatino',
      headerSize: 10,
      footerFont: 'Palatino',
      footerSize: 10,
      pdfFootnotes: 'Footnotes',
      epubFootnotes: 'End of chapter',
      footnoteSize: 0.75,
    } as Theme);
    setIsEditingTheme(true);
  };

  const selectedTheme = themes.find(t => t._id === selectedThemeId) || themes[0];
  const activePreviewTheme = isEditingTheme ? (editingThemeDraft || selectedTheme) : selectedTheme;

  const getThemeStyles = (theme?: Theme) => {
    if (!theme) return {};
    return {
      fontFamily: theme.bodyFont,
      fontSize: `${theme.fontSize}pt`,
      lineHeight: theme.lineSpacing,
      textAlign: theme.alignment as any,
      paddingLeft: `${theme.marginInside}in`,
      paddingRight: `${theme.marginOutside}in`,
      paddingTop: `1in`,
      paddingBottom: `1in`,
    };
  };

  const getHeadingStyles = (theme?: Theme) => {
    if (!theme) return {};
    const weight = (theme.chapterHeadingStyle || '').includes('Bold') ? 'bold' : 'normal';
    const fontStyle = (theme.chapterHeadingStyle || '').includes('Italic') ? 'italic' : 'normal';
    
    return {
      fontFamily: theme.chapterHeadingFont,
      fontSize: `${theme.chapterHeadingSize}pt`,
      textAlign: theme.chapterHeadingAlign as any,
      fontWeight: weight,
      fontStyle: fontStyle,
      width: `${theme.chapterHeadingWidth || 100}%`,
      margin: theme.chapterHeadingAlign === 'center' ? '0 auto' : (theme.chapterHeadingAlign === 'right' ? '0 0 0 auto' : '0'),
    };
  };

  const dummyContent = "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair.\n\nWe had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way - in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.";

  const renderHeadingImage = (theme: Theme) => {
    if (!theme.chapterImageEnabled || !theme.chapterImageGlobalUrl) return null;
    return (
      <div 
        className="my-6" 
        style={{ 
          width: `${theme.chapterImageWidth || 100}%`,
          margin: theme.chapterImageAlign === 'center' ? '1.5rem auto' : (theme.chapterImageAlign === 'right' ? '1.5rem 0 1.5rem auto' : '1.5rem 0'),
          textAlign: theme.chapterImageAlign as any
        }}
      >
        <img src={theme.chapterImageGlobalUrl} alt="" className="max-w-full h-auto inline-block" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex">
      <GlobalSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-16 border-b border-[#1f1f1f] bg-[#121212] flex items-center px-6 shrink-0">
          <Palette className="w-5 h-5 text-amber-500 mr-3" />
          <h1 className="text-xl font-black text-white tracking-tight">Book Formatting Templates</h1>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {isEditingTheme && editingThemeDraft ? (
            <div className="w-[50%] border-r border-[#1f1f1f] bg-white shrink-0 h-full overflow-hidden flex flex-col">
              <ThemeEditor 
                theme={editingThemeDraft} 
                onSave={handleSaveTheme} 
                onCancel={() => {
                  setIsEditingTheme(false);
                  setEditingThemeDraft(null);
                }} 
              />
            </div>
          ) : (
            <div className="w-[30%] min-w-[320px] border-r border-[#1f1f1f] bg-[#121212] flex flex-col shrink-0 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Your Templates</h3>
                <button 
                  onClick={handleCreateNew}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {themes.map(theme => (
                    <div key={theme._id} className="flex flex-col relative group">
                      <button
                        onClick={() => setSelectedThemeId(theme._id)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition w-full ${
                          selectedThemeId === theme._id ? 'border-amber-500 bg-amber-500/5' : 'border-[#1f1f1f] bg-[#0a0a0a] hover:border-[#333]'
                        }`}
                      >
                        <div className={`w-16 h-20 bg-white rounded shadow-inner mb-3 flex flex-col items-center p-2 pt-4`} style={{ fontFamily: theme.bodyFont }}>
                          <div className="text-[6px] text-slate-400 font-bold uppercase mb-2">Chapter 1</div>
                          {theme.chapterHeadingDropCap ? (
                            <div className="flex items-start text-black w-full px-1">
                              <span className="text-xl font-bold float-left mr-1 leading-none">O</span>
                              <div className="flex-1 h-1 bg-slate-200 mt-1" />
                            </div>
                          ) : (
                            <div className="w-full px-1 space-y-1 mt-1">
                              <div className="w-full h-0.5 bg-slate-300" />
                              <div className="w-5/6 h-0.5 bg-slate-300" />
                              <div className="w-full h-0.5 bg-slate-300" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-300 text-center line-clamp-1">{theme.name}</span>
                        {theme.isSystem && <span className="text-[9px] text-amber-600 mt-1 uppercase font-bold">System</span>}
                      </button>
                      
                      {selectedThemeId === theme._id && (
                        <button 
                          onClick={() => {
                            setEditingThemeDraft(theme);
                            setIsEditingTheme(true);
                          }}
                          className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Preview Frame */}
          <div className="flex-1 bg-[#0a0a0a] p-8 flex justify-center items-start overflow-y-auto relative print-preview-area">
            {activePreviewTheme && (
              <div 
                className="w-full bg-white rounded-lg shadow-2xl overflow-hidden relative border border-[#333] transition-all duration-300"
                style={{
                  maxWidth: '600px',
                  aspectRatio: `${parseFloat(activePreviewTheme.trimSize.split(' x ')[0] || '5')} / ${parseFloat(activePreviewTheme.trimSize.split(' x ')[1] || '8')}`
                }}
              >
                <div 
                  className="absolute inset-0 bg-white text-black overflow-y-auto transition-all"
                  style={{
                    ...getThemeStyles(activePreviewTheme),
                    backgroundImage: (activePreviewTheme.chapterImageEnabled && activePreviewTheme.chapterImagePlacement === 'Background Image' && activePreviewTheme.chapterImageGlobalUrl) ? `url(${activePreviewTheme.chapterImageGlobalUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                   <div className="mb-12 mt-8 flex flex-col">
                     {activePreviewTheme.chapterImagePlacement === 'Above Chapter #' && renderHeadingImage(activePreviewTheme)}
                     
                     {activePreviewTheme.chapterNumberEnabled && (
                       <div className="text-xl tracking-widest font-bold mb-4 uppercase" style={{ textAlign: activePreviewTheme.chapterHeadingAlign as any, fontFamily: activePreviewTheme.chapterHeadingFont }}>
                         Chapter 1
                       </div>
                     )}

                     {activePreviewTheme.chapterImagePlacement === 'Above Chapter Title' && renderHeadingImage(activePreviewTheme)}

                     {activePreviewTheme.chapterTitleEnabled && (
                       <h2 className="uppercase tracking-widest leading-tight" style={getHeadingStyles(activePreviewTheme)}>
                         The Tale Begins
                       </h2>
                     )}

                     {activePreviewTheme.chapterImagePlacement === 'Below Chapter Title' && renderHeadingImage(activePreviewTheme)}

                     {activePreviewTheme.chapterSubtitleEnabled && (
                       <div className="text-lg italic mt-4" style={{ textAlign: activePreviewTheme.chapterHeadingAlign as any, fontFamily: activePreviewTheme.chapterHeadingFont }}>
                         In which our heroes set forth
                       </div>
                     )}

                     {activePreviewTheme.chapterImagePlacement === 'Below Subtitle' && renderHeadingImage(activePreviewTheme)}
                   </div>

                   <div className={`text-sm text-slate-800 ${activePreviewTheme.chapterHeadingDropCap ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none' : ''}`}>
                     {dummyContent.split('\n\n').map((para, i) => (
                       <p key={i} className="mb-4" style={{ textIndent: i > 0 ? `${activePreviewTheme.indentSize}in` : '0' }}>{para}</p>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
