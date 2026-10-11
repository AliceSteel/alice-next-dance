export default function renderHighlighted(text: string) {
  //split text content with $ to identify highlighted segments
  const parts = text.split("$");

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className="text-textLightBlue">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
