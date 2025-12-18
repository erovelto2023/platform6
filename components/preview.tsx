"use client";

interface PreviewProps {
    value: string;
}

export const Preview = ({
    value,
}: PreviewProps) => {
    return (
        <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
    );
};
