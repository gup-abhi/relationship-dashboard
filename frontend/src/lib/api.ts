const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const { params, headers, body, ...rest } = options || {};

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'POST', body: data, ...options }),
  put: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: data, ...options }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};

export const fetchAverageComplexityScore = () =>
  api.get<{ averageComplexity: number }>('/overview/average-complexity');

export const fetchSentimentDistribution = () =>
  api.get<{ sentimentDistribution: Array<{ _id: string; count: number }> }>('/overview/sentiment-distribution');

export const fetchMostCommonIssuesDistribution = () =>
  api.get<{ mostCommonIssuesDistribution: Array<{ _id: string; count: number }> }>('/overview/most-common-issues-distribution');
