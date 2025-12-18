"use client";

import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({
    onChange,
    value,
}: EditorProps) => {
    return (
        <div className="bg-white">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[200px]"
            />
        </div>
    );
};
