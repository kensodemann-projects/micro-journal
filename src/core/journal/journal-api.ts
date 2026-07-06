export const withBaseUrl = (path: string): string => {
  const baseUrl = import.meta.env.VITE_XANO_JOURNAL_API_URL;
  if (!baseUrl) {
    throw new Error('VITE_XANO_JOURNAL_API_URL is not configured');
  }
  return `${baseUrl}${path}`;
};
