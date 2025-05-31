// composables/useAuth.ts
import { ref, computed, watch } from 'vue'; // watch might be useful for reacting to changes
import type { IUser } from '~/server/models/User'; // Your user type

interface AuthApiResponse { // Define what /api/auth/me is expected to return
  user: IUser;
  // any other properties returned by /api/auth/me
}

// It's often better to have a single instance of auth state if it's truly global.
// You can achieve this with useState if you don't want to use Pinia.
// const globalUser = useState<IUser | null>('global-user', () => null);
// const globalLoading = useState<boolean>('global-auth-loading', () => true); // Start true if you fetch on load

export const useAuth = () => {
    // If using useState for global state:
    // const user = globalUser;
    // const loading = globalLoading;
    // Otherwise, local state per useAuth() call:
    const user = useState<IUser | null>('user', () => null); // Initialize user state
  const loading = ref(false); // Start false, set true only during fetchUser
  const error = ref<any>(null);

  const fetchUser = async () => {
    if (loading.value) return; // Prevent concurrent fetches

    loading.value = true;
    error.value = null;
    // console.log('[useAuth] fetchUser called. Current cookie:', useCookie('auth_session').value); // Debug: check cookie just before fetch

    try {
      // Assuming /api/auth/me returns the user object directly or an object containing the user
      // The generic type here should match the expected structure of a successful response.
      // In a Vue component's script setup
        const { data: me, pending, error } = await useFetch<IUser | AuthApiResponse>('/api/auth/me');
        if(!error.value) {
          user.value = me.value;
        }
    } catch (e: any) {
      // console.error('[useAuth] Error fetching /api/auth/me:', e);
      user.value = null; // Crucial: set user to null on auth error (like 401)
      error.value = e.data || { statusMessage: e.message, statusCode: e.statusCode || 500 };
    } finally {
      loading.value = false;
    }
  };

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Clear user data, e.g., on logout
  const clearUser = async () => {
    user.value = null; // Clear user state
    await $fetch<IUser | AuthApiResponse>('/api/auth/logout', {method: 'POST'});
    location.reload(); // Reload the page to reset state
  };

  return {
    user,
    isLoggedIn,
    isAdmin,
    fetchUser,
    clearUser, // For logout
    loading,
    error,
  };
};