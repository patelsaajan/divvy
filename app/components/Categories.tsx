import { ChevronLeftIcon, PlusIcon, CheckIcon, SearchIcon } from 'lucide-vue-next';

const Categories = () => {
  const router = useRouter();
  const categories = [{
    id: 1,
    name: 'Meals and Entertainment',
    icon: '🍽️',
    color: 'bg-teal-500',
    selected: false
  }, {
    id: 2,
    name: 'Travel',
    icon: '✈️',
    color: 'bg-cyan-500',
    selected: false
  }, {
    id: 3,
    name: 'Car',
    icon: '🚗',
    color: 'bg-blue-500',
    selected: true
  }, {
    id: 4,
    name: 'Home office',
    icon: '🏠',
    color: 'bg-purple-500',
    selected: false
  }, {
    id: 5,
    name: 'Insurances',
    icon: '🔒',
    color: 'bg-green-500',
    selected: false
  }, {
    id: 6,
    name: 'Education',
    icon: '📚',
    color: 'bg-cyan-500',
    selected: false
  }, {
    id: 7,
    name: 'Taxes and Fees',
    icon: '📝',
    color: 'bg-purple-500',
    selected: false
  }, {
    id: 8,
    name: 'Marketing',
    icon: '📊',
    color: 'bg-yellow-500',
    selected: false
  }];
  return <div class="px-4 py-6 h-full">
      <div class="flex items-center mb-6">
        <button class="p-2 mr-2" onClick={() => router.back()}>
          <ChevronLeftIcon size={24} />
        </button>
        <h1 class="text-xl font-semibold">Categories</h1>
      </div>
      {/* Search */}
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon size={16} class="text-gray-400" />
        </div>
        <input type="text" placeholder="Search for Categories" class="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none" />
      </div>
      {/* None option */}
      <div class="mb-2 flex justify-between items-center bg-gray-800 rounded-lg p-4">
        <span>None</span>
      </div>
      {/* Add new category */}
      <button class="w-full mb-4 flex items-center bg-gray-800 rounded-lg p-4 text-orange-500">
        <PlusIcon size={20} class="mr-2" />
        <span>Add New Category</span>
      </button>
      {/* Categories list */}
      <div class="space-y-2">
        {categories.map(category => <div key={category.id} class="flex justify-between items-center bg-gray-800 rounded-lg p-4">
            <div class="flex items-center">
              <div class={`${category.color} w-8 h-8 rounded flex items-center justify-center mr-3`}>
                <span>{category.icon}</span>
              </div>
              <span>{category.name}</span>
            </div>
            {category.selected && <CheckIcon size={20} class="text-orange-500" />}
          </div>)}
      </div>
    </div>;
};
export default Categories;