import { CheckIcon } from 'lucide-react';

export default function RightsCard({ description }: { description: string }) {
    return (
        <div className="flex items-center gap-3 rounded-md p-3 shadow-md duration-300 hover:translate-x-2 hover:shadow-green-500">
            <div className="rounded-full bg-green-500 p-1 text-white">
                <CheckIcon size={10} />
            </div>

            <p className="text-sm">{description}</p>
        </div>
    );
}
