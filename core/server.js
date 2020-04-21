import { serve as http } from "https://deno.land/std/http/server.ts";
import config from '../config/config.default.js';
import router from '../app/router.js';
import Home from '../app/controller/home.js';

class Router {
    constructor() {
        this.router = {
            get: [],
            post: [],
        }
    }
    get(path, handle) {
        this.router.get.push({
            path,
            handle
        });
    }
    post(path, handle) {
        this.router.post.push({
            path,
            handle
        })
    }
}





class Application {
    router = new Router();
    controller = {
        home: new Home()
    };
    constructor(config) {
        this.config = config;
        router(this);
    }

    async listen() {
        const server = http({
            hostname: this.config.listen.hostname,
            port: this.config.listen.port
        });
        console.log(`http://${this.config.listen.hostname}:${this.config.listen.port}`);
        for await (const ctx of server) {
            ctx.router = this.router.router;
            this.ctx = ctx;
            let route = [];
            if (ctx.method === 'GET') {
                route = ctx.router.get.filter(item => {
                    return item.path === ctx.url;
                });
            } else if (ctx.method === 'POST') {
                route = ctx.router.post.forEach(item => {
                    return item.path === ctx.url;
                });
            };
            let data = 'Hello World\n';
            if (route && route[0]) {
                const handle = route[0].handle;
                handle.call(this);
                data = await handle.call(this);
            }
            ctx.headers.set('Content-Type', 'text/html; charset=utf-8')
            await ctx.respond({ body: data, headers: ctx.headers });
        };
    }
}

export default () => {
    return new Application(config);
}
