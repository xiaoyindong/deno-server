export default app => {
    const { router, controller } = app;
    router.get("/index.html", controller.home.index);
}