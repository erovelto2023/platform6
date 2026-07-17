export interface BlockTemplate {
  id: string;
  name: string;
  type: "designer" | "modern" | "wireframe" | "direct-response" | "popups" | "megamenus";
  category: string;
  previewSvg?: string; // Optional custom SVG preview
  html: string;
  css?: string;        // Optional separate CSS code
}

export const blockTemplates: BlockTemplate[] = [
  // ── DESIGNER BLOCKS ──
  {
    id: "alert-bar-1",
    name: "Countdown Announcement Bar",
    type: "designer",
    category: "Alert bars",
    html: `<!-- Announcement Alert Bar -->
<div class="bg-gradient-to-r from-sky-600 to-indigo-700 text-white py-3 px-4 shadow-md">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
    <div class="flex items-center gap-2">
      <span class="flex h-2 w-2 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <p class="text-sm font-medium">🔥 Special Offer: Get 50% off KBusiness Academy premium access today only!</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">CODE: PREMIUM50</span>
      <a href="#pricing" class="bg-white text-indigo-700 hover:bg-slate-100 px-3 py-1 rounded-md text-xs font-bold transition-all shadow-sm">Claim Now</a>
    </div>
  </div>
</div>`
  },
  {
    id: "cta-1",
    name: "Direct Call to Action Card",
    type: "designer",
    category: "Call to action",
    html: `<!-- Premium Centered Call to Action -->
<section class="py-16 px-4 bg-slate-900 text-white text-center relative overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
  <div class="max-w-3xl mx-auto relative z-10 space-y-6">
    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Accelerate Your Career?</h2>
    <p class="text-slate-400 text-lg leading-relaxed">Join thousands of students and professional developers leveling up their skills with interactive masterclasses, mentorship, and resources.</p>
    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
      <a href="/checkout" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-sky-500/20 transition-all w-full sm:w-auto text-center">Get Instant Access</a>
      <a href="#curriculum" class="text-white hover:text-slate-300 font-semibold px-6 py-3 border border-slate-700 hover:border-slate-500 rounded-lg transition-all w-full sm:w-auto text-center">Browse Curriculum</a>
    </div>
  </div>
</section>`
  },
  {
    id: "checkout-1",
    name: "Modern Checkout Form Panel",
    type: "designer",
    category: "Checkout forms",
    html: `<!-- Modern Dual-Column Checkout Box -->
<div class="max-w-5xl mx-auto px-4 py-12">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <!-- Order Summary -->
    <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 class="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b border-slate-200">
          <div>
            <p class="font-semibold text-slate-800">KBusiness Premium Access</p>
            <p class="text-xs text-slate-500">Annual Membership</p>
          </div>
          <span class="font-bold text-slate-900">$297.00</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-600">Subtotal</span>
          <span class="text-slate-800">$297.00</span>
        </div>
        <div class="flex justify-between items-center text-sm text-emerald-600 font-semibold">
          <span>Discount (PREMIUM50)</span>
          <span>-$148.50</span>
        </div>
        <div class="flex justify-between items-center text-lg font-bold pt-4 border-t border-slate-200 text-slate-900">
          <span>Total</span>
          <span>$148.50</span>
        </div>
      </div>
    </div>
    
    <!-- Billing Info Form -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 class="text-lg font-bold text-slate-900">Payment Information</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input type="email" placeholder="you@example.com" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
          <input type="text" placeholder="•••• •••• •••• ••••" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
            <input type="text" placeholder="MM / YY" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
            <input type="text" placeholder="•••" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
          </div>
        </div>
        <button class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-md mt-4">Complete Payment</button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: "contact-1",
    name: "Two-Column Contact Us Form",
    type: "designer",
    category: "Contact Us",
    html: `<!-- Two-Column Contact Us Layout -->
<section class="py-16 px-4 max-w-6xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <span class="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Contact Support</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Let's talk about your academy goals.</h2>
      <p class="text-slate-600 leading-relaxed text-lg">Have questions about our training courses, curriculum, or enterprise pricing? Drop us a message, and our team will get back to you within 24 hours.</p>
      
      <div class="space-y-4 pt-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-sky-50 text-sky-650 rounded-lg">📧</div>
          <div>
            <p class="text-xs text-slate-500 font-semibold">Email Us</p>
            <p class="text-sm font-semibold text-slate-800">support@kbusinessacademy.com</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-emerald-50 text-emerald-650 rounded-lg">📍</div>
          <div>
            <p class="text-xs text-slate-500 font-semibold">Headquarters</p>
            <p class="text-sm font-semibold text-slate-800">San Francisco, CA</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-xl space-y-4">
      <h3 class="text-xl font-bold text-slate-900">Send us a Message</h3>
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
            <input type="text" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
            <input type="text" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
          <input type="text" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Message</label>
          <textarea rows="4" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 resize-none"></textarea>
        </div>
        <button type="submit" class="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg transition-all shadow-md">Send Message</button>
      </form>
    </div>
  </div>
</section>`
  },
  {
    id: "content-1",
    name: "Featured Courses Row Grid",
    type: "designer",
    category: "Content",
    html: `<!-- Features grid with card hover elevations -->
<div class="max-w-6xl mx-auto px-4 py-16">
  <div class="text-center max-w-2xl mx-auto mb-12">
    <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Explore Our Featured Training Modules</h2>
    <p class="text-slate-500 mt-2">Expert-led blueprints designed to fast-track your coding career.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div class="h-3 bg-gradient-to-r from-sky-400 to-sky-500"></div>
      <div class="p-6 space-y-4">
        <span class="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Frontend Development</span>
        <h3 class="text-lg font-bold text-slate-900">Next.js Masterclass</h3>
        <p class="text-sm text-slate-500 leading-relaxed">Master SSR, Server Components, Route Handlers, and visual UI rendering with Next.js 15+.</p>
        <a href="#" class="block text-sm font-bold text-sky-600 hover:underline">Learn more →</a>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div class="h-3 bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
      <div class="p-6 space-y-4">
        <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Database Architecture</span>
        <h3 class="text-lg font-bold text-slate-900">MongoDB in Production</h3>
        <p class="text-sm text-slate-500 leading-relaxed">Learn indexes, aggregation frameworks, schema design, security, and connection pools.</p>
        <a href="#" class="block text-sm font-bold text-indigo-600 hover:underline">Learn more →</a>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div class="h-3 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
      <div class="p-6 space-y-4">
        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Server Operations</span>
        <h3 class="text-lg font-bold text-slate-900">Zero Downtime Hosting</h3>
        <p class="text-sm text-slate-500 leading-relaxed">Deploy secure full-stack applications with custom domains, SSL certificates, and CI/CD pipelines.</p>
        <a href="#" class="block text-sm font-bold text-emerald-600 hover:underline">Learn more →</a>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: "countdown-1",
    name: "Classic Countdown Clock Timer",
    type: "designer",
    category: "Countdown timers",
    html: `<!-- Urgency Countdown Timer Banner -->
<div class="bg-slate-950 text-white py-12 px-4 relative overflow-hidden">
  <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
    <div class="space-y-1">
      <h3 class="text-2xl font-bold tracking-tight">Hurry! Free enrollment closes soon.</h3>
      <p class="text-slate-400 text-sm">Sign up before the timer hits zero to save your scholarship seat.</p>
    </div>
    <div class="flex items-center gap-3 sm:gap-4">
      <div class="flex flex-col items-center">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-2xl font-bold font-mono text-emerald-450">02</div>
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Hours</span>
      </div>
      <span class="text-2xl font-bold text-slate-700">:</span>
      <div class="flex flex-col items-center">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-2xl font-bold font-mono text-emerald-455">45</div>
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Mins</span>
      </div>
      <span class="text-2xl font-bold text-slate-700">:</span>
      <div class="flex flex-col items-center">
        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-2xl font-bold font-mono text-emerald-455">18</div>
        <span class="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Secs</span>
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: "pricing-1",
    name: "SaaS Professional Pricing Tables",
    type: "designer",
    category: "pricing",
    html: `<!-- Modern Three-tier Pricing Cards -->
<section id="pricing" class="py-16 px-4 bg-slate-50/50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Simple, Transparent Pricing</h2>
      <p class="text-slate-500 mt-2">Unlock lifetime access to our coding courses with zero recurring subscriptions.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      <!-- Tier 1 -->
      <div class="bg-white rounded-xl border border-slate-205 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        <div class="space-y-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Starter Pack</p>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900">$49</span>
            <span class="text-slate-500 text-sm">/one-time</span>
          </div>
          <p class="text-sm text-slate-505">Essential access to bootstrap your frontend career development.</p>
          <div class="h-px bg-slate-100 my-4"></div>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li class="flex items-center gap-2">✅ 3 Core Framework Courses</li>
            <li class="flex items-center gap-2">✅ Full Code Exercises Download</li>
            <li class="flex items-center gap-2">✅ Lifetime Updates Included</li>
          </ul>
        </div>
        <a href="#" class="block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg transition-colors mt-8">Select Starter</a>
      </div>

      <!-- Tier 2 (Popular) -->
      <div class="bg-white rounded-xl border-2 border-sky-500 p-6 flex flex-col justify-between shadow-md relative">
        <span class="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
        <div class="space-y-4">
          <p class="text-xs font-bold text-sky-600 uppercase tracking-widest">Premium Developer</p>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900">$148</span>
            <span class="text-slate-505 text-sm">/one-time</span>
          </div>
          <p class="text-sm text-slate-500">The complete blueprint to becoming a professional full-stack Next.js developer.</p>
          <div class="h-px bg-slate-100 my-4"></div>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li class="flex items-center gap-2">✅ All Courses & Workshops</li>
            <li class="flex items-center gap-2">✅ Discord Premium Student Lounge</li>
            <li class="flex items-center gap-2">✅ Code Review & Feedback blue-print</li>
            <li class="flex items-center gap-2">✅ 1-on-1 Mentorship Session</li>
          </ul>
        </div>
        <a href="#" class="block text-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg transition-colors mt-8 shadow-sm">Select Premium</a>
      </div>

      <!-- Tier 3 -->
      <div class="bg-white rounded-xl border border-slate-205 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
        <div class="space-y-4">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Enterprise Group</p>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-extrabold text-slate-900">$399</span>
            <span class="text-slate-500 text-sm">/one-time</span>
          </div>
          <p class="text-sm text-slate-500">Enable your entire engineering team to level up coding standards together.</p>
          <div class="h-px bg-slate-100 my-4"></div>
          <ul class="space-y-2.5 text-sm text-slate-600">
            <li class="flex items-center gap-2">✅ Up to 5 Team Access accounts</li>
            <li class="flex items-center gap-2">✅ Dedicated Slack support line</li>
            <li class="flex items-center gap-2">✅ Customized Learning Roadmap</li>
          </ul>
        </div>
        <a href="#" class="block text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg transition-colors mt-8">Select Enterprise</a>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: "testimonials-1",
    name: "Clean Testimonials Grid Card",
    type: "designer",
    category: "testimonials",
    html: `<!-- Testimonials 3-Card Layout -->
<section class="py-16 px-4 bg-white">
  <div class="max-w-6xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">What Our Graduates Say</h2>
      <p class="text-slate-550 mt-2">See how our alumni transformed their workflows and landed engineering jobs.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
        <p class="text-slate-600 leading-relaxed text-sm italic">"The Next.js course completely demystified Server Components and routing. Within three weeks of completing it, I landed a Senior Frontend role at a leading tech firm."</p>
        <div class="flex items-center gap-3 mt-6">
          <div class="w-10 h-10 rounded-full bg-slate-350 text-white font-bold flex items-center justify-center">SL</div>
          <div>
            <h4 class="font-bold text-sm text-slate-900">Sarah Jenkins</h4>
            <p class="text-xs text-slate-500">Software Engineer, Vercel</p>
          </div>
        </div>
      </div>
      
      <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
        <p class="text-slate-600 leading-relaxed text-sm italic">"I've bought many online courses, but KBusiness Academy stands out. The code reviews, exercises, and clean architecture guides are incredibly high quality."</p>
        <div class="flex items-center gap-3 mt-6">
          <div class="w-10 h-10 rounded-full bg-slate-350 text-white font-bold flex items-center justify-center">MR</div>
          <div>
            <h4 class="font-bold text-sm text-slate-900">Marcus Reed</h4>
            <p class="text-xs text-slate-500">Junior Full-Stack Dev</p>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
        <p class="text-slate-600 leading-relaxed text-sm italic">"Zero fluff. Just practical production setups, database indexes, and deployment blueprints. Absolutely worth every single cent."</p>
        <div class="flex items-center gap-3 mt-6">
          <div class="w-10 h-10 rounded-full bg-slate-350 text-white font-bold flex items-center justify-center">DV</div>
          <div>
            <h4 class="font-bold text-sm text-slate-900">Daniel Vance</h4>
            <p class="text-xs text-slate-500">Freelance Web Developer</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ── MODERN BLOCKS ──
  {
    id: "modern-hero-1",
    name: "Modern Grid Hero Layout",
    type: "modern",
    category: "Hero",
    html: `<!-- Modern Split Hero Grid -->
<header class="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="space-y-6">
      <span class="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
        ✨ Level Up Your Engineering Today
      </span>
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
        Build Production Apps with Real-World Blueprints.
      </h1>
      <p class="text-slate-400 text-lg leading-relaxed">
        Stop building simple tutorial apps. Learn design patterns, enterprise architectures, security, and scalable databases from senior tech leads.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a href="#courses" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-center shadow-lg transition-colors">Start Learning</a>
        <a href="#about" class="text-slate-350 hover:text-white border border-slate-700 hover:border-slate-500 font-semibold px-6 py-3 rounded-lg text-center transition-colors">Learn More</a>
      </div>
    </div>
    <!-- Visual Mockup Container -->
    <div class="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl">
      <div class="flex items-center gap-1.5 pb-3 border-b border-slate-850">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div class="pt-4 font-mono text-xs text-sky-400 space-y-2">
        <p class="text-slate-500">// Initialize KBusiness Academy Masterclass</p>
        <p><span class="text-indigo-400">const</span> academy = <span class="text-emerald-400">new</span> <span class="text-yellow-400">Academy</span>({</p>
        <p class="pl-4">students: <span class="text-emerald-450">"unlimited"</span>,</p>
        <p class="pl-4">curriculum: <span class="text-emerald-455">"nextjs15_mongodb_stripe"</span>,</p>
        <p class="pl-4">mentorship: <span class="text-amber-400">true</span></p>
        <p>});</p>
        <p class="text-slate-500">// Run deployment pipeline...</p>
        <p class="text-emerald-450">academy.deploy({ state: "success" });</p>
      </div>
    </div>
  </div>
</header>`
  },
  {
    id: "modern-team-1",
    name: "Modern Leaders & Instructors Grid",
    type: "modern",
    category: "Team",
    html: `<!-- Instructors Profile Cards -->
<section class="py-16 px-4 bg-slate-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-12">
      <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">Meet Your Instructors</h2>
      <p class="text-slate-505 mt-2">Learn directly from senior industry engineers with years of experience building scalable systems.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
      <!-- Team Card 1 -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 flex gap-4 items-center">
        <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">👨‍💻</div>
        <div class="space-y-1">
          <h4 class="font-bold text-lg text-slate-900">Alex Rivera</h4>
          <p class="text-xs font-semibold text-sky-600">Lead Technical Instructor</p>
          <p class="text-xs text-slate-500">Former Senior Staff Architect at Netflix & Stripe integrations expert.</p>
        </div>
      </div>
      
      <!-- Team Card 2 -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 flex gap-4 items-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">👩‍💻</div>
        <div class="space-y-1">
          <h4 class="font-bold text-lg text-slate-900">Elena Chen</h4>
          <p class="text-xs font-semibold text-sky-600">Database & Security Lead</p>
          <p class="text-xs text-slate-500">Open-source MongoDB contributor and expert on full-stack web security models.</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },

  // ── WIREFRAME BLOCKS ──
  {
    id: "wireframe-columns-1",
    name: "Three-Column Grid Placeholder",
    type: "wireframe",
    category: "Empty blocks",
    html: `<!-- Wireframe: Three Columns Placeholder -->
<div class="max-w-6xl mx-auto px-4 py-16 border-2 border-dashed border-slate-300 rounded-xl my-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center min-h-[200px] flex flex-col justify-center">
      <div class="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-3"></div>
      <div class="h-4 w-3/4 bg-slate-200 rounded mx-auto mb-2"></div>
      <div class="h-3 w-1/2 bg-slate-200 rounded mx-auto"></div>
    </div>
    <div class="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center min-h-[200px] flex flex-col justify-center">
      <div class="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-3"></div>
      <div class="h-4 w-3/4 bg-slate-200 rounded mx-auto mb-2"></div>
      <div class="h-3 w-1/2 bg-slate-200 rounded mx-auto"></div>
    </div>
    <div class="border border-slate-200 rounded-lg p-6 bg-slate-50 text-center min-h-[200px] flex flex-col justify-center">
      <div class="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-3"></div>
      <div class="h-4 w-3/4 bg-slate-200 rounded mx-auto mb-2"></div>
      <div class="h-3 w-1/2 bg-slate-200 rounded mx-auto"></div>
    </div>
  </div>
</div>`
  },

  // ── DIRECT RESPONSE BLOCKS ──
  {
    id: "direct-response-1",
    name: "Urgent Direct Response Pitch Card",
    type: "direct-response",
    category: "Call to action",
    html: `<!-- Copywriting Pitch / Direct Response Section -->
<section class="py-16 px-4 bg-amber-50 border-y border-amber-200">
  <div class="max-w-4xl mx-auto space-y-6">
    <span class="text-xs font-bold text-amber-800 tracking-widest uppercase">READ THIS IF YOU WANT TO SPEED UP DEVELOPMENT</span>
    <h2 class="text-3xl font-extrabold text-amber-950 tracking-tight">Stop wasting hours debugging stack configurations and learn the patterns that work.</h2>
    <p class="text-amber-900 leading-relaxed text-lg">
      Most developers spend 80% of their time writing boilerplate connection code and debugging path routes. Our curriculum bypasses the tutorials, and gives you direct production-ready setups to copy-paste.
    </p>
    <div class="bg-white border border-amber-200 p-5 rounded-lg shadow-sm">
      <h4 class="font-bold text-amber-950 mb-2">Here is what you get inside KBusiness Academy:</h4>
      <ul class="space-y-2 text-sm text-amber-900">
        <li>🚀 Over 45+ copy-pasteable React, Next.js, and MongoDB templates.</li>
        <li>🔐 Secure Clerk / NextAuth API authentication flow setups.</li>
        <li>💳 Multi-provider Billing setups (Stripe + PayPal checkout engines).</li>
      </ul>
    </div>
    <div class="pt-4 text-center">
      <a href="/checkout" class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-8 py-3.5 rounded-lg shadow-md transition-colors">Instant Lifetime Access Package</a>
    </div>
  </div>
</section>`
  },

  // ── POPUPS ──
  {
    id: "popup-newsletter-1",
    name: "Newsletter Modal Alert Card",
    type: "popups",
    category: "optin-forms",
    html: `<!-- Overlay/Modal Popup Simulated Frame -->
<div class="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative my-6">
  <div class="bg-slate-900 p-6 text-white text-center">
    <span class="text-3xl">🎁</span>
    <h3 class="text-xl font-bold mt-2">Get Free Templates Daily</h3>
    <p class="text-xs text-slate-400 mt-1">We send fresh premium HTML and Tailwind layouts to your inbox every morning.</p>
  </div>
  <div class="p-6 space-y-4">
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
      <input type="email" placeholder="name@domain.com" class="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" />
    </div>
    <button class="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md">Subscribe & Download</button>
    <p class="text-[10px] text-center text-slate-400">We respect your privacy. Unsubscribe at any time.</p>
  </div>
</div>`
  },

  // ── MEGAMENUS ──
  {
    id: "megamenu-1",
    name: "Full-width Dropdown Megamenu",
    type: "megamenus",
    category: "navigation bars",
    html: `<!-- Top Navigation Header with Megamenu -->
<nav class="bg-slate-900 text-white border-b border-slate-800">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <span class="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">🎓 KBusiness Academy</span>
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <a href="#" class="hover:text-white transition-colors">Home</a>
        <a href="#" class="hover:text-white transition-colors">Courses</a>
        <a href="#" class="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1">
          Templates Library <span class="text-[10px]">▼</span>
        </a>
        <a href="#" class="hover:text-white transition-colors">Pricing</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <a href="/login" class="text-sm font-semibold hover:text-slate-200">Sign In</a>
      <a href="/register" class="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors">Get Access</a>
    </div>
  </div>
</nav>`
  },

  // ── GROOVE TRANSFERRED BLOCKS ──
  {
    id: "groove-keynote-speaker",
    name: "Groove Keynote Speaker Profile",
    type: "designer",
    category: "Content",
    html: `<!-- Groove Keynote Speaker Profile Block -->
<section style="position: relative; background: #f7fafc; padding: 4rem 1rem; background-position: center; background-size: cover;">
  <div style="width: 100%; margin-right: auto; margin-left: auto; max-width: 1200px;">
    <div style="width: 100%; padding-right: 0.5rem; padding-left: 0.5rem;">
      <div style="flex-wrap: wrap; margin-right: -0.5rem; margin-left: -0.5rem; display: flex; align-items: center;">
        <!-- Left Image Column -->
        <div class="w-full md:w-1/2 px-2" style="flex-basis: auto; flex-shrink: 0; flex-grow: 0; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; flex-direction: column; height: 100%; width: 100%;">
            <img src="https://assets.grooveapps.com/images/5df98d83cf362c0e9cf8723d/1595935059_about-2.png" alt="Keynote Speaker" style="object-position: center center; object-fit: cover; display: inline-flex; height: auto; width: 350px; max-width: 100%; border-radius: 12px;">
          </div>
        </div>
        <!-- Right Content Column -->
        <div class="w-full md:w-1/2 px-2" style="flex-basis: auto; flex-shrink: 0; flex-grow: 0;">
          <div style="display: flex; align-items: flex-start; flex-direction: column; height: 100%; width: 100%; padding: 1.5rem;">
            <h2 style="font-size: 18px; color: rgb(57, 75, 86); font-family: Montserrat, sans-serif; margin-bottom: 12px;">Keynote Speaker</h2>
            <h1 style="font-size: 48px; font-family: 'Fira Sans', sans-serif; font-weight: 800; margin-bottom: 16px;">Harley Quinn</h1>
            <p style="font-size: 16px; line-height: 1.5; font-family: Montserrat, sans-serif; margin-bottom: 24px; color: #4a5568;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut elementum elit. Nulla pharetra sem id nisi ornare, eget porta eros vehicula. Morbi vel nisl finibus, porta lacus eget, lobortis enim. Vivamus laoreet ligula ut ipsum sagittis lobortis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <img src="https://assets.grooveapps.com/images/5df98d83cf362c0e9cf8723d/1595919703_featured-list-1.png" alt="Partners" style="object-position: center center; object-fit: cover; display: inline-flex; height: auto; width: 450px; margin-bottom: 1.75rem; max-width: 100%;">
            <a href="#" class="hover:opacity-90 transition-opacity" style="display: inline-block; width: 75%; padding: 1rem 3rem; background-color: rgb(255, 204, 36); text-align: center; color: rgb(32, 45, 60); font-weight: 700; font-size: 1.125rem; font-family: Montserrat, sans-serif; text-decoration: none; cursor: pointer; border-radius: 8px;">
              Please Save My Seat 
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
  }
];
