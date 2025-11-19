import {
  AuthService
} from "./chunk-VAU76LWT.js";
import {
  CommonModule,
  Component,
  Router,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵtext
} from "./chunk-4JUKSTFU.js";

// src/app/components/super-admin-dashboard/super-admin-dashboard.component.ts
var SuperAdminDashboardComponent = class _SuperAdminDashboardComponent {
  authService;
  router;
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function SuperAdminDashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SuperAdminDashboardComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SuperAdminDashboardComponent, selectors: [["app-super-admin-dashboard"]], decls: 8, vars: 0, consts: [[1, "container", "mt-4"], [1, "d-flex", "justify-content-between", "align-items-center", "mb-4"], [1, "btn", "btn-danger", 3, "click"], [1, "alert", "alert-info"]], template: function SuperAdminDashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "h2");
      \u0275\u0275text(3, "Super Admin Dashboard");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "button", 2);
      \u0275\u0275domListener("click", function SuperAdminDashboardComponent_Template_button_click_4_listener() {
        return ctx.logout();
      });
      \u0275\u0275text(5, "Logout");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(6, "div", 3);
      \u0275\u0275text(7, " Welcome to the super admin dashboard! ");
      \u0275\u0275domElementEnd()();
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SuperAdminDashboardComponent, [{
    type: Component,
    args: [{
      selector: "app-super-admin-dashboard",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Super Admin Dashboard</h2>
        <button class="btn btn-danger" (click)="logout()">Logout</button>
      </div>
      <div class="alert alert-info">
        Welcome to the super admin dashboard!
      </div>
    </div>
  `
    }]
  }], () => [{ type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SuperAdminDashboardComponent, { className: "SuperAdminDashboardComponent", filePath: "src/app/components/super-admin-dashboard/super-admin-dashboard.component.ts", lineNumber: 22 });
})();
export {
  SuperAdminDashboardComponent
};
//# sourceMappingURL=super-admin-dashboard.component-VWMBUWIV.js.map
