
import { BufferItem } from "../interfaces/ProcessRequest";


interface Props {
  buffer: (BufferItem|undefined)[];
}

export const Buffer = ({ buffer }: Props) => {
  

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {buffer.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            border: "1px solid black",
            borderColor: "black",
            width: "50px",
            height: "50px",
            lineHeight: "30px",
            overflow: 'hidden',
          
          }}
          className="text-ellipsis overflow-hidden text-nowrap"
        >
          <span
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bolder",

            }}
            title={item?.process.processUuid}
          >
            {item?.process.processUuid}
          </span>
          <span
            style={{
              fontSize: 10,
              position: "absolute",
              bottom: -6,
              left: 33,
            }}
          >
            {index}
          </span>
        </div>
      ))}
    </div>
  );
};
