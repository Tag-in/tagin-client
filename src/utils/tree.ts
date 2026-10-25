export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

// parentId로 이어진 평평한 폴더 목록을 트리로 만든다. 입력 순서(이름 순)를 유지한다.
export const buildFolderTree = (
  folders: { id: string; name: string; parentId: string | null }[],
): TreeNode[] => {
  const nodes = new Map<string, TreeNode>(
    folders.map(({ id, name }) => [id, { id, name, children: [] }]),
  );
  const roots: TreeNode[] = [];
  for (const { id, parentId } of folders) {
    const parent = parentId ? nodes.get(parentId) : undefined;
    // 부모가 목록에 없으면(휴지통 등) 최상위에 둔다.
    (parent ? parent.children! : roots).push(nodes.get(id)!);
  }
  return roots;
};
