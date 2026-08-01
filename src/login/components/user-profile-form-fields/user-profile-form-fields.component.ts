import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  forwardRef,
  inject,
  input,
  signal,
  type TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import {
  getButtonToDisplayForMultivaluedAttributeField,
  UserProfileFormService,
} from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
  selector: 'kc-user-profile-form-fields',
  templateUrl: 'user-profile-form-fields.component.html',
  styleUrl: 'user-profile-form-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  providers: [
    UserProfileFormService,
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => UserProfileFormFieldsComponent),
    },
  ],
})
export class UserProfileFormFieldsComponent extends ComponentReference {
  i18n = inject<I18n>(LOGIN_I18N);
  kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
  #userProfileFormService = inject(UserProfileFormService);
  doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

  formState$ = this.#userProfileFormService.formState$;
  getButtonToDisplay = getButtonToDisplayForMultivaluedAttributeField;
  dispatchFormAction = this.#userProfileFormService.dispatchFormAction;

  passwordVisible = signal<Record<string, boolean>>({});
  visibleFieldNames = input<string[] | undefined>();

  isFieldVisible(name: string): boolean {
    const visibleNames = this.visibleFieldNames();
    return !visibleNames || visibleNames.includes(name);
  }

  togglePasswordVisibility(name: string): void {
    this.passwordVisible.update((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  isPasswordVisible(name: string): boolean {
    return !!this.passwordVisible()[name];
  }

  @ContentChild('beforeField') beforeField: TemplateRef<unknown> | undefined;
  @ContentChild('afterField') afterField: TemplateRef<unknown> | undefined;

  onFieldInput(name: string, value: string): void {
    this.dispatchFormAction({ action: 'update', name, valueOrValues: value });
  }

  onFieldBlur(name: string): void {
    this.dispatchFormAction({ action: 'focus lost', name, fieldIndex: undefined });
  }

  onMultiValueUpdate(name: string, values: string[]): void {
    this.dispatchFormAction({ action: 'update', name, valueOrValues: values });
  }

  onMultiValueFieldUpdate(name: string, values: string[], index: number, newValue: string): void {
    const updated = values.map((v, j) => (j === index ? newValue : v));
    this.dispatchFormAction({ action: 'update', name, valueOrValues: updated });
  }

  onAddValue(name: string, values: string[]): void {
    this.dispatchFormAction({ action: 'update', name, valueOrValues: [...values, ''] });
  }

  onRemoveValue(name: string, values: string[], index: number): void {
    this.dispatchFormAction({
      action: 'update',
      name,
      valueOrValues: values.filter((_, i) => i !== index),
    });
  }

  onSelectChange(name: string, value: string | string[]): void {
    this.dispatchFormAction({ action: 'update', name, valueOrValues: value });
  }

  onCheckboxChange(name: string, checked: boolean): void {
    this.dispatchFormAction({
      action: 'update',
      name,
      valueOrValues: checked ? 'on' : 'off',
    });
  }

  getLabel(displayName: string | undefined): string {
    return this.i18n.advancedMsgStr(displayName ?? '');
  }

  getOptionLabel(attributeName: string, option: string): string {
    return this.i18n.advancedMsgStr(attributeName + '.' + option);
  }

  isPassword(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'password';
  }

  isTextarea(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'textarea';
  }

  isSelect(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'select';
  }

  isMultiSelect(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'multiselect';
  }

  isRadio(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'select-radiobuttons';
  }

  isCheckbox(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'multiselect-checkboxes';
  }

  isHidden(attr: { annotations?: { inputType?: string } }): boolean {
    return attr.annotations?.inputType === 'hidden';
  }

  isMultivalued(attr: { annotations?: Record<string, unknown> }): boolean {
    return !!attr.annotations?.['multivalued'];
  }

  getErrorsForField(
    errors: { fieldIndex: number | undefined }[],
    fieldIndex: number | undefined,
  ): { errorMessage: string }[] {
    const index = fieldIndex ?? 0;
    return errors.filter((e) => (e.fieldIndex ?? 0) === index) as unknown as { errorMessage: string }[];
  }

  getInputType(attr: { annotations?: { inputType?: string } }): string {
    const inputType = attr.annotations?.inputType;
    if (!inputType || inputType === 'text' || inputType === 'email' || inputType === 'tel' || inputType === 'url') {
      return 'text';
    }
    return inputType;
  }

  getOptions(attr: { annotations?: Record<string, unknown> }): string[] {
    return (attr.annotations?.['inputOptions'] as string[]) ?? [];
  }

  trackByField(_: number, field: { attribute: { name: string } }): string {
    return field.attribute.name;
  }
}
