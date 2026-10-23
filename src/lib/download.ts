import {
  downloadZip,
  getDownloadUrl,
  type DriveItem,
  type DriveSelection,
} from "../api/drive";

const saveFromUrl = (href: string, filename: string) => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

// 파일 1개는 임시 URL로 바로 받고, 링크는 새 탭으로 연다. 그 밖(여러 개·폴더)은 ZIP으로 받는다.
export const downloadSelection = async (
  selection: DriveSelection,
  items: DriveItem[],
) => {
  const single =
    !selection.folderIds?.length && selection.itemIds?.length === 1
      ? items.find((item) => item.id === selection.itemIds![0])
      : undefined;

  if (single?.kind === "LINK" && single.url) {
    window.open(single.url, "_blank", "noreferrer");
    return;
  }
  if (single) {
    const { url, filename } = await getDownloadUrl(single.id);
    saveFromUrl(url, filename);
    return;
  }

  const { blob, filename } = await downloadZip(selection);
  const href = URL.createObjectURL(blob);
  saveFromUrl(href, filename);
  // 다운로드가 시작될 시간을 준 뒤 메모리를 돌려준다.
  setTimeout(() => URL.revokeObjectURL(href), 60_000);
};
