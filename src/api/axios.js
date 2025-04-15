import axios from "axios";

class HttpRequest {
    constructor(baseURL) {
        this.baseURL = "http://localhost:8000/api";
    }

    getInstance() {
        const config = {
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        return config;
    }

    interception(instance) {
        instance.interceptors.request.use(
            function (config) {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            function (error) {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                return Promise.reject(this.handleError(error));
            }.bind(this)
        );
    }

    handleError(error) {
        let errorMessage = "发生错误";
        
        if (error.response) {
            console.log('错误响应:', error.response);
            if (error.response.status === 401) {
                errorMessage = "认证失败，请重新登录";
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/sign-in';
            } else if (error.response.status === 403) {
                errorMessage = "您没有执行此操作的权限。请确保您已登录并有正确的权限。";
            } else if (error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response.data && error.response.data.msg) {
                errorMessage = typeof error.response.data.msg === 'object' 
                    ? Object.values(error.response.data.msg).join(', ') 
                    : error.response.data.msg;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
    
        return new Error(errorMessage);
    }

    request(options) {
        options = { ...this.getInstance(), ...options };
        const instance = axios.create();
        this.interception(instance);
        return instance(options);
    }

    setAuthToken(token) {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }
}

export default new HttpRequest();