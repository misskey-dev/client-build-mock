import { createSSRApp } from 'vue';
import App from './App.vue';
import './style.css';

export function createInnerApp(props?: any) {
    const app = createSSRApp(App);
    return app;
  }
  
createInnerApp().mount('#innerapp');
