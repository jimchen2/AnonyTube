import { useEffect } from "react";

export const useFetchSubtitles = (
  selectedSubtitles,
  subtitles,
  setSubtitleTexts
) => {
  useEffect(() => {
    const fetchData = async () => {
      const promises = selectedSubtitles.map(async (language) => {
        const subtitleUrl = subtitles.find(
          (subtitle) => subtitle.language === language
        )?.url;
        if (subtitleUrl) {
          const response = await fetch(subtitleUrl);
          const text = await response.text();
          return { language, text };
        }
        return null;
      });

      const subtitleData = await Promise.all(promises);
      const parsedSubtitles = subtitleData.map((data) => {
        if (data) {
          return {
            language: data.language,
            subtitles: parseSubtitles(data.text),
          };
        }
        return null;
      });

      setSubtitleTexts(parsedSubtitles.filter((subtitle) => subtitle !== null));
    };

    fetchData();
  }, [selectedSubtitles, subtitles, setSubtitleTexts]);
};

const parseSubtitles = (text) => {
  const lines = text.trim().split("\n");
  const subtitleData = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->")) {
      const [startTime, endTime] = lines[i]
        .split("-->")
        .map((time) => time.trim());
      const subtitleLines = [];

      while (lines[++i] && lines[i].trim() !== "") {
        subtitleLines.push(lines[i].trim());
      }

      subtitleData.push({
        startTime: parseTime(startTime),
        endTime: parseTime(endTime),
        text: subtitleLines.join("\n"),
      });
    }
  }
  return subtitleData;
};

const parseTime = (timeString) => {
  const timeParts = timeString.split(":");

  // Pad timeParts to ensure always have [hours, minutes, seconds, milliseconds]
  while (timeParts.length < 3) timeParts.unshift('00');

  // Parse seconds, accommodating for a potential decimal point denoting milliseconds
  let [hours, minutes, seconds] = timeParts;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  seconds = parseFloat(seconds); // Parse seconds as a float to get milliseconds if present

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
};

export const handleTimeUpdate = (
  playerRef,
  subtitleTexts,
  setSubtitleTexts
) => {
  const currentTime = playerRef.current.getState().player.currentTime;
  const currentSubtitles = subtitleTexts.map((subtitle) => {
    const currentSubtitle = subtitle.subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
    );
    return currentSubtitle ? currentSubtitle.text : "";
  });

  setSubtitleTexts((prevSubtitles) =>
    prevSubtitles.map((subtitle, index) => ({
      ...subtitle,
      text: currentSubtitles[index],
    }))
  );
};