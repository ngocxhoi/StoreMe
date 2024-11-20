export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useCookie("appwrite-session").value;

  if (session) {
    if (to.path != "/auth") return;
    if (to.path == "/auth") return navigateTo("/dashboard");
  }

  if (to.path == "/auth") return;
  if (to.path != "/auth") return navigateTo("/auth");
  return;
});
