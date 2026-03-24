"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            position="bottom-right"
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast:
                        "contact-toast flex items-start gap-3 w-full rounded-lg px-5 py-4 font-body text-[0.875rem]",
                    title: "font-body font-medium text-[0.875rem]",
                    description: "font-body text-[0.8125rem] mt-1",
                    actionButton:
                        "font-mono text-[0.6875rem] uppercase tracking-[0.08em] font-medium",
                    cancelButton:
                        "font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
                },
            }}
            {...props}
        />
    );
}

export { Toaster };