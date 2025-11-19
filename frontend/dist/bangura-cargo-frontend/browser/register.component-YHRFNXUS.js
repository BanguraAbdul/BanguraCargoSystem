import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-EGPA3IZO.js";
import {
  AuthService
} from "./chunk-VAU76LWT.js";
import {
  CommonModule,
  Component,
  NgIf,
  Router,
  RouterLink,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-4JUKSTFU.js";

// src/app/components/register/register.component.ts
function RegisterComponent_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function RegisterComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.success);
  }
}
var RegisterComponent = class _RegisterComponent {
  authService;
  router;
  registerData = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    address: "",
    password: ""
  };
  error = "";
  success = "";
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
  }
  onSubmit() {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.success = "Registration successful! Redirecting to login...";
        setTimeout(() => this.router.navigate(["/login"]), 2e3);
      },
      error: (err) => this.error = "Registration failed. Please try again."
    });
  }
  static \u0275fac = function RegisterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RegisterComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], decls: 39, vars: 8, consts: [[1, "container", "mt-5"], [1, "row", "justify-content-center"], [1, "col-md-6"], [1, "card"], [1, "card-header"], [1, "card-body"], [3, "ngSubmit"], [1, "mb-3"], ["for", "firstName", 1, "form-label"], ["type", "text", "id", "firstName", "name", "firstName", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "lastName", 1, "form-label"], ["type", "text", "id", "lastName", "name", "lastName", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "email", 1, "form-label"], ["type", "email", "id", "email", "name", "email", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "contact", 1, "form-label"], ["type", "text", "id", "contact", "name", "contact", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "address", 1, "form-label"], ["id", "address", "name", "address", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["for", "password", 1, "form-label"], ["type", "password", "id", "password", "name", "password", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "btn", "btn-primary"], ["routerLink", "/login", 1, "btn", "btn-link"], ["class", "alert alert-danger mt-3", 4, "ngIf"], ["class", "alert alert-success mt-3", 4, "ngIf"], [1, "alert", "alert-danger", "mt-3"], [1, "alert", "alert-success", "mt-3"]], template: function RegisterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "h3");
      \u0275\u0275text(6, "Register");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5)(8, "form", 6);
      \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_8_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(9, "div", 7)(10, "label", 8);
      \u0275\u0275text(11, "First Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "input", 9);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.firstName, $event) || (ctx.registerData.firstName = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 7)(14, "label", 10);
      \u0275\u0275text(15, "Last Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "input", 11);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.lastName, $event) || (ctx.registerData.lastName = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "div", 7)(18, "label", 12);
      \u0275\u0275text(19, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(20, "input", 13);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_20_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.email, $event) || (ctx.registerData.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 7)(22, "label", 14);
      \u0275\u0275text(23, "Contact");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "input", 15);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_24_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.contact, $event) || (ctx.registerData.contact = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 7)(26, "label", 16);
      \u0275\u0275text(27, "Address");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "textarea", 17);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_textarea_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.address, $event) || (ctx.registerData.address = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 7)(30, "label", 18);
      \u0275\u0275text(31, "Password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "input", 19);
      \u0275\u0275twoWayListener("ngModelChange", function RegisterComponent_Template_input_ngModelChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.registerData.password, $event) || (ctx.registerData.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "button", 20);
      \u0275\u0275text(34, "Register");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "a", 21);
      \u0275\u0275text(36, "Already have an account? Login");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(37, RegisterComponent_div_37_Template, 2, 1, "div", 22)(38, RegisterComponent_div_38_Template, 2, 1, "div", 23);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.firstName);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.lastName);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.email);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.contact);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.address);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.registerData.password);
      \u0275\u0275advance(5);
      \u0275\u0275property("ngIf", ctx.error);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.success);
    }
  }, dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RegisterComponent, [{
    type: Component,
    args: [{
      selector: "app-register",
      standalone: true,
      imports: [CommonModule, FormsModule, RouterLink],
      template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Register</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="firstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="firstName" 
                         [(ngModel)]="registerData.firstName" name="firstName" required>
                </div>
                <div class="mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="lastName" 
                         [(ngModel)]="registerData.lastName" name="lastName" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" 
                         [(ngModel)]="registerData.email" name="email" required>
                </div>
                <div class="mb-3">
                  <label for="contact" class="form-label">Contact</label>
                  <input type="text" class="form-control" id="contact" 
                         [(ngModel)]="registerData.contact" name="contact" required>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <textarea class="form-control" id="address" 
                            [(ngModel)]="registerData.address" name="address" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" 
                         [(ngModel)]="registerData.password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
                <a routerLink="/login" class="btn btn-link">Already have an account? Login</a>
              </form>
              <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
              <div *ngIf="success" class="alert alert-success mt-3">{{ success }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
    }]
  }], () => [{ type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src/app/components/register/register.component.ts", lineNumber: 64 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=register.component-YHRFNXUS.js.map
