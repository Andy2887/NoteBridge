interface NorthwesternLogoProps {
  size?: number;
  className?: string;
}

const NorthwesternLogo = ({ size = 24, className = "" }: NorthwesternLogoProps) => {
  return (
    <img 
      src="/Northwestern-logo.jpeg" 
      alt="Northwestern University Logo"
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
};

export default NorthwesternLogo;
