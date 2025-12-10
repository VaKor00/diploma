// car_dealership/src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
// resolvePageComponent - это глобальная функция, которая ожидает пути относительно корня Laravel-проекта.
// Но glob-шаблон должен быть относительно файла, где он вызывается (т.е. index.jsx).
// ЭТО ХИТРАЯ ЧАСТЬ. Мы должны заставить resolvePageComponent работать с относительными путями.

createInertiaApp({
    // name - это строка, которую Laravel передает, например 'Home' или 'Models'
    // glob-шаблон должен быть относительно текущего файла (index.jsx)
    resolve: (name) => {
        // Путь к компоненту относительно папки src/
        const path = `./Pages/${name}.jsx`; // <--- Здесь важно! Указываем путь относительно src/

        // `import.meta.glob` ищет файлы относительно *текущего* файла (index.jsx в src/)
        const pages = import.meta.glob('./Pages/**/*.jsx');
        // console.log(name);
        // resolvePageComponent требует, чтобы первый аргумент (pagePath) *совпадал* с одним из ключей в pages
        // Ключи в pages будут выглядеть как './Pages/Home.jsx' или './Pages/Models.jsx'
        return pages[path]()
            .then(module => module.default);
        // Или, если вы хотите использовать resolvePageComponent, перепроверьте его сигнатуру:
        // return resolvePageComponent(path, pages); // Обычно этого достаточно
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
