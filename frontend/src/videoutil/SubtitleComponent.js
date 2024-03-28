import React from "react";

const SubtitleComponent = ({ selectedSubtitles, subtitleTexts }) => {
  const subtitleLines = selectedSubtitles.map((language) => {
    const subtitleText = subtitleTexts
      .filter((subtitle) => subtitle.language === language)
      .map((subtitle) => subtitle.text)
      .join("\n");
    return (
      <p key={language} className="subtitle-text">
        {subtitleText}
      </p>
    );
  });

  return (
    <div
      className={`subtitle-wrapper ${
        subtitleLines.length === 0 ? "hidden" : ""
      }`}
    >
      <div className="subtitle-background">{subtitleLines}</div>
    </div>
  );
};

export default SubtitleComponent;