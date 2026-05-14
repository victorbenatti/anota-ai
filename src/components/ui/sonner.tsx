import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "!bg-paper !text-ink !border !border-ink !rounded-sm !shadow-[4px_4px_0_hsl(var(--ink))] !font-display",
          title: "!font-display !text-base !italic",
          description:
            "!font-mono !text-[10px] !uppercase !tracking-[0.14em] !text-ink-soft",
        },
      }}
      {...props}
    />
  );
}
