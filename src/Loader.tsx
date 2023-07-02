export const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "calc(50% - 78px)",
        top: "calc(50% - 62px)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ margin: "auto", display: "block", shapeRendering: "auto" }}
        width="100px"
        height="100px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <g transform="translate(50 50)">
          <path
            fill="#e90c59"
            transform="scale(0.8)"
            d="M40.7-34.3c-9.8-9.8-25.6-9.8-35.4,0L0-29l-5.3-5.3c-9.8-9.8-25.6-9.8-35.4,0l0,0c-9.8,9.8-9.8,25.6,0,35.4l5.3,5.3L-23,18.7l23,23l23-23L35.4,6.3L40.7,1C50.4-8.8,50.4-24.6,40.7-34.3z"
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              repeatCount="indefinite"
              dur="1s"
              keyTimes="0;0.05;0.39;0.45;0.6;1"
              values="0.68;0.8;0.6000000000000001;0.7200000000000001;0.68;0.6400000000000001"
              calcMode="spline"
              keySplines="0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1;0.215 0.61,0.355 1"
            />
          </path>
        </g>
      </svg>
      <div>Loading lineup...</div>
    </div>
  );
};
