export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout completely bypasses the parent admin layout
    return (
        <div className="h-screen w-screen overflow-hidden">
            {children}
        </div>
    );
}
