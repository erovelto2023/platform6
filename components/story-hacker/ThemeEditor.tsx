'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export interface Theme {
  _id: string;
  name: string;
  isSystem?: boolean;
  trimSize: string;
  trimUnit: string;
  bodyFont: string;
  fontSize: number;
  lineSpacing: number;
  largePrint: boolean;
  marginInside: number;
  marginOutside: number;
  indentSize: number;
  alignment: 'justified' | 'left';
  hyphens: boolean;
  layoutPriority: 'widows' | 'balanced' | 'hybrid';
  chapterNumberEnabled: boolean;
  chapterTitleEnabled: boolean;
  chapterHeadingFont: string;
  chapterHeadingAlign: 'left' | 'center' | 'right';
  chapterHeadingStyle: 'Regular' | 'Bold' | 'Italic' | 'Bold Italic';
  chapterHeadingSize: number;
  chapterHeadingWidth: number;
  chapterSubtitleEnabled: boolean;
  chapterImageEnabled: boolean;
  chapterIndividualImages: boolean;
  chapterImageGlobalUrl: string;
  chapterImagePlacement: 'Above Chapter #' | 'Above Chapter Title' | 'Below Chapter Title' | 'Below Subtitle' | 'Background Image';
  chapterImageWidth: number;
  chapterImageAlign: 'left' | 'center' | 'right';
  chapterHeadingDropCap: boolean;
  subheadingFont: string;
  subheadingSize: number;
  subheadingAlign: 'left' | 'center' | 'right';
  sceneBreakType: 'text' | 'image' | 'blank';
  sceneBreakText: string;
  sceneBreakImage: string;
  headerLayout: string;
  headerFont: string;
  headerSize: number;
  footerFont: string;
  footerSize: number;
  pdfFootnotes: string;
  epubFootnotes: string;
  footnoteSize: number;
}

interface ThemeEditorProps {
  theme: Theme;
  onSave: (theme: Partial<Theme>, isNew: boolean) => Promise<void>;
  onCancel: () => void;
}

const TABS = [
  'Chapter heading', 'Paragraph', 'Subheading', 'Scene break', 
  'Notes', 'Print layout', 'Typography', 'Header/Footer', 'Trim sizes'
];

