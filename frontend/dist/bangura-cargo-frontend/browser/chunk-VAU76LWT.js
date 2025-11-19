import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  inject,
  setClassMetadata,
  tap,
  ɵɵdefineInjectable
} from "./chunk-4JUKSTFU.js";

// src/app/services/auth.service.ts
var AuthService = class _AuthService {
  apiUrl = "http://localhost:8080/api";
  http = inject(HttpClient);
  currentUserSubject = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor() {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      this.currentUserSubject.next(user);
    }
  }
  login(credentials) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(tap((response) => {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      this.currentUserSubject.next(response);
    }));
  }
  register(request) {
    return this.http.post(`${this.apiUrl}/auth/register`, request).pipe(tap((response) => {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      this.currentUserSubject.next(response);
    }));
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUserSubject.next(null);
  }
  getToken() {
    return localStorage.getItem("token");
  }
  getUserRole() {
    const user = this.currentUserSubject.value;
    return user?.role || null;
  }
  isAuthenticated() {
    return !!this.getToken();
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-VAU76LWT.js.map
