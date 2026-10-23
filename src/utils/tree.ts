export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export const findTreePath = (
  nodes: TreeNode[],
  id: string,
  parents: string[] = [],
): string[] | null => {
  for (const node of nodes) {
    const path = [...parents, node.name];
    if (node.id === id) return path;
    if (node.children) {
      const found = findTreePath(node.children, id, path);
      if (found) return found;
    }
  }
  return null;
};
