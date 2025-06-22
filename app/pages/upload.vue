<template>
  <PageHeader title="Upload Receipt" />

  <div class="px-4">
    <div
      v-if="!previewUrl"
      class="flex flex-col items-center justify-center h-[75vh]"
    >
      <div
        class="border-2 border-dashed border-gray-600 rounded-lg p-8 w-full max-w-lg flex flex-col items-center justify-center h-1/2"
      >
        <UIcon
          name="i-heroicons-camera"
          :size="48"
          class="text-gray-500 mb-4"
        />
        <p class="text-center mb-4 text-gray-400">
          Take a photo or upload an image of your receipt
        </p>
        <div class="flex space-x-4">
          <label
            class="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer"
          >
            Take Photo
            <UInput
              type="file"
              accept="image/*"
              capture="environment"
              class="hidden"
              @change="onFileChange"
            />
          </label>
          <label
            class="px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer"
          >
            Upload
            <UInput
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            />
          </label>
        </div>
      </div>
    </div>

    <div v-if="previewUrl" class="mt-8 flex flex-col items-center">
      <img
        :src="previewUrl"
        alt="Receipt Preview"
        class="w-full max-w-xs rounded-lg"
      />
      <div class="flex space-x-4 mt-4">
        <label
          class="px-4 py-2 bg-orange-500 text-white rounded-md cursor-pointer"
        >
          Change
          <UInput
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            @change="onFileChange"
          />
        </label>
        <UButton variant="ghost" @click="handleUpload">Submit</UButton>
      </div>
    </div>

    <div v-if="isUploading" class="mt-8 flex flex-col items-center">
      <div class="w-full max-w-xs bg-gray-800 rounded-lg p-4">
        <div class="flex items-center mb-2">
          <div
            class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3"
          >
            <UIcon name="i-heroicons-camera" :size="16" class="text-white" />
          </div>
          <span>Uploading...</span>
        </div>
        <div class="w-full bg-gray-700 h-2 rounded-full">
          <div class="bg-orange-500 h-2 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { endpoints } from "~~/utils/endpoints";

const isUploading = ref(false);
const file = ref(null);
const previewUrl = ref(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
  previewUrl.value = URL.createObjectURL(file.value);
};

const handleUpload = async (e) => {
  e.preventDefault();
  isUploading.value = true;
  const formData = new FormData();
  formData.append("file", file.value);
  const response = await fetch(endpoints.receipt.process, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    isUploading.value = false;
    navigateTo("/receipt/new");
  } else {
    console.error("Failed to upload receipt");
  }
};
</script>
