import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface !text-ink !border !border-line !rounded-xl !shadow-soft-md",
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-ink-soft",
        },
      }}
      {...props}
    />
  );
}
