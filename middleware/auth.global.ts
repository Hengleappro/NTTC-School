export default defineNuxtRouteMiddleware(async (to, from) => {
    await useAuth().fetchUser();
    
    if(to.name == 'login') {
        if (useAuth().isLoggedIn.value) {
            return navigateTo('/');
        }
    }
    if(to.name == 'user') {
        if (!useAuth().isAdmin.value) {
            return navigateTo('/');
        }
    }
    if(to.name == 'profile') {
        if (!useAuth().isLoggedIn.value) {
            return navigateTo('/');
        }
    }
});