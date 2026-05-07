export function getAvatarUrl(seed: string, size = 80): string {
  return `https://api.dicebear.com/8.x/lorelei/svg?seed=${encodeURIComponent(seed)}&size=${size}`;
}
