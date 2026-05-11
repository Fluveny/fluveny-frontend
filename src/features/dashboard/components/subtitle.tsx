export const SubTitle = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-xl font-bold lg:text-2xl">{title}</p>
      <p className="text-muted-foreground lg:text-base">{description}</p>
    </div>
  );
};
