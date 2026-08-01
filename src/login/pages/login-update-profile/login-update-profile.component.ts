import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  type TemplateRef,
  type Type,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { type UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { UserProfileFormService } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { map } from 'rxjs';

@Component({
  selector: 'kc-login-update-profile',
  templateUrl: 'login-update-profile.component.html',
  styleUrl: '../register/register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, NgTemplateOutlet, KcSanitizePipe, MatButtonModule],
  providers: [
    UserProfileFormService,
    { provide: ComponentReference, useExisting: forwardRef(() => LoginUpdateProfileComponent) },
  ],
})
export class LoginUpdateProfileComponent extends ComponentReference {
  #userProfileFormService = inject(UserProfileFormService);
  kcContext = inject<Extract<KcContext, { pageId: 'login-update-profile.ftl' }>>(KC_LOGIN_CONTEXT);
  i18n = inject<I18n>(LOGIN_I18N);

  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  documentTitle: string | undefined;
  bodyClassName: string | undefined;

  displayRequiredFields = true;
  displayInfo = false;
  displayMessage = true;

  headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
  infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  isFormSubmittable = toSignal(this.#userProfileFormService.formState$.pipe(map((s) => s.isFormSubmittable)), {
    initialValue: false,
  });
  formFieldStates = toSignal(this.#userProfileFormService.formState$.pipe(map((s) => s.formFieldStates)), {
    initialValue: [],
  });
  userProfileFormFields = input<Type<UserProfileFormFieldsComponent>>();

  registrationStep = signal(0);

  fieldNames = computed(() => this.formFieldStates().map(({ attribute }) => attribute.name));

  registrationSteps = computed(() => {
    const fields = this.fieldNames();
    const profileFields = fields.filter(
      (f) => f === 'username' || f === 'email' || f === 'firstName' || f === 'lastName',
    );
    const steps: string[][] = [];
    for (let i = 0; i < profileFields.length; i += 2) {
      steps.push(profileFields.slice(i, i + 2));
    }
    return steps;
  });

  visibleFieldNames = computed(
    () => this.registrationSteps()[Math.min(this.registrationStep(), this.registrationSteps().length - 1)] ?? [],
  );

  get hasMultipleSteps(): boolean {
    return this.registrationSteps().length > 1;
  }

  get isLastStep(): boolean {
    return !this.hasMultipleSteps || this.registrationStep() === this.registrationSteps().length - 1;
  }

  nextStep(): void {
    if (!this.isLastStep) {
      this.registrationStep.update((step) => step + 1);
    }
  }

  previousStep(): void {
    this.registrationStep.update((step) => Math.max(0, step - 1));
  }
}
