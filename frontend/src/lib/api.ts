const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RequestOptions {
  params?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
  method?: string;
}

async function apiRequest<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const { params, headers, body, method } = options || {};

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'body'>) =>
    apiRequest<T>(endpoint, { method: 'POST', body: data, ...options }),
  put: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'body'>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: data, ...options }),
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};

export const fetchAverageComplexityScore = (filters?: Record<string, string>) =>
  api.get<{ averageComplexity: number }>('/overview/average-complexity', { params: filters });

export const fetchSentimentDistribution = (filters?: Record<string, string>) =>
  api.get<{ sentimentDistribution: Array<{ _id: string; count: number }> }>('/overview/sentiment-distribution', { params: filters });

export const fetchMostCommonIssuesDistribution = (filters?: Record<string, string>) =>
  api.get<{ mostCommonIssuesDistribution: Array<{ _id: string; count: number }> }>('/overview/most-common-issues-distribution', { params: filters });

export const fetchTopIssues = (limit: number = 5, filters?: Record<string, string>) =>
  api.get<{ topIssues: Array<{ _id: string; count: number }> }>('/overview/top-issues', { params: { limit: limit.toString(), ...filters } });

export const fetchRecentTrends = (timeUnit: string = 'day', dateField: string = 'created_date', filters?: Record<string, string>) =>
  api.get<{ recentTrends: Array<{ _id: string; count: number }> }>('/overview/recent-trends', { params: { timeUnit, dateField, ...filters } });

export const fetchPostsBySubreddit = (timeUnit: string = 'month', dateField: string = 'created_date', filters?: Record<string, string>) =>
  api.get<{ trends: Array<{ date: string; [subreddit: string]: number | string }> }>('/overview/posts-by-subreddit', { params: { timeUnit, dateField, ...filters } });

export const fetchTrendingTopics = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/trends/topics', { params: filters });

export const fetchPrimaryIssues = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/issues/primary', { params: filters });

export const fetchSecondaryIssues = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/issues/secondary', { params: filters });

export const fetchRedFlags = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/issues/red-flags', { params: filters });

export const fetchPositiveIndicators = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/issues/positive-indicators', { params: filters });

export const fetchKeyThemes = (filters?: Record<string, string>) =>
  api.get<Array<{ _id: string; count: number }>>('/issues/themes', { params: filters });
