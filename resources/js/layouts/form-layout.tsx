export default function FormLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative space-y-5 rounded-md border p-8">
            {children}
        </div>
    );
}
