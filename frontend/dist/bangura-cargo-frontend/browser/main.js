import {
  Component,
  Router,
  RouterOutlet,
  bootstrapApplication,
  inject,
  provideHttpClient,
  provideRouter,
  setClassMetadata,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement
} from "./chunk-4JUKSTFU.js";

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [RouterOutlet],
      template: "<router-outlet></router-outlet>"
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 10 });
})();

// src/app/guards/auth.guard.ts
var authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  }
  router.navigate(["/login"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () => import("./login.component-KKT44755.js").then((m) => m.LoginComponent)
  },
  {
    path: "register",
    loadComponent: () => import("./register.component-YHRFNXUS.js").then((m) => m.RegisterComponent)
  },
  {
    path: "customer",
    loadComponent: () => import("./customer-dashboard.component-GGWUCKNL.js").then((m) => m.CustomerDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: "admin",
    loadComponent: () => import("./admin-dashboard.component-BL5KQ4KY.js").then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: "super-admin",
    loadComponent: () => import("./super-admin-dashboard.component-VWMBUWIV.js").then((m) => m.SuperAdminDashboardComponent),
    canActivate: [authGuard]
  }
];

// src/app/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};

// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
