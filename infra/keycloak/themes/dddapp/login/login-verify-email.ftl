<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true isVerifyEmail=true; section>
  <div class="emailVerification">
    <#if section = "form">
        <p class="instruction">
        Wysłaliśmy do Ciebie e-mail z instrukcjami dotyczącymi weryfikacji Twojego adresu e-mail
        </p> 
    <#elseif section = "info">
        <p class="instruction">
            Nie otrzymałeś kodu weryfikacyjnego na swoją skrzynkę e-mail?
            <br/>
            <a href="${url.loginAction}">Kliknij tutaj</a>, by ponownie przesłać maila.
        </p>
    </#if>
    </div>
</@layout.registrationLayout>
