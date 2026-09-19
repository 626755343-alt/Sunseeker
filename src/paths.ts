export function publicAssetPath(file: string, base = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;
}
