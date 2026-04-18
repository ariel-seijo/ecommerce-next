import "./SectionTitle.css";

export default function SectionTitle({ children }) {
  return (
    <div className="titleContainer">
      <h2 className="sectionTitle">{children}</h2>
    </div>
  );
}
