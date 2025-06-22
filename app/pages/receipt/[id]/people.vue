<template>
  <div class="container mx-auto">
    <UButton
      variant="ghost"
      class="flex items-center my-6 cursor-pointer"
      @click="$router.back()"
    >
      <UIcon name="i-heroicons-chevron-left" :size="24" />
      <span class="ml-2">Receipts</span>
    </UButton>
    <h1 class="text-xl font-semibold">People</h1>
    <!-- Participants -->
    <div class="mb-6">
      <PeopleCard v-for="person in people" :key="person.id" :person="person" />

      <div class="flex gap-2 mb-4 w-full">
        <UInput v-model="newPerson" placeholder="Enter a name" class="w-full" />
        <UButton
          variant="ghost"
          class="flex items-center my-6 cursor-pointer"
          @click="addPerson"
        >
          <UIcon name="i-heroicons-plus" :size="24" />
          <span class="ml-2">Add Person</span>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const people = ref([
  { id: 1, name: "John Doe", amount: 100 },
  { id: 2, name: "Jane Smith", amount: 200 },
  { id: 3, name: "John Doe", amount: 100 },
]);

const newPerson = ref("");

const addPerson = () => {
  people.value.push({
    id: people.value.length + 1,
    name: newPerson.value,
    amount: 0,
  });
  newPerson.value = "";
};
</script>
