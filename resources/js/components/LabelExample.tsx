import { PropsWithChildren } from 'react';
import { Label } from './ui/label';
import { Asterisk } from 'lucide-react';

type LabelExampleProps = {
    isRequired: boolean;
    title: string;
    example: string;
};

export default function LabelExample({
    isRequired,
    title,
    example,
}: LabelExampleProps) {
    return (
        <div className="relative flex items-center justify-between">
            <Label>
                {title} {isRequired ? <Asterisk color="red" size={12} /> : ''}
            </Label>
            <small className="absolute right-0 text-[10px] text-gray-500 sm:text-xs dark:text-gray-200">
                (ex: {example})
            </small>
        </div>
    );
}
