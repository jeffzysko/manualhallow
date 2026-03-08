import { TOC_ITEMS } from "@/data/chapters";

interface ManualTOCProps {
  onNavigate: (target: string) => void;
}

const ManualTOC = ({ onNavigate }: ManualTOCProps) => (
  <section id="toc">
    <div className="page-wrap">
      <div className="toc-header">
        <div className="ornament mb-16" style={{ marginBottom: 24 }}><span>ÍNDICE</span></div>
        <h2>O que você vai <em>dominar</em></h2>
      </div>

      <div className="toc-grid">
        {TOC_ITEMS.map(item => (
          <a
            key={item.target}
            className="toc-item"
            style={{ "--item-color": item.color } as React.CSSProperties}
            onClick={(e) => { e.preventDefault(); onNavigate(item.target); }}
            href={`#${item.target}`}
          >
            <span className="toc-num">{item.num}</span>
            <div className="toc-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
            <span className="toc-arrow">→</span>
          </a>
        ))}
      </div>

    </div>
  </section>
));

ManualTOC.displayName = "ManualTOC";

export default ManualTOC;
