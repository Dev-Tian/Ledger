import axios, { type AxiosRequestConfig } from "axios"

const tokenKey = "ledger-token"

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    Accept: "application/json",
  },
})

client.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config
  const token = window.localStorage.getItem(tokenKey)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export type SignedInUser = {
  id: number
  name: string
  email: string
}

export type SignInResponse = {
  token: string
  user: SignedInUser
}

export function signIn(email: string, password: string) {
  return apiRequest<SignInResponse>("/api/login", {
    method: "POST",
    data: { email, password },
  }).then((result) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(tokenKey, result.token)
    }
    return result
  })
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: AxiosRequestConfig = {}) {
  try {
    const response = await client.request<T>({ url: path, ...options })
    return response.data
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error
    const problem = error.response?.data as { message?: string } | undefined
    const message = problem?.message || error.message || "Request failed"
    throw new ApiError(message, error.response?.status ?? 0)
  }
}
