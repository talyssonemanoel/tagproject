import Dashboard from "./views/Dashboard.js";
import Tag from "./views/Tag.js";
import listTag from "./views/listTag.js";
import User from "./views/User.js";
import listUser from "./views/listUser.js";
import Process from "./views/Process.js";
import ListProcess from "./views/ListProcess.js";



const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");


const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard },
        { path: "/dashboard", view: Dashboard },

        { path: "/tag/list", view: listTag },
        { path: "/tag/new", view: Tag },
        { path: "/tag/:_key", view: Tag },
        { path: "/tag/:_key/process/list", view: ListProcess },

        { path: "/user/list", view: listUser },
        { path: "/user/new", view: User },
        { path: "/user/:_key", view: User },

        { path: "/process/list", view: ListProcess },
        { path: "/process/new", view: Process },
        { path: "/process/:_key", view: Process },
    
        { path: "/tag/:_key/process/list", view: ListProcess },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

    await view.init();
    document.querySelector("#menu").innerHTML = await view.getMenu();
    document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", e => {
                
        if (e.target.matches("[data-link]")) {
            
            e.preventDefault();
            navigateTo(e.currentTarget.href);

        }
    });

    router();
});