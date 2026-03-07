import { useReadingProgress } from "@/hooks/useReadingProgress";

const ReadingProgressBar = () => {
  const { progress, toggleChapter, percentage, completedCount, totalChapters, chapters } = useReadingProgress();

  return (
    <div className="reading-progress">
      <div className="reading-progress__header">
        <span className="reading-progress__label">Seu progresso</span>
        <span className="reading-progress__count">{completedCount}/{totalChapters} capítulos · {percentage}%</span>
      </div>
      <div className="reading-progress__bar">
        <div className="reading-progress__fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="reading-progress__chapters">
        {chapters.map(ch => (
          <button
            key={ch.id}
            className={`reading-progress__chip${progress[ch.id] ? " reading-progress__chip--done" : ""}`}
            onClick={() => toggleChapter(ch.id)}
            title={progress[ch.id] ? "Marcar como não lido" : "Marcar como lido"}
          >
            {progress[ch.id] && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReadingProgressBar;
