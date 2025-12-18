export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-500">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 text-indigo-600"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.18.063-2.33.12-3.45.164m9.376 2.137V15.75a3 3 0 0 1-3 3h-3.25m-2.25-3.75h4.483c1.253 0 2.227-.969 2.572-2.185a.75.75 0 0 0-1.082-.916l-.387.217a.75.75 0 0 1-.722 0l-.387-.217a.75.75 0 0 0-1.082.916c.345 1.216 1.319 2.185 2.572 2.185H14.25m-2.25-3.75h2.25M4.5 19.5h1.5m-1.5 0v-1.5m0 1.5v1.5m0-1.5H3m1.5-1.5h1.5m-1.5 0v-1.5m0 1.5v1.5m0-1.5H3"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Select a conversation</h3>
            <p className="max-w-md">
                Choose a conversation from the list on the left or start a new one to begin messaging.
            </p>
        </div>
    );
}
