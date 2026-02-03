"use client";
import React from 'react';

import { Player } from '@remotion/player';
import { QuestionsAnimation } from '@/components/remotion/questions-animation';

export default function QuestionsHero() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-full h-[400px] md:h-[500px] bg-slate-950" />;
    }

    return (
        <div className="w-full bg-slate-950 border-b border-slate-800 overflow-hidden relative group">
            <div className="w-full h-[400px] md:h-[500px]">
                <Player
                    component={QuestionsAnimation}
                    durationInFrames={150}
                    compositionWidth={1920}
                    compositionHeight={600}
                    fps={30}
                    autoPlay
                    loop
                    controls={false}
                    className="w-full h-full [&>video]:object-cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>
    );
}
