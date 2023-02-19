<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username') isForgottenPassword=true; section>
    <#if section="form">
    <div class="container">
        <div id="loginbox" class="mainbox">
            <div class="panel panel-info" >
                <div class="panel-heading">
                    <div class="panel-title">Przypomnij hasło</div>
                </div>
                <div class="panel-body">
                  <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
                      <div class="${properties.kcFormGroupClass!}">
                          <div class="${properties.kcInputWrapperClass!}">
                              <input type="text" id="username" name="username" class="${properties.kcInputClass!}" placeholder="Email" autofocus value="${(auth.attemptedUsername!'')}" aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"/>
                              <#if messagesPerField.existsError('username')>
                                  <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                                              ${kcSanitize(messagesPerField.get('username'))?no_esc}
                                  </span>
                              </#if>
                          </div>
                      </div>
                      <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                          <div id="kc-form-options" class="${properties.kcFormOptionsClass!} w-100 d-block">
                              <div class="${properties.kcFormOptionsWrapperClass!}">
                                  <a class="forgot-password w-100" href="${url.loginUrl}">Powrót do logowania</a>
                              </div>
                          </div>

                          <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                              <input class="btn btn-primary w-100 mb-4" type="submit" value="Wyślij"/>
                          </div>
                      </div>
                  </form>
                </div>
            </div>
        </div>
    </div>
    <#elseif section = "info" >
        Wprowadź swój adres e-mail, a wyślemy Ci instrukcje jak utworzyć nowe hasło
    </#if>
</@layout.registrationLayout>