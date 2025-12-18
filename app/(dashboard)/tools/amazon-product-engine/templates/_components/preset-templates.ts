export const PRESET_TEMPLATES = [
    {
        name: "Modern Card (Default)",
        type: "box",
        content: `<div class="p-6 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-300 max-w-sm">
  <div class="relative w-full h-48 mb-4 flex items-center justify-center bg-slate-50 rounded-lg p-4">
    <img src="{{image}}" alt="{{title}}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
  </div>
  <h3 class="font-bold text-lg leading-tight mb-2 text-slate-800 line-clamp-2 h-14">{{title}}</h3>
  <div class="flex items-center gap-1 mb-4">
    <span class="text-yellow-400 text-lg">★</span>
    <span class="font-medium text-slate-600">{{rating}}</span>
  </div>
  <div class="flex items-center justify-between mt-auto">
    <span class="text-2xl font-bold text-slate-900">{{price}}</span>
    <a href="{{link}}" target="_blank" rel="nofollow" class="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
      Buy Now
    </a>
  </div>
</div>`
    },
    {
        name: "Minimal List Item",
        type: "list",
        content: `<div class="flex items-center gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
  <div class="w-16 h-16 flex-shrink-0 bg-white border rounded-md p-1 flex items-center justify-center">
    <img src="{{image}}" alt="{{title}}" class="max-h-full max-w-full object-contain" />
  </div>
  <div class="flex-1 min-w-0">
    <h4 class="font-medium text-slate-900 truncate">{{title}}</h4>
    <div class="flex items-center gap-2 text-sm text-slate-500">
      <span>{{rating}} ★</span>
      <span>•</span>
      <span class="font-semibold text-slate-700">{{price}}</span>
    </div>
  </div>
  <a href="{{link}}" target="_blank" rel="nofollow" class="text-sky-600 hover:text-sky-700 font-medium text-sm whitespace-nowrap">
    View Deal →
  </a>
</div>`
    },
    {
        name: "Vibrant Deal Badge",
        type: "widget",
        content: `<div class="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg max-w-xs">
  <div class="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
    Best Deal
  </div>
  <div class="bg-white p-3 rounded-xl mb-3 shadow-inner">
    <img src="{{image}}" alt="{{title}}" class="w-full h-32 object-contain" />
  </div>
  <h3 class="font-bold text-lg mb-1 line-clamp-1">{{title}}</h3>
  <div class="flex items-end justify-between">
    <div>
      <p class="text-indigo-100 text-xs mb-0.5">Amazon Price</p>
      <p class="text-2xl font-extrabold">{{price}}</p>
    </div>
    <a href="{{link}}" target="_blank" rel="nofollow" class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm">
      Get It
    </a>
  </div>
</div>`
    },
    {
        name: "Review Pros/Cons Box",
        type: "box",
        content: `<div class="flex flex-col md:flex-row gap-6 p-6 border rounded-xl bg-white shadow-sm">
  <div class="w-full md:w-1/3 flex flex-col items-center">
    <img src="{{image}}" alt="{{title}}" class="w-full h-48 object-contain mb-4" />
    <a href="{{link}}" target="_blank" rel="nofollow" class="w-full bg-orange-500 text-white text-center py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md">
      Check Price on Amazon
    </a>
  </div>
  <div class="w-full md:w-2/3">
    <h3 class="text-xl font-bold text-slate-900 mb-2">{{title}}</h3>
    <div class="flex items-center gap-2 mb-4">
      <div class="flex text-yellow-400">★★★★★</div>
      <span class="text-slate-500 text-sm">({{rating}} rating)</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 class="font-bold text-green-700 mb-2 text-sm uppercase">Pros</h4>
        <ul class="text-sm text-green-800 space-y-1 list-disc list-inside">
          <li>High quality build</li>
          <li>Excellent performance</li>
          <li>Great value for money</li>
        </ul>
      </div>
      <div class="bg-red-50 p-4 rounded-lg border border-red-100">
        <h4 class="font-bold text-red-700 mb-2 text-sm uppercase">Cons</h4>
        <ul class="text-sm text-red-800 space-y-1 list-disc list-inside">
          <li>Premium price point</li>
          <li>Limited availability</li>
        </ul>
      </div>
    </div>
  </div>
</div>`
    }
];
