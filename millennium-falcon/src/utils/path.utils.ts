import path from "path";

/**
 * Set relative path dynamically
 * We support relative and absolute paths
 * @param currentPath {string} path
 * @private
 */
export const setRelativePathDynamically = (currentPath: string): string => {
  return currentPath.startsWith("/")
    ? currentPath
    : path.join("./", currentPath);
};