import { App } from './core/App';

export { App }

declare global {
    interface Window { CreamsPIXI: any; }
}

window.CreamsPIXI = App;
