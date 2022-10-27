import { useState } from "react";
import { TextAnnotateMulti } from "@badiary/react-text-annotate-multi";
import SyntaxHighlighter from "react-syntax-highlighter";

type LabelUnit = {
  start: number;
  end: number;
  labelName: string;
  text: string;
};

const initialLabelUnits: LabelUnit[] = [
  {
    start: 51,
    end: 64,
    labelName: "labelB",
    text: "Design simple",
  },
  {
    start: 111,
    end: 116,
    labelName: "labelB",
    text: "React",
  },
  {
    start: 111,
    end: 151,
    labelName: "labelC",
    text: "React will efficiently update and render",
  },
];

const demoText =
  "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debug.";

const COLORS: { [key: string]: string } = {
  labelA: "rgb(179, 245, 66)",
  labelB: "#99ffff",
  labelC: "#ff99ff",
};

const getBackgroungColor = (labelNames: Set<string>): string => {
  const muitiLabeledColor = "#c8c8c8";

  let bgColor = muitiLabeledColor;

  if (labelNames.size === 1) {
    let labelName = Array.from(labelNames)[0];
    if (labelName in COLORS) {
      bgColor = COLORS[labelName];
    } else {
      console.log("not found", labelName);
    }
  } else {
    console.log("size not equal to 1", labelNames);
  }
  console.log({ bgColor });
  return bgColor;
};

// const textElementGenerator = (text: string) => {
//   return text.replace("the", "The!!!");
// };
function TextAnnotator() {
  const [labelUnits, setLabelUnits] = useState(initialLabelUnits);
  const [labelName, setLabelName] = useState("labelA");

  return (
    <div
      style={{
        margin: "10px",
        padding: "10px 30px 30px 30px",
        border: "1px solid #000",
      }}
    >
      <div>
        <span>label name: </span>
        <select onChange={(e) => setLabelName(e.target.value)}>
          {Object.keys(COLORS).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div>
        <TextAnnotateMulti
          text={demoText}
          setLabelUnits={setLabelUnits}
          labelUnits={labelUnits}
          labelName={labelName}
          getBackgroungColor={getBackgroungColor}
          // textElementGenerator={textElementGenerator}
        />
      </div>
      <br />
      <h4>Current Stored Label</h4>
      <SyntaxHighlighter language="json">
        {JSON.stringify(labelUnits, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
}

export default TextAnnotator;
