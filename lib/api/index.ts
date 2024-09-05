/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * StartupSphere API
 * API documentation for StartupSphere, the 3D mapping platform for startup ecosystems.
 * OpenAPI spec version: 1.0
 */
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  AuthResponse,
  Bookmark,
  CreateBookmarkRequest,
  CreateLikeRequest,
  CreateViewRequest,
  Like,
  LoginRequest,
  RegisterRequest,
  Startup,
  StartupRequest,
  View,
} from "../schemas";

export const authControllerRegister = <TData = AxiosResponse<AuthResponse>>(
  registerRequest: RegisterRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/auth/register`, registerRequest, options);
};

export const authControllerLogin = <TData = AxiosResponse<AuthResponse>>(
  loginRequest: LoginRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/auth/login`, loginRequest, options);
};

export const startupControllerGetAll = <TData = AxiosResponse<Startup[]>>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/startups`, options);
};

export const startupControllerCreate = <TData = AxiosResponse<Startup>>(
  startupRequest: StartupRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/startups`, startupRequest, options);
};

export const startupControllerGetOneById = <TData = AxiosResponse<Startup>>(
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/startups/${startupId}`, options);
};

export const startupControllerUpdate = <TData = AxiosResponse<Startup>>(
  startupId: number,
  startupRequest: StartupRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.put(`http://localhost:3001/startups/${startupId}`, startupRequest, options);
};

export const startupControllerDelete = <TData = AxiosResponse<unknown>>(
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.delete(`http://localhost:3001/startups/${startupId}`, options);
};

export const bookmarkControllerGetAll = <TData = AxiosResponse<Bookmark[]>>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/bookmarks`, options);
};

export const bookmarkControllerCreate = <TData = AxiosResponse<void>>(
  createBookmarkRequest: CreateBookmarkRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/bookmarks`, createBookmarkRequest, options);
};

export const bookmarkControllerFindOneByUserIdAndStartupId = <TData = AxiosResponse<Bookmark>>(
  userId: number,
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/bookmarks/${userId}/${startupId}`, options);
};

export const bookmarkControllerRemove = <TData = AxiosResponse<void>>(
  userId: number,
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.delete(`http://localhost:3001/bookmarks/${userId}/${startupId}`, options);
};

export const bookmarkControllerFindAllByUserId = <TData = AxiosResponse<Bookmark[]>>(
  userId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/bookmarks/${userId}`, options);
};

export const bookmarkControllerFindAllByStartupId = <TData = AxiosResponse<Bookmark[]>>(
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/bookmarks/${startupId}`, options);
};

export const likeControllerGetAll = <TData = AxiosResponse<Like[]>>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/likes`, options);
};

export const likeControllerCreate = <TData = AxiosResponse<void>>(
  createLikeRequest: CreateLikeRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/likes`, createLikeRequest, options);
};

export const likeControllerRemove = <TData = AxiosResponse<void>>(
  userId: number,
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.delete(`http://localhost:3001/likes/${userId}/${startupId}`, options);
};

export const likeControllerFindOneByUserIdAndStartupId = <TData = AxiosResponse<Like>>(
  userId: number,
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/likes/${userId}/${startupId}`, options);
};

export const likeControllerFindAllByStartupId = <TData = AxiosResponse<Like[]>>(
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/likes/${startupId}`, options);
};

export const viewControllerCreate = <TData = AxiosResponse<void>>(
  createViewRequest: CreateViewRequest,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/views`, createViewRequest, options);
};

export const viewControllerGetAll = <TData = AxiosResponse<View[]>>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/views`, options);
};

export const viewControllerFindRecentsByUserId = <TData = AxiosResponse<View[]>>(
  userId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/views/${userId}`, options);
};

export const viewControllerFindAllByStartupId = <TData = AxiosResponse<View[]>>(
  startupId: number,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/views/${startupId}`, options);
};

export type AuthControllerRegisterResult = AxiosResponse<AuthResponse>;
export type AuthControllerLoginResult = AxiosResponse<AuthResponse>;
export type StartupControllerGetAllResult = AxiosResponse<Startup[]>;
export type StartupControllerCreateResult = AxiosResponse<Startup>;
export type StartupControllerGetOneByIdResult = AxiosResponse<Startup>;
export type StartupControllerUpdateResult = AxiosResponse<Startup>;
export type StartupControllerDeleteResult = AxiosResponse<unknown>;
export type BookmarkControllerGetAllResult = AxiosResponse<Bookmark[]>;
export type BookmarkControllerCreateResult = AxiosResponse<void>;
export type BookmarkControllerFindOneByUserIdAndStartupIdResult = AxiosResponse<Bookmark>;
export type BookmarkControllerRemoveResult = AxiosResponse<void>;
export type BookmarkControllerFindAllByUserIdResult = AxiosResponse<Bookmark[]>;
export type BookmarkControllerFindAllByStartupIdResult = AxiosResponse<Bookmark[]>;
export type LikeControllerGetAllResult = AxiosResponse<Like[]>;
export type LikeControllerCreateResult = AxiosResponse<void>;
export type LikeControllerRemoveResult = AxiosResponse<void>;
export type LikeControllerFindOneByUserIdAndStartupIdResult = AxiosResponse<Like>;
export type LikeControllerFindAllByStartupIdResult = AxiosResponse<Like[]>;
export type ViewControllerCreateResult = AxiosResponse<void>;
export type ViewControllerGetAllResult = AxiosResponse<View[]>;
export type ViewControllerFindRecentsByUserIdResult = AxiosResponse<View[]>;
export type ViewControllerFindAllByStartupIdResult = AxiosResponse<View[]>;
