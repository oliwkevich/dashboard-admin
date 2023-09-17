const Heading = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
};

export { Heading };
