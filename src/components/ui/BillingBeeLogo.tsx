interface LogoProps {
  size?: number;
}

const BillingBeeLogo = ({ size = 40 }: LogoProps) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="50 5, 90 27, 90 73, 50 95, 10 73, 10 27"
          stroke="#FACC15"
          strokeWidth="6"
          fill="none"
        />

        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="40"
          fontWeight="700"
          fill="#FACC15"
          fontFamily="Inter, sans-serif"
        >
          B
        </text>
      </svg>

      <span className="text-xl font-semibold tracking-tight text-white">
        Billing<span className="text-yellow-400">Bee</span>
      </span>
    </div>
  );
};

export default BillingBeeLogo;