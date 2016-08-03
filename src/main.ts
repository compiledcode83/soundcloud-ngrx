import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { bootstrap } from '@angular/platform-browser-dynamic';

// route configuration
import { ROUTER_PROVIDERS } from './views/routes';

// root component
import { App } from './views/app';

// common styles
import './views/styles/common.scss';


if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}


document.addEventListener('DOMContentLoaded', () => {
  bootstrap(App, [
    disableDeprecatedForms(),
    provideForms(),
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS
  ]).catch((error: Error) => console.error(error));
});
