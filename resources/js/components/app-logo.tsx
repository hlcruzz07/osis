import { env } from 'node:process';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/logo.webp" alt="" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 flex flex-col gap-1 truncate leading-tight font-semibold">
                    CHMSU OSIS
                    <small className="text-[10px]">
                        Online Student Information Sheet
                    </small>
                </span>
            </div>
        </>
    );
}
