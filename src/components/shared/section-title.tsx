interface SectionTitleProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-center justify-between px-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}
