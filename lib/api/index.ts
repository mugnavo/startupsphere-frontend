/**
 * Generated by orval v6.28.2 🍺
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

export const bookmarkControllerCreate = <TData = AxiosResponse<Bookmark>>(
  bookmark: Bookmark,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/bookmarks`, bookmark, options);
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

export const likeControllerCreate = <TData = AxiosResponse<Like>>(
  like: Like,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/likes`, like, options);
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

export const viewControllerCreate = <TData = AxiosResponse<View>>(
  view: View,
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.post(`http://localhost:3001/views`, view, options);
};

export const viewControllerGetAll = <TData = AxiosResponse<View[]>>(
  options?: AxiosRequestConfig
): Promise<TData> => {
  return axios.get(`http://localhost:3001/views`, options);
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
export type BookmarkControllerCreateResult = AxiosResponse<Bookmark>;
export type BookmarkControllerFindOneByUserIdAndStartupIdResult = AxiosResponse<Bookmark>;
export type BookmarkControllerRemoveResult = AxiosResponse<void>;
export type LikeControllerCreateResult = AxiosResponse<Like>;
export type LikeControllerRemoveResult = AxiosResponse<void>;
export type LikeControllerFindOneByUserIdAndStartupIdResult = AxiosResponse<Like>;
export type ViewControllerCreateResult = AxiosResponse<View>;
export type ViewControllerGetAllResult = AxiosResponse<View[]>;
export type ViewControllerFindAllByStartupIdResult = AxiosResponse<View[]>;
