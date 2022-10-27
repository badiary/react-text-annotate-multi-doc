import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import TextAnnotator from "./TextAnnotator";
import { HeadingProps } from "react-markdown/lib/ast-to-react";
import { Row, Col, Container, Table } from "react-bootstrap";

function App() {
  const markdown1 = `
  # React Text Annotate Multi

This library provides a React component for labeling a selected range of text. Arbitrary number of labels can be overlapped.

This project stems from [\`react-text-annotate-blend\`](https://www.npmjs.com/package/react-text-annotate-blend), in which only two overlapping labels are allowed.

## Installation

\`\`\`node
npm install @badiary/react-text-annotate-multi
\`\`\`

## Demo
`;

  const markdown2 = `

## Usage

\`\`\`tsx
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
    }
  }

  return bgColor;
};

function App() {
  const [labelUnits, setLabelUnits] = useState(initialLabelUnits);
  const [labelName, setLabelName] = useState("labelA");

  return (
    <>
      <select onChange={(e) => setLabelName(e.target.value)}>
        {Object.keys(COLORS).map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <div>
        <TextAnnotateMulti
          text={demoText}
          updateLabelUnits={(newLabelUnits: LabelUnit[]) => {
            setLabelUnits(newLabelUnits);
          }}
          labelUnits={labelUnits}
          labelName={labelName}
          getBackgroungColor={getBackgroungColor}
        />
      </div>

      <h3>Current Stored Label</h3>
      <div>
        <pre>{JSON.stringify(labelUnits, null, 2)}</pre>
      </div>
    </>
  );
}
\`\`\`

## Props
`;

  const markdown3 = `
(*) Type \`LabelUnit\` is defined as follows:

\`\`\`javascript
type LabelUnit = {
  start: number;     // index at which labeled text starts
  end: number;       // index at which labeled text ends
  labelName: string; // labeled name
  text: string;      // text of labeled range
};
\`\`\`

`;

  const toc: {
    level: number;
    id: string;
    title: string;
  }[] = [];

  // Magic.
  const addToTOC = ({
    children,
    ...props
  }: React.PropsWithChildren<HeadingProps>) => {
    const level = Number(props.node.tagName.match(/h(\d)/)?.slice(1));
    if (level && children && typeof children[0] === "string") {
      const id = children[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({
        level,
        id,
        title: children[0],
      });
      return React.createElement(props.node.tagName, { id }, children);
    } else {
      return React.createElement(props.node.tagName, props, children);
    }
  };

  function TOC() {
    return (
      <ul className="table-of-contents">
        {toc.map(({ level, id, title }) => (
          <li key={id} className={`toc-entry-level-${level}`}>
            <a href={`#${id}`}>{title}</a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Container>
      <Row>
        <Col md="10" className="wall-of-text">
          <ReactMarkdown
            children={markdown1}
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h2: addToTOC,
            }}
          />
          <TextAnnotator />
          <ReactMarkdown
            children={markdown2}
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h2: addToTOC,
            }}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "200px" }}>Property</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>text</td>
                <td>string</td>
                <td>Text you want to annotate.</td>
              </tr>
              <tr>
                <td>labelName</td>
                <td>string</td>
                <td>
                  Name of a label you want to annotate. This may be a state of a
                  React component which refers to a value of select tag.
                </td>
              </tr>
              <tr>
                <td>labelUnits</td>
                <td>LabelUnit[]</td>
                <td>
                  An array of <code>LabelUnit</code>(*) which corresponds to
                  label data. This may be a state of a React component which
                  stores label data.
                </td>
              </tr>
              <tr>
                <td>updateLabelUnites</td>
                <td>{"(newLabelUnits: LabelUnit[]) => void"}</td>
                <td>
                  Fired when label data is updated. Call
                  <code>React.SetStateAction</code>
                  in this function to update the state of labelUnits.
                </td>
              </tr>
              <tr>
                <td>getBackgroungColor</td>
                <td>{"(labelNames: Set<string>) => string"}</td>
                <td>
                  {`A function which returns a background color of labeled name
                  set. Returned string must be interpretable as a
                  backgroundColor property of CSS. (e.g. "#42f5f5", "rgb(179,
                  245, 66)", etc...)`}
                </td>
              </tr>
              <tr>
                <td>
                  textElementGenerator
                  <br />
                  (optional)
                </td>
                <td>
                  {"(text: string) => string | JSX.Element | JSX.Element[]"}
                </td>
                <td>
                  A function which generates a text node / element(s). Useful
                  when you want to modify labeled text (e.g. highlighting
                  keywords).
                </td>
              </tr>
            </tbody>
          </Table>
          <ReactMarkdown
            children={markdown3}
            remarkPlugins={[remarkGfm]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              h2: addToTOC,
            }}
          />
        </Col>
        <Col md="2">
          <TOC />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
