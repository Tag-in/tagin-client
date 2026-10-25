export const formatBytes = (bytes: number | null) => {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`;
};

// 10월 24일
export const formatDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const TYPE_BY_EXTENSION: Record<string, string> = {
  pdf: "PDF 문서",
  doc: "Word 문서",
  docx: "Word 문서",
  ppt: "프레젠테이션",
  pptx: "프레젠테이션",
  xls: "스프레드시트",
  xlsx: "스프레드시트",
  csv: "스프레드시트",
  txt: "텍스트",
  md: "텍스트",
  fig: "Figma 파일",
  zip: "압축 파일",
};

// 파일 종류 표시용 이름
export const typeLabel = (
  kind: "FILE" | "LINK" | "FOLDER",
  name: string,
  mimeType: string | null = null,
) => {
  if (kind === "FOLDER") return "폴더";
  if (kind === "LINK") return "링크";
  const extension = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  if (TYPE_BY_EXTENSION[extension]) return TYPE_BY_EXTENSION[extension];
  if (mimeType?.startsWith("image/")) return "이미지";
  if (mimeType?.startsWith("video/")) return "동영상";
  return "파일";
};
