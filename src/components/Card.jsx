import clsx from "clsx";

export default function Card({
  children,
  className,
  padding = true,
}) {
  return (
    <div
      className={clsx(
        "bg-surface dark:bg-surfaceDark border border-borderLight dark:border-borderDark rounded-xl shadow-soft",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}