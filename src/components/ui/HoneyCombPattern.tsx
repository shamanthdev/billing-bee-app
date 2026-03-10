const HoneycombPattern = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hexPattern"
          width="60"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="30 0, 60 15, 60 37, 30 52, 0 37, 0 15"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  );
};

export default HoneycombPattern;