export default function ThemeEditor({ theme, onSave, onCancel }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState('Trim sizes');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Local state for all theme properties
  const [draft, setDraft] = useState<Theme>({ ...theme });

  const handleChange = (field: keyof Theme, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (isNew: boolean) => {
    if (isNew) {
      setIsSavingNew(true);
      const newName = prompt('Enter a name for your new theme:', `${draft.name} Copy`);
      if (newName) {
        await onSave({ ...draft, name: newName }, true);
      }
      setIsSavingNew(false);
    } else {
      setIsSaving(true);
      await onSave(draft, false);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800">
      
      {/* Top Header */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-sm">Themes</span>
          <span className="text-slate-300">&gt;</span>
          <span className="font-bold text-sm">Edit {draft.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition">
            Discard
          </button>
          <button 
            onClick={() => handleSave(true)} 
            disabled={isSavingNew}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition flex items-center gap-2"
          >
            {isSavingNew && <Loader2 className="w-3 h-3 animate-spin" />}
            Save as new theme
          </button>
          {!draft.isSystem && (
            <button 
              onClick={() => handleSave(false)} 
              disabled={isSaving}
              className="px-6 py-1.5 text-xs font-bold text-white bg-blue-600 rounded shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
              Save
            </button>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Settings Sidebar */}
        <div className="w-48 bg-white border-r border-slate-200 shrink-0 overflow-y-auto py-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-6 py-3 text-xs font-bold transition border-l-4 ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="max-w-3xl w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            
            {activeTab === 'Trim sizes' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4">Paper trim size</h4>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="radio" checked={draft.trimUnit === 'inches'} onChange={() => handleChange('trimUnit', 'inches')} className="accent-blue-600" /> inches
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="radio" checked={draft.trimUnit === 'mm'} onChange={() => handleChange('trimUnit', 'mm')} className="accent-blue-600" /> mm
                    </label>
                  </div>
                </div>

                {[
                  { title: "Popular trim sizes", sizes: ['5 x 8', '5.25 x 8', '5.5 x 8.5', '6 x 9'] },
                  { title: "Additional trim sizes", sizes: ['5.06 x 7.81', '5.5 x 8.25', '6.14 x 9.21'] },
                  { title: "International sizes", sizes: ['4.72 x 7.48', '4.92 x 7.48', '5.83 x 8.27', '5.31 x 8.46'] },
                  { title: "Mass market paperbacks", sizes: ['4.12 x 6.75', '4.25 x 7', '4.37 x 7'] },
                  { title: "Children's book trim sizes", sizes: ['8.5 x 8.5', '8 x 10', '8.5 x 11'] },
                ].map((group) => (
                  <div key={group.title}>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">{group.title}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {group.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => handleChange('trimSize', size)}
                          className={`py-2 px-3 text-xs border rounded transition flex items-center justify-between ${draft.trimSize === size ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:bg-slate-50'}`}
                        >
                          {size}
                          <div className="flex gap-0.5" title="Supported by KDP, IngramSpark, Lulu">
                             <div className="w-1 h-1 bg-amber-500 rounded-sm" />
                             <div className="w-1 h-1 bg-blue-400 rounded-sm" />
                             <div className="w-1 h-1 bg-blue-800 rounded-sm" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Typography' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Body font</h4>
                  <select 
                    value={draft.bodyFont} 
                    onChange={e => handleChange('bodyFont', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Open Sans">Open Sans</option>
                    <option value="Palatino">Palatino</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Font size</h4>
                    <span>{draft.fontSize}pt</span>
                  </div>
                  <input 
                    type="range" min="9" max="18" step="1" 
                    value={draft.fontSize} 
                    onChange={e => handleChange('fontSize', Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>9pt</span><span>18pt</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Line spacing</h4>
                    <span>{draft.lineSpacing}</span>
                  </div>
                  <input 
                    type="range" min="1" max="2" step="0.25" 
                    value={draft.lineSpacing} 
                    onChange={e => handleChange('lineSpacing', Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Single</span><span>Double</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Print layout' && (
              <div className="space-y-8">
                 <div>
                   <h4 className="text-sm font-bold text-slate-700 mb-4">Margins</h4>
                   <div className="flex gap-6">
                     <label className="flex items-center gap-2 text-sm text-slate-600">
                       Inside
                       <input type="number" step="0.1" value={draft.marginInside} onChange={e => handleChange('marginInside', Number(e.target.value))} className="w-20 border border-slate-300 rounded px-2 py-1 text-center" /> in
                     </label>
                     <label className="flex items-center gap-2 text-sm text-slate-600">
                       Outside
                       <input type="number" step="0.1" value={draft.marginOutside} onChange={e => handleChange('marginOutside', Number(e.target.value))} className="w-20 border border-slate-300 rounded px-2 py-1 text-center" /> in
                     </label>
                   </div>
                 </div>

                 <div>
                   <h4 className="text-sm font-bold text-slate-700 mb-4">Alignment</h4>
                   <div className="flex gap-4">
                     <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                       <input type="radio" checked={draft.alignment === 'justified'} onChange={() => handleChange('alignment', 'justified')} className="accent-blue-600" /> Justified
                     </label>
                     <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                       <input type="radio" checked={draft.alignment === 'left'} onChange={() => handleChange('alignment', 'left')} className="accent-blue-600" /> Left (Ragged)
                     </label>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'Paragraph' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">First Line Indent</h4>
                  <div className="flex items-center gap-4">
                    <input type="number" step="0.05" value={draft.indentSize} onChange={e => handleChange('indentSize', Number(e.target.value))} className="w-24 border border-slate-300 rounded px-3 py-2 text-center" />
                    <span className="text-sm text-slate-500">inches</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Space added to the first line of every paragraph.</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.hyphens} onChange={(e) => handleChange('hyphens', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Enable Hyphenation
                  </label>
                  <p className="text-xs text-slate-500 mt-1 ml-6">Automatically hyphenate words across lines to improve layout spacing.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'Chapter heading' && (
              <div className="space-y-4">
                
                {/* Chapter Number Block */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.chapterNumberEnabled} onChange={(e) => handleChange('chapterNumberEnabled', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Chapter number
                  </label>
                </div>

                {/* Chapter Title Block */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.chapterTitleEnabled} onChange={(e) => handleChange('chapterTitleEnabled', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Chapter title
                  </label>
                  
                  {draft.chapterTitleEnabled && (
                    <div className="space-y-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Font</label>
                          <select value={draft.chapterHeadingFont} onChange={e => handleChange('chapterHeadingFont', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                            <option value="Open Sans">Open Sans</option>
                            <option value="Palatino">Palatino</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Arial">Arial</option>
                            <option value="CinzelDecorative">CinzelDecorative</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Align</label>
                          <select value={draft.chapterHeadingAlign} onChange={e => handleChange('chapterHeadingAlign', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 capitalize">
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Style</label>
                          <select value={draft.chapterHeadingStyle || 'Regular'} onChange={e => handleChange('chapterHeadingStyle', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                            <option value="Regular">Regular</option>
                            <option value="Bold">Bold</option>
                            <option value="Italic">Italic</option>
                            <option value="Bold Italic">Bold Italic</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Size</label>
                          <input type="range" min="15" max="54" step="1" value={draft.chapterHeadingSize} onChange={e => handleChange('chapterHeadingSize', Number(e.target.value))} className="w-full accent-blue-600" />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                            <span>15</span><span>28</span><span>41</span><span>54</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Width percentage</label>
                          <input type="range" min="20" max="100" step="5" value={draft.chapterHeadingWidth || 100} onChange={e => handleChange('chapterHeadingWidth', Number(e.target.value))} className="w-full accent-blue-600" />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                            <span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapter Subtitle Block */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.chapterSubtitleEnabled} onChange={(e) => handleChange('chapterSubtitleEnabled', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Chapter subtitle
                  </label>
                </div>

                {/* Chapter Image Block */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.chapterImageEnabled} onChange={(e) => handleChange('chapterImageEnabled', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Chapter image
                  </label>

                  {draft.chapterImageEnabled && (
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-700">Use individual chapter images</span>
                        <div 
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition ${draft.chapterIndividualImages ? 'bg-blue-600' : 'bg-slate-300'}`}
                          onClick={() => handleChange('chapterIndividualImages', !draft.chapterIndividualImages)}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition transform ${draft.chapterIndividualImages ? 'translate-x-5' : ''}`} />
                        </div>
                      </div>

                      {!draft.chapterIndividualImages && (
                        <div>
                          <div className="flex gap-4 mb-4 text-xs font-bold text-blue-600">
                            <button className="hover:underline flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Upload image</button>
                            <button className="hover:underline flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> My image gallery</button>
                            <button className="hover:underline flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Create image with book brush</button>
                          </div>
                          <div className="relative border border-slate-200 rounded-lg p-8 flex justify-center items-center bg-slate-50 min-h-[120px]">
                            {draft.chapterImageGlobalUrl ? (
                              <>
                                <img src={draft.chapterImageGlobalUrl} alt="Chapter flourish" className="max-h-[100px] object-contain" />
                                <button onClick={() => handleChange('chapterImageGlobalUrl', '')} className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded text-slate-500 hover:text-red-500 shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                              </>
                            ) : (
                              <button onClick={() => handleChange('chapterImageGlobalUrl', 'https://images.unsplash.com/photo-1596541223130-5d5644a49edc?auto=format&fit=crop&q=80&w=300&h=100')} className="text-sm text-slate-500 hover:text-blue-600 transition underline">Click to insert dummy image</button>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-3">Placement</label>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {['Above Chapter #', 'Above Chapter Title', 'Below Chapter Title', 'Below Subtitle', 'Background Image'].map((placement) => (
                            <button 
                              key={placement} 
                              onClick={() => handleChange('chapterImagePlacement', placement)}
                              className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition w-24 h-24 shrink-0 ${draft.chapterImagePlacement === placement ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                              <div className="w-full h-full border border-dashed border-slate-300 rounded flex flex-col items-center justify-center bg-white p-1 text-[8px] text-center gap-1 font-bold text-slate-500">
                                {placement === 'Above Chapter #' && <><div className="w-4 h-2 bg-slate-200 rounded" /><span>Chapter #</span><span className="text-black">Chapter Title</span><span>Subtitle</span></>}
                                {placement === 'Above Chapter Title' && <><span>Chapter #</span><div className="w-4 h-2 bg-slate-200 rounded" /><span className="text-black">Chapter Title</span><span>Subtitle</span></>}
                                {placement === 'Below Chapter Title' && <><span>Chapter #</span><span className="text-black">Chapter Title</span><div className="w-4 h-2 bg-slate-200 rounded" /><span>Subtitle</span></>}
                                {placement === 'Below Subtitle' && <><span>Chapter #</span><span className="text-black">Chapter Title</span><span>Subtitle</span><div className="w-4 h-2 bg-slate-200 rounded" /></>}
                                {placement === 'Background Image' && <span className="text-[10px]">Bg Image</span>}
                              </div>
                              <span className="text-[9px] mt-2 font-medium text-slate-600 text-center leading-tight">{placement}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">Note: Images in chapter headings are considered decorative and do not require alt text. <a href="#" className="underline">Learn more about alt text best practices.</a></p>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Image element options</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">Width percentage</label>
                            <input type="range" min="20" max="100" step="5" value={draft.chapterImageWidth || 100} onChange={e => handleChange('chapterImageWidth', Number(e.target.value))} className="w-full accent-blue-600" />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                              <span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2">Alignment</label>
                            <select value={draft.chapterImageAlign || 'center'} onChange={e => handleChange('chapterImageAlign', e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 capitalize">
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Legacy Drop Cap Setting */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white mt-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={draft.chapterHeadingDropCap} onChange={(e) => handleChange('chapterHeadingDropCap', e.target.checked)} className="accent-blue-600 w-4 h-4" /> 
                    Enable Drop Caps (First letter of chapter)
                  </label>
                </div>
              </div>
            )}
            
            {activeTab === 'Subheading' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Subheading Font</h4>
                  <select 
                    value={draft.subheadingFont || 'Palatino'} 
                    onChange={e => handleChange('subheadingFont', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Open Sans">Open Sans</option>
                    <option value="Palatino">Palatino</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Arial">Arial</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Subheading Size</h4>
                    <span>{draft.subheadingSize || 14}pt</span>
                  </div>
                  <input 
                    type="range" min="10" max="36" step="1" 
                    value={draft.subheadingSize || 14} 
                    onChange={e => handleChange('subheadingSize', Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4">Alignment</h4>
                  <div className="flex gap-4">
                    {['left', 'center', 'right'].map(align => (
                       <label key={align} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer capitalize">
                         <input type="radio" checked={(draft.subheadingAlign || 'left') === align} onChange={() => handleChange('subheadingAlign', align)} className="accent-blue-600" /> {align}
                       </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Scene break' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4">Break Type</h4>
                  <div className="flex gap-4">
                    {['text', 'image', 'blank'].map(type => (
                       <label key={type} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer capitalize">
                         <input type="radio" checked={(draft.sceneBreakType || 'text') === type} onChange={() => handleChange('sceneBreakType', type)} className="accent-blue-600" /> {type}
                       </label>
                    ))}
                  </div>
                </div>
                
                {(!draft.sceneBreakType || draft.sceneBreakType === 'text') && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Break Text</h4>
                    <input 
                      type="text" 
                      value={draft.sceneBreakText || '***'} 
                      onChange={e => handleChange('sceneBreakText', e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {draft.sceneBreakType === 'image' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Image URL</h4>
                    <input 
                      type="url" 
                      value={draft.sceneBreakImage || ''} 
                      onChange={e => handleChange('sceneBreakImage', e.target.value)}
                      placeholder="https://example.com/flourish.png"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">PDF Footnotes Location</h4>
                  <select 
                    value={draft.pdfFootnotes || 'Footnotes'} 
                    onChange={e => handleChange('pdfFootnotes', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Footnotes">Bottom of Page</option>
                    <option value="End of chapter">End of Chapter</option>
                    <option value="End of book">End of Book</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">EPUB Footnotes Location</h4>
                  <select 
                    value={draft.epubFootnotes || 'End of chapter'} 
                    onChange={e => handleChange('epubFootnotes', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="End of chapter">End of Chapter</option>
                    <option value="End of book">End of Book</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <h4 className="text-sm font-bold text-slate-700">Footnote Size Multiplier</h4>
                    <span>{draft.footnoteSize || 0.75}x</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="1" step="0.05" 
                    value={draft.footnoteSize || 0.75} 
                    onChange={e => handleChange('footnoteSize', Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'Header/Footer' && (
              <div className="space-y-8">
                 <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Header Layout</h4>
                  <select 
                    value={draft.headerLayout || 'Author - Title'} 
                    onChange={e => handleChange('headerLayout', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Author - Title">Author - Title</option>
                    <option value="Title - Chapter">Title - Chapter</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Header Font</h4>
                    <select 
                      value={draft.headerFont || 'Palatino'} 
                      onChange={e => handleChange('headerFont', e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Open Sans">Open Sans</option>
                      <option value="Palatino">Palatino</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Header Size (pt)</h4>
                    <input type="number" value={draft.headerSize || 10} onChange={e => handleChange('headerSize', Number(e.target.value))} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Footer Font</h4>
                    <select 
                      value={draft.footerFont || 'Palatino'} 
                      onChange={e => handleChange('footerFont', e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Open Sans">Open Sans</option>
                      <option value="Palatino">Palatino</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Footer Size (pt)</h4>
                    <input type="number" value={draft.footerSize || 10} onChange={e => handleChange('footerSize', Number(e.target.value))} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            )}

            
          </div>
        </div>

      </div>
    </div>
  );
}
