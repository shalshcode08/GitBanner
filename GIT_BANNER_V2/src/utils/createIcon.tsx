type Opts = {
  width: number;
  height: number;
  fill?: string;
  viewBox?: string;
};

export const createIcon = (d: string | React.ReactNode, opts: Opts) => {
  const { width, height, fill, viewBox } = opts;
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      fill={fill}
    >
      {typeof d === "string" ? <path fill="currentColor" d={d} /> : d}
    </svg>
  );
};
