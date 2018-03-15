import { App } from './core/app/App';

export { App }

declare global {
    interface Window { CreamsPIXI: any; }
}

window.CreamsPIXI = App;
