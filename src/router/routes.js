export const routes = [{
        // 登录
        path: "/entrance",
        name: "Entrance",
        component: () =>
            import ("../views/Entrance.vue"),
    },
    {
        // 首页
        path: "/main",
        name: "Main",
        component: () =>
            import ("../views/Main.vue"),
        // 二级路由
        children: [{
                // 首页
                path: "home",
                name: "Home",
                component: () =>
                    import ("../views/mainViews/Home.vue"),
            },
            {
                // 菜单页
                path: "menu",
                name: "Menu",
                component: () =>
                    import ("../views/mainViews/Menu.vue"),
            },
            {
                // 购物袋页
                path: "shobag",
                name: "Shobag",
                component: () =>
                    import ("../views/mainViews/Shobag.vue"),
            },
            {
                // 个人中心
                path: "my",
                name: "My",
                component: () =>
                    import ("../views/mainViews/My.vue"),
            },
        ],
    },
    // 详情页
    {
        path: "/details",
        name: "Details",
        component: () =>
            import ("../views/Details.vue"),
    },
    // 确认订单页
    {
        path: "/orderpage",
        name: "Orderpage",
        component: () =>
            import ("../views/Orderpage.vue"),
    },
    // 我的订单页
    {
        path: "/myorder",
        name: "Myorder",
        component: () =>
            import ("../views/Myorder.vue"),
    },
    // 新增地址页
    {
        path: "/newaddress",
        name: "Newaddress",
        component: () =>
            import ("../views/Newaddress.vue"),
    },
    // 编辑地址页
    {
        path: "/editaddress",
        name: "Editaddress",
        component: () =>
            import ("../views/Editaddress.vue"),
    },

    // 个人信息页
    {
        path: "/information",
        name: "Information",
        component: () =>
            import ("../views/Information.vue"),
    },
    // 安全中心页
    {
        path: "/securitycenter",
        name: "Securitycenter",
        component: () =>
            import ("../views/Securitycenter.vue"),
    },

    // 默认跳转
    {
        path: "*",
        redirect: {
            name: "Home",
        },
    },
];