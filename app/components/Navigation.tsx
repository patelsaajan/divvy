import { RouterLink, useRoute } from 'vue-router';
import { ReceiptIcon, UploadIcon, SettingsIcon } from 'lucide-vue-next';
const Navigation = () => {
  return <nav class="fixed bottom-0 left-0 right-0 bg-gray-800 py-2 px-4">
      <div class="flex justify-around items-center">
        <RouterLink to="/" class="flex flex-col items-center p-2 rounded-md text-gray-400">
          <ReceiptIcon size={24} />
          <span class="text-xs mt-1">Expenses</span>
        </RouterLink>
        <RouterLink to="/upload" class="flex flex-col items-center p-2 rounded-md text-gray-400">
          <UploadIcon size={24} />
          <span class="text-xs mt-1">Upload</span>
        </RouterLink>
        <RouterLink to="/settings" class="flex flex-col items-center p-2 rounded-md text-gray-400">
          <SettingsIcon size={24} />
          <span class="text-xs mt-1">Settings</span>
        </RouterLink>
      </div>
    </nav>;
};
export default Navigation;