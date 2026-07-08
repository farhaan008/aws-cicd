import router from '@/router'
import _axios, { type AxiosInstance, AxiosHeaders, type InternalAxiosRequestConfig, type AxiosResponse, type Method, AxiosError } from 'axios'

import { type PayloadData } from './http.types'

const baseUrl: string | undefined = import.meta.env.VITE_API_URL

// switch (process.env.VUE_APP_BUILD) {
//   case 'production':
//     baseUrl = ''
//     break
//   case 'uat':
//     baseUrl = ''
//     break
//   case 'development':
//     baseUrl = ''
//     break
//   default:
//     baseUrl = ''
//     break
// }

export class Axios {
  protected readonly instance: AxiosInstance
  protected setAuthHeader = false
  public constructor() {
    this.instance = _axios.create({
      baseURL: baseUrl,
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' },
    })
    this.initializeRequestInterceptor()
    this.initializeResponseInterceptor()
  }

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this.handleRequest, this.handleErrors)
  }

  private handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (this.setAuthHeader) {
      if (!config.headers) {
        config.headers = new AxiosHeaders()
      }
      config.headers['Authorization'] = 'Bearer ....'
    }
    return config
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this.handleResponse)
  }

  private handleResponse = (response: AxiosResponse) => {
    switch (response.status) {
      case 200:
        // handle response
        break
      default:
      //
    }
    return response
  }

  private handleErrors = (error: AxiosError) => {
    const status: number = error.response ? error.response.status : 400
    switch (status) {
      case 400:
        console.error(status, error.message)
        console.error('Nothing to display', 'Data Not Found')
        break
      case 401:
        console.error(status, error.message)
        console.error('Please login again', 'Session Expired')
        router.replace('/login')
        break
      case 404:
        console.error(status, error.message)
        console.error('Nothing to display', 'Page Not Found')
        break
      case 500:
        console.error(status, error.message)
        console.error('Please try again after sometime')
        break
      default:
        console.error(status, error.message)
        break
    }
  }

  // request(type: string, url: string, isAuth: boolean, data?: Data): Promise<AxiosResponse> request<T>(method: string, url: string, auth: boolean, data: T): Promise<any>
  // async request(type: string, url: string, isAuth: boolean, data?: Data): Promise<AxiosResponse> {
  //   this.setAuthHeader = isAuth
  //   try {
  //     let response: AxiosResponse
  //     switch (type) {
  //       case 'get':
  //         response = await this.instance.get(url, data)
  //         break
  //       case 'post':
  //         response = await this.instance.post(url, data)
  //         break
  //       case 'put':
  //         response = await this.instance.put(url, data)
  //         break
  //       case 'patch':
  //         response = await this.instance.get(url, data)
  //         break
  //       case 'delete':
  //         response = await this.instance.get(url, data)
  //         break
  //       default:
  //         response = await this.instance.get(url, data)
  //         break
  //     }
  //     return response && response.data ? response.data : response
  //   } catch (error) {
  //     this.handleErrors(error as AxiosError)
  //     return Promise.reject(error)
  //   }
  // }

  /**
   * @access protected
   * @param { Method } type
   * @param { string } url
   * @param { boolean } isAuth
   * @param { object } data
   * @returns { Promise<R> }
   * @memberof Axios
  */

  protected async request<T>( type: Method, url: string, isAuth: boolean, data?: PayloadData): Promise<T> {
    this.setAuthHeader = isAuth;
    try {
      let response: AxiosResponse<T>;
      switch (type) {
        case 'get':
          response = await this.instance.get<T>(url, data)
          break
        case 'post':
          response = await this.instance.post<T>(url, data)
          break
        case 'put':
          response = await this.instance.put<T>(url, data)
          break
        case 'patch':
          response = await this.instance.get<T>(url, data)
          break
        case 'delete':
          response = await this.instance.get<T>(url, data)
          break
        default:
          throw new Error(`Unsupported method: ${type}`);
      }
      return response && response.data ? response.data : response.data

    } catch (error) {
      this.handleErrors(error as AxiosError)
      return Promise.reject(error)
    }
  }

}

