<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('firstName','lastName','email','username','password','password-confirm'); section>
    <#if section = "form">
    <div class="container">
        <div id="loginbox" class="mainbox">
            <div class="panel panel-info" >
                <div class="panel-heading">
                    <div class="panel-title">Rejestracja</div>
                </div>
                <div class="panel-form">
                    <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="text" id="firstName" class="${properties.kcInputClass!}" name="firstName"
                                    value="${(register.formData.firstName!'')}"
                                    aria-invalid="<#if messagesPerField.existsError('firstName')>true</#if>"
                                    placeholder="Imię"
                                />

                                <#if messagesPerField.existsError('firstName')>
                                    <span id="input-error-firstname" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('firstName'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                        </div>

                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="text" id="lastName" class="${properties.kcInputClass!}" name="lastName"
                                    value="${(register.formData.lastName!'')}"
                                    aria-invalid="<#if messagesPerField.existsError('lastName')>true</#if>"
                                    placeholder="Nazwisko"
                                />

                                <#if messagesPerField.existsError('lastName')>
                                    <span id="input-error-lastname" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('lastName'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                        </div>

                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <input type="text" id="email" class="${properties.kcInputClass!}" name="email"
                                    value="${(register.formData.email!'')}" autocomplete="email"
                                    aria-invalid="<#if messagesPerField.existsError('email')>true</#if>"
                                    placeholder="Email"
                                />

                                <#if messagesPerField.existsError('email')>
                                    <span id="input-error-email" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                        ${kcSanitize(messagesPerField.get('email'))?no_esc}
                                    </span>
                                </#if>
                            </div>
                        </div>

                        <#if !realm.registrationEmailAsUsername>
                            <div class="${properties.kcFormGroupClass!}">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="text" id="username" class="${properties.kcInputClass!}" name="username"
                                        value="${(register.formData.username!'')}" autocomplete="username"
                                        aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                                    />

                                    <#if messagesPerField.existsError('username')>
                                        <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                            ${kcSanitize(messagesPerField.get('username'))?no_esc}
                                        </span>
                                    </#if>
                                </div>
                            </div>
                        </#if>

                        <#if passwordRequired??>
                            <div class="${properties.kcFormGroupClass!}">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="password" id="password" class="${properties.kcInputClass!}" name="password"
                                        autocomplete="new-password"
                                        aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                                            placeholder="Hasło"

                                    />

                                    <#if messagesPerField.existsError('password')>
                                        <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                            ${kcSanitize(messagesPerField.get('password'))?no_esc}
                                        </span>
                                    </#if>
                                </div>
                            </div>

                            <div class="${properties.kcFormGroupClass!}">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <input type="password" id="password-confirm" class="${properties.kcInputClass!}"
                                        name="password-confirm"
                                        aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                                            placeholder="Potwierdź hasło"

                                    />

                                    <#if messagesPerField.existsError('password-confirm')>
                                        <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                            ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                                        </span>
                                    </#if>
                                </div>
                            </div>
                        </#if>

                        <#if recaptchaRequired??>
                            <div class="form-group">
                                <div class="${properties.kcInputWrapperClass!}">
                                    <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                                </div>
                            </div>
                        </#if>

                        <div class="${properties.kcFormGroupClass!}">
                            <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                                <div class="w-100">
                                    <a class="forgot-password" href="${url.loginUrl}">Powrót do logowania</a>
                                </div>
                            </div>

                            <div id="kc-form-buttons" class="forgot-password">
                                <input class="btn btn-primary w-100" type="submit" value="Zarejestruj"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </#if>
</@layout.registrationLayout>