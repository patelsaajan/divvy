import { RouterView } from 'vue-router';
import Navigation from './Navigation';
const Layout = () => {
  return <div class="flex flex-col h-screen">
      <main class="flex-1 overflow-y-auto pb-16">
        <RouterView />
      </main>
      <Navigation />
    </div>;
};
export default Layout;