import React from 'react';
import { Heart, DollarSign, CreditCard } from 'lucide-react';

interface PaymentSupportProps {
  variant?: 'minimal' | 'full';
  className?: string;
}

export const PaymentSupport: React.FC<PaymentSupportProps> = ({ variant = 'full', className = "" }) => {
  const paymentMethods = [
    { name: 'Cash App', value: '$EricRovelto', icon: DollarSign, color: 'text-emerald-500' },
    { name: 'PayPal', value: 'erovelto1@gmail.com', icon: CreditCard, color: 'text-blue-500' },
    { name: 'Venmo', value: 'LearnEric', url: 'https://www.venmo.com/u/LearnEric', icon: Heart, color: 'text-purple-500' },
  ];

  if (variant === 'minimal') {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-sm border-b border-white/5 py-2 px-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] uppercase font-black tracking-widest text-slate-400 ${className}`}>
        <span className="flex items-center gap-2">
          <Heart size={12} className="text-pink-500 fill-current" />
          Support the Academy:
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {paymentMethods.map((method) => (
            <div key={method.name} className="flex items-center gap-1.5">
              <span className={method.color}>{method.name}:</span>
              {method.url ? (
                <a href={method.url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">
                  {method.value}
                </a>
              ) : (
                <span className="text-white">{method.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl ${className}`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Heart size={120} className="text-white fill-current" />
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
          <Heart size={12} className="fill-current text-pink-500" /> Pay What You Want
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Support Our Mission</h2>
        <p className="text-slate-400 font-medium mb-8 max-w-xl text-sm leading-relaxed">
          K Business Academy is free for everyone. If you find value in our tools and training, consider supporting the academy through any of the options below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentMethods.map((method) => {
            const content = (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl hover:border-white/20 transition-all flex flex-col items-center text-center group/item hover:scale-[1.02]">
                <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-colors group-hover/item:bg-white/10`}>
                  <method.icon size={20} className={method.color} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{method.name}</div>
                <div className="text-white font-bold text-sm truncate w-full">{method.value}</div>
              </div>
            );

            return method.url ? (
              <a key={method.name} href={method.url} target="_blank" rel="noopener noreferrer" className="block">
                {content}
              </a>
            ) : (
              <div key={method.name}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
