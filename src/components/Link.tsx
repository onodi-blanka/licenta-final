type LinkProps = {
  href: string;
  label: string;
};

const Link = ({ href, label }: LinkProps) => {
  return (
    <a href={href} className="pt-2 hover:underline hover:text-green-700">
      {label}
    </a>
  );
};

export default Link;